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
    docker-compose up -d
    echo.
    echo Task2SMS is running!
    echo Frontend: http://localhost
    echo Backend API: http://localhost:8000
    echo API Docs: http://localhost:8000/docs
    echo.
    echo To view logs: docker-compose logs -f
    echo To stop: docker-compose down
) else (
    echo Docker Compose not found. Please install Docker and Docker Compose.
    echo.
    echo Alternatively, run manually:
    echo 1. Backend: cd backend ^&^& python main.py
    echo 2. Frontend: cd frontend ^&^& npm run dev
)

pause

