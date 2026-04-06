# 🔐 SecureVault - MERN Stack Password Manager

A full-stack password manager built with MongoDB, Express, React, and Node.js.

## Features
- 🔐 Master password authentication with JWT
- 🔒 AES-256 encryption for all stored passwords
- 📁 Categories: Social Media, Banking, Email, Shopping, Work, Other
- ➕ Add / Edit / Delete password entries
- 👁️ Show/Hide password toggle
- 📋 Copy to clipboard
- 🔍 Search by title, username, or website
- ⭐ Favorite passwords
- 🎲 Password generator
- 💪 Password strength indicator

## Tech Stack
- **Frontend**: React 18, React Router v6, Axios, React Hot Toast, React Icons
- **Backend**: Node.js, Express.js, Mongoose
- **Database**: MongoDB
- **Auth**: JWT + bcryptjs
- **Encryption**: CryptoJS (AES-256)

---

## Getting Started

### Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

---

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your values:
```
MONGO_URI=mongodb://localhost:27017/passwordmanager
JWT_SECRET=your_super_secret_jwt_key_change_this
ENCRYPTION_SECRET=your_super_secret_encryption_key_change_this
PORT=5000
```

> ⚠️ **IMPORTANT**: Change `JWT_SECRET` and `ENCRYPTION_SECRET` to strong random strings before using in production.

Start the backend:
```bash
npm run dev    # development (with nodemon)
npm start      # production
```

---

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder (optional):
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

The app will open at **http://localhost:3000**

---

## Project Structure

```
password-manager/
├── backend/
│   ├── config/
│   │   └── encryption.js      # AES-256 encrypt/decrypt
│   ├── middleware/
│   │   └── auth.js            # JWT middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Password.js        # Password schema
│   ├── routes/
│   │   ├── auth.js            # Register, Login, Me
│   │   └── passwords.js       # CRUD operations
│   ├── .env.example
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── PasswordCard.js     # Password item card
    │   │   └── PasswordModal.js    # Add/Edit modal
    │   ├── context/
    │   │   └── AuthContext.js      # Auth state management
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Register.js
    │   │   └── Dashboard.js
    │   ├── utils/
    │   │   └── api.js             # Axios API calls
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create account | No |
| POST | /api/auth/login | Login | No |
| GET | /api/auth/me | Get current user | Yes |
| GET | /api/passwords | Get all passwords | Yes |
| POST | /api/passwords | Add password | Yes |
| PUT | /api/passwords/:id | Update password | Yes |
| DELETE | /api/passwords/:id | Delete password | Yes |
| PATCH | /api/passwords/:id/favorite | Toggle favorite | Yes |

---

## Security Notes
- Passwords are encrypted with AES-256 before storage
- Master password is hashed with bcrypt (12 salt rounds)
- JWT tokens expire after 7 days
- All password routes require authentication
- Never share your `.env` file or commit it to git
