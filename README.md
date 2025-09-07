# TaskFlow Backend API

A robust Node.js/Express backend for the TaskFlow task management application.

## Features

- **User Authentication**: JWT-based auth with secure password hashing
- **Task Management**: Complete CRUD operations with user isolation
- **Advanced Filtering**: Search, sort, and filter tasks with pagination
- **Email Integration**: Password reset and welcome emails
- **Security**: Rate limiting, CORS, input validation, and security headers
- **Real-time Updates**: Socket.io integration for live task updates

# Bonus Features

Password reset functionality
Email notifications
Task priorities and categories
Due dates and tags
Real-time updates
Comprehensive validation
Security best practices

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: express-validator
- **Email**: Nodemailer
- **Real-time**: Socket.io

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. **Clone and install dependencies**

```bash
git clone <https://github.com/Abishek0612/task-management-app-backend.git>

render api live  url - https://task-management-app-backend-1u70.onrender.com/api

cd backend
npm install (install node modules)
```

# Create .env file:

MONGODB_URI=mongodb+srv://uabishek6:abi%40abi12@cluster0.xblmerd.mongodb.net/notebookllm
JWT_SECRET=nkcksldnkcioew32jklcassacnjjdsbjlsdcnkas
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=uabishek6@gmail.com
EMAIL_PASSWORD=ssca npgd wxuj niou
RESET_PASSWORD_EXPIRES=10m

# Start Development Server

npm run dev

# API Endpoints

# Authentication

POST /api/auth/register - User registration
POST /api/auth/login - User login
POST /api/auth/forgot-password - Send reset email
POST /api/auth/reset-password - Reset password
GET /api/auth/me - Get current user
POST /api/auth/logout - Logout user

# Tasks

GET /api/tasks - Get user tasks (with search, filter, pagination)
POST /api/tasks - Create new task
GET /api/tasks/:id - Get specific task
PUT /api/tasks/:id - Update task
DELETE /api/tasks/:id - Delete task
GET /api/tasks/stats - Get task statistics
