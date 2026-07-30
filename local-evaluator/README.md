# 333 TRS Local Evaluator

Browser-only prototype for extracting student answers from Mission Forecaster and Station Forecaster Excel workbooks.

## Run locally

Open `index.html` in a browser. The workbook parser and all site assets are local; no internet connection or web server is required for extraction.

For local AI evaluation, run an OpenAI-compatible agent and enter its chat-completions URL in the page. The default URL is:

```text
http://localhost:11434/v1/chat/completions
```

The browser sends extracted submissions, course scope, approved context, instructions, and rubric in one request. If the agent is unavailable, extracted data remains available for instructor review.

## Supported workbook types

- Mission Forecaster: `MEF Forecast Reasoning`
- Station Forecaster: `TAF Forecast Reasoning`

The original prototype in `../site` is preserved unchanged.
