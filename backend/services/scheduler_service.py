from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.interval import IntervalTrigger
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from typing import Optional
import logging
from croniter import croniter

from database import SessionLocal
from models import Task, Notification, DeliveryStatus, SMSProvider
from services.condition_evaluator import condition_evaluator
from services.sms_service import sms_service

logger = logging.getLogger(__name__)


class TaskScheduler:
    """Manages scheduled task execution"""
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.running_jobs = {}
    
    def start(self):
        """Start the scheduler"""
        if not self.scheduler.running:
            self.scheduler.start()
            logger.info("Task scheduler started")
            # Load existing tasks
            self.load_all_tasks()
    
    def stop(self):
        """Stop the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Task scheduler stopped")
    
    def load_all_tasks(self):
        """Load all active tasks from database and schedule them"""
        db = SessionLocal()
        try:
            tasks = db.query(Task).filter(Task.is_active == True).all()
            for task in tasks:
                self.schedule_task(task)
            logger.info(f"Loaded {len(tasks)} active tasks")
        finally:
            db.close()
    
    def schedule_task(self, task: Task):
        """Schedule a single task"""
        job_id = f"task_{task.id}"
        
        # Remove existing job if any
        if job_id in self.running_jobs:
            self.scheduler.remove_job(job_id)
        
        # Parse schedule
        trigger = self._parse_schedule(task.schedule_cron, task.schedule_human)
        
        if trigger:
            self.scheduler.add_job(
                self._execute_task,
                trigger=trigger,
                id=job_id,
                args=[task.id],
                replace_existing=True
            )
            self.running_jobs[job_id] = task.id
            
            # Update next_run time
            db = SessionLocal()
            try:
                db_task = db.query(Task).filter(Task.id == task.id).first()
                if db_task:
                    job = self.scheduler.get_job(job_id)
                    if job and job.next_run_time:
                        db_task.next_run = job.next_run_time
                        db.commit()
            finally:
                db.close()
            
            logger.info(f"Scheduled task {task.id}: {task.name}")
        else:
            logger.warning(f"Could not parse schedule for task {task.id}")
    
    def unschedule_task(self, task_id: int):
        """Remove a task from the schedule"""
        job_id = f"task_{task_id}"
        if job_id in self.running_jobs:
            self.scheduler.remove_job(job_id)
            del self.running_jobs[job_id]
            logger.info(f"Unscheduled task {task_id}")
    
    def _parse_schedule(self, cron_expr: Optional[str], human_expr: Optional[str]):
        """Parse schedule expression into APScheduler trigger"""
        
        # Try cron expression first
        if cron_expr:
            try:
                # Validate cron expression
                if croniter.is_valid(cron_expr):
                    return CronTrigger.from_crontab(cron_expr)
            except Exception as e:
                logger.error(f"Invalid cron expression '{cron_expr}': {e}")
        
        # Try human-readable expression
        if human_expr:
            try:
                return self._parse_human_schedule(human_expr)
            except Exception as e:
                logger.error(f"Invalid human schedule '{human_expr}': {e}")
        
        return None
    
    def _parse_human_schedule(self, human_expr: str):
        """Parse human-readable schedule (e.g., 'every 1 hour', 'every 30 minutes')"""
        human_expr = human_expr.lower().strip()
        
        # Parse "every X minutes/hours/days"
        if human_expr.startswith("every "):
            parts = human_expr.split()
            if len(parts) >= 3:
                try:
                    value = int(parts[1])
                    unit = parts[2].rstrip('s')  # Remove plural 's'
                    
                    if unit in ['minute', 'hour', 'day', 'week']:
                        return IntervalTrigger(**{f"{unit}s": value})
                except ValueError:
                    pass
        
        return None
    
    async def _execute_task(self, task_id: int):
        """Execute a scheduled task"""
        db = SessionLocal()
        try:
            task = db.query(Task).filter(Task.id == task_id).first()
            if not task or not task.is_active:
                logger.warning(f"Task {task_id} not found or inactive")
                return
            
            logger.info(f"Executing task {task_id}: {task.name}")
            
            # Update last_run
            task.last_run = datetime.utcnow()
            
            # Fetch data if source link provided
            data = {}
            if task.source_link:
                data = await condition_evaluator.fetch_data(task.source_link)
                if data is None:
                    logger.error(f"Failed to fetch data for task {task_id}")
                    db.commit()
                    return
            
            # Evaluate condition
            should_send = condition_evaluator.evaluate_condition(
                task.condition_rules or {},
                data
            )
            
            if should_send:
                # Format message
                message = condition_evaluator.format_message(
                    task.message_template or "Task update: {name}",
                    {**data, "name": task.name, "description": task.description or ""}
                )
                
                # Send to all recipients
                for recipient in task.recipients or []:
                    await self._send_notification(db, task, recipient, message)
                
                logger.info(f"Task {task_id} sent {len(task.recipients or [])} notifications")
            else:
                logger.info(f"Task {task_id} condition not met, skipping notification")
            
            db.commit()
            
        except Exception as e:
            logger.error(f"Error executing task {task_id}: {e}", exc_info=True)
            db.rollback()
        finally:
            db.close()
    
    async def _send_notification(self, db: Session, task: Task, recipient: str, message: str):
        """Send notification and log to database"""
        
        # Determine provider (default to africastalking)
        provider = SMSProvider.AFRICASTALKING
        
        # Create notification record
        notification = Notification(
            task_id=task.id,
            recipient=recipient,
            message=message,
            provider=provider,
            status=DeliveryStatus.PENDING
        )
        db.add(notification)
        db.flush()  # Get notification ID
        
        try:
            # Send SMS
            result = sms_service.send_sms(recipient, message, provider.value)
            
            if result['success']:
                notification.status = DeliveryStatus.SENT
                notification.sent_at = datetime.utcnow()
                logger.info(f"SMS sent to {recipient} for task {task.id}")
            else:
                notification.status = DeliveryStatus.FAILED
                notification.error_message = result.get('error', 'Unknown error')
                logger.error(f"Failed to send SMS to {recipient}: {notification.error_message}")
        
        except Exception as e:
            notification.status = DeliveryStatus.QUEUED  # Queue for retry
            notification.error_message = str(e)
            logger.error(f"Exception sending SMS to {recipient}: {e}")
        
        db.commit()


# Singleton instance
task_scheduler = TaskScheduler()

