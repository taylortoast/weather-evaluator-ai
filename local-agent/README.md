# Local evaluation agent

This service keeps the agent rules and curriculum retrieval local, then calls the LM Studio OpenAI-compatible API.

## Manual startup

PowerShell:

```powershell
$env:LM_STUDIO_API_TOKEN = "your-local-token"
$env:LM_STUDIO_BASE_URL = "http://127.0.0.1:1234"
$env:LM_STUDIO_MODEL = "google/gemma-3-4b"
node .\local-agent\server.js
```

The agent listens at `http://127.0.0.1:8787`.

Health check:

```text
http://127.0.0.1:8787/health
```

The curriculum text was extracted from the project PDF into `course/curriculum.txt`. The original PDF remains unchanged.
