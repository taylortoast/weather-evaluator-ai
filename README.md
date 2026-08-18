# 333 TRS Weather AI

Local tools for extracting and evaluating 333 TRS Weather student workbook submissions.

## Prerequisites

- Node.js 18 or newer for the local agent and evaluator web server.
- Windows PowerShell to run the included startup script.
- A modern browser such as Edge, Chrome, or Firefox.
- LM Studio, or another local OpenAI-compatible chat-completions server, running an instruction-following LLM. The required LM Studio model is **Google/Gemma-3-4B** at `http://127.0.0.1:1234`.

## Servers

- **Local Agent** (`local-agent/`, port `8787`): the Node.js evaluation service. It retrieves objective-focused reference context and sends submissions to the local OpenAI-compatible LLM. Its health check is `http://localhost:8787/health`.
- **Local Evaluator** (`local-evaluator/`, port `5500`): the browser web server and instructor interface for uploading Excel workbooks, selecting objectives, and reviewing results. Open `http://localhost:5500/`.

## Quick Start

### Run locally

1. Install Node.js 18 or newer and Python 3.
2. Start LM Studio, load **Google/Gemma-3-4B** (`google/gemma-3-4b`), and enable its local server on port `1234`.
3. Open PowerShell in the project root: `C:\Users\Admin\Documents\Web\333 TRS Weather AI`.
4. Start both local web servers:

Double-click `start.cmd`.

The script opens one PowerShell window for each server:

- Local Agent: `http://localhost:8787`
- Local Evaluator: `http://localhost:5500`

The evaluator server listens on `0.0.0.0:5500`, meaning it accepts connections on all network interfaces. Open the website locally at [http://localhost:5500/](http://localhost:5500/). From another PC on the same LAN, use `http://HOST-PC-IP:5500/`, replacing `HOST-PC-IP` with the host computer's LAN address. `0.0.0.0` is a bind/listen address, not the normal browser address.

Confirm the services are running by opening:

- Agent health: `http://localhost:8787/health`
- Evaluator: `http://localhost:5500/`

Use the evaluator in the browser. Keep both server windows and LM Studio open while testing.

To stop the local run, press `Ctrl+C` in both server windows. Double-clicking `start.cmd` again also stops any process already listening on ports `8787` and `5500` before starting fresh servers.

The default agent configuration uses `http://127.0.0.1:1234` and `google/gemma-3-4b`. To use a different local LLM server or model, set `LM_STUDIO_BASE_URL`, `LM_STUDIO_MODEL`, and (if needed) `LM_STUDIO_API_TOKEN` before launching `start.cmd`.

Open `http://localhost:5500/` on the host PC. From another PC on the same LAN, open `http://HOST-PC-IP:5500/`.

## Tools and PowerShell scripts

There is only one active tool directory:

- `local-agent/tools/` contains `distill-pdf.py`, the PDF-to-Markdown distiller used by `utility/distill-ai-references.ps1`.
- `utility/` contains the PowerShell implementation files. Users normally run the root `.cmd` launchers instead.
- The root `tools/` directory currently contains no project source files and is not used by either server or launcher.

### `start.cmd` / `utility/start.ps1`

Starts the two Node.js services in separate PowerShell windows. It runs `local-agent/server.js` on port `8787` and `local-evaluator/server.js` on port `5500`, binding the evaluator for local/LAN access. It also stops existing listeners on those ports first.

### `distill-ai-references.cmd` / `utility/distill-ai-references.ps1`

Runs the Python distiller against every PDF in `docs/AI-References/`. Objective-specific filenames must contain `Obj-<code>`, for example `AFMAN-15-124-Obj-3a.pdf`. Generated Markdown goes to `local-agent/course/references/`, and the objective catalog is updated at `local-agent/course/reference-manifest.json`.

Double-click `distill-ai-references.cmd` to run the PowerShell implementation without manually entering a command. PDFs without an objective code are reported as skipped so they are not attached to the wrong evaluation scope.

## Workflow

1. Name each standardized workbook `METOC-Product-Package-Lastname-Firstname.xlsx`.
2. Upload one or more standardized or legacy Excel workbooks.
3. Select the applicable current course objective in Section 02.
4. Click `Evaluate work`.
5. Review each student submission in its own result box.
6. Use each result box's `Copy` button when ready.

Correct answers are returned as list items; Missing answers are returned only as a count. Partially correct and incorrect answers list the objective, evaluated answer text, evaluation narrative, and PDF citation. Unclear answers remain for instructor review.

## Objective References

The UI objective picker and local agent use distilled, objective-focused reference files:

```text
local-agent/course/reference-manifest.json
local-agent/course/references/
```

Objective-specific reference PDFs can be distilled into markdown tied to the selected objective. For the normal workflow, place the PDFs in `docs/AI-References/` and double-click `distill-ai-references.cmd`.

The launcher processes every PDF whose filename contains `Obj-<code>`, writes markdown to `local-agent/course/references/`, and updates `local-agent/course/reference-manifest.json`. In Section 02, selecting that objective automatically includes its linked reference markdown in the evaluator context.

### One-click batch distillation

1. Place PDFs named like `AFMAN-15-124-Obj-3a.pdf` in `docs/AI-References/`.
2. Double-click `distill-ai-references.cmd`.
3. Review the generated markdown in `local-agent/course/references/`.

The batch command processes every PDF whose filename contains `Obj-<code>` and updates the manifest. Files without an objective code are listed as skipped so they can be assigned safely with `--objective`.

## Supported Workbooks

- Standardized METOC Product Package: mapped cells in `local-evaluator/worksheet-mapping.json`
- Legacy Mission Forecaster: `MEF Forecast Reasoning`
- Legacy Station Forecaster: `TAF Forecast Reasoning`

## LAN Notes

The UI and agent bind to `0.0.0.0` for LAN access. If another PC cannot connect, allow Node.js through Windows Firewall for Private networks.
