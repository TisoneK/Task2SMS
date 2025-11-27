from abc import ABC, abstractmethod
from typing import Optional, Dict
import logging
from config import settings

logger = logging.getLogger(__name__)


class SMSProvider(ABC):
    """Abstract base class for SMS providers"""
    
    @abstractmethod
    def send_sms(self, recipient: str, message: str) -> Dict[str, any]:
        """Send SMS and return delivery status"""
        pass


class AfricasTalkingSMSProvider(SMSProvider):
    """Africa's Talking SMS provider"""
    
    def __init__(self):
        if not settings.africastalking_username or not settings.africastalking_api_key:
            raise ValueError("Africa's Talking credentials not configured")
        
        import africastalking
        africastalking.initialize(
            settings.africastalking_username,
            settings.africastalking_api_key
        )
        self.sms = africastalking.SMS
    
    def send_sms(self, recipient: str, message: str) -> Dict[str, any]:
        try:
            response = self.sms.send(message, [recipient])
            logger.info(f"Africa's Talking response: {response}")
            
            if response['SMSMessageData']['Recipients']:
                recipient_data = response['SMSMessageData']['Recipients'][0]
                return {
                    'success': recipient_data['status'] == 'Success',
                    'message_id': recipient_data.get('messageId'),
                    'status': recipient_data['status'],
                    'cost': recipient_data.get('cost')
                }
            return {'success': False, 'error': 'No recipient data'}
        except Exception as e:
            logger.error(f"Africa's Talking error: {str(e)}")
            return {'success': False, 'error': str(e)}


class TwilioSMSProvider(SMSProvider):
    """Twilio SMS provider"""
    
    def __init__(self):
        if not settings.twilio_account_sid or not settings.twilio_auth_token:
            raise ValueError("Twilio credentials not configured")
        
        from twilio.rest import Client
        self.client = Client(
            settings.twilio_account_sid,
            settings.twilio_auth_token
        )
        self.from_number = settings.twilio_phone_number
    
    def send_sms(self, recipient: str, message: str) -> Dict[str, any]:
        try:
            msg = self.client.messages.create(
                body=message,
                from_=self.from_number,
                to=recipient
            )
            logger.info(f"Twilio message SID: {msg.sid}")
            
            return {
                'success': True,
                'message_id': msg.sid,
                'status': msg.status,
                'price': msg.price
            }
        except Exception as e:
            logger.error(f"Twilio error: {str(e)}")
            return {'success': False, 'error': str(e)}


class GSMModemSMSProvider(SMSProvider):
    """GSM Modem SMS provider for offline operation"""
    
    def __init__(self):
        if not settings.gsm_modem_port:
            raise ValueError("GSM modem port not configured")
        
        import serial
        self.port = settings.gsm_modem_port
        self.baudrate = settings.gsm_modem_baudrate
    
    def send_sms(self, recipient: str, message: str) -> Dict[str, any]:
        try:
            import serial
            import time
            
            # Open serial connection
            ser = serial.Serial(self.port, self.baudrate, timeout=1)
            time.sleep(1)
            
            # Set SMS mode to text
            ser.write(b'AT+CMGF=1\r')
            time.sleep(0.5)
            
            # Set recipient
            ser.write(f'AT+CMGS="{recipient}"\r'.encode())
            time.sleep(0.5)
            
            # Send message
            ser.write(f'{message}\x1A'.encode())
            time.sleep(2)
            
            # Read response
            response = ser.read(ser.in_waiting).decode()
            ser.close()
            
            if '+CMGS:' in response:
                logger.info(f"GSM Modem SMS sent to {recipient}")
                return {'success': True, 'status': 'sent', 'response': response}
            else:
                logger.error(f"GSM Modem error: {response}")
                return {'success': False, 'error': response}
                
        except Exception as e:
            logger.error(f"GSM Modem error: {str(e)}")
            return {'success': False, 'error': str(e)}


class SMSService:
    """Main SMS service that manages multiple providers"""
    
    def __init__(self):
        self.providers = {}
        self._initialize_providers()
    
    def _initialize_providers(self):
        """Initialize available SMS providers"""
        # Try to initialize Africa's Talking
        try:
            self.providers['africastalking'] = AfricasTalkingSMSProvider()
            logger.info("Africa's Talking provider initialized")
        except Exception as e:
            logger.warning(f"Africa's Talking not available: {e}")
        
        # Try to initialize Twilio
        try:
            self.providers['twilio'] = TwilioSMSProvider()
            logger.info("Twilio provider initialized")
        except Exception as e:
            logger.warning(f"Twilio not available: {e}")
        
        # Try to initialize GSM Modem
        try:
            self.providers['gsm_modem'] = GSMModemSMSProvider()
            logger.info("GSM Modem provider initialized")
        except Exception as e:
            logger.warning(f"GSM Modem not available: {e}")
    
    def send_sms(self, recipient: str, message: str, provider: str = 'africastalking') -> Dict[str, any]:
        """Send SMS using specified provider with fallback"""
        
        # Try primary provider
        if provider in self.providers:
            result = self.providers[provider].send_sms(recipient, message)
            if result['success']:
                return result
            logger.warning(f"Provider {provider} failed, trying fallback")
        
        # Try fallback providers
        for fallback_provider_name, fallback_provider in self.providers.items():
            if fallback_provider_name != provider:
                logger.info(f"Trying fallback provider: {fallback_provider_name}")
                result = fallback_provider.send_sms(recipient, message)
                if result['success']:
                    result['fallback_provider'] = fallback_provider_name
                    return result
        
        return {'success': False, 'error': 'All providers failed'}
    
    def get_available_providers(self) -> list:
        """Get list of available providers"""
        return list(self.providers.keys())


# Singleton instance
sms_service = SMSService()

