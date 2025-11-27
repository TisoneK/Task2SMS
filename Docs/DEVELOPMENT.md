# Development Guide

## Project Structure

```
Task2SMS/
├── backend/                 # FastAPI backend
│   ├── routers/            # API route handlers
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── tasks.py        # Task CRUD endpoints
│   │   └── notifications.py # Notification endpoints
│   ├── services/           # Business logic services
│   │   ├── sms_service.py  # SMS provider abstraction
│   │   ├── scheduler_service.py # Task scheduling
│   │   ├── condition_evaluator.py # Rule evaluation
│   │   └── retry_service.py # Failed message retry
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database connection
│   ├── auth.py             # Authentication utilities
│   ├── config.py           # Configuration
│   └── main.py             # Application entry point
├── frontend/               # React frontend
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (auth)
│   │   ├── services/       # API client
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   └── package.json
├── Docs/                   # Documentation
├── docker-compose.yml      # Docker orchestration
└── README.md
```

## Backend Architecture

### Database Models

1. **User**: User accounts with authentication
2. **Task**: Automated tasks with scheduling and conditions
3. **Notification**: SMS notification records with delivery status
4. **DataCache**: Cached data for offline operation

### Services

#### SMS Service (`sms_service.py`)
- Abstracts multiple SMS providers
- Automatic fallback between providers
- Supports Africa's Talking, Twilio, and GSM modems

#### Scheduler Service (`scheduler_service.py`)
- Uses APScheduler for task execution
- Supports cron expressions and human-readable schedules
- Automatically loads active tasks on startup

#### Condition Evaluator (`condition_evaluator.py`)
- Evaluates task conditions against data
- Supports various condition types:
  - `always`: Always send
  - `total_over`: Total score over threshold
  - `total_under`: Total score under threshold
  - `field_equals`: Field equals value
  - `field_contains`: Field contains text
  - `field_greater_than`: Field greater than value
  - `field_less_than`: Field less than value

#### Retry Service (`retry_service.py`)
- Automatically retries failed notifications
- Configurable retry count and interval
- Runs every 5 minutes by default

## Frontend Architecture

### Pages

1. **Login/Register**: User authentication
2. **Dashboard**: Task list and management
3. **TaskForm**: Create/edit tasks
4. **TaskDetails**: View task details and notification history
5. **Notifications**: All notifications across tasks

### Context

- **AuthContext**: Manages user authentication state

### Services

- **api.js**: Axios-based API client with interceptors

## Development Workflow

### Backend Development

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

### Database Migrations

For production, use Alembic for database migrations:

```bash
cd backend

# Initialize Alembic (first time only)
alembic init alembic

# Create migration
alembic revision --autogenerate -m "Description"

# Apply migration
alembic upgrade head
```

## Testing

### Backend Testing

Create tests in `backend/tests/`:

```python
# tests/test_tasks.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_task():
    # Register user
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass"
    })
    assert response.status_code == 201
    
    # Login
    response = client.post("/api/auth/login", data={
        "username": "testuser",
        "password": "testpass"
    })
    token = response.json()["access_token"]
    
    # Create task
    response = client.post("/api/tasks/", 
        headers={"Authorization": f"Bearer {token}"},
        json={
            "name": "Test Task",
            "schedule_human": "every 1 hour",
            "recipients": ["+254712345678"],
            "is_active": True
        }
    )
    assert response.status_code == 201
```

Run tests:
```bash
pytest
```

### Frontend Testing

Add tests using Vitest:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
npm run test
```

## SMS Provider Setup

### Africa's Talking

1. Sign up at https://africastalking.com
2. Go to sandbox and get your API key
3. Add to `.env`:
```env
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your-api-key
```

### Twilio

1. Sign up at https://twilio.com
2. Get Account SID and Auth Token from console
3. Purchase a phone number
4. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

### GSM Modem

1. Connect modem to USB port
2. Find port (Linux: `/dev/ttyUSB0`, Windows: `COM3`)
3. Add to `.env`:
```env
GSM_MODEM_PORT=/dev/ttyUSB0
GSM_MODEM_BAUDRATE=115200
```

## Debugging

### Backend Debugging

Enable debug logging in `main.py`:

```python
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
```

### Frontend Debugging

Use React DevTools browser extension and check console logs.

## Performance Optimization

### Backend

1. Use database connection pooling
2. Add caching for frequently accessed data
3. Use async/await for I/O operations
4. Optimize database queries with indexes

### Frontend

1. Use React.memo for expensive components
2. Implement pagination for large lists
3. Use lazy loading for routes
4. Optimize bundle size with code splitting

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong SECRET_KEY** in production
3. **Enable HTTPS** in production
4. **Validate all user inputs**
5. **Use rate limiting** for API endpoints
6. **Sanitize SMS messages** to prevent injection
7. **Implement CORS** properly

## Deployment Checklist

- [ ] Set strong SECRET_KEY
- [ ] Configure production database
- [ ] Set up SMS provider credentials
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Test all features in staging
- [ ] Document deployment process
- [ ] Set up error tracking (e.g., Sentry)

## Common Issues

### Issue: SMS not sending

**Solution**: Check SMS provider credentials and balance

### Issue: Tasks not running

**Solution**: Check scheduler logs and ensure tasks are active

### Issue: Database connection error

**Solution**: Verify DATABASE_URL and database is running

### Issue: CORS errors

**Solution**: Update CORS settings in `main.py`

## Contributing

1. Fork the repository at https://github.com/TisoneK/Task2SMS
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Write tests
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request at https://github.com/TisoneK/Task2SMS/pulls

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [APScheduler Documentation](https://apscheduler.readthedocs.io/)
- [Africa's Talking API](https://developers.africastalking.com/)
- [Twilio API](https://www.twilio.com/docs)

