# Local Evaluation Agent

Node.js service that retrieves selected course objective context from `course/course-reference.md`, calls LM Studio, validates the model response, and returns instructor-review text to the evaluator UI.

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
  "curriculumPages": 20
}
```

## Evaluation Contract

The UI sends each student document as a separate evaluation request with:

- selected objective labels
- extracted workbook answers
- fixed evaluation instructions

The agent retrieves matching sections from `course/course-reference.md`. It does not use `curriculum.txt`, `objective-notes.md`, or a second reference source.

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
