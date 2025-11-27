# Changelog

All notable changes to Task2SMS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of Task2SMS
- User authentication and registration
- Task creation and management
- Flexible scheduling (cron and human-readable)
- Conditional notification rules
- Multi-provider SMS support (Africa's Talking, Twilio, GSM Modem)
- Automatic retry for failed messages
- React-based dashboard with Tailwind CSS
- Notification history and tracking
- Docker deployment support
- Comprehensive API documentation
- Health check endpoints
- Offline queue for failed messages

### Features

#### Backend
- FastAPI REST API
- SQLAlchemy ORM with PostgreSQL/SQLite support
- JWT-based authentication
- APScheduler for task scheduling
- Multiple SMS provider abstraction
- Condition evaluation engine
- Automatic retry service
- Database models for users, tasks, notifications

#### Frontend
- React 18 with Vite
- Tailwind CSS styling
- React Router for navigation
- Authentication context
- Task CRUD operations
- Real-time notification history
- Responsive design
- Form validation

#### Deployment
- Docker and Docker Compose support
- Environment-based configuration
- Production-ready setup
- Health monitoring
- Logging and error tracking

### Documentation
- Comprehensive README
- Getting Started guide
- Development guide
- API examples
- Deployment instructions

## [Unreleased]

### Planned Features
- Multi-user accounts with role-based access
- Advanced analytics and reporting
- WhatsApp integration
- Email notifications
- Mobile app (React Native)
- Webhook support
- Custom data source integrations
- AI-powered message generation
- Task templates
- Bulk task operations
- Export/import functionality
- Advanced scheduling options
- Custom SMS provider plugins
- Rate limiting
- API rate limiting
- Two-factor authentication
- Audit logs
- Team collaboration features
- Dashboard widgets
- Custom notification sounds
- SMS delivery reports
- Cost tracking
- Usage analytics
