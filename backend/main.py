from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from database import engine, Base
from config import settings
from routers import auth, tasks, notifications
from services.scheduler_service import task_scheduler
from services.retry_service import retry_service

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup
    logger.info("Starting Task2SMS application...")
    
    # Create database tables
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables created")
    
    # Start scheduler
    task_scheduler.start()
    logger.info("Task scheduler started")

    # Start retry service
    retry_service.start()
    logger.info("Retry service started")

    yield

    # Shutdown
    logger.info("Shutting down Task2SMS application...")
    task_scheduler.stop()
    logger.info("Task scheduler stopped")
    retry_service.stop()
    logger.info("Retry service stopped")


app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Turn your tasks into timely SMS updates",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(tasks.router)
app.include_router(notifications.router)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to Task2SMS API",
        "version": settings.app_version,
        "docs": "/docs"
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "scheduler_running": task_scheduler.scheduler.running,
        "active_jobs": len(task_scheduler.running_jobs),
        "retry_service_running": retry_service.scheduler.running
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug
    )

