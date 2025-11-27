# Contributing to Task2SMS

First off, thank you for considering contributing to Task2SMS! It's people like you that make Task2SMS such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by respect and professionalism. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if relevant**
- **Include your environment details** (OS, Python version, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the suggested enhancement**
- **Explain why this enhancement would be useful**
- **List any similar features in other applications**

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/TisoneK/Task2SMS.git
   cd Task2SMS
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Make your changes**
   - Follow the coding style of the project
   - Add tests if applicable
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

6. **Open a Pull Request**
   - Go to https://github.com/TisoneK/Task2SMS/pulls
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

## Development Setup

### Backend Development

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## Coding Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where applicable
- Write docstrings for functions and classes
- Keep functions focused and small
- Use meaningful variable names

Example:
```python
def send_sms(recipient: str, message: str) -> dict:
    """
    Send an SMS message to a recipient.
    
    Args:
        recipient: Phone number in international format
        message: Message content to send
        
    Returns:
        dict: Result with 'success' and 'message' keys
    """
    # Implementation
    pass
```

### JavaScript/React (Frontend)

- Use ES6+ features
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names

Example:
```javascript
const TaskCard = ({ task, onToggle, onDelete }) => {
  // Component implementation
};
```

### Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters
- Reference issues and pull requests when relevant

Examples:
```
Add SMS retry mechanism for failed deliveries
Fix task scheduler not loading on startup
Update documentation for GSM modem setup
```

## Project Structure

```
Task2SMS/
├── backend/          # FastAPI backend
│   ├── routers/      # API endpoints
│   ├── services/     # Business logic
│   ├── models.py     # Database models
│   └── main.py       # Application entry
├── frontend/         # React frontend
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── context/  # React context
│   │   └── services/ # API client
└── Docs/            # Documentation
```

## Areas for Contribution

### High Priority

- [ ] Add comprehensive test coverage
- [ ] Implement database migrations with Alembic
- [ ] Add rate limiting for API endpoints
- [ ] Improve error handling and logging
- [ ] Add monitoring and analytics

### Features

- [ ] WhatsApp integration
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Webhook support
- [ ] Advanced analytics dashboard
- [ ] Task templates
- [ ] Bulk operations
- [ ] Two-factor authentication

### Documentation

- [ ] Video tutorials
- [ ] More API examples
- [ ] Deployment guides for different platforms
- [ ] Troubleshooting guide
- [ ] Architecture diagrams

### Bug Fixes

Check the [issues page](https://github.com/TisoneK/Task2SMS/issues) for bugs that need fixing.

## Questions?

Feel free to:
- Open an issue for questions
- Start a discussion on GitHub Discussions
- Reach out to the maintainers

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for contributing to Task2SMS! 🎉

