# PowerShell runner script for ARES-LUNA
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting ARES-LUNA: Planetary Analog & Mission Simulator" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$rootDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n[1/2] Starting Backend (FastAPI on http://localhost:8000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\backend'; .\venv\Scripts\python.exe run.py"

Write-Host "[2/2] Starting Frontend (Next.js on http://localhost:3000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$rootDir\frontend'; npm run dev"

Write-Host "`nSystem operational!" -ForegroundColor Cyan
Write-Host "• Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "• Backend API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan

