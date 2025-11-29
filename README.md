# Task2SMS

**Turn your tasks into timely SMS updates.**

Task2SMS is a web-based automation tool that lets users create and manage tasks which automatically send SMS updates based on schedules or conditions. It provides reliable, offline-capable notifications so users receive vital updates even with intermittent internet.

[![GitHub](https://img.shields.io/badge/GitHub-Task2SMS-blue?logo=github)](https://github.com/TisoneK/Task2SMS)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## Features

- ✅ **Task Management**: Create, edit, and manage automated tasks
- 📅 **Flexible Scheduling**: Cron expressions or human-readable schedules (e.g., "every 1 hour")
- 🎯 **Conditional Notifications**: Send SMS based on rules (e.g., "if total > 140")
- 📱 **Multi-Provider SMS**: Support for Africa's Talking, Twilio, and GSM modems
- 🔄 **Offline Queue**: Automatic retry for failed messages
- 🌐 **Modern UI**: React dashboard with Tailwind CSS
- 🔐 **User Authentication**: Secure login and registration
- 📊 **Notification History**: Track all sent messages and delivery status

## Tech Stack

### Backend
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: Database ORM
- **PostgreSQL/SQLite**: Database
- **APScheduler**: Task scheduling
- **Africa's Talking/Twilio**: SMS providers
- **pySerial**: GSM modem support

### Frontend
- **React**: UI library
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **React Router**: Navigation
- **Axios**: HTTP client

## Quick Start

### Prerequisites
- Python 3.12
- Node.js 18+
- PostgreSQL (optional, SQLite works for development)

### Change version

If you need to install or update Rust on Windows (PowerShell), for example when a dependency requires Rust toolchain, use the steps below.

1. Install Rust (PowerShell):

```powershell
Invoke-WebRequest -Uri https://win.rustup.rs/x86_64 -OutFile rustup-init.exe
.\rustup-init.exe -y
```

2. After installation, close and reopen PowerShell.

3. Verify Rust and Cargo are available:

```powershell
rustc --version
cargo --version
```

4. Reinstall Python requirements (from the project root or `backend` folder where `requirements.txt` lives):

```powershell
pip install -r requirements.txt
```

Notes:
- The `Invoke-WebRequest` step downloads the Rust installer and runs it non-interactively (`-y`).
- If you prefer a GUI installer or need a different architecture, visit https://www.rust-lang.org/tools/install.

### Add Rust to PATH

#### PowerShell (Permanent - Recommended)

**Add to User PATH:**

```powershell
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.cargo\bin",
    "User"
)
```

**Add to System PATH (Requires Admin):**

```powershell
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "Machine") + ";$env:USERPROFILE\.cargo\bin",
    "Machine"
)
```

#### Command Prompt (Permanent)

**Add to User PATH:**

```cmd
setx PATH "%PATH%;%USERPROFILE%\.cargo\bin"
```

**Add to System PATH (Requires Admin):**

```cmd
setx /M PATH "%PATH%;%USERPROFILE%\.cargo\bin"
```

#### Apply Changes to Current Session

After setting the environment variable, refresh the current session:

**PowerShell:**

```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**Command Prompt:**

```cmd
set PATH=%PATH%;%USERPROFILE%\.cargo\bin
```

#### Linux/Mac (Bash/Zsh)

If you're on Linux or Mac, add to ~/.bashrc or ~/.zshrc:

```bash
export PATH="$HOME/.cargo/bin:$PATH"
```

Then reload:

```bash
source ~/.bashrc  # or ~/.zshrc
```

#### Verify

After running any of the above, verify with:

```powershell
rustc --version
cargo --version
```

### Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/TisoneK/Task2SMS.git
cd Task2SMS
```

2. **Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your configuration

# Run the backend
python main.py
```

The backend will be available at `http://localhost:8000`

3. **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Docker Setup

```bash
# Create .env file in the root directory with your SMS provider credentials
cp backend/.env.example .env

# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

Access the application at `http://localhost`

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/task2sms
# Or use SQLite for development:
# DATABASE_URL=sqlite:///./task2sms.db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Africa's Talking
AFRICASTALKING_USERNAME=your-username
AFRICASTALKING_API_KEY=your-api-key

# Twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# GSM Modem (optional)
GSM_MODEM_PORT=/dev/ttyUSB0
GSM_MODEM_BAUDRATE=115200
```

## Usage

### Creating a Task

1. **Register/Login** to your account
2. Click **"New Task"** on the dashboard
3. Fill in the task details:
   - **Name**: Task identifier (e.g., "Lakers vs Bulls")
   - **Description**: Optional details
   - **Source Link**: API endpoint to fetch data from
   - **Schedule**: "every 1 hour" or cron expression "0 * * * *"
   - **Recipients**: Phone numbers (e.g., +254712345678)
   - **Condition**: When to send SMS (always, total over, field equals, etc.)
   - **Message Template**: Use `{field_name}` for dynamic values

4. Click **"Create Task"**

### Example Task

**Task**: Basketball Game Updates
- **Name**: Lakers vs Bulls
- **Schedule**: every 30 minutes
- **Condition**: Total score over 140
- **Recipients**: +254712345678
- **Message**: `{home_team} {home_score} - {away_team} {away_score}. Total: {total}`

The system will check the data source every 30 minutes and send an SMS when the total score exceeds 140.

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/tasks/` - Get all tasks
- `POST /api/tasks/` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task
- `GET /api/notifications/` - Get notification history

## SMS Providers

### Africa's Talking (Recommended for Kenya)

1. Sign up at [africastalking.com](https://africastalking.com)
2. Get your API key from the dashboard
3. Add credentials to `.env`

### Twilio

1. Sign up at [twilio.com](https://twilio.com)
2. Get your Account SID and Auth Token
3. Purchase a phone number
4. Add credentials to `.env`

### GSM Modem (Offline Mode)

1. Connect a GSM modem to your server
2. Set `GSM_MODEM_PORT` in `.env` (e.g., `/dev/ttyUSB0` on Linux, `COM3` on Windows)
3. The system will automatically use the modem as a fallback

## Deployment

### Deploy to Railway

1. Create a new project on [Railway](https://railway.app)
2. Add PostgreSQL database
3. Deploy from GitHub
4. Set environment variables
5. Deploy!

### Deploy to Render

1. Create a new Web Service on [Render](https://render.com)
2. Connect your repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

### Deploy to DigitalOcean

1. Create a Droplet
2. Install Docker and Docker Compose
3. Clone the repository
4. Set up environment variables
5. Run `docker-compose up -d`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributors

Thanks to all the contributors who have helped make Task2SMS better!

<!-- Contributors will be added here -->

## Support

For issues and questions, please [open an issue on GitHub](https://github.com/TisoneK/Task2SMS/issues).

⭐ If you find Task2SMS useful, please consider giving it a star on [GitHub](https://github.com/TisoneK/Task2SMS)!

## Roadmap

- [ ] Multi-user accounts with role-based access
- [ ] Advanced analytics and reporting
- [ ] WhatsApp integration
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Webhook support
- [ ] Custom data source integrations
- [ ] AI-powered message generation

## Acknowledgments

Built with ❤️ for reliable SMS notifications anywhere, anytime.

