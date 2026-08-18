const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.LOCAL_AGENT_PORT || 8787);
const HOST = process.env.LOCAL_AGENT_HOST || "0.0.0.0";
const LM_BASE_URL = (process.env.LM_STUDIO_BASE_URL || "http://127.0.0.1:1234").replace(/\/$/, "");
const LM_MODEL = process.env.LM_STUDIO_MODEL || "google/gemma-3-4b";
const LM_TOKEN = process.env.LM_STUDIO_API_TOKEN || "";
const MAX_CONTEXT_CHARS = 9000;
const MAX_SECTION_CHARS = 2800;
const MAX_EVALUATION_ITEMS_PER_BATCH = 24;
const LM_REQUEST_TIMEOUT_MS = Number(process.env.LM_STUDIO_TIMEOUT_MS || 30000);
const CURRICULUM_OBJECTIVES = ["2A", "2B", "3A", "3B", "3C", "4A", "4B", "4C", "4D", "4E", "5A", "5B", "5C", "5D", "5E", "5F", "6A"];
const allowedOrigin = origin => /^https?:\/\/(127\.0\.0\.1|localhost|10(?:\.\d{1,3}){3}|172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2}|192\.168(?:\.\d{1,3}){2}):5500$/.test(origin || "")
  ? origin
  : "http://127.0.0.1:5500";

const agentInstructions = fs.readFileSync(path.join(ROOT, "AGENT.md"), "utf8");
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "rules", "evaluation-rules.json"), "utf8"));
const courseRoot = path.join(ROOT, "course");
const referenceManifestPath = path.join(courseRoot, "reference-manifest.json");

function normalizeObjectiveLabel(line) {
  return String(line || "").replace(/^#+\s*/, "").replace(/^([A-Z]?\d+[A-Z]?)\.\s*/, "$1 - ").replace(/\s*(?:-|:|\u2013|\u2014)\s*/, " - ").replace(/\s+/g, " ").trim();
}

function objectiveCode(line) {
  return (normalizeObjectiveLabel(line).match(/^([A-Z]?\d+[A-Z]?)(?:\s+-\s+|$)/) || [])[1] || "";
}

function objectiveMatches(a, b) {
  const left = normalizeObjectiveLabel(a);
  const right = normalizeObjectiveLabel(b);
  const leftCode = objectiveCode(left);
  const rightCode = objectiveCode(right);
  return Boolean(left && right && (left === right || (leftCode && leftCode === rightCode)));
}

function progressiveObjectiveCodes(objectives) {
  const expanded = new Set();
  for (const objective of objectives) {
    const code = objectiveCode(objective);
    const index = CURRICULUM_OBJECTIVES.indexOf(code);
    if (index < 0) {
      if (code) expanded.add(code);
      continue;
    }
    CURRICULUM_OBJECTIVES.slice(0, index + 1).forEach(item => expanded.add(item));
  }
  return expanded;
}

function sectionLabel(section) {
  return normalizeObjectiveLabel((section.match(/^###\s+([^\r\n]+)/m) || [])[1] || "");
}

function trimSection(section) {
  return section.length > MAX_SECTION_CHARS ? `${section.slice(0, MAX_SECTION_CHARS)}\n[section trimmed]` : section;
}

function sendJson(response, status, body, origin) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": allowedOrigin(origin),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET"
  });
  response.end(JSON.stringify(body, null, 2));
}

function sendText(response, status, body, origin) {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Access-Control-Allow-Origin": allowedOrigin(origin),
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET"
  });
  response.end(body);
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", chunk => { body += chunk; if (body.length > 2_000_000) reject(new Error("Request is too large.")); });
    request.on("end", () => resolve(body));
    request.on("error", reject);
  });
}

function words(value) {
  return new Set(String(value || "").toLowerCase().match(/[a-z0-9]{4,}/g) || []);
}

function answerItemsForSubmission(submission) {
  if (Array.isArray(submission?.answerItems)) {
    const seen = new Set();
    return submission.answerItems.filter(item => {
      const id = String(item?.id || "");
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    }).map(item => ({
      id: String(item.id),
      sheet: String(item.sheet || ""),
      cell: String(item.cell || ""),
      section: String(item.section || ""),
      prompt: String(item.prompt || item.id),
      value: item.value ?? ""
    }));
  }
  return Object.entries(submission?.answers || {}).map(([prompt, value], index) => ({
    id: `legacy-${index + 1}`,
    sheet: String(submission?.sheet || ""),
    cell: "",
    section: "Legacy workbook answer",
    prompt,
    value: value ?? ""
  }));
}

function answerEntries(submissions) {
  return Object.entries(submissions || {}).flatMap(([submissionKey, submission]) => answerItemsForSubmission(submission).map(item => ({
    submissionKey,
    submission,
    item: { ...item, submissionKey, displayLabel: submission.displayLabel || submission.studentName || submissionKey, studentName: submission.studentName || submission.displayLabel || submissionKey }
  })));
}

function answerCount(submissions) {
  return answerEntries(submissions).length;
}

function answerPrompts(submissions) {
  return answerEntries(submissions).map(entry => entry.item.prompt);
}

function isBlankAnswer(value) {
  return value === null || value === undefined || String(value).trim() === "";
}

function readReferenceManifest() {
  try {
    const items = JSON.parse(fs.readFileSync(referenceManifestPath, "utf8"));
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

function resolveCourseFile(relativePath) {
  const target = path.normalize(path.join(courseRoot, String(relativePath || "")));
  const relative = path.relative(courseRoot, target);
  if (!relative || relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return target;
}

function selectedReferencePages(request) {
  const selectedObjectives = (request.scope?.objectives || []).map(normalizeObjectiveLabel);
  if (!selectedObjectives.length) return [];
  const progressiveCodes = progressiveObjectiveCodes(selectedObjectives);
  return readReferenceManifest()
    .filter(item => progressiveCodes.has(objectiveCode(item.objective)))
    .flatMap(item => {
      const filePath = resolveCourseFile(item.path);
      if (!filePath) return [];
      try {
        const text = fs.readFileSync(filePath, "utf8");
        return text.split(/(?=^##\s+Page\s+\d+)/gm)
          .map(section => section.trim())
          .filter(section => section.startsWith("## Page "))
          .map(section => ({
            page: `### Reference: ${item.title}\nObjective: ${item.objective}\nSource: ${item.source}\n\n${section}`,
            objective: normalizeObjectiveLabel(item.objective),
            selected: selectedObjectives.some(value => objectiveMatches(value, item.objective))
          }));
      } catch {
        return [];
      }
    });
}

function retrieveContext(request) {
  const answerText = Object.values(request.submissions || {}).map(submission => JSON.stringify(submission)).join(" ");
  const selectedObjectives = new Set((request.scope?.objectives || []).map(normalizeObjectiveLabel));
  const objectiveReferencePages = selectedReferencePages(request);
  const queryWords = words([
    JSON.stringify(request.scope || {}),
    request.objective,
    request.rubric,
    request.instructions,
    answerText
  ].join(" "));
  const availablePages = objectiveReferencePages.map((item, index) => ({ ...item, index }));
  const ranked = availablePages.map(item => {
    const pageWords = words(item.page);
    let score = 0;
    if (item.selected || selectedObjectives.has(item.objective)) score += 1000;
    score += 200;
    for (const word of queryWords) if (pageWords.has(word)) score += 1;
    return { ...item, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  const selected = [];
  let size = 0;
  for (const item of ranked) {
    const page = trimSection(item.page);
    if (selected.length >= 4 || size + page.length > MAX_CONTEXT_CHARS) continue;
    selected.push({ ...item, page });
    size += page.length;
  }
  return selected.sort((a, b) => a.index - b.index).map(item => item.page).join("\n\n");
}

function buildUserPrompt(request, context) {
  const entries = answerEntries(request.submissions);
  const prompts = entries.map(entry => entry.item.prompt);
  const objectives = Array.isArray(request.scope?.objectives) ? request.scope.objectives : [];
  const progressiveScope = [...progressiveObjectiveCodes(objectives)];
  const studentLabels = [...new Set(entries.map(entry => entry.item.displayLabel))];
  const answerList = entries.map(entry => ({
    id: entry.item.id,
    sheet: entry.item.sheet,
    cell: entry.item.cell,
    prompt: entry.item.prompt,
    answer: entry.item.value
  }));
  return [
    `Evaluate the student submission(s) labeled ${JSON.stringify(studentLabels)} below. Student labels are metadata only and must not affect grading.`,
    "Use only the instructor scope, retrieved course reference sections, instructions, and rubric.",
    "Return JSON only. Do not include markdown fences.",
    `Instructor scope: ${JSON.stringify(request.scope || {})}`,
    `Retrieved objective-focused reference sections:\n${context || "No matching objective-focused reference file was found."}`,
    `Evaluation instructions: ${request.instructions || "None supplied."}`,
    `Rubric: ${request.rubric || "None supplied."}`,
    `The submission contains ${prompts.length} answer items. Return exactly ${prompts.length} fieldEvaluations entries, one per answer, in this exact order: ${JSON.stringify(prompts)}.`,
    "Do not combine answers. Each fieldEvaluations entry must contain id, sheet, cell, objective, prompt, status, summary, and citation. Repeat the supplied id, sheet, cell, and prompt exactly.",
    "A blank answer is Missing. Do not infer an answer from neighboring cells or from the workbook layout.",
    "For Partially correct and Incorrect answers, summary must be a concise narrative explaining why the answer received that status. For Correct, Missing, and Unclear answers, keep summary empty.",
    `Selected objectives: ${JSON.stringify(objectives)}.`,
    `Progressive background scope available to retrieval: ${JSON.stringify(progressiveScope)}. Evaluate directly against the selected objective while using earlier objectives as background knowledge when relevant.`,
    "The objective field must include the objective code and title most directly used to evaluate that answer, for example: 5D - Terminal Aerodrome Forecast (TAF).",
    "The prompt field must repeat the exact evaluated answer prompt from the ordered list. The id, sheet, and cell fields must identify the same mapped answer item.",
    "The citation field must identify where the rule or concept appears in the original source PDF using this format when a page marker is available: <source file> p. <page>. If no page marker supports the finding, cite the selected objective heading or reference title.",
    `Mapped answer items: ${JSON.stringify(answerList)}`
  ].join("\n\n");
}

function normalizeModelJson(content) {
  const raw = String(content || "").trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return JSON.parse((fenced ? fenced[1] : raw).trim());
}

function citationText(value) {
  if (Array.isArray(value)) return value.filter(Boolean).join("; ");
  if (value && typeof value === "object") return Object.values(value).filter(Boolean).join("; ");
  return String(value || "").trim();
}

function normalizeEvaluation(value, expectedItems = [], objectives = []) {
  const normalized = { ...value };
  normalized.confidence = String(value.confidence || "").toLowerCase();
  normalized.fieldEvaluations = Array.isArray(value.fieldEvaluations)
    ? expectedItems.map((expected, index) => {
      const item = value.fieldEvaluations[index] || {};
      return {
        ...item,
        id: expected.id,
        sheet: expected.sheet,
        cell: expected.cell,
        submissionKey: expected.submissionKey,
        displayLabel: expected.displayLabel,
        objective: item.objective || item.objectiveTitle || objectives[0] || "",
        prompt: expected.prompt,
        status: normalizeStatus(item.status || item.evaluation),
        summary: String(item.summary || item.feedback || item.reason || item.explanation || "").trim(),
        citation: citationText(item.citation || item.sourceReference || item.sourceReferences || item.references)
      };
    })
    : value.fieldEvaluations;
  if (normalized.confidence === "low") normalized.needsInstructorReview = true;
  return normalized;
}

function normalizeStatus(value) {
  const text = String(value || "").toLowerCase();
  if (text.includes("partially") || text.includes("partial")) return "Partially correct";
  if (text.includes("incorrect") || text.includes("wrong")) return "Incorrect";
  if (text.includes("missing") || text.includes("no answer") || text.includes("did not provide")) return "Missing";
  if (text.includes("correct") || text.includes("meets")) return "Correct";
  return "Unclear";
}

function validateEvaluation(value, expectedItems) {
  if (!value || typeof value !== "object") throw new Error("Evaluation was not an object.");
  const required = ["evaluationSummary", "fieldEvaluations", "rubricFindings", "missingConcepts", "confidence", "sourceReferences", "needsInstructorReview", "studentFeedback"];
  for (const key of required) if (!(key in value)) throw new Error(`Evaluation is missing ${key}.`);
  if (!rules.confidenceValues.includes(value.confidence)) throw new Error("Evaluation confidence is invalid.");
  if (!Array.isArray(value.fieldEvaluations)) throw new Error("fieldEvaluations must be an array.");
  const expectedCount = Array.isArray(expectedItems) ? expectedItems.length : expectedItems;
  if (value.fieldEvaluations.length !== expectedCount) throw new Error(`Evaluation returned ${value.fieldEvaluations.length} items; expected ${expectedCount}.`);
  const invalidStatus = value.fieldEvaluations.find(item => item.status && !rules.allowedStatuses.includes(item.status));
  if (invalidStatus) throw new Error(`Invalid answer status: ${invalidStatus.status}.`);
  const missingNarrative = value.fieldEvaluations.find(item => ["Partially correct", "Incorrect"].includes(item.status) && !item.summary);
  if (missingNarrative) throw new Error(`Evaluation narrative is missing for ${missingNarrative.status} answer.`);
  return value;
}

function formatEvaluation(evaluation) {
  const evaluations = evaluation.fieldEvaluations;
  const correctCount = evaluations.filter(item => item.status === "Correct").length;
  const labels = [...new Set(evaluations.map(item => item.displayLabel).filter(Boolean))];
  const listItem = item => `- ${item.prompt || "Unlabeled answer"}`;
  const linesFor = item => {
    const lines = [
      `- Student: ${item.displayLabel || "Student label not provided."}`,
      `- Location: ${item.sheet && item.cell ? `${item.sheet}!${item.cell}` : "Legacy workbook field"}`,
      `- Objective: ${item.objective || "Objective not provided."}`,
      `- Answer: ${item.prompt || "Unlabeled answer"}`
    ];
    if (["Partially correct", "Incorrect"].includes(item.status)) {
      lines.push(`- Evaluation: ${item.status}. ${item.summary}`);
    } else {
      lines.push(`- Status: ${item.status}`);
    }
    lines.push(`- Citation: ${item.citation || "Citation not provided."}`);
    return lines.join("\n");
  };
  const lines = [labels.length ? `Student: ${labels.join(", ")}` : "Student: Label not provided.", `Correct: ${correctCount}`];
  const correctItems = evaluations.filter(item => item.status === "Correct").map(listItem);
  const missingCount = evaluations.filter(item => item.status === "Missing").length;
  const reviewItems = evaluations
    .filter(item => ["Partially correct", "Incorrect", "Unclear"].includes(item.status))
    .map(linesFor);
  if (correctItems.length) lines.push("", "Correct items:", ...correctItems);
  if (missingCount) lines.push("", `Missing: ${missingCount}`);
  if (reviewItems.length) lines.push("", "Feedback / review:", ...reviewItems);
  return lines.join("\n");
}

function batchRequest(request, entries) {
  const submissions = {};
  for (const entry of entries) {
    const original = request.submissions[entry.submissionKey];
    const submission = submissions[entry.submissionKey] ||= {
      studentName: original.studentName,
      firstName: original.firstName,
      lastName: original.lastName,
      displayLabel: original.displayLabel,
      originalFileName: original.originalFileName,
      workbookType: original.workbookType,
      answerItems: [],
      answers: {}
    };
    submission.answerItems.push(entry.item);
    submission.answers[entry.item.id] = entry.item.value;
  }
  return { ...request, submissions };
}

function blankEvaluation(entry, objectives) {
  return {
    id: entry.item.id,
    sheet: entry.item.sheet,
    cell: entry.item.cell,
    submissionKey: entry.submissionKey,
    displayLabel: entry.item.displayLabel,
    objective: objectives[0] || "",
    prompt: entry.item.prompt,
    status: "Missing",
    summary: "",
    citation: `No student response in ${entry.item.sheet}!${entry.item.cell}.`
  };
}

function failedEvaluation(entry, error, objectives) {
  return {
    id: entry.item.id,
    sheet: entry.item.sheet,
    cell: entry.item.cell,
    submissionKey: entry.submissionKey,
    displayLabel: entry.item.displayLabel,
    objective: objectives[0] || "",
    prompt: entry.item.prompt,
    status: "Unclear",
    summary: `Automatic evaluation could not be completed for this batch: ${error.message}`,
    citation: "Instructor review required."
  };
}

async function evaluateBatches(request, entries, objectives) {
  const results = [];
  for (let start = 0; start < entries.length; start += MAX_EVALUATION_ITEMS_PER_BATCH) {
    const batch = entries.slice(start, start + MAX_EVALUATION_ITEMS_PER_BATCH);
    const evaluated = new Map(batch.map(entry => [entry.item.id + "::" + entry.submissionKey, isBlankAnswer(entry.item.value)
      ? blankEvaluation(entry, objectives)
      : null]));
    const populated = batch.filter(entry => !isBlankAnswer(entry.item.value));
    if (populated.length) {
      try {
        const requestForBatch = batchRequest(request, populated);
        const context = retrieveContext(requestForBatch);
        const evaluation = validateEvaluation(
          normalizeEvaluation(await callLmStudio(requestForBatch, context), populated.map(entry => entry.item), objectives),
          populated.map(entry => entry.item)
        );
        evaluation.fieldEvaluations.forEach((item, index) => {
          const entry = populated[index];
          evaluated.set(entry.item.id + "::" + entry.submissionKey, {
            ...item,
            submissionKey: entry.submissionKey,
            displayLabel: entry.item.displayLabel
          });
        });
      } catch (error) {
        populated.forEach(entry => evaluated.set(entry.item.id + "::" + entry.submissionKey, failedEvaluation(entry, error, objectives)));
      }
    }
    results.push(...batch.map(entry => evaluated.get(entry.item.id + "::" + entry.submissionKey)));
  }
  return results;
}

async function callLmStudio(request, context) {
  const headers = { "Content-Type": "application/json" };
  if (LM_TOKEN) headers.Authorization = `Bearer ${LM_TOKEN}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), LM_REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${LM_BASE_URL}/v1/chat/completions`, {
      method: "POST",
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        model: LM_MODEL,
        temperature: rules.temperature,
        max_tokens: rules.maxOutputTokens,
        messages: [
          { role: "system", content: agentInstructions },
          { role: "user", content: buildUserPrompt(request, context) }
        ]
      })
    });
    if (!response.ok) throw new Error(`LM Studio returned HTTP ${response.status}.`);
    const payload = await response.json();
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("LM Studio returned no message content.");
    return normalizeModelJson(content);
  } catch (error) {
    if (error.name === "AbortError") throw new Error(`LM Studio request timed out after ${LM_REQUEST_TIMEOUT_MS} ms.`);
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function handleEvaluate(request, response, origin) {
  const startedAt = Date.now();
  if (!request || !request.submissions || !Object.keys(request.submissions).length) {
    console.warn("[Evaluation] Rejected: at least one submission is required.");
    return sendJson(response, 400, { error: "At least one submission is required." }, origin);
  }
  const entries = answerEntries(request.submissions);
  const expectedItems = entries.length;
  const objectives = Array.isArray(request.scope?.objectives) ? request.scope.objectives : [];
  console.log(`[Evaluation] Started: ${expectedItems} answer${expectedItems === 1 ? "" : "s"}.`);
  try {
    console.log(`[Evaluation] Sending populated answer batches of up to ${MAX_EVALUATION_ITEMS_PER_BATCH} items to LM Studio...`);
    const fieldEvaluations = await evaluateBatches(request, entries, objectives);
    const evaluation = {
      evaluationSummary: `${fieldEvaluations.length} mapped answer items evaluated.`,
      fieldEvaluations,
      rubricFindings: [],
      missingConcepts: [],
      confidence: fieldEvaluations.some(item => item.status === "Unclear") ? "low" : "medium",
      sourceReferences: [],
      needsInstructorReview: fieldEvaluations.some(item => ["Partially correct", "Incorrect", "Missing", "Unclear"].includes(item.status)),
      studentFeedback: "Review the mapped worksheet results and any items marked for instructor review."
    };
    console.log(`[Evaluation] Completed in ${Date.now() - startedAt} ms.`);
    sendText(response, 200, formatEvaluation(evaluation), origin);
  } catch (error) {
    console.error(`[Evaluation] Failed after ${Date.now() - startedAt} ms: ${error.message}`);
    sendJson(response, 502, { error: error.message, needsInstructorReview: true, evaluationSummary: "Automatic evaluation could not be completed.", studentFeedback: "Instructor review is required." }, origin);
  }
}

const server = http.createServer(async (request, response) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${request.method} ${request.url}`);
  const origin = request.headers.origin;
  if (request.method === "OPTIONS") return sendJson(response, 204, {}, origin);
  if (request.method === "GET" && request.url === "/health") {
    const manifest = readReferenceManifest();
    const objectives = new Set(manifest.map(item => normalizeObjectiveLabel(item.objective)).filter(Boolean));
    return sendJson(response, 200, { ok: true, model: LM_MODEL, objectives: objectives.size, references: manifest.length }, origin);
  }
  if (request.method === "POST" && request.url === "/api/evaluate") {
    try { return await handleEvaluate(JSON.parse(await readBody(request)), response, origin); }
    catch (error) {
      console.error(`[Evaluation] Bad request: ${error.message}`);
      return sendJson(response, 400, { error: error.message, needsInstructorReview: true }, origin);
    }
  }
  sendJson(response, 404, { error: "Not found." }, origin);
});

server.listen(PORT, HOST, () => console.log(`Local evaluator agent listening at http://${HOST}:${PORT}`));
