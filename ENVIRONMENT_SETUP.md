# 🔐 Environment Variables Setup Guide

This guide explains how to set up environment variables for the FlameBox application to properly handle sensitive information and configuration.

## 📁 Environment Files Overview

The application uses two separate environment files:

### Server Environment (`server/.env`)

- **Location**: `server/.env`
- **Template**: `server/.env.example`
- **Purpose**: Backend configuration, database settings, JWT secrets, email credentials

### Client Environment (`client/.env.local`)

- **Location**: `client/.env.local` or `client/.env`
- **Template**: `client/.env.example`
- **Purpose**: Frontend configuration, API endpoints, feature flags

## 🚀 Quick Setup

### 1. Server Setup

1. Navigate to the server directory:

   ```bash
   cd server
   ```

2. Copy the example file:

   ```bash
   copy .env.example .env
   ```

3. Edit the `.env` file with your actual values:

   ```dotenv
   # Database
   MONGODB_URI=mongodb://localhost:27017/flamebox

   # JWT Secret (generate a strong secret)
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password

   # CORS
   CLIENT_URL=http://localhost:5173
   ```

### 2. Client Setup

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Copy the example file:

   ```bash
   copy .env.example .env.local
   ```

3. Edit the `.env.local` file:
   ```dotenv
   VITE_API_BASE_URL=http://localhost:3000
   VITE_APP_NAME=FlameBox Admin
   VITE_ENABLE_OTP_RESET=true
   ```

## 🔑 Important Security Notes

### JWT Secret Generation

Generate a secure JWT secret using Node.js:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Gmail App Password Setup

For email functionality:

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the App Password (not your regular password) in `SMTP_PASS`

### Environment File Security

- **NEVER** commit `.env` files to version control
- Use `.env.example` files as templates
- Keep production secrets separate from development

## 📊 Environment Variables Reference

### Server Variables

| Variable             | Description         | Example                              | Required |
| -------------------- | ------------------- | ------------------------------------ | -------- |
| `PORT`               | Server port         | `3000`                               | No       |
| `NODE_ENV`           | Environment         | `development`                        | No       |
| `CLIENT_URL`         | Frontend URL        | `http://localhost:5173`              | Yes      |
| `MONGODB_URI`        | Database connection | `mongodb://localhost:27017/flamebox` | Yes      |
| `JWT_SECRET`         | JWT signing key     | `your-secret-key`                    | Yes      |
| `JWT_EXPIRES_IN`     | Token expiry        | `7d`                                 | No       |
| `BCRYPT_SALT_ROUNDS` | Password hashing    | `10`                                 | No       |
| `SMTP_HOST`          | Email server        | `smtp.gmail.com`                     | Yes\*    |
| `SMTP_PORT`          | Email port          | `587`                                | Yes\*    |
| `SMTP_USER`          | Email username      | `your-email@gmail.com`               | Yes\*    |
| `SMTP_PASS`          | Email password      | `your-app-password`                  | Yes\*    |

\*Required for OTP functionality

### Client Variables

| Variable                | Description         | Example                 | Required |
| ----------------------- | ------------------- | ----------------------- | -------- |
| `VITE_API_BASE_URL`     | Backend API URL     | `http://localhost:3000` | Yes      |
| `VITE_APP_NAME`         | Application name    | `FlameBox Admin`        | No       |
| `VITE_ENABLE_OTP_RESET` | Enable OTP features | `true`                  | No       |
| `VITE_ENABLE_ROLE_AUTH` | Enable role auth    | `true`                  | No       |

## 🌍 Environment-Specific Setup

### Development

- Use localhost URLs
- Enable debug logging
- Use test email credentials

### Production

- Use production URLs (HTTPS)
- Strong JWT secrets
- Production email credentials
- Set `NODE_ENV=production`
- Enable security features

### Example Production Server `.env`:

```dotenv
PORT=3000
NODE_ENV=production
CLIENT_URL=https://yourdomain.com
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/flamebox
JWT_SECRET=generated-64-character-hex-string
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@yourdomain.com
SMTP_PASS=production-app-password
```

### Example Production Client `.env.local`:

```dotenv
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=FlameBox Admin
VITE_ENABLE_OTP_RESET=true
VITE_SECURE_COOKIES=true
VITE_ENABLE_HTTPS=true
```

## 🔧 Verification

### Test Server Configuration

```bash
cd server
npm start
```

Check console for:

- ✅ MongoDB connected
- 🚀 Server running on http://localhost:PORT

### Test Client Configuration

```bash
cd client
npm run dev
```

Check that API calls work properly and no CORS errors occur.

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**: Check `CLIENT_URL` in server `.env`
2. **Database Connection**: Verify `MONGODB_URI`
3. **Email Not Working**: Check Gmail App Password setup
4. **API Calls Failing**: Verify `VITE_API_BASE_URL` in client
5. **JWT Errors**: Ensure `JWT_SECRET` is set and consistent

### Debug Steps

1. Check environment loading:

   ```javascript
   console.log("Environment loaded:", !!process.env.JWT_SECRET);
   ```

2. Verify API endpoints:

   ```javascript
   console.log("API Base URL:", import.meta.env.VITE_API_BASE_URL);
   ```

3. Test database connection:
   ```bash
   node -e "require('dotenv').config(); console.log('DB URI:', process.env.MONGODB_URI);"
   ```

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Verify all required environment variables are set
3. Ensure `.env` files are in the correct locations
4. Check for typos in variable names
5. Restart both server and client after environment changes

---

**Remember**: Environment variables are crucial for security. Always use templates (`.env.example`) for sharing configuration structure, never share actual `.env` files with sensitive data!
