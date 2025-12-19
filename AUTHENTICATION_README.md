# Role-Based Authentication System

This project implements a comprehensive role-based authentication system with **Admin** and **Trainer** roles, featuring email/phone login, OTP-based password reset, and complete user management.

## 🚀 Features

### Authentication

- **Role-based Login**: Admin and Trainer roles with different access levels
- **Multi-format Login**: Login using email or phone number
- **Secure Password**: Bcrypt hashing with salt rounds
- **JWT Tokens**: 7-day expiration with automatic refresh

### Password Management

- **Forget Password**: OTP-based password reset
- **Admin Reset**: Admins receive OTP directly to their email
- **Trainer Reset**: OTP sent to admin's email for approval
- **Secure OTP**: 6-digit codes with 10-minute expiration

### User Management

- **Admin Controls**: Create, edit, activate/deactivate users
- **Trainer Creation**: Admins can create trainer accounts
- **User Profiles**: Complete user information management
- **Activity Tracking**: Last login, creation date, etc.

## 🏗️ Architecture

### Backend Structure

```
server/
├── models/auth/Users.js          # User model with roles
├── controllers/auth/users-controller.js  # Auth logic
├── routes/auth/users-routes.js    # API endpoints
├── middleware/auth.js             # JWT verification & role checks
└── .env.example                   # Environment variables template
```

### Frontend Structure

```
client/src/
├── pages/auth/
│   ├── RoleBasedLogin.jsx         # Login component
│   └── ForgotPassword.jsx         # Password reset
├── pages/admin/
│   └── UserManagement.jsx         # Admin user management
├── pages/trainer/
│   └── TrainerDashboard.jsx       # Trainer interface
└── store/auth/auth-slice/         # Redux state management
```

## 🔐 User Roles & Permissions

### Admin Role

- ✅ **Full System Access**: Complete control over all features
- ✅ **User Management**: Create, edit, delete admin and trainer accounts
- ✅ **Direct Password Reset**: Receive OTP directly for password reset
- ✅ **System Configuration**: Access to all admin panels and settings

### Trainer Role

- ✅ **Limited Access**: Access to trainer-specific features only
- ✅ **Client Management**: Manage assigned clients and sessions
- ✅ **Admin-Assisted Reset**: Password reset OTP sent to admin for approval
- ❌ **No User Creation**: Cannot create new user accounts
- ❌ **No System Admin**: Cannot access admin-only features

## 📧 Email System

### OTP Delivery

- **Admin Password Reset**: OTP sent directly to admin's email
- **Trainer Password Reset**: OTP sent to admin's email with trainer details
- **Email Templates**: Professional HTML email templates
- **Security**: 10-minute OTP expiration with automatic cleanup

### Email Configuration

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 🛠️ API Endpoints

### Authentication Routes

```
POST   /api/auth/users/login           # User login
POST   /api/auth/users/forgot-password # Request OTP
POST   /api/auth/users/reset-password  # Reset with OTP
GET    /api/auth/users/verify          # Verify JWT token
```

### Admin Routes (Protected)

```
POST   /api/auth/users/register        # Create new user
GET    /api/auth/users/all             # Get all users
DELETE /api/auth/users/:userId         # Delete user
PATCH  /api/auth/users/:userId/status  # Toggle user status
```

## 🔧 Setup Instructions

### 1. Environment Setup

```bash
# Copy environment template
cp server/.env.example server/.env

# Update with your values
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/flamebox
```

### 2. Install Dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 3. Create Initial Admin

```javascript
// Run this in MongoDB or create via API
{
  "userName": "admin",
  "fullName": "System Administrator",
  "email": "admin@gym.com",
  "phoneNumber": "1234567890",
  "password": "admin123", // Will be hashed automatically
  "role": "admin",
  "isActive": true
}
```

### 4. Start Development

```bash
# Backend (Terminal 1)
cd server
npm start

# Frontend (Terminal 2)
cd client
npm run dev
```

## 🔗 Usage Examples

### Login Component

```jsx
import RoleBasedLogin from "./pages/auth/RoleBasedLogin";

// Supports both admin and trainer login
// Auto-redirects based on role after login
<RoleBasedLogin />;
```

### Protected Routes

```jsx
import { useSelector } from "react-redux";

const { user, isAuthenticated } = useSelector((state) => state.auth);

// Check authentication
if (!isAuthenticated) return <Navigate to="/login" />;

// Check admin access
if (user.role !== "admin") return <div>Access Denied</div>;
```

### User Management

```jsx
import UserManagement from "./pages/admin/UserManagement";

// Admin-only component for managing users
// Features: Create, edit, delete, activate/deactivate
<UserManagement />;
```

## 🚨 Security Features

### Password Security

- **Bcrypt Hashing**: Industry-standard password encryption
- **Salt Rounds**: 10 rounds for optimal security/performance
- **Minimum Length**: 6 characters minimum requirement

### Token Security

- **JWT Tokens**: Stateless authentication with expiration
- **Secure Headers**: Proper Authorization header handling
- **Auto-expiry**: 7-day token lifetime with refresh capability

### Role-based Access

- **Middleware Protection**: Route-level role checking
- **Frontend Guards**: Component-level access control
- **API Validation**: Server-side permission verification

## 🔄 Migration from Old System

### Backward Compatibility

- Old Employee model still supported
- Legacy admin login still functional
- Gradual migration path available

### Migration Steps

1. **Keep Existing**: Old system continues working
2. **Add New Users**: Use new role-based system for new accounts
3. **Gradual Migration**: Migrate existing users when convenient
4. **Full Switch**: Eventually deprecate old system

## 📝 Testing

### Test User Creation

```bash
# Create test admin
curl -X POST http://localhost:3000/api/auth/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "userName": "testadmin",
    "fullName": "Test Administrator",
    "email": "admin@test.com",
    "phoneNumber": "1234567890",
    "password": "admin123",
    "role": "admin"
  }'

# Create test trainer
curl -X POST http://localhost:3000/api/auth/users/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "userName": "testtrainer",
    "fullName": "Test Trainer",
    "email": "trainer@test.com",
    "phoneNumber": "0987654321",
    "password": "trainer123",
    "role": "trainer",
    "adminEmail": "admin@test.com"
  }'
```

## 🐛 Troubleshooting

### Common Issues

1. **Email OTP not received**

   - Check EMAIL_USER and EMAIL_PASS in .env
   - Verify Gmail App Password is correctly set
   - Check spam/junk folder

2. **JWT Token errors**

   - Ensure JWT_SECRET is set in .env
   - Clear localStorage and login again
   - Check token expiration (7 days)

3. **Role permission denied**
   - Verify user role in database
   - Check if user is active (isActive: true)
   - Ensure proper Authorization header

### Debug Mode

```javascript
// Enable detailed logging
console.log("User:", user);
console.log("Token:", localStorage.getItem("token"));
console.log("Auth State:", isAuthenticated);
```

## 🚀 Future Enhancements

### Planned Features

- [ ] **Two-Factor Authentication (2FA)**
- [ ] **OAuth Integration** (Google, Facebook)
- [ ] **Role Permissions Matrix**
- [ ] **Session Management**
- [ ] **Audit Logging**
- [ ] **Email Templates Customization**

### Performance Optimizations

- [ ] **Token Refresh** mechanism
- [ ] **Redis Caching** for sessions
- [ ] **Rate Limiting** for auth endpoints
- [ ] **Bulk Operations** for user management

## 📞 Support

For technical support or feature requests:

- Create an issue in the project repository
- Contact the development team
- Check documentation for common solutions

---

**Note**: This authentication system is production-ready but requires proper environment configuration, especially for email functionality and JWT secrets.
