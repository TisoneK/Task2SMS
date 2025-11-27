# Quick Start Guide

Get Task2SMS up and running in 5 minutes!

## Prerequisites

- Docker and Docker Compose installed
- OR Python 3.12+ and Node.js 18+

## Option 1: Docker (Recommended) 🐳

```bash
# Clone the repository
git clone https://github.com/TisoneK/Task2SMS.git
cd Task2SMS

# Create environment file
cp .env.example .env

# Edit .env and add your SMS provider credentials (optional for testing)
# nano .env  # or use your favorite editor

# Start the application
docker-compose up -d

# View logs
docker-compose logs -f
```

**Access the application:**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Option 2: Manual Setup 💻

### Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # Linux/Mac
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Run the backend
python main.py
```

Backend runs on http://localhost:8000

### Frontend (New Terminal)

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs on http://localhost:3000

## First Steps

1. **Open the application** in your browser
2. **Register** a new account
3. **Login** with your credentials
4. **Create your first task**:
   - Name: "Test Task"
   - Schedule: "every 1 minute"
   - Recipients: Your phone number (e.g., +254712345678)
   - Condition: "Always send"
   - Message: "Hello from Task2SMS!"
5. **Watch it work!** Check your phone for the SMS

## SMS Provider Setup (Optional)

For production use, configure an SMS provider:

### Africa's Talking (Kenya/Africa)

1. Sign up at https://africastalking.com
2. Get your API key
3. Add to `.env`:
```env
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your-api-key
```

### Twilio (Global)

1. Sign up at https://twilio.com
2. Get credentials
3. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```

## Stopping the Application

### Docker
```bash
docker-compose down
```

### Manual
Press `Ctrl+C` in both terminal windows

## Need Help?

- 📖 [Full Documentation](README.md)
- 🚀 [Getting Started Guide](Docs/GETTING_STARTED.md)
- 💻 [Development Guide](Docs/DEVELOPMENT.md)
- 🔍 [API Examples](Docs/API_EXAMPLES.md)
- 🐛 [Report Issues](https://github.com/TisoneK/Task2SMS/issues)

## What's Next?

- Explore different condition types
- Try cron expressions for scheduling
- Set up multiple tasks
- Monitor notification history
- Configure offline GSM modem support

Happy automating! 🎉

