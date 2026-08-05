# 333 TRS Weather AI

Local tools for extracting and evaluating 333 TRS Weather student workbook submissions.

## Prerequisites

- Node.js 18 or newer for the local agent and evaluator web server.
- Windows PowerShell to run the included startup script.
- A modern browser such as Edge, Chrome, or Firefox.
- LM Studio, or another local OpenAI-compatible chat-completions server, running an instruction-following LLM. The default setup expects LM Studio at `http://127.0.0.1:1234` with the `google/gemma-3-4b` model loaded.

## Servers

- **Local Agent** (`local-agent/`, port `8787`): the Node.js evaluation service. It retrieves course-reference context and sends submissions to the local OpenAI-compatible LLM. Its health check is `http://localhost:8787/health`.
- **Local Evaluator** (`local-evaluator/`, port `5500`): the browser web server and instructor interface for uploading Excel workbooks, selecting objectives, and reviewing results. Open `http://localhost:5500/`.

## Quick Start

Start LM Studio first, load `google/gemma-3-4b`, and enable its local server on port `1234`.

From the project root, start both servers:

```powershell
.\start.ps1
```

The launcher stops any existing processes on ports `8787` and `5500`, then opens a PowerShell window for each server. Leave both windows open while using the evaluator. Stop the servers with `Ctrl+C` in those windows.

The default agent configuration uses `http://127.0.0.1:1234` and `google/gemma-3-4b`. To use a different local LLM server or model, set `LM_STUDIO_BASE_URL`, `LM_STUDIO_MODEL`, and (if needed) `LM_STUDIO_API_TOKEN` in the same PowerShell window before running `.\start.ps1`.

Open `http://localhost:5500/` on the host PC. From another PC on the same LAN, open `http://HOST-PC-IP:5500/`.

## Workflow

1. Upload one or more Mission Forecaster or Station Forecaster Excel workbooks.
2. Select the applicable course objectives in Section 02.
3. Click `Evaluate work`.
4. Review each student submission in its own result box.
5. Use each result box's `Copy` button when ready.

Correct answers are returned only as a count. Partially correct and incorrect answers list the objective, evaluated answer text, evaluation narrative, and PDF citation. Missing and unclear answers omit the evaluation narrative.

## Course Reference

Both the UI objective picker and local agent retrieval use one reference file:

```text
local-agent/course/course-reference.md
```

That file contains objective sections and citations back to `Complete_Curriculum_Text.pdf`.

## Supported Workbooks

- Mission Forecaster: `MEF Forecast Reasoning`
- Station Forecaster: `TAF Forecast Reasoning`

## LAN Notes

The UI and agent bind to `0.0.0.0` for LAN access. If another PC cannot connect, allow Node.js through Windows Firewall for Private networks.
