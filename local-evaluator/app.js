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
const jsonOutput = $("#jsonOutput");
const copyButton = $("#copyButton");
const downloadButton = $("#downloadButton");
const evaluateButton = $("#evaluateButton");
const evaluationStatus = $("#evaluationStatus");
const evaluationOutput = $("#evaluationOutput");

let parsedSubmissions = { submissions: {} };
let validFiles = [];

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
  jsonOutput.textContent = JSON.stringify(parsedSubmissions, null, 2);
  renderSubmissionList(results);
  const errors = results.filter(result => result.error);
  fileCount.textContent = `${files.length} file${files.length === 1 ? "" : "s"} selected`;
  copyButton.disabled = validFiles.length === 0;
  downloadButton.disabled = copyButton.disabled;
  evaluateButton.disabled = copyButton.disabled;
  status.className = errors.length ? "status error" : "status success";
  status.textContent = errors.length
    ? `${validFiles.length} workbook(s) parsed. ${errors.length} file(s) need attention.`
    : `${validFiles.length} workbook(s) parsed successfully.`;
  evaluationStatus.textContent = validFiles.length ? "Ready to send the extracted work to the local agent." : "Upload at least one valid workbook to enable evaluation.";
}

function renderSubmissionList(results) {
  submissionList.replaceChildren(...results.map(result => {
    const card = document.createElement("div");
    card.className = "submission-card";
    const details = document.createElement("div");
    const name = document.createElement("strong");
    name.textContent = result.name;
    const meta = document.createElement("small");
    meta.textContent = result.error || `${result.workbookType} • ${Object.keys(result.answers).length} extracted fields`;
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

function scopeValues() {
  return {
    course: $("#course").value.trim(),
    block: $("#block").value.trim(),
    lesson: $("#lesson").value.trim(),
    objective: $("#objective").value.trim()
  };
}

function buildEvaluationRequest() {
  return {
    scope: scopeValues(),
    instructions: $("#instructions").value.trim(),
    rubric: $("#rubric").value.trim(),
    approvedContext: $("#courseContext").value.trim(),
    submissions: parsedSubmissions.submissions
  };
}

async function evaluateWork() {
  evaluateButton.disabled = true;
  evaluationOutput.hidden = true;
  evaluationStatus.className = "status";
  evaluationStatus.textContent = "Sending extracted answers to the local agent…";
  try {
    const request = buildEvaluationRequest();
    const response = await fetch($("#endpoint").value.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request)
    });
    if (!response.ok) throw new Error(`Local agent returned HTTP ${response.status}.`);
    const result = await response.json();
    if (result.error && !result.evaluationSummary) throw new Error(result.error);
    evaluationOutput.textContent = JSON.stringify(result, null, 2);
    evaluationOutput.hidden = false;
    evaluationStatus.className = "status success";
    evaluationStatus.textContent = "Evaluation received. Review the result before sending feedback to a student.";
  } catch (error) {
    evaluationStatus.className = "status error";
    evaluationStatus.textContent = `${error.message} Extracted workbook data remains available for instructor review.`;
  } finally {
    evaluateButton.disabled = validFiles.length === 0;
  }
}

browseButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", event => selectFiles(event.target.files));
dropZone.addEventListener("keydown", event => { if (event.key === "Enter" || event.key === " ") fileInput.click(); });
dropZone.addEventListener("dragover", event => { event.preventDefault(); dropZone.classList.add("is-dragging"); });
dropZone.addEventListener("dragleave", () => dropZone.classList.remove("is-dragging"));
dropZone.addEventListener("drop", event => { event.preventDefault(); dropZone.classList.remove("is-dragging"); selectFiles(event.dataTransfer.files); });
copyButton.addEventListener("click", async () => { await navigator.clipboard.writeText(JSON.stringify(parsedSubmissions, null, 2)); status.className = "status success"; status.textContent = "JSON copied to the clipboard."; });
downloadButton.addEventListener("click", () => { const blob = new Blob([JSON.stringify(parsedSubmissions, null, 2)], { type: "application/json" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "weather-ai-submissions.json"; link.click(); URL.revokeObjectURL(link.href); });
evaluateButton.addEventListener("click", evaluateWork);
