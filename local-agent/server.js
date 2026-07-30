const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = __dirname;
const PORT = Number(process.env.LOCAL_AGENT_PORT || 8787);
const LM_BASE_URL = (process.env.LM_STUDIO_BASE_URL || "http://127.0.0.1:1234").replace(/\/$/, "");
const LM_MODEL = process.env.LM_STUDIO_MODEL || "google/gemma-3-4b";
const LM_TOKEN = process.env.LM_STUDIO_API_TOKEN || "";
const MAX_CONTEXT_CHARS = 26000;

const agentInstructions = fs.readFileSync(path.join(ROOT, "AGENT.md"), "utf8");
const rules = JSON.parse(fs.readFileSync(path.join(ROOT, "rules", "evaluation-rules.json"), "utf8"));
const pages = fs.readFileSync(path.join(ROOT, "course", "curriculum.txt"), "utf8")
  .split(/(?==== CURRICULUM PAGE \d+ ===)/g)
  .map(text => text.trim())
  .filter(Boolean);

function sendJson(response, status, body) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "http://127.0.0.1:5500",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS, GET"
  });
  response.end(JSON.stringify(body, null, 2));
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

function retrieveContext(request) {
  const answerText = Object.values(request.submissions || {}).map(submission => JSON.stringify(submission)).join(" ");
  const queryWords = words([
    JSON.stringify(request.scope || {}),
    request.objective,
    request.rubric,
    request.instructions,
    answerText
  ].join(" "));
  const ranked = pages.map((page, index) => {
    const pageWords = words(page);
    let score = 0;
    for (const word of queryWords) if (pageWords.has(word)) score += 1;
    return { page, index, score };
  }).sort((a, b) => b.score - a.score || a.index - b.index);
  const selected = [];
  let size = 0;
  for (const item of ranked) {
    if (selected.length >= 8 || size + item.page.length > MAX_CONTEXT_CHARS) continue;
    selected.push(item);
    size += item.page.length;
  }
  return selected.sort((a, b) => a.index - b.index).map(item => item.page).join("\n\n");
}

function buildUserPrompt(request, context) {
  return [
    "Evaluate the student submissions below.",
    "Use only the instructor scope, approved context, retrieved curriculum pages, instructions, and rubric.",
    "Return JSON only. Do not include markdown fences.",
    `Instructor scope: ${JSON.stringify(request.scope || {})}`,
    `Approved course context: ${request.approvedContext || "None supplied."}`,
    `Retrieved curriculum context:\n${context || "No matching curriculum context was found."}`,
    `Evaluation instructions: ${request.instructions || "None supplied."}`,
    `Rubric: ${request.rubric || "None supplied."}`,
    `Submissions: ${JSON.stringify(request.submissions || {})}`
  ].join("\n\n");
}

function normalizeModelJson(content) {
  const raw = String(content || "").trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  return JSON.parse((fenced ? fenced[1] : raw).trim());
}

function normalizeEvaluation(value) {
  const normalized = { ...value };
  normalized.confidence = String(value.confidence || "").toLowerCase();
  normalized.fieldEvaluations = Array.isArray(value.fieldEvaluations)
    ? value.fieldEvaluations.map(item => ({
      ...item,
      prompt: item.prompt || item.field || "",
      status: normalizeStatus(item.status || item.evaluation)
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

function validateEvaluation(value) {
  if (!value || typeof value !== "object") throw new Error("Evaluation was not an object.");
  const required = ["evaluationSummary", "fieldEvaluations", "rubricFindings", "missingConcepts", "confidence", "sourceReferences", "needsInstructorReview", "studentFeedback"];
  for (const key of required) if (!(key in value)) throw new Error(`Evaluation is missing ${key}.`);
  if (!rules.confidenceValues.includes(value.confidence)) throw new Error("Evaluation confidence is invalid.");
  if (!Array.isArray(value.fieldEvaluations)) throw new Error("fieldEvaluations must be an array.");
  const invalidStatus = value.fieldEvaluations.find(item => item.status && !rules.allowedStatuses.includes(item.status));
  if (invalidStatus) throw new Error(`Invalid answer status: ${invalidStatus.status}.`);
  return value;
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

async function handleEvaluate(request, response) {
  if (!request || !request.submissions || !Object.keys(request.submissions).length) return sendJson(response, 400, { error: "At least one submission is required." });
  const context = retrieveContext(request);
  try {
    const evaluation = validateEvaluation(normalizeEvaluation(await callLmStudio(request, context)));
    sendJson(response, 200, { ...evaluation, metadata: { model: LM_MODEL, retrievedContext: Boolean(context), contextPages: (context.match(/=== CURRICULUM PAGE \d+ ===/g) || []).length } });
  } catch (error) {
    sendJson(response, 502, { error: error.message, needsInstructorReview: true, evaluationSummary: "Automatic evaluation could not be completed.", studentFeedback: "Instructor review is required." });
  }
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") return sendJson(response, 204, {});
  if (request.method === "GET" && request.url === "/health") return sendJson(response, 200, { ok: true, model: LM_MODEL, curriculumPages: pages.length });
  if (request.method === "POST" && request.url === "/api/evaluate") {
    try { return await handleEvaluate(JSON.parse(await readBody(request)), response); }
    catch (error) { return sendJson(response, 400, { error: error.message, needsInstructorReview: true }); }
  }
  sendJson(response, 404, { error: "Not found." });
});

server.listen(PORT, "127.0.0.1", () => console.log(`Local evaluator agent listening at http://127.0.0.1:${PORT}`));
