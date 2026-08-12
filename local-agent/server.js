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

function answerCount(submissions) {
  return Object.values(submissions || {}).reduce((total, submission) => total + Object.keys(submission.answers || {}).length, 0);
}

function answerPrompts(submissions) {
  return Object.values(submissions || {}).flatMap(submission => Object.keys(submission.answers || {}));
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
  return readReferenceManifest()
    .filter(item => selectedObjectives.some(objective => objectiveMatches(objective, item.objective)))
    .flatMap(item => {
      const filePath = resolveCourseFile(item.path);
      if (!filePath) return [];
      try {
        const text = fs.readFileSync(filePath, "utf8");
        return text.split(/(?=^##\s+Page\s+\d+)/gm)
          .map(section => section.trim())
          .filter(section => section.startsWith("## Page "))
          .map(section => `### Reference: ${item.title}\nSource: ${item.source}\n\n${section}`);
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
  const availablePages = objectiveReferencePages.map((page, index) => ({ page, index, selectedReference: true }));
  const ranked = availablePages.map(item => {
    const pageWords = words(item.page);
    let score = 0;
    if (selectedObjectives.has(sectionLabel(item.page))) score += 1000;
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
  const prompts = answerPrompts(request.submissions);
  const objectives = Array.isArray(request.scope?.objectives) ? request.scope.objectives : [];
  return [
    "Evaluate the student submissions below.",
    "Use only the instructor scope, retrieved course reference sections, instructions, and rubric.",
    "Return JSON only. Do not include markdown fences.",
    `Instructor scope: ${JSON.stringify(request.scope || {})}`,
    `Retrieved objective-focused reference sections:\n${context || "No matching objective-focused reference file was found."}`,
    `Evaluation instructions: ${request.instructions || "None supplied."}`,
    `Rubric: ${request.rubric || "None supplied."}`,
    `The submission contains ${prompts.length} answer items. Return exactly ${prompts.length} fieldEvaluations entries, one per answer, in this exact order: ${JSON.stringify(prompts)}.`,
    "Do not combine answers. Each fieldEvaluations entry must contain objective, prompt, status, summary, and citation.",
    "For Partially correct and Incorrect answers, summary must be a concise narrative explaining why the answer received that status. For Correct, Missing, and Unclear answers, keep summary empty.",
    `Selected objectives: ${JSON.stringify(objectives)}.`,
    "The objective field must include the objective code and title most directly used to evaluate that answer, for example: 5D - Terminal Aerodrome Forecast (TAF).",
    "The prompt field must repeat the exact evaluated answer prompt from the ordered list.",
    "The citation field must identify where the rule or concept appears in the original source PDF using this format when a page marker is available: <source file> p. <page>. If no page marker supports the finding, cite the selected objective heading or reference title.",
    `Submissions: ${JSON.stringify(request.submissions || {})}`
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

function normalizeEvaluation(value, prompts = [], objectives = []) {
  const normalized = { ...value };
  normalized.confidence = String(value.confidence || "").toLowerCase();
  normalized.fieldEvaluations = Array.isArray(value.fieldEvaluations)
    ? value.fieldEvaluations.map((item, index) => ({
      ...item,
      objective: item.objective || item.objectiveTitle || objectives[0] || "",
      prompt: item.prompt || item.field || prompts[index] || "",
      status: normalizeStatus(item.status || item.evaluation),
      summary: String(item.summary || item.feedback || item.reason || item.explanation || "").trim(),
      citation: citationText(item.citation || item.sourceReference || item.sourceReferences || item.references)
    }))
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
  if (value.fieldEvaluations.length !== expectedItems) throw new Error(`Evaluation returned ${value.fieldEvaluations.length} items; expected ${expectedItems}.`);
  const invalidStatus = value.fieldEvaluations.find(item => item.status && !rules.allowedStatuses.includes(item.status));
  if (invalidStatus) throw new Error(`Invalid answer status: ${invalidStatus.status}.`);
  const missingNarrative = value.fieldEvaluations.find(item => ["Partially correct", "Incorrect"].includes(item.status) && !item.summary);
  if (missingNarrative) throw new Error(`Evaluation narrative is missing for ${missingNarrative.status} answer.`);
  return value;
}

function formatEvaluation(evaluation) {
  const evaluations = evaluation.fieldEvaluations;
  const correctCount = evaluations.filter(item => item.status === "Correct").length;
  const linesFor = item => {
    const lines = [
      `- Objective: ${item.objective || "Objective not provided."}`,
      `- Answer: ${item.prompt || "Unlabeled answer"}`
    ];
    if (["Partially correct", "Incorrect"].includes(item.status)) {
      lines.push(`- Evaluation: ${item.status}. ${item.summary}`);
    }
    lines.push(`- Citation: ${item.citation || "Citation not provided."}`);
    return lines.join("\n");
  };
  const nonCorrect = evaluations
    .filter(item => item.status !== "Correct")
    .map(linesFor);
  const lines = [`Correct: ${correctCount}`];
  if (nonCorrect.length) lines.push("", ...nonCorrect);
  return lines.join("\n");
}

async function callLmStudio(request, context) {
  const headers = { "Content-Type": "application/json" };
  if (LM_TOKEN) headers.Authorization = `Bearer ${LM_TOKEN}`;
  const response = await fetch(`${LM_BASE_URL}/v1/chat/completions`, {
    method: "POST",
    headers,
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
}

async function handleEvaluate(request, response, origin) {
  const startedAt = Date.now();
  if (!request || !request.submissions || !Object.keys(request.submissions).length) {
    console.warn("[Evaluation] Rejected: at least one submission is required.");
    return sendJson(response, 400, { error: "At least one submission is required." }, origin);
  }
  const expectedItems = answerCount(request.submissions);
  const prompts = answerPrompts(request.submissions);
  const objectives = Array.isArray(request.scope?.objectives) ? request.scope.objectives : [];
  const context = retrieveContext(request);
  console.log(`[Evaluation] Started: ${expectedItems} answer${expectedItems === 1 ? "" : "s"}.`);
  try {
    console.log("[Evaluation] Sending request to LM Studio...");
    const evaluation = validateEvaluation(normalizeEvaluation(await callLmStudio(request, context), prompts, objectives), expectedItems);
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
