# 333 TRS Weather AI Turnover

**Date:** 2026-08-03
**Project:** `C:\Users\Admin\Documents\Web\333 TRS Weather AI`

## Current status

The project has two local components:

1. `local-evaluator/`: browser UI for workbook upload, objective selection, and per-submission results.
2. `local-agent/`: Node.js evaluation service that retrieves selected objective context and calls LM Studio.

The old `site/` prototype is preserved locally but ignored by Git.

## Current workflow

```text
Excel workbook
-> browser extraction
-> selected course objectives
-> course-reference retrieval
-> LM Studio evaluation
-> one instructor-review result box per submission
```

Each uploaded workbook is treated as one student submission.

## Course reference

The UI objective picker and the local agent now use the same reference file:

```text
local-agent/course/course-reference.md
```

Do not use `objective-notes.md` or `curriculum.txt` for the active workflow.

## Evaluation behavior

- Correct answers return as a count only.
- Incorrect, partially correct, missing, and unclear answers include the objective, evaluated answer text, and PDF citation.
- The agent uses `AGENT.md`, `rules/evaluation-rules.json`, and the selected sections from `course-reference.md`.
- Results remain instructor-review drafts.

## Manual startup

Start LM Studio first, load `google/gemma-3-4b`, and start its local server on port `1234`.

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

Open on the host PC:

```text
http://localhost:5500/
```

Open from another PC on the same LAN:

```text
http://HOST-PC-IP:5500/
```

## LAN notes

The evaluator UI and local agent bind to `0.0.0.0` by default. If another PC cannot connect, allow Node.js through Windows Firewall for Private networks.

The evaluator auto-fills the agent endpoint:

- host PC: `http://127.0.0.1:8787/api/evaluate`
- LAN PC: `http://HOST-PC-IP:8787/api/evaluate`

## Supported workbooks

- Mission Forecaster: `MEF Forecast Reasoning`
- Station Forecaster: `TAF Forecast Reasoning`

## Validation checklist

- `http://localhost:5500/` loads the evaluator UI.
- `http://localhost:5500/how-to-use.html` loads the instructor guide.
- `http://localhost:5500/course/course-reference.md` serves the shared course reference.
- `http://localhost:8787/health` reports healthy agent status.
- Uploading two workbooks creates two separate result boxes.
- Selecting different objectives changes the evaluation scope.
- Each result box has a working `Copy` button.
