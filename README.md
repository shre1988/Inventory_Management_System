# 🧪 Lab Inventory Management System (LIMS)

A comprehensive full-stack web application for managing laboratory inventory with real-time tracking, alerts, and analytics.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Usage Guide](#usage-guide)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

LIMS is a modern web application designed for laboratory inventory management. It provides comprehensive tools for tracking components, managing stock levels, monitoring alerts, and generating analytics. The system supports role-based access control and real-time inventory operations.

### Key Capabilities:
- **Real-time Inventory Tracking**: Monitor component quantities and locations
- **Smart Alerts**: Low stock and stale stock notifications
- **Analytics Dashboard**: Monthly inward/outward statistics with charts
- **Role-based Access**: Admin, User, Technician, and Researcher roles
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## ✨ Features

### 🔐 Authentication & Authorization
- **JWT-based Authentication**: Secure token-based authentication
- **Role-based Access Control**: Four user roles with different permissions
- **Session Management**: Automatic token validation and expiration handling
- **Protected Routes**: Secure access to application features

### 📊 Dashboard Analytics
- **Monthly Statistics**: Inward and outward movement charts
- **Real-time Alerts**: Low stock and stale stock notifications
- **Visual Indicators**: Color-coded status cards with icons
- **Responsive Charts**: Interactive data visualization

### 📦 Inventory Management
- **CRUD Operations**: Create, Read, Update, Delete components
- **Stock Tracking**: Real-time quantity monitoring
- **Location Management**: Bin and storage location tracking
- **Component Details**: Manufacturer, part numbers, datasheets

### 🔄 Inventory Operations
- **Inward Logging**: Add stock with reason tracking
- **Outward Logging**: Remove stock with availability checks
- **Audit Trail**: Complete history of all inventory movements
- **Validation**: Prevents negative stock and invalid operations

### 🚨 Smart Alerts
- **Low Stock Alerts**: Components below critical threshold
- **Stale Stock Detection**: Items inactive for 90+ days
- **Visual Indicators**: Color-coded alerts in dashboard
- **Real-time Updates**: Instant notification of issues

## 🛠 Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-origin resource sharing

### Frontend
- **React.js**: User interface library
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization
- **React Hot Toast**: Toast notifications
- **Vite**: Build tool and dev server

### Development Tools
- **ESLint**: Code linting
- **Vite**: Fast development server
- **Hot Module Replacement**: Real-time code updates

## 📁 Project Structure

```
InventoryManagement/
├── backend/
│   ├── index.js              # Main server file
│   ├── authMiddleware.js     # JWT authentication middleware
│   ├── models/
│   │   ├── User.js          # User model with roles
│   │   ├── Component.js     # Inventory component model
│   │   └── InventoryLog.js  # Inventory movement logs
│   ├── package.json
│   └── .env                 # Environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application component
│   │   ├── main.jsx         # Application entry point
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── components/
│   │   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   │   └── ProtectedRoute.jsx # Route protection
│   │   ├── pages/
│   │   │   ├── Login.jsx        # Authentication page
│   │   │   ├── Dashboard.jsx    # Analytics dashboard
│   │   │   └── Inventory.jsx    # Inventory management
│   │   └── index.css        # Global styles
│   ├── index.html           # HTML template
│   └── package.json
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd InventoryManagement
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your_jwt_secret_key
   PORT=5050
   ```

4. **Start the backend server**
   ```bash
   node index.js
   ```
   Server will start on `http://localhost:5050`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```
   Application will be available at `http://localhost:5173`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

#### POST `/auth/login`
Authenticate user and receive JWT token.
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Component Management

#### GET `/components`
Retrieve all inventory components (requires authentication).

#### POST `/components`
Create a new component (admin only).
```json
{
  "name": "Resistor 10kΩ",
  "category": "Electronics",
  "manufacturer": "Vishay",
  "partNumber": "R-10K-1W",
  "description": "10kΩ 1W resistor",
  "quantity": 100,
  "locationBin": "A1-B2",
  "unitPrice": 0.05,
  "criticalThreshold": 10
}
```

#### PUT `/components/:id`
Update component details (admin only).

#### DELETE `/components/:id`
Delete a component (admin only).

### Inventory Operations

#### POST `/logs/inward/:componentId`
Log inward movement (admin only).
```json
{
  "quantity": 50,
  "reason": "New stock received"
}
```

#### POST `/logs/outward/:componentId`
Log outward movement (admin only).
```json
{
  "quantity": 5,
  "reason": "Used in experiment"
}
```

### Analytics & Alerts

#### GET `/stats/inward`
Get monthly inward statistics.

#### GET `/stats/outward`
Get monthly outward statistics.

#### GET `/alerts`
Get low stock and stale stock alerts.

## 🎨 Frontend Components

### Authentication System
- **Login/Register Page**: Modern gradient design with form validation
- **AuthContext**: Global authentication state management
- **ProtectedRoute**: Route protection based on authentication status

### Dashboard
- **Statistics Cards**: Visual representation of key metrics
- **Alert Sections**: Low stock and stale stock notifications
- **Responsive Layout**: Adapts to different screen sizes

### Inventory Management
- **Component Table**: Sortable and filterable inventory display
- **Modal Forms**: Add, edit, inward, and outward operations
- **Real-time Updates**: Instant reflection of changes

### Navigation
- **Sidebar**: Consistent navigation with user information
- **Role-based Menu**: Different options based on user role
- **Logout Functionality**: Secure session termination

## 🗄 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'user', 'technician', 'researcher']),
  timestamps: true
}
```

### Component Model
```javascript
{
  name: String (required),
  category: String (required),
  manufacturer: String,
  partNumber: String,
  description: String,
  quantity: Number (required, default: 0),
  locationBin: String,
  unitPrice: Number,
  datasheetLink: String,
  criticalThreshold: Number (default: 0),
  lastOutwardedAt: Date,
  timestamps: true
}
```

### InventoryLog Model
```javascript
{
  componentId: ObjectId (ref: Component, required),
  userId: ObjectId (ref: User, required),
  actionType: String (enum: ['inward', 'outward'], required),
  quantity: Number (required),
  reason: String,
  timestamp: Date (default: now)
}
```

## 🔐 Authentication & Authorization

### JWT Implementation
- **Token Generation**: Created on successful login
- **Token Storage**: Stored in localStorage for persistence
- **Token Validation**: Middleware checks on protected routes
- **Token Expiration**: Automatic logout on expired tokens

### Role-based Access Control
- **Admin**: Full access to all features
- **User**: View-only access to dashboard and inventory
- **Technician**: Limited inventory operations
- **Researcher**: Read-only access with specific permissions

### Security Features
- **Password Hashing**: bcryptjs for secure password storage
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Secure error messages without data leakage

## 📖 Usage Guide

### Getting Started

1. **Access the Application**
   - Open `http://localhost:5173` in your browser
   - You'll be redirected to the login page

2. **Create Your First Account**
   - Click "Sign up" on the login page
   - Fill in your details and choose a role
   - Admin role has full access to all features

3. **Add Inventory Components**
   - Navigate to Inventory page
   - Click "Add Component" button
   - Fill in component details and save

4. **Manage Stock**
   - Use "Inward" button to add stock
   - Use "Outward" button to remove stock
   - Monitor alerts on the Dashboard

### Dashboard Features

- **Statistics Overview**: View total inward/outward movements
- **Alert Monitoring**: Check low stock and stale stock items
- **Real-time Updates**: Data refreshes automatically

### Inventory Management

- **Component Tracking**: Monitor quantities and locations
- **Stock Operations**: Log inward and outward movements
- **Component Details**: View manufacturer and part information
- **Critical Alerts**: Visual indicators for low stock items

## 🔧 Troubleshooting

### Common Issues

#### Backend Connection Issues
```bash
# Check if backend is running
curl http://localhost:5050/auth/login

# Restart backend server
cd backend && node index.js
```

#### Frontend Not Loading
```bash
# Clear cache and restart
cd frontend
npm run dev
```

#### MongoDB Connection Issues
- Verify MongoDB URI in `.env` file
- Check network connectivity
- Ensure database credentials are correct

#### Authentication Problems
- Clear browser localStorage
- Check JWT token expiration
- Verify user credentials

### Development Commands

```bash
# Start backend server
cd backend && node index.js

# Start frontend development server
cd frontend && npm run dev

# Install dependencies
npm install

# Check for linting issues
npm run lint
```

## 🚀 Deployment

### Backend Deployment
1. Set up production environment variables
2. Configure MongoDB Atlas connection
3. Deploy to cloud platform (Heroku, AWS, etc.)
4. Set up environment variables on deployment platform

### Frontend Deployment
1. Build production version: `npm run build`
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure environment variables for API endpoints

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🤝 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the troubleshooting section

---

**Built with ❤️ for efficient laboratory inventory management** 