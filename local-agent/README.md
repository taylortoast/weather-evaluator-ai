# Local Evaluation Agent

Node.js service that retrieves distilled reference PDFs linked to the selected objectives, calls LM Studio, validates the model response, and returns instructor-review text to the evaluator UI.

Use **Google/Gemma-3-4B** in LM Studio. The configured model identifier is `google/gemma-3-4b`.

The evaluator identifies students from filenames named `METOC-Product-Package-Lastname-Firstname.xlsx`. Student identity is passed as metadata only and does not affect grading. Expanded workbooks are evaluated from the mapped worksheet cells in `local-evaluator/worksheet-mapping.json`; blank mapped cells are reported as `Missing`, and populated cells retain worksheet/cell provenance.

## Start

From the project root:

```powershell
$env:LM_STUDIO_API_TOKEN = "your-local-token"
$env:LM_STUDIO_BASE_URL = "http://127.0.0.1:1234"
$env:LM_STUDIO_MODEL = "google/gemma-3-4b"
$env:LOCAL_AGENT_HOST = "0.0.0.0"
node .\local-agent\server.js
```

Health check:

```text
http://localhost:8787/health
```

Expected response includes:

```json
{
  "ok": true,
  "model": "google/gemma-3-4b",
  "objectives": 0,
  "references": 0
}
```

## Evaluation Contract

The UI sends each student document as a separate evaluation request with:

- selected objective labels
- student identity metadata and original filename
- extracted mapped workbook answer items with worksheet and cell addresses
- fixed evaluation instructions

Large submissions are evaluated in ordered batches of up to 24 populated answer items. Blank mapped cells are handled locally as `Missing` items, then merged back into the original worksheet/cell order.

The selected objective is the direct evaluation target. The agent also makes earlier curriculum objectives available as progressive background context, so selecting 4A can use prerequisite material from Units 2 and 3 when relevant. Retrieval still ranks the selected objective first and is capped at four reference sections and 9,000 context characters. It does not use `course-reference.md`, `curriculum.txt`, or `objective-notes.md`.

Returned output:

- correct answers: count only
- partially correct and incorrect answers: objective, evaluated answer text, evaluation narrative, and PDF citation
- missing and unclear answers: objective, evaluated answer text, and PDF citation

## Configuration

- `LOCAL_AGENT_PORT`: defaults to `8787`
- `LOCAL_AGENT_HOST`: defaults to `0.0.0.0`
- `LM_STUDIO_BASE_URL`: defaults to `http://127.0.0.1:1234`
- `LM_STUDIO_MODEL`: defaults to `google/gemma-3-4b`
- `LM_STUDIO_API_TOKEN`: optional local token

Keep tokens in the shell environment. Do not commit them.
