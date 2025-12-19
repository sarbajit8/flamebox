# FLAMEBOX - Admin Setup Guide

## 🔥 How to Create Admin Account

When you transfer this project to someone else or deploy it to a new environment, follow these steps to create the initial admin account:

---

## Method 1: Using Setup Script (Recommended)

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Run Admin Creation Script

```bash
node scripts/createAdmin.js
```

### Step 3: Note the Credentials

The script will display the admin credentials:

```
==================================================
ADMIN LOGIN CREDENTIALS
==================================================
📧 Email: admin@flamebox.com
🔑 Password: admin123
👤 Username: admin
📱 Phone: 1234567890
==================================================
```

### Step 4: Login to FLAMEBOX

- Go to the admin login page
- Use the credentials displayed above
- **IMPORTANT:** Change the password after first login!

---

## Method 2: Manual Database Creation

If you prefer to create admin manually or customize the credentials:

### Step 1: Create a Custom Script

Create a file `server/scripts/myAdmin.js`:

```javascript
const mongoose = require("mongoose");
const User = require("../models/auth/Users");

const createMyAdmin = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Flamebox");
    console.log("✅ Connected to MongoDB");

    // CUSTOMIZE THESE CREDENTIALS
    const adminData = {
      userName: "myadmin", // Change this
      fullName: "Your Name", // Change this
      email: "youremail@gmail.com", // Change this
      phoneNumber: "9876543210", // Change this
      password: "YourSecurePassword", // Change this
      role: "admin",
      isActive: true,
      isVerified: true,
    };

    // Check if admin exists
    const existing = await User.findOne({ email: adminData.email });
    if (existing) {
      console.log("⚠️  Admin with this email already exists!");
      mongoose.disconnect();
      return;
    }

    // Create admin
    const admin = new User(adminData);
    await admin.save();

    console.log("\n✅ Admin created successfully!");
    console.log("📧 Email:", adminData.email);
    console.log("🔑 Password:", adminData.password);

    mongoose.disconnect();
  } catch (error) {
    console.error("❌ Error:", error.message);
    mongoose.disconnect();
  }
};

createMyAdmin();
```

### Step 2: Run Your Custom Script

```bash
node scripts/myAdmin.js
```

---

## Method 3: Using MongoDB Compass or CLI

### Using MongoDB Compass:

1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select database: `Flamebox`
4. Select collection: `users`
5. Click "INSERT DOCUMENT"
6. Paste this JSON (password will be automatically hashed by the model):

```json
{
  "userName": "admin",
  "fullName": "Admin User",
  "email": "admin@flamebox.com",
  "phoneNumber": "1234567890",
  "password": "admin123",
  "role": "admin",
  "isActive": true,
  "isVerified": true
}
```

### Using MongoDB CLI:

```bash
mongosh
use Flamebox
db.users.insertOne({
  userName: "admin",
  fullName: "Admin User",
  email: "admin@flamebox.com",
  phoneNumber: "1234567890",
  password: "admin123",
  role: "admin",
  isActive: true,
  isVerified: true
})
```

---

## Method 4: Using Node.js Script (One-liner)

Run this command in the server directory:

```bash
node -e "const mongoose = require('mongoose'); const User = require('./models/auth/Users'); mongoose.connect('mongodb://localhost:27017/Flamebox').then(async () => { const admin = new User({ userName: 'admin', fullName: 'Admin User', email: 'admin@flamebox.com', phoneNumber: '1234567890', password: 'admin123', role: 'admin', isActive: true, isVerified: true }); await admin.save(); console.log('✅ Admin created!'); console.log('Email: admin@flamebox.com'); console.log('Password: admin123'); mongoose.disconnect(); });"
```

---

## 🔐 Default Credentials

If you use the provided setup script without modifications:

```
Email: admin@flamebox.com
Password: admin123
```

---

## ⚠️ Security Notes

1. **Change Default Password**: Always change the default password after first login
2. **Use Strong Passwords**: Use at least 12 characters with mixed case, numbers, and symbols
3. **Secure Email**: Use a proper email address for password recovery
4. **Delete Setup Script**: After creating admin, you can delete the setup script for security
5. **Environment Variables**: Never commit credentials to version control

---

## 📝 Troubleshooting

### "Admin already exists" Error

- Delete the existing admin from database
- Or use the script's password update feature

### "MongoDB Connection Error"

- Make sure MongoDB is running
- Check connection string in `.env` file
- Verify MongoDB is accessible on `localhost:27017`

### "Module not found" Error

- Run `npm install` in the server directory
- Make sure all dependencies are installed

---

## 📧 Contact

For issues or questions about admin setup, contact the project administrator.

---

**FLAMEBOX Fitness Management System**  
© 2025 All Rights Reserved
