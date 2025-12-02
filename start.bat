@echo off
echo Starting Task2SMS...

REM Check if .env exists
if not exist backend\.env (
    echo Creating .env file from example...
    copy backend\.env.example backend\.env
    echo Please edit backend\.env with your configuration
)

REM Start with Docker Compose
where docker-compose >nul 2>nul
if %errorlevel% == 0 (
    echo Starting with Docker Compose...
    REM Backend setup and start
    start "" cmd /k "cd backend && (if not exist venv (python -m venv venv) && call venv\Scripts\activate && pip install -r requirements.txt) && uvicorn main:app --reload"
    
    REM Frontend setup and start
    start "" cmd /k "cd frontend && (if not exist node_modules (npm install)) && npm run dev"
    echo.
    echo Task2SMS is running!
    echo Frontend: http://localhost
    echo Backend API: http://localhost:8000
    echo API Docs: http://localhost:8000/docs
    echo.
    echo To stop: Close the terminal windows for frontend and backend.
)

pause

