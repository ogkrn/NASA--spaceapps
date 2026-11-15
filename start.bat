@echo off
echo ========================================================
echo Starting ARES-LUNA: Planetary Analog & Mission Simulator
echo ========================================================
echo.

echo [1/2] Starting Backend (FastAPI on http://localhost:8000)...
start "ARES-LUNA Backend" cmd /k "cd backend && venv\Scripts\python.exe run.py"

echo [2/2] Starting Frontend (Next.js on http://localhost:3000)...
start "ARES-LUNA Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Both services are starting!
echo - Frontend: http://localhost:3000
echo - Backend API & Docs: http://localhost:8000/docs
echo ========================================================

