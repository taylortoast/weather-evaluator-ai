const COURSE = "335 TRS Weather";
const EVALUATION_INSTRUCTIONS = "Evaluate directly against the selected objective. Use earlier objective material as prerequisite background knowledge when relevant. Identify missing concepts, explain the reasoning clearly, and flag uncertain or insufficient-context results for instructor review.";
const REFERENCE_MANIFEST_URL = "/course/reference-manifest.json";
const WORKSHEET_MAPPING_URL = "worksheet-mapping.json";
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
const objectiveSelect = $("#objectiveSelect");
const objectiveStatus = $("#objectiveStatus");
const evaluateButton = $("#evaluateButton");
const evaluationStatus = $("#evaluationStatus");
const evaluationOutput = $("#evaluationOutput");
const endpoint = $("#endpoint");
objectiveSelect.addEventListener("change", updateEvaluationAvailability);

let parsedSubmissions = { submissions: {} };
let validFiles = [];
let objectives = [];
let references = [];
let worksheetMapping = null;
const worksheetMappingReady = loadWorksheetMapping();

if (endpoint && ["127.0.0.1", "localhost"].includes(location.hostname)) {
  endpoint.value = "http://127.0.0.1:8787/api/evaluate";
} else if (endpoint) {
  endpoint.value = `http://${location.hostname}:8787/api/evaluate`;
}

function cellValue(sheet, address) {
  const cell = sheet[address];
  return cell ? (cell.w ?? cell.v ?? "") : "";
}

function serializableValue(value) {
  return value instanceof Date ? value.toISOString() : value ?? "";
}

function parseStudentFilename(fileName) {
  const stem = String(fileName || "").replace(/\.(?:xlsx|xls)$/i, "");
  const prefix = "METOC-Product-Package-";
  if (!stem.startsWith(prefix)) throw new Error("Rename the file to METOC-Product-Package-Lastname-Firstname.xlsx.");
  const nameParts = stem.slice(prefix.length).split("-").filter(Boolean);
  if (nameParts.length < 2 || nameParts.some(part => !/^[A-Za-z][A-Za-z']*$/.test(part))) {
    throw new Error("Rename the file to METOC-Product-Package-Lastname-Firstname.xlsx.");
  }
  const firstName = nameParts.pop();
  const lastName = nameParts.join("-");
  return {
    firstName,
    lastName,
    studentName: `${firstName} ${lastName}`,
    displayLabel: `${lastName}, ${firstName}`,
    originalFileName: fileName
  };
}

function columnNumber(value) {
  return [...value].reduce((total, char) => total * 26 + char.charCodeAt(0) - 64, 0);
}

function columnName(value) {
  let result = "";
  for (let number = value; number > 0; number = Math.floor((number - 1) / 26)) {
    result = String.fromCharCode(65 + ((number - 1) % 26)) + result;
  }
  return result;
}

function expandCellRange(range) {
  const match = String(range).match(/^([A-Z]+)(\d+)(?::([A-Z]+)(\d+))?$/i);
  if (!match) throw new Error(`Invalid worksheet mapping range: ${range}`);
  const startColumn = columnNumber(match[1].toUpperCase());
  const startRow = Number(match[2]);
  const endColumn = columnNumber((match[3] || match[1]).toUpperCase());
  const endRow = Number(match[4] || match[2]);
  const cells = [];
  for (let row = startRow; row <= endRow; row += 1) {
    for (let column = startColumn; column <= endColumn; column += 1) cells.push(`${columnName(column)}${row}`);
  }
  return cells;
}

function expandWorksheetMapping(definition) {
  const seen = new Set();
  const worksheets = definition.worksheets.map(sheet => ({
    ...sheet,
    cells: sheet.cells.flatMap(expandCellRange).filter(address => {
      const id = `${sheet.name}!${address}`;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    })
  }));
  return { ...definition, worksheets, cellCount: seen.size };
}

async function loadWorksheetMapping() {
  const response = await fetch(WORKSHEET_MAPPING_URL);
  if (!response.ok) throw new Error(`Worksheet mapping returned HTTP ${response.status}.`);
  worksheetMapping = expandWorksheetMapping(await response.json());
  return worksheetMapping;
}

function cellCoordinates(address) {
  const match = String(address).match(/^([A-Z]+)(\d+)$/i);
  return { column: columnNumber(match[1].toUpperCase()), row: Number(match[2]) };
}

function rowValues(sheet, row, ignored = new Set()) {
  const result = [];
  for (const address of Object.keys(sheet)) {
    if (!/^[A-Z]+\d+$/.test(address)) continue;
    if (ignored.has(address.toUpperCase())) continue;
    const coordinates = cellCoordinates(address);
    if (coordinates.row !== row) continue;
    const value = String(cellValue(sheet, address)).replace(/\s+/g, " ").trim();
    if (value) result.push({ column: coordinates.column, value });
  }
  return result.sort((a, b) => a.column - b.column).map(item => item.value);
}

function cellPrompt(sheet, sheetName, address) {
  const { row } = cellCoordinates(address);
  const ignored = new Set((worksheetMapping?.worksheets.find(item => item.name === sheetName)?.cells || []).map(value => value.toUpperCase()));
  ignored.add(address.toUpperCase());
  const context = [];
  for (const value of rowValues(sheet, row, ignored)) {
    if (!context.includes(value) && value.length <= 180) context.push(value);
  }
  for (let previousRow = row - 1; previousRow >= Math.max(1, row - 5) && context.length < 4; previousRow -= 1) {
    for (const value of rowValues(sheet, previousRow, ignored)) {
      if (!context.includes(value) && value.length <= 120) context.push(value);
    }
  }
  const description = context.slice(0, 4).join(" | ");
  return `${sheetName}!${address}${description ? ` - ${description}` : " - mapped answer"}`;
}

function sectionLabel(sheet, sheetName, row) {
  const ignored = new Set((worksheetMapping?.worksheets.find(item => item.name === sheetName)?.cells || []).map(value => value.toUpperCase()));
  for (let previousRow = row; previousRow >= Math.max(1, row - 8); previousRow -= 1) {
    const values = rowValues(sheet, previousRow, ignored).filter(value => !/^\d{2,4}Z(?:\s*-\s*\d{2,4}Z)?$/.test(value));
    if (values.length) return values[0].slice(0, 120);
  }
  return "Mapped worksheet answer";
}

function standardWorkbook(workbook) {
  const legacy = WORKBOOK_TYPES.some(type => workbook.SheetNames.includes(type.sheet));
  const mappedNames = worksheetMapping?.worksheets.map(sheet => sheet.name) || [];
  return !legacy && mappedNames.some(name => workbook.SheetNames.includes(name));
}

function legacyWorkbook(workbook) {
  return WORKBOOK_TYPES.find(type => workbook.SheetNames.includes(type.sheet));
}

function legacyAnswerItems(type, sheet) {
  return type.rows.flatMap(row => {
    const prompt = String(cellValue(sheet, `A${row}`)).replace(/\s+/g, " ").trim();
    if (!prompt) return [];
    const cell = `B${row}`;
    return [{ id: `${type.sheet}!${cell}`, sheet: type.sheet, cell, section: prompt, prompt, value: serializableValue(cellValue(sheet, cell)) }];
  });
}

function parseWorkbook(file, arrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });
  const type = legacyWorkbook(workbook);
  if (type) {
    const answerItems = legacyAnswerItems(type, workbook.Sheets[type.sheet]);
    return {
      workbookType: type.name,
      sheet: type.sheet,
      answerItems,
      answers: Object.fromEntries(answerItems.map(item => [item.prompt, item.value]))
    };
  }
  if (!standardWorkbook(workbook)) throw new Error("No supported METOC Product Package worksheet was found.");
  if (!worksheetMapping) throw new Error("The worksheet mapping is not available.");

  const answerItems = [];
  const missingSheets = [];
  for (const mapping of worksheetMapping.worksheets) {
    const sheet = workbook.Sheets[mapping.name];
    if (!sheet) {
      missingSheets.push(mapping.name);
      continue;
    }
    for (const cell of mapping.cells) {
      const { row } = cellCoordinates(cell);
      answerItems.push({
        id: `${mapping.name}!${cell}`,
        sheet: mapping.name,
        cell,
        section: sectionLabel(sheet, mapping.name, row),
        prompt: cellPrompt(sheet, mapping.name, cell),
        value: serializableValue(cellValue(sheet, cell))
      });
    }
  }
  if (!answerItems.length) throw new Error("The workbook does not contain any mapped evaluation worksheets.");
  const answers = Object.fromEntries(answerItems.map(item => [item.id, item.value]));

  return {
    workbookType: "METOC Product Package",
    sheet: "Multiple mapped worksheets",
    answerItems,
    answers,
    mappedCellCount: answerItems.length,
    populatedCellCount: answerItems.filter(item => item.value !== "").length,
    blankCellCount: answerItems.filter(item => item.value === "").length,
    missingSheets,
    duplicateMappingCount: worksheetMapping.duplicateEntries?.length || 0
  };
}

async function parseFiles(files) {
  await worksheetMappingReady;
  const next = { submissions: {} };
  const results = [];
  validFiles = [];

  for (const file of files) {
    try {
      const identity = parseStudentFilename(file.name);
      const parsed = parseWorkbook(file, await file.arrayBuffer());
      const baseKey = identity.displayLabel;
      let submissionKey = baseKey;
      let duplicateNumber = 2;
      while (next.submissions[submissionKey]) submissionKey = `${baseKey} #${duplicateNumber++}`;
      const submission = { ...identity, ...parsed };
      next.submissions[submissionKey] = submission;
      validFiles.push(submissionKey);
      results.push({ name: submissionKey, ...submission });
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
    name.textContent = result.displayLabel || result.name;
    const meta = document.createElement("small");
    meta.textContent = result.error || `${result.originalFileName} - ${result.populatedCellCount ?? Object.keys(result.answers).length} populated / ${result.mappedCellCount ?? Object.keys(result.answers).length} mapped fields${result.duplicateMappingCount ? ` - ${result.duplicateMappingCount} duplicate mapping entries ignored` : ""}`;
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
  if (files.length) parseFiles(files).catch(error => {
    status.className = "status error";
    status.textContent = error.message;
  });
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

function selectedObjectives() {
  const objective = objectives[Number(objectiveSelect.value)];
  return objective ? [objective] : [];
}

function referencesForObjective(label) {
  return references.filter(reference => objectiveMatches(label, reference.objective));
}

function referenceDescription(reference) {
  const rawTitle = String(reference.title || reference.source || "").replace(/\.pdf$/i, "");
  if (/^AFMAN-15-124-Obj-[A-Z]?\d+[A-Z]?$/i.test(rawTitle)) return "AFMAN15-124";
  const title = rawTitle
    .replace(/^BLK-\d+-Unit-\d+-Obj-[A-Z]?\d+[A-Z]?(?:-|$)/i, "")
    .replace(/^AFMAN-\d+-\d+-Obj-[A-Z]?\d+[A-Z]?(?:-|$)/i, "")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return title || "Objective-focused reference";
}

function referenceUnit(reference) {
  const source = String(reference.title || reference.source || "");
  const match = source.match(/(?:BLK-\d+-)?Unit-(\d+)/i);
  return match ? `Unit ${match[1]}` : "Other References";
}

function objectiveUnit(label) {
  const match = objectiveCode(label).match(/\d+/);
  return match ? `Unit ${match[0]}` : "Unassigned Unit";
}

function objectiveItemsFromReferences(items) {
  return [...items.reduce((map, reference) => {
    const label = normalizeObjectiveLabel(reference.objective);
    if (label && !map.has(label)) {
      const linkedReferences = referencesForObjective(label);
      const descriptions = [...new Set(linkedReferences.map(referenceDescription))];
      const unit = linkedReferences.map(referenceUnit).find(value => value !== "Other References") || objectiveUnit(label);
      map.set(label, {
        id: `objective-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        label,
        description: descriptions.join("; "),
        referenceCount: linkedReferences.length,
        unitKey: unit.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        unit
      });
    }
    return map;
  }, new Map()).values()].sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true }));
}

function renderObjectives() {
  const selectedLabel = objectives[Number(objectiveSelect.value)]?.label || "";
  objectives = objectiveItemsFromReferences(references);
  objectiveSelect.replaceChildren(new Option("Select a current objective", ""), ...objectives.map((objective, index) => {
    const option = new Option(`${objective.label} - ${objective.description}`, String(index));
    option.title = `${objective.referenceCount} linked reference${objective.referenceCount === 1 ? "" : "s"}`;
    if (objective.label === selectedLabel) option.selected = true;
    return option;
  }));
  const selectedIndex = objectives.findIndex(objective => objective.label === selectedLabel);
  objectiveSelect.value = selectedIndex >= 0 ? String(selectedIndex) : "";
  objectiveStatus.textContent = objectives.length
    ? `${objectives.length} objective${objectives.length === 1 ? "" : "s"} available. Earlier objectives are included as background context.`
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
    objectiveSelect.replaceChildren(new Option("No objectives available", ""));
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

function resultCard(name, submission) {
  const card = document.createElement("article");
  card.className = "evaluation-card";
  const heading = document.createElement("div");
  heading.className = "result-heading";
  const title = document.createElement("h3");
  title.textContent = submission.displayLabel || name;
  const fileName = document.createElement("small");
  fileName.textContent = submission.originalFileName || name;
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
  const titleBlock = document.createElement("div");
  titleBlock.append(title, fileName);
  heading.append(titleBlock, actions);
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
  const selected = selectedObjectives();
  if (!entries.length || !validFiles.length || !selected.length) {
    updateEvaluationAvailability();
    return;
  }
  evaluateButton.disabled = true;
  evaluationOutput.hidden = false;
  evaluationOutput.replaceChildren();
  evaluationStatus.className = "status";
  evaluationStatus.textContent = `Evaluating ${entries.length} student submission${entries.length === 1 ? "" : "s"}...`;

  let completed = 0;
  let failed = 0;
  for (const [name, submission] of entries) {
    const elements = resultCard(name, submission);
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
