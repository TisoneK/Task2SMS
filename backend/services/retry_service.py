import logging
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

from database import SessionLocal
from models import Notification, DeliveryStatus
from services.sms_service import sms_service

logger = logging.getLogger(__name__)


class RetryService:
    """Service to retry failed SMS notifications"""
    
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.max_retries = 3
        self.retry_interval_minutes = 5
    
    def start(self):
        """Start the retry service"""
        if not self.scheduler.running:
            # Run retry check every 5 minutes
            self.scheduler.add_job(
                self._retry_failed_notifications,
                trigger=IntervalTrigger(minutes=self.retry_interval_minutes),
                id='retry_failed_notifications',
                replace_existing=True
            )
            self.scheduler.start()
            logger.info("Retry service started")
    
    def stop(self):
        """Stop the retry service"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            logger.info("Retry service stopped")
    
    async def _retry_failed_notifications(self):
        """Retry failed and queued notifications"""
        db = SessionLocal()
        try:
            # Get failed and queued notifications that haven't exceeded max retries
            notifications = db.query(Notification).filter(
                Notification.status.in_([DeliveryStatus.FAILED, DeliveryStatus.QUEUED]),
                Notification.retry_count < self.max_retries
            ).all()
            
            logger.info(f"Found {len(notifications)} notifications to retry")
            
            for notification in notifications:
                try:
                    # Attempt to send
                    result = sms_service.send_sms(
                        notification.recipient,
                        notification.message,
                        notification.provider.value
                    )
                    
                    notification.retry_count += 1
                    
                    if result['success']:
                        notification.status = DeliveryStatus.SENT
                        notification.sent_at = datetime.utcnow()
                        notification.error_message = None
                        logger.info(f"Successfully retried notification {notification.id}")
                    else:
                        if notification.retry_count >= self.max_retries:
                            notification.status = DeliveryStatus.FAILED
                        else:
                            notification.status = DeliveryStatus.QUEUED
                        notification.error_message = result.get('error', 'Unknown error')
                        logger.warning(f"Retry failed for notification {notification.id}: {notification.error_message}")
                    
                    db.commit()
                    
                except Exception as e:
                    logger.error(f"Error retrying notification {notification.id}: {e}")
                    notification.retry_count += 1
                    notification.error_message = str(e)
                    db.commit()
            
        except Exception as e:
            logger.error(f"Error in retry service: {e}", exc_info=True)
        finally:
            db.close()


# Singleton instance
retry_service = RetryService()

