const COURSE = "335 TRS Weather";
const EVALUATION_INSTRUCTIONS = "Evaluate only against the selected objective content. Identify missing concepts, explain the reasoning clearly, and flag uncertain or insufficient-context results for instructor review.";
const REFERENCE_MANIFEST_URL = "/course/reference-manifest.json";
const WORKBOOK_TYPES = [
  { name: "Mission Forecaster", sheet: "MEF Forecast Reasoning", rows: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48, 53, 58] },
  { name: "Station Forecaster", sheet: "TAF Forecast Reasoning", rows: [3, 8, 13, 18, 23, 28, 33, 38] }
];

const $ = selector => document.querySelector(selector);
const dropZone = $("#dropZone");
const fileInput = $("#fileInput");
const browseButton = $("#browseButton");
const status = $("#status");
const fileCount = $("#fileCount");
const submissionList = $("#submissionList");
const objectiveList = $("#objectiveList");
const objectiveStatus = $("#objectiveStatus");
const evaluateButton = $("#evaluateButton");
const evaluationStatus = $("#evaluationStatus");
const evaluationOutput = $("#evaluationOutput");
const endpoint = $("#endpoint");

let parsedSubmissions = { submissions: {} };
let validFiles = [];
let objectives = [];
let references = [];

if (endpoint && ["127.0.0.1", "localhost"].includes(location.hostname)) {
  endpoint.value = "http://127.0.0.1:8787/api/evaluate";
} else if (endpoint) {
  endpoint.value = `http://${location.hostname}:8787/api/evaluate`;
}

function cellValue(sheet, address) {
  const cell = sheet[address];
  return cell ? (cell.w ?? cell.v ?? "") : "";
}

function identifyWorkbook(workbook) {
  return WORKBOOK_TYPES.find(type => workbook.SheetNames.includes(type.sheet));
}

function parseWorkbook(file, arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const type = identifyWorkbook(workbook);
  if (!type) throw new Error("No supported Forecast Reasoning worksheet was found.");

  const sheet = workbook.Sheets[type.sheet];
  const answers = {};
  for (const row of type.rows) {
    const prompt = String(cellValue(sheet, `A${row}`)).replace(/\s+/g, " ").trim();
    if (prompt) answers[prompt] = cellValue(sheet, `B${row}`);
  }

  return { workbookType: type.name, sheet: type.sheet, answers };
}

async function parseFiles(files) {
  const next = { submissions: {} };
  const results = [];
  validFiles = [];

  for (const file of files) {
    try {
      const parsed = parseWorkbook(file, await file.arrayBuffer());
      next.submissions[file.name] = parsed;
      validFiles.push(file.name);
      results.push({ name: file.name, ...parsed });
    } catch (error) {
      results.push({ name: file.name, error: error.message });
    }
  }

  parsedSubmissions = next;
  renderSubmissionList(results);
  const errors = results.filter(result => result.error);
  fileCount.textContent = `${files.length} file${files.length === 1 ? "" : "s"} selected`;
  status.className = errors.length ? "status error" : "status success";
  status.textContent = errors.length
    ? `${validFiles.length} workbook(s) parsed. ${errors.length} file(s) need attention.`
    : `${validFiles.length} workbook(s) parsed successfully.`;
  updateEvaluationAvailability();
}

function renderSubmissionList(results) {
  submissionList.replaceChildren(...results.map(result => {
    const card = document.createElement("div");
    card.className = "submission-card";
    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = result.name;
    const meta = document.createElement("small");
    meta.textContent = result.error || `${result.workbookType} - ${Object.keys(result.answers).length} extracted fields`;
    details.append(name, meta);
    const pill = document.createElement("span");
    pill.className = result.error ? "pill error" : "pill";
    pill.textContent = result.error ? "Needs attention" : "Parsed";
    card.append(details, pill);
    return card;
  }));
}

function selectFiles(fileList) {
  const files = [...fileList].filter(file => /\.(xlsx|xls)$/i.test(file.name));
  if (files.length) parseFiles(files);
  else {
    status.className = "status error";
    status.textContent = "Please choose at least one .xlsx or .xls workbook.";
  }
}

function normalizeObjectiveLabel(line) {
  return line.replace(/^#+\s*/, "").replace(/^([A-Z]?\d+[A-Z]?)\.\s*/, "$1 - ").replace(/\s*(?:-|:|\u2013|\u2014)\s*/, " - ").replace(/\s+/g, " ").trim();
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

function selectedObjectiveLabels() {
  return selectedObjectives().map(objective => objective.label);
}

function selectedObjectives() {
  return [...objectiveList.querySelectorAll(".objective-option[aria-pressed='true']")]
    .map(button => objectives[Number(button.dataset.index)])
    .filter(Boolean);
}

function referencesForObjective(label) {
  return references.filter(reference => objectiveMatches(label, reference.objective));
}

function objectiveItemsFromReferences(items) {
  return [...items.reduce((map, reference) => {
    const label = normalizeObjectiveLabel(reference.objective);
    if (label && !map.has(label)) {
      map.set(label, {
        id: `objective-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        label,
        unitKey: "unit-objective-references",
        unit: "Objective-Focused References"
      });
    }
    return map;
  }, new Map()).values()].sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

function renderObjectives() {
  const selected = new Set(selectedObjectiveLabels());
  objectives = objectiveItemsFromReferences(references);
  const groups = objectives.reduce((map, objective) => {
    if (!map.has(objective.unitKey)) map.set(objective.unitKey, { title: objective.unit, items: [] });
    map.get(objective.unitKey).items.push(objective);
    return map;
  }, new Map());
  objectiveList.replaceChildren(...[...groups.values()].map(group => {
    const section = document.createElement("section");
    section.className = "objective-unit";
    const heading = document.createElement("h3");
    heading.textContent = group.title;
    const options = document.createElement("div");
    options.className = "objective-options";
    options.append(...group.items.map(objective => {
      const index = objectives.indexOf(objective);
      const button = document.createElement("button");
      button.type = "button";
      button.className = "objective-option";
      button.dataset.index = String(index);
      button.setAttribute("aria-pressed", selected.has(objective.label) ? "true" : "false");
      const linkedReferences = referencesForObjective(objective.label);
      button.textContent = linkedReferences.length
        ? `${objective.label} (${linkedReferences.length} ref${linkedReferences.length === 1 ? "" : "s"})`
        : objective.label;
      button.title = linkedReferences.map(reference => reference.source).join("\n");
      button.addEventListener("click", () => {
        const isSelected = button.getAttribute("aria-pressed") === "true";
        button.setAttribute("aria-pressed", String(!isSelected));
        updateEvaluationAvailability();
      });
      return button;
    }));
    section.append(heading, options);
    return section;
  }));
  objectiveStatus.textContent = objectives.length
    ? `${objectives.length} unique objective${objectives.length === 1 ? "" : "s"} found.`
    : "No objectives found yet.";
  updateEvaluationAvailability();
}

function renderReferences(items) {
  references = Array.isArray(items) ? items : [];
  renderObjectives();
}

async function loadObjectives() {
  try {
    const response = await fetch(REFERENCE_MANIFEST_URL);
    if (!response.ok) throw new Error(`Reference manifest returned HTTP ${response.status}.`);
    renderReferences(await response.json());
  } catch {
    references = [];
    objectives = [];
    objectiveStatus.textContent = "No objective-focused reference catalog was found.";
    objectiveList.replaceChildren();
    updateEvaluationAvailability();
  }
}

function updateEvaluationAvailability() {
  const selectedCount = selectedObjectives().length;
  const referenceCount = selectedObjectives().flatMap(objective => referencesForObjective(objective.label)).length;
  evaluateButton.disabled = validFiles.length === 0 || selectedCount === 0;
  evaluationStatus.textContent = validFiles.length === 0
    ? "Upload at least one valid workbook and select at least one objective to enable evaluation."
    : selectedCount === 0
      ? "Select at least one objective to enable evaluation."
      : `${validFiles.length} student submission${validFiles.length === 1 ? "" : "s"} ready for evaluation${referenceCount ? ` with ${referenceCount} reference file${referenceCount === 1 ? "" : "s"}` : ""}.`;
}

function buildEvaluationRequest(name, submission) {
  const selected = selectedObjectives();
  return {
    scope: {
      course: COURSE,
      objectives: selected.map(objective => objective.label)
    },
    instructions: EVALUATION_INSTRUCTIONS,
    submissions: { [name]: submission }
  };
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function resultCard(name) {
  const card = document.createElement("article");
  card.className = "evaluation-card";
  const heading = document.createElement("div");
  heading.className = "result-heading";
  const title = document.createElement("h3");
  title.textContent = name;
  const pill = document.createElement("span");
  pill.className = "pill";
  pill.textContent = "Waiting";
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copy";
  copyButton.disabled = true;
  copyButton.addEventListener("click", async () => {
    await copyText(body.textContent);
    copyButton.textContent = "Copied";
    setTimeout(() => { copyButton.textContent = "Copy"; }, 1400);
  });
  const body = document.createElement("pre");
  body.textContent = "Queued for evaluation.";
  const actions = document.createElement("div");
  actions.className = "result-actions";
  actions.append(pill, copyButton);
  heading.append(title, actions);
  card.append(heading, body);
  return { card, pill, body, copyButton };
}

async function evaluateSubmission(name, submission, elements) {
  elements.pill.textContent = "Evaluating";
  elements.body.textContent = "Sending this student submission to the local agent...";
  const response = await fetch(endpoint.value.trim(), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildEvaluationRequest(name, submission))
  });
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const result = isJson ? await response.json() : await response.text();
  if (!response.ok) throw new Error(result.error || `Local agent returned HTTP ${response.status}.`);
  elements.pill.textContent = "Complete";
  elements.body.textContent = typeof result === "string" ? result : JSON.stringify(result, null, 2);
  elements.copyButton.disabled = false;
}

async function evaluateWork() {
  const entries = Object.entries(parsedSubmissions.submissions);
  evaluateButton.disabled = true;
  evaluationOutput.hidden = false;
  evaluationOutput.replaceChildren();
  evaluationStatus.className = "status";
  evaluationStatus.textContent = `Evaluating ${entries.length} student submission${entries.length === 1 ? "" : "s"}...`;

  let completed = 0;
  let failed = 0;
  for (const [name, submission] of entries) {
    const elements = resultCard(name);
    evaluationOutput.append(elements.card);
    try {
      await evaluateSubmission(name, submission, elements);
      completed += 1;
    } catch (error) {
      failed += 1;
      elements.pill.className = "pill error";
      elements.pill.textContent = "Needs review";
      elements.body.textContent = `${error.message} Extracted workbook data remains available for instructor review.`;
      elements.copyButton.disabled = false;
    }
  }

  evaluationStatus.className = failed ? "status error" : "status success";
  evaluationStatus.textContent = failed
    ? `${completed} evaluation(s) completed. ${failed} need instructor review.`
    : `${completed} evaluation(s) received. Review each result before sending feedback to students.`;
  evaluateButton.disabled = validFiles.length === 0 || selectedObjectives().length === 0;
}

browseButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", event => selectFiles(event.target.files));
dropZone.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") fileInput.click(); });
dropZone.addEventListener("dragover", event => { event.preventDefault(); dropZone.classList.add("is-dragging"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-dragging"));
dropZone.addEventListener("drop", event => { event.preventDefault(); dropZone.classList.remove("is-dragging"); selectFiles(event.dataTransfer.files); });
evaluateButton.addEventListener("click", evaluateWork);
loadObjectives();
