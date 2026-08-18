$root = Split-Path -Parent $PSScriptRoot

Write-Host ""
Write-Host "=== 333 TRS Weather AI local startup ===" -ForegroundColor Cyan
Write-Host "Project root: $root"
Write-Host ""
Write-Host "Before continuing, start LM Studio and enable its local server at:" -ForegroundColor Yellow
Write-Host "  http://127.0.0.1:1234"
Write-Host "The default model is google/gemma-3-4b."
Write-Host ""
Write-Host "This launcher will open two PowerShell windows and stop existing listeners on ports 8787 and 5500."
Write-Host ""

$servers = @(
    @{
        Name      = "Local Agent"
        Directory = Join-Path $root "local-agent"
        Port      = 8787
        Command   = "node server.js"
    },
    @{
        Name      = "Local Evaluator"
        Directory = Join-Path $root "local-evaluator"
        Port      = 5500
        Command   = "node server.js 5500 0.0.0.0"
    }
)

foreach ($server in $servers) {
    $connections = Get-NetTCPConnection `
        -LocalPort $server.Port `
        -State Listen `
        -ErrorAction SilentlyContinue

    foreach ($processId in ($connections.OwningProcess | Sort-Object -Unique)) {
        Write-Host "Stopping process $processId on port $($server.Port)..."
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
    }

    Write-Host "Starting $($server.Name) on port $($server.Port)..."

    Start-Process powershell.exe `
        -WorkingDirectory $server.Directory `
        -ArgumentList @(
            "-NoExit",
            "-Command",
            $server.Command
        )
}

Write-Host ""
Write-Host "=== Startup requested ===" -ForegroundColor Green
Write-Host "Local Agent health: http://localhost:8787/health"
Write-Host "Local Evaluator:    http://localhost:5500/" -ForegroundColor Green
Write-Host ""
Write-Host "Open the evaluator link above in your browser. Do not use http://0.0.0.0:5500 as the browser address."
Write-Host "The evaluator listens on 0.0.0.0:5500 so another LAN computer can connect with http://HOST-PC-IP:5500/."
Write-Host ""
Write-Host "Keep both server windows and LM Studio open while testing. Press Ctrl+C in both server windows to stop."
