# API Examples

## Authentication

### Register a New User

```bash
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "johndoe",
    "password": "securepassword123"
  }'
```

Response:
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "is_active": true,
  "created_at": "2024-01-15T10:30:00"
}
```

### Login

```bash
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=johndoe&password=securepassword123"
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

### Get Current User

```bash
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Tasks

### Create a Task

#### Example 1: Basketball Game Updates

```bash
curl -X POST "http://localhost:8000/api/tasks/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lakers vs Bulls",
    "description": "Get score updates every hour",
    "source_link": "https://api-basketball.com/games/12345",
    "schedule_human": "every 1 hour",
    "recipients": ["+254712345678", "+254723456789"],
    "condition_rules": {
      "type": "total_over",
      "value": 140
    },
    "message_template": "{home_team} {home_score} - {away_team} {away_score}. Total: {total}",
    "is_active": true
  }'
```

#### Example 2: Daily Reminder

```bash
curl -X POST "http://localhost:8000/api/tasks/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Daily Standup Reminder",
    "description": "Remind team about daily standup",
    "schedule_cron": "0 9 * * 1-5",
    "recipients": ["+254712345678"],
    "condition_rules": {
      "type": "always"
    },
    "message_template": "Good morning! Daily standup in 15 minutes.",
    "is_active": true
  }'
```

#### Example 3: Weather Alert

```bash
curl -X POST "http://localhost:8000/api/tasks/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Rain Alert",
    "description": "Alert when rain is forecasted",
    "source_link": "https://api.weather.com/forecast",
    "schedule_human": "every 6 hours",
    "recipients": ["+254712345678"],
    "condition_rules": {
      "type": "field_contains",
      "field": "weather",
      "value": "rain"
    },
    "message_template": "Weather Alert: {weather} expected. Temperature: {temp}°C",
    "is_active": true
  }'
```

### Get All Tasks

```bash
curl -X GET "http://localhost:8000/api/tasks/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
[
  {
    "id": 1,
    "name": "Lakers vs Bulls",
    "description": "Get score updates every hour",
    "source_link": "https://api-basketball.com/games/12345",
    "schedule_cron": null,
    "schedule_human": "every 1 hour",
    "recipients": ["+254712345678", "+254723456789"],
    "condition_rules": {
      "type": "total_over",
      "value": 140
    },
    "message_template": "{home_team} {home_score} - {away_team} {away_score}. Total: {total}",
    "is_active": true,
    "user_id": 1,
    "last_run": "2024-01-15T14:00:00",
    "next_run": "2024-01-15T15:00:00",
    "created_at": "2024-01-15T10:30:00",
    "updated_at": "2024-01-15T10:30:00"
  }
]
```

### Get Single Task

```bash
curl -X GET "http://localhost:8000/api/tasks/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Task

```bash
curl -X PUT "http://localhost:8000/api/tasks/1" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "schedule_human": "every 30 minutes",
    "is_active": true
  }'
```

### Toggle Task Active Status

```bash
curl -X POST "http://localhost:8000/api/tasks/1/toggle" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Delete Task

```bash
curl -X DELETE "http://localhost:8000/api/tasks/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notifications

### Get All Notifications

```bash
curl -X GET "http://localhost:8000/api/notifications/" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Response:
```json
[
  {
    "id": 1,
    "task_id": 1,
    "recipient": "+254712345678",
    "message": "Lakers 102 - Bulls 97. Total: 199",
    "provider": "africastalking",
    "status": "sent",
    "sent_at": "2024-01-15T14:00:00",
    "delivered_at": null,
    "error_message": null,
    "retry_count": 0,
    "created_at": "2024-01-15T14:00:00"
  }
]
```

### Get Notifications for a Task

```bash
curl -X GET "http://localhost:8000/api/notifications/task/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Single Notification

```bash
curl -X GET "http://localhost:8000/api/notifications/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Condition Rules Examples

### Always Send

```json
{
  "type": "always"
}
```

### Total Score Over Threshold

```json
{
  "type": "total_over",
  "value": 140
}
```

### Total Score Under Threshold

```json
{
  "type": "total_under",
  "value": 100
}
```

### Field Equals Value

```json
{
  "type": "field_equals",
  "field": "status",
  "value": "completed"
}
```

### Field Contains Text

```json
{
  "type": "field_contains",
  "field": "description",
  "value": "urgent"
}
```

### Field Greater Than

```json
{
  "type": "field_greater_than",
  "field": "temperature",
  "value": 30
}
```

### Field Less Than

```json
{
  "type": "field_less_than",
  "field": "humidity",
  "value": 50
}
```

## Schedule Examples

### Human-Readable Schedules

- `every 1 minute`
- `every 5 minutes`
- `every 1 hour`
- `every 2 hours`
- `every 1 day`
- `every 1 week`

### Cron Expressions

- `* * * * *` - Every minute
- `0 * * * *` - Every hour
- `0 9 * * *` - Every day at 9 AM
- `0 9 * * 1-5` - Every weekday at 9 AM
- `0 0 * * 0` - Every Sunday at midnight
- `*/15 * * * *` - Every 15 minutes
- `0 */6 * * *` - Every 6 hours

## Message Template Examples

### Sports Score

```
{home_team} {home_score} - {away_team} {away_score}
Full Time — {winner} wins by {margin}.
```

### Weather Update

```
Weather Update for {city}:
Temperature: {temp}°C
Condition: {weather}
Humidity: {humidity}%
```

### Stock Alert

```
Stock Alert: {symbol}
Price: ${price}
Change: {change}%
Time: {timestamp}
```

### Task Reminder

```
Reminder: {task_name}
Due: {due_date}
Priority: {priority}
```

## Health Check

```bash
curl -X GET "http://localhost:8000/health"
```

Response:
```json
{
  "status": "healthy",
  "scheduler_running": true,
  "active_jobs": 5,
  "retry_service_running": true
}
```

## Error Responses

### 401 Unauthorized

```json
{
  "detail": "Could not validate credentials"
}
```

### 404 Not Found

```json
{
  "detail": "Task not found"
}
```

### 400 Bad Request

```json
{
  "detail": "Email or username already registered"
}
```

### 422 Validation Error

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

