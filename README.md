# 333 TRS Weather AI

Local tools for extracting and evaluating weather-forecasting student workbooks.

## Included components

- [`local-evaluator`](local-evaluator/): browser-only workbook extraction and instructor review interface.
- [`local-agent`](local-agent/): local evaluation service that retrieves approved curriculum context and sends evaluation requests to an OpenAI-compatible LM Studio endpoint.

## Workflow

1. Open `local-evaluator/index.html` in a browser.
2. Select Mission Forecaster or Station Forecaster Excel workbooks.
3. Review or download the extracted submission JSON.
4. Optionally enter a local agent URL and request an evaluation.
5. Review the returned classification, rubric findings, missing concepts, and instructor-review flag.

## Start the local agent

From the project directory, configure the local model connection and start the service:

```powershell
$env:LM_STUDIO_API_TOKEN = "your-local-token"
$env:LM_STUDIO_BASE_URL = "http://127.0.0.1:1234"
$env:LM_STUDIO_MODEL = "google/gemma-3-4b"
node .\local-agent\server.js
```

The service listens at `http://127.0.0.1:8787`.

- Health check: `http://127.0.0.1:8787/health`
- Evaluation endpoint: `http://127.0.0.1:8787/api/evaluate`

## Evaluation boundaries

The agent evaluates only against the instructor-provided scope, approved context, rubric, evaluation instructions, and locally stored course curriculum. Ambiguous, low-confidence, conflicting, or insufficiently supported results are marked for instructor review.

## Supported workbooks

- Mission Forecaster: `MEF Forecast Reasoning`
- Station Forecaster: `TAF Forecast Reasoning`

All included runtime assets are local. No external web server is required to extract workbook data.
