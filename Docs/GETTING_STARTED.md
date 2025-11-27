# Getting Started with Task2SMS

## What is Task2SMS?

Task2SMS is an automation platform that sends SMS notifications based on scheduled tasks and conditions. Perfect for:

- 🏀 Sports score updates
- 🌤️ Weather alerts
- 📊 Stock price notifications
- ⏰ Reminders and alerts
- 📈 Data monitoring

## Installation

### Option 1: Docker (Recommended)

**Prerequisites**: Docker and Docker Compose installed

1. **Clone the repository**
```bash
git clone https://github.com/TisoneK/Task2SMS.git
cd Task2SMS
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your SMS provider credentials
```

3. **Start the application**
```bash
# Linux/Mac
chmod +x start.sh
./start.sh

# Windows
start.bat
```

4. **Access the application**
- Frontend: http://localhost
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

**Prerequisites**: Python 3.12+, Node.js 18+, PostgreSQL (optional)

#### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Run the backend
python main.py
```

Backend will run on http://localhost:8000

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will run on http://localhost:3000

## First Steps

### 1. Create an Account

1. Open http://localhost (or http://localhost:3000 for manual setup)
2. Click "Register"
3. Fill in your details:
   - Email
   - Username
   - Password
4. Click "Register"

### 2. Set Up SMS Provider

You need at least one SMS provider configured. Choose one:

#### Africa's Talking (Best for Kenya/Africa)

1. Sign up at https://africastalking.com
2. Get your API key from the dashboard
3. Add to `.env`:
```env
AFRICASTALKING_USERNAME=sandbox
AFRICASTALKING_API_KEY=your-api-key-here
```
4. Restart the backend

#### Twilio (Global)

1. Sign up at https://twilio.com
2. Get Account SID and Auth Token
3. Purchase a phone number
4. Add to `.env`:
```env
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890
```
4. Restart the backend

#### GSM Modem (Offline)

1. Connect GSM modem to your computer
2. Find the port (Linux: `/dev/ttyUSB0`, Windows: `COM3`)
3. Add to `.env`:
```env
GSM_MODEM_PORT=/dev/ttyUSB0
```
4. Restart the backend

### 3. Create Your First Task

1. **Login** to your account
2. Click **"New Task"** button
3. Fill in the form:

**Example: Basketball Score Updates**

- **Name**: Lakers vs Bulls
- **Description**: Get score updates when total exceeds 140
- **Source Link**: https://api-basketball.com/games/12345 (your data source)
- **Schedule**: `every 1 hour` or `0 * * * *`
- **Recipients**: Click the input, type `+254712345678`, press Enter
- **Condition**: Select "Total score over" and enter `140`
- **Message Template**: 
  ```
  {home_team} {home_score} - {away_team} {away_score}
  Total: {total}
  ```
- **Active**: Check the box

4. Click **"Create Task"**

### 4. Monitor Your Tasks

- **Dashboard**: View all your tasks
- **Toggle**: Click the toggle icon to activate/deactivate
- **View**: Click "View" to see task details and notification history
- **Edit**: Click "Edit" to modify the task
- **Delete**: Click the trash icon to remove the task

### 5. Check Notifications

1. Click **"Notifications"** in the header
2. View all sent SMS messages
3. Check delivery status:
   - ✅ **Sent**: Successfully delivered
   - ❌ **Failed**: Delivery failed
   - ⚠️ **Queued**: Waiting for retry
   - ⏱️ **Pending**: Being processed

## Common Use Cases

### 1. Sports Score Updates

**Goal**: Get SMS when a game's total score exceeds 140

```
Name: Lakers vs Bulls
Schedule: every 30 minutes
Source: https://api-basketball.com/games/12345
Condition: Total score over 140
Recipients: +254712345678
Message: {home_team} {home_score} - {away_team} {away_score}. Total: {total}
```

### 2. Weather Alerts

**Goal**: Get notified when rain is forecasted

```
Name: Rain Alert
Schedule: every 6 hours
Source: https://api.weather.com/forecast/nairobi
Condition: Field contains - field: "weather", value: "rain"
Recipients: +254712345678
Message: Weather Alert: {weather} expected. Temp: {temp}°C
```

### 3. Daily Reminders

**Goal**: Daily standup reminder at 9 AM on weekdays

```
Name: Daily Standup
Schedule: 0 9 * * 1-5 (cron)
Condition: Always send
Recipients: +254712345678, +254723456789
Message: Good morning! Daily standup in 15 minutes.
```

### 4. Stock Price Alerts

**Goal**: Alert when stock price changes significantly

```
Name: AAPL Stock Alert
Schedule: every 15 minutes
Source: https://api.stocks.com/quote/AAPL
Condition: Field greater than - field: "change_percent", value: 2
Recipients: +254712345678
Message: {symbol} Alert! Price: ${price}, Change: {change_percent}%
```

## Understanding Schedules

### Human-Readable Format

Simple and intuitive:
- `every 1 minute`
- `every 5 minutes`
- `every 1 hour`
- `every 2 hours`
- `every 1 day`

### Cron Format

More flexible:
- `* * * * *` - Every minute
- `0 * * * *` - Every hour
- `0 9 * * *` - Daily at 9 AM
- `0 9 * * 1-5` - Weekdays at 9 AM
- `*/15 * * * *` - Every 15 minutes

**Cron Format**: `minute hour day month weekday`

## Understanding Conditions

### Always Send
Send SMS every time the task runs

### Total Score Over/Under
For sports: send when combined score exceeds/falls below threshold

### Field Equals
Send when a specific field matches a value
- Example: `status` equals `completed`

### Field Contains
Send when a field contains specific text
- Example: `description` contains `urgent`

### Field Greater/Less Than
Send when a numeric field exceeds/falls below threshold
- Example: `temperature` greater than `30`

## Message Templates

Use `{field_name}` to insert dynamic values from your data source:

```
{home_team} {home_score} - {away_team} {away_score}
```

If your data source returns:
```json
{
  "home_team": "Lakers",
  "home_score": 102,
  "away_team": "Bulls",
  "away_score": 97
}
```

The SMS will be:
```
Lakers 102 - Bulls 97
```

## Troubleshooting

### SMS Not Sending

1. **Check SMS provider credentials** in `.env`
2. **Verify phone number format** (include country code: +254...)
3. **Check provider balance** (for paid services)
4. **View notification history** for error messages

### Task Not Running

1. **Ensure task is active** (toggle should be green)
2. **Check schedule format** (valid cron or human-readable)
3. **View health endpoint**: http://localhost:8000/health
4. **Check backend logs** for errors

### Can't Login

1. **Verify credentials** are correct
2. **Check backend is running**: http://localhost:8000/health
3. **Clear browser cache** and try again

### Data Source Issues

1. **Verify URL is accessible** (test in browser)
2. **Check API returns JSON** format
3. **Ensure field names match** your message template
4. **Check API authentication** if required

## Next Steps

1. ✅ Create your first task
2. ✅ Test with a simple reminder
3. ✅ Set up a real data source
4. ✅ Monitor notification history
5. ✅ Explore advanced conditions
6. ✅ Set up multiple tasks

## Getting Help

- 📖 Read the [Development Guide](DEVELOPMENT.md)
- 🔍 Check [API Examples](API_EXAMPLES.md)
- 🐛 [Report issues on GitHub](https://github.com/TisoneK/Task2SMS/issues)
- 💬 [Join discussions](https://github.com/TisoneK/Task2SMS/discussions)

## Tips for Success

1. **Start simple**: Begin with "always send" conditions
2. **Test schedules**: Use short intervals for testing
3. **Verify data sources**: Ensure APIs return expected data
4. **Monitor costs**: Track SMS usage with paid providers
5. **Use templates**: Create reusable message formats
6. **Set up fallbacks**: Configure multiple SMS providers

Happy automating! 🚀

