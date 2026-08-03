param(
  [int]$Port = 5500,
  [string]$HostAddress = "0.0.0.0"
)

node server.js $Port $HostAddress
