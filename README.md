# 333 TRS Weather AI

Local tools for extracting and evaluating 333 TRS Weather student workbook submissions.

## Components

- `local-evaluator/`: browser UI for uploading Excel workbooks, selecting course objectives, and reviewing one evaluation result per student submission.
- `local-agent/`: Node.js service that retrieves course-reference context and calls an OpenAI-compatible LM Studio endpoint.

## Quick Start

Start LM Studio first, load `google/gemma-3-4b`, and enable its local server on port `1234`.

Start the local agent:

```powershell
cd "C:\Users\Admin\Documents\Web\333 TRS Weather AI"
$env:LM_STUDIO_API_TOKEN = "your-local-token"
$env:LM_STUDIO_BASE_URL = "http://127.0.0.1:1234"
$env:LM_STUDIO_MODEL = "google/gemma-3-4b"
node .\local-agent\server.js
```

Start the evaluator UI:

```powershell
cd "C:\Users\Admin\Documents\Web\333 TRS Weather AI\local-evaluator"
.\start-server.ps1
```

Open `http://localhost:5500/` on the host PC. From another PC on the same LAN, open `http://HOST-PC-IP:5500/`.

## Workflow

1. Upload one or more Mission Forecaster or Station Forecaster Excel workbooks.
2. Select the applicable course objectives in Section 02.
3. Click `Evaluate work`.
4. Review each student submission in its own result box.
5. Use each result box's `Copy` button when ready.

Correct answers are returned only as a count. Non-correct answers list the objective, evaluated answer text, and PDF citation.

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
