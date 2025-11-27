# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently supported versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Task2SMS seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please do NOT:

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it has been addressed

### Please DO:

1. **Email us directly** at the repository owner's email (check GitHub profile)
2. **Provide detailed information** including:
   - Type of vulnerability
   - Full paths of source file(s) related to the vulnerability
   - Location of the affected source code (tag/branch/commit or direct URL)
   - Step-by-step instructions to reproduce the issue
   - Proof-of-concept or exploit code (if possible)
   - Impact of the issue, including how an attacker might exploit it

### What to expect:

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Communication**: We will keep you informed about the progress of fixing the vulnerability
- **Credit**: We will credit you in the security advisory (unless you prefer to remain anonymous)
- **Timeline**: We aim to patch critical vulnerabilities within 7 days

## Security Best Practices

When deploying Task2SMS:

### 1. Environment Variables
- Never commit `.env` files to version control
- Use strong, unique values for `SECRET_KEY`
- Rotate secrets regularly

### 2. Database Security
- Use strong database passwords
- Enable SSL/TLS for database connections in production
- Regularly backup your database
- Keep PostgreSQL updated

### 3. API Security
- Enable HTTPS in production
- Use rate limiting to prevent abuse
- Implement proper CORS policies
- Keep dependencies updated

### 4. SMS Provider Security
- Protect API keys and credentials
- Monitor SMS usage for unusual patterns
- Set up spending limits with providers
- Use webhook signatures for callbacks

### 5. Authentication
- Enforce strong password policies
- Consider implementing 2FA
- Set appropriate token expiration times
- Use secure session management

### 6. Network Security
- Use firewalls to restrict access
- Keep only necessary ports open
- Use VPN for administrative access
- Enable DDoS protection

### 7. Monitoring
- Enable logging for security events
- Monitor for suspicious activity
- Set up alerts for unusual patterns
- Regularly review access logs

### 8. Updates
- Keep all dependencies updated
- Subscribe to security advisories
- Apply security patches promptly
- Test updates in staging first

## Known Security Considerations

### SMS Injection
- All SMS messages are sanitized before sending
- Special characters are properly escaped
- Message length is validated

### SQL Injection
- SQLAlchemy ORM is used to prevent SQL injection
- All user inputs are parameterized
- No raw SQL queries with user input

### XSS (Cross-Site Scripting)
- React automatically escapes output
- User inputs are validated on both client and server
- Content Security Policy headers recommended

### CSRF (Cross-Site Request Forgery)
- JWT tokens are used instead of cookies
- CORS is properly configured
- State-changing operations require authentication

### Authentication
- Passwords are hashed using bcrypt
- JWT tokens have expiration times
- Tokens are validated on each request

## Dependency Security

We use:
- Dependabot for automated dependency updates
- Regular security audits of dependencies
- Minimal dependency footprint

To check for vulnerabilities:

```bash
# Backend
cd backend
pip install safety
safety check

# Frontend
cd frontend
npm audit
```

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find similar problems
3. Prepare fixes for all supported versions
4. Release new versions as soon as possible
5. Publish a security advisory on GitHub

## Comments on this Policy

If you have suggestions on how this process could be improved, please submit a pull request.

## Hall of Fame

We would like to thank the following security researchers for responsibly disclosing vulnerabilities:

<!-- Security researchers will be listed here -->

*No vulnerabilities have been reported yet.*

