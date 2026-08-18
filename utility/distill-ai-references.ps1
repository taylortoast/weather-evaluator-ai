$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $PSScriptRoot
$python = Get-ChildItem "$env:LOCALAPPDATA\Programs\Python\Python*\python.exe" -ErrorAction SilentlyContinue |
    Sort-Object FullName -Descending |
    Select-Object -First 1 -ExpandProperty FullName
if (-not $python) { $python = (Get-Command python -ErrorAction SilentlyContinue).Source }
if (-not $python) { throw "Python 3 is required. Install Python, then run this file again." }

& $python "$projectRoot\local-agent\tools\distill-pdf.py" "$projectRoot\docs\AI-References"
if ($LASTEXITCODE -ne 0) { throw "Distillation failed with exit code $LASTEXITCODE." }
Write-Host "`nDone. Open local-agent\course\references to review the generated files." -ForegroundColor Green
Read-Host "Press Enter to close"
