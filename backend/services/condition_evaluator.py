from typing import Dict, Any, Optional
import logging
import httpx
from datetime import datetime

logger = logging.getLogger(__name__)


class ConditionEvaluator:
    """Evaluates task conditions to determine if notifications should be sent"""
    
    def __init__(self):
        self.http_client = httpx.AsyncClient(timeout=30.0)
    
    async def fetch_data(self, source_link: str) -> Optional[Dict[str, Any]]:
        """Fetch data from external source"""
        try:
            response = await self.http_client.get(source_link)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Error fetching data from {source_link}: {e}")
            return None
    
    def evaluate_condition(self, condition_rules: Dict[str, Any], data: Dict[str, Any]) -> bool:
        """
        Evaluate if condition is met based on rules and data
        
        Condition rule examples:
        - {"type": "always"} - Always send
        - {"type": "total_over", "value": 140} - Send if total > value
        - {"type": "total_under", "value": 100} - Send if total < value
        - {"type": "field_equals", "field": "status", "value": "completed"}
        - {"type": "field_contains", "field": "description", "value": "urgent"}
        - {"type": "odds_change", "threshold": 0.1} - Send if odds changed by threshold
        """
        
        if not condition_rules:
            return True  # No condition means always send
        
        condition_type = condition_rules.get("type", "always")
        
        if condition_type == "always":
            return True
        
        elif condition_type == "total_over":
            total = self._extract_total(data)
            threshold = condition_rules.get("value", 0)
            return total is not None and total > threshold
        
        elif condition_type == "total_under":
            total = self._extract_total(data)
            threshold = condition_rules.get("value", 0)
            return total is not None and total < threshold
        
        elif condition_type == "field_equals":
            field = condition_rules.get("field")
            expected_value = condition_rules.get("value")
            actual_value = self._get_nested_field(data, field)
            return actual_value == expected_value
        
        elif condition_type == "field_contains":
            field = condition_rules.get("field")
            search_value = condition_rules.get("value", "")
            actual_value = str(self._get_nested_field(data, field) or "")
            return search_value.lower() in actual_value.lower()
        
        elif condition_type == "field_greater_than":
            field = condition_rules.get("field")
            threshold = condition_rules.get("value", 0)
            actual_value = self._get_nested_field(data, field)
            try:
                return float(actual_value) > float(threshold)
            except (ValueError, TypeError):
                return False
        
        elif condition_type == "field_less_than":
            field = condition_rules.get("field")
            threshold = condition_rules.get("value", 0)
            actual_value = self._get_nested_field(data, field)
            try:
                return float(actual_value) < float(threshold)
            except (ValueError, TypeError):
                return False
        
        elif condition_type == "odds_change":
            # Compare current odds with previous odds
            current_odds = self._extract_odds(data)
            previous_odds = condition_rules.get("previous_odds")
            threshold = condition_rules.get("threshold", 0.1)
            
            if current_odds is not None and previous_odds is not None:
                change = abs(current_odds - previous_odds)
                return change >= threshold
            return False
        
        else:
            logger.warning(f"Unknown condition type: {condition_type}")
            return False
    
    def _extract_total(self, data: Dict[str, Any]) -> Optional[float]:
        """Extract total score from data"""
        # Try common field names
        for field in ['total', 'score_total', 'combined_score', 'sum']:
            if field in data:
                try:
                    return float(data[field])
                except (ValueError, TypeError):
                    pass
        
        # Try to calculate from home and away scores
        try:
            home = float(data.get('home_score', 0))
            away = float(data.get('away_score', 0))
            return home + away
        except (ValueError, TypeError):
            pass
        
        return None
    
    def _extract_odds(self, data: Dict[str, Any]) -> Optional[float]:
        """Extract odds from data"""
        for field in ['odds', 'current_odds', 'line']:
            if field in data:
                try:
                    return float(data[field])
                except (ValueError, TypeError):
                    pass
        return None
    
    def _get_nested_field(self, data: Dict[str, Any], field_path: str) -> Any:
        """Get nested field value using dot notation (e.g., 'team.score')"""
        if not field_path:
            return None
        
        parts = field_path.split('.')
        value = data
        
        for part in parts:
            if isinstance(value, dict):
                value = value.get(part)
            else:
                return None
        
        return value
    
    def format_message(self, template: str, data: Dict[str, Any]) -> str:
        """
        Format message template with data
        
        Template example: "{home_team} {home_score} - {away_team} {away_score}"
        """
        try:
            # Simple template formatting
            message = template
            for key, value in data.items():
                placeholder = f"{{{key}}}"
                if placeholder in message:
                    message = message.replace(placeholder, str(value))
            return message
        except Exception as e:
            logger.error(f"Error formatting message: {e}")
            return template
    
    async def close(self):
        """Close HTTP client"""
        await self.http_client.aclose()


# Singleton instance
condition_evaluator = ConditionEvaluator()

