# 333 TRS Local Evaluator

Browser UI for extracting mapped answers from standardized METOC Product Package Excel workbooks, selecting course objectives, and reviewing one local AI evaluation per student submission.

## Start

From this directory:

```powershell
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

The UI server binds to `0.0.0.0` by default. If Windows blocks access, allow Node.js through the firewall for Private networks.

## Agent Endpoint

The page auto-fills the endpoint based on how it was opened:

- host PC: `http://127.0.0.1:8787/api/evaluate`
- LAN PC: `http://HOST-PC-IP:8787/api/evaluate`

Run the local agent on the host PC before evaluating work.

## Workflow

1. Name each workbook `METOC-Product-Package-Lastname-Firstname.xlsx`.
2. Upload one or more `.xlsx` or `.xls` workbooks.
3. Select one current objective in Section 02.
4. Click `Evaluate work`.
5. Review one result box per workbook.
6. Use the result box `Copy` button if the instructor wants to preserve or share the result.

Correct answers are shown as list items; Missing answers are shown only as a count. Partially correct and incorrect answers include the objective, evaluated answer, evaluation narrative, and PDF citation. Unclear answers remain in the review section.

## Supported Workbook Types

- Standardized METOC package: mapped cells in `worksheet-mapping.json` across the expanded workbook worksheets.
- Legacy Mission Forecaster: `MEF Forecast Reasoning`
- Legacy Station Forecaster: `TAF Forecast Reasoning`

Mapped blank cells are reported as `Missing`. Evaluation results retain the worksheet and cell address for instructor review.

## Objective References

The objective picker loads objectives from:

```text
../local-agent/course/reference-manifest.json
```

The local agent uses the same manifest for retrieval, so the UI and evaluation context stay aligned. Distilled PDFs listed there are automatically included when their associated objective is selected.
