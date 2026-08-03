# LM Studio Setup Notes

This project uses LM Studio through its OpenAI-compatible chat endpoint.

## Required local setup

1. Open LM Studio.
2. Load `google/gemma-3-4b`.
3. Start the local server on port `1234`.
4. Start the local agent with:

```powershell
$env:LM_STUDIO_BASE_URL = "http://127.0.0.1:1234"
$env:LM_STUDIO_MODEL = "google/gemma-3-4b"
$env:LM_STUDIO_API_TOKEN = "your-local-token"
node .\local-agent\server.js
```

The local agent calls:

```text
http://127.0.0.1:1234/v1/chat/completions
```

## Context-size notes

`google/gemma-3-4b` may reject very large prompts. The evaluator now sends selected objective labels only, and the agent retrieves capped sections from `local-agent/course/course-reference.md`.

If LM Studio reports a context-size error, reduce the number of selected objectives and retry.

## Token handling

Keep `LM_STUDIO_API_TOKEN` in the PowerShell session used to start the agent. Do not commit tokens or paste them into the evaluator UI.
