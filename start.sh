#!/bin/bash

echo "Starting Task2SMS..."

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo "Creating .env file from example..."
    cp backend/.env.example backend/.env
    echo "Please edit backend/.env with your configuration"
fi

# Start with Docker Compose
if command -v docker-compose &> /dev/null; then
    echo "Starting with Docker Compose..."
    # Backend setup and start
    (cd backend && [ ! -d "venv" ] && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt; source venv/bin/activate && uvicorn main:app --reload) &
    
    # Frontend setup and start
    (cd frontend && [ ! -d "node_modules" ] && npm install; npm run dev) &
    echo ""
    echo "Task2SMS is running!"
    echo "Frontend: http://localhost"
    echo "Backend API: http://localhost:8000"
    echo "API Docs: http://localhost:8000/docs"
    echo ""
    echo "To stop: Close the terminal windows for frontend and backend."
fi

