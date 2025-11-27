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
    docker-compose up -d
    echo ""
    echo "Task2SMS is running!"
    echo "Frontend: http://localhost"
    echo "Backend API: http://localhost:8000"
    echo "API Docs: http://localhost:8000/docs"
    echo ""
    echo "To view logs: docker-compose logs -f"
    echo "To stop: docker-compose down"
else
    echo "Docker Compose not found. Please install Docker and Docker Compose."
    echo ""
    echo "Alternatively, run manually:"
    echo "1. Backend: cd backend && python main.py"
    echo "2. Frontend: cd frontend && npm run dev"
fi

