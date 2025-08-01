# Inventory Management System - High-Level Architecture

## System Overview
A full-stack inventory management system built with React frontend and Node.js/Express backend, featuring role-based access control, real-time inventory tracking, and comprehensive logging.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │   React App     │  │   React App     │  │   React App     │           │
│  │   (Dashboard)   │  │  (Inventory)    │  │ (User Mgmt)     │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
│           │                     │                     │                   │
│           └─────────────────────┼─────────────────────┘                   │
│                                 │                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AUTHENTICATION CONTEXT                          │   │
│  │  • JWT Token Management                                           │   │
│  │  • User Session Handling                                          │   │
│  │  • Protected Route Components                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS
                                    │ REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Express.js Server                               │   │
│  │  • CORS Configuration                                             │   │
│  │  • Request/Response Handling                                      │   │
│  │  • Middleware Chain                                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATION LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  Auth Middleware│  │  Role Middleware│  │  JWT Validation │           │
│  │  • Token Verify │  │  • Role Check   │  │  • Token Decode │           │
│  │  • User Attach  │  │  • Permission   │  │  • Expiry Check │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS LOGIC LAYER                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  Auth Routes    │  │ Component Routes│  │ Inventory Logs  │           │
│  │  • Login        │  │  • CRUD Ops     │  │  • Inward/Out   │           │
│  │  • Register     │  │  • Search/Filter│  │  • Audit Trail  │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
│                                                                           │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  Admin Routes   │  │  Alert System   │  │  Analytics      │           │
│  │  • User Mgmt    │  │  • Low Stock    │  │  • Statistics   │           │
│  │  • Role Control │  │  • Stale Stock  │  │  • Reports      │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA ACCESS LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐           │
│  │  User Model     │  │ Component Model │  │ InventoryLog    │           │
│  │  • Name, Email  │  │  • Name, Cat    │  │  • ComponentId  │           │
│  │  • Password     │  │  • Quantity     │  │  • UserId       │           │
│  │  • Role         │  │  • Location     │  │  • Action Type  │           │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Mongoose ODM
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    MongoDB Database                                │   │
│  │  • Collections: users, components, inventory_logs                 │   │
│  │  • Indexes: email (unique), componentId, userId                   │   │
│  │  • Aggregation: Statistics, Reports                               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Component Interactions

### 1. Authentication Flow
```
User Login → AuthContext → Express Server → JWT Token → Protected Routes
```

### 2. Inventory Management Flow
```
Frontend Request → Auth Middleware → Role Check → Business Logic → Database → Response
```

### 3. Data Flow Architecture
```
React Components → AuthContext → API Calls → Express Routes → Mongoose Models → MongoDB
```

## Key Features & Technologies

### Frontend (React)
- **React 18** with Vite build tool
- **React Router** for navigation
- **Context API** for state management
- **React Hot Toast** for notifications
- **Tailwind CSS** for styling

### Backend (Node.js/Express)
- **Express.js** web framework
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** for cross-origin requests
- **Mongoose** ODM for MongoDB

### Database
- **MongoDB** NoSQL database
- **Mongoose** schema validation
- **Indexes** for performance optimization

### Security Features
- **Role-based Access Control** (Admin, LabTechnician, Researcher, Engineer)
- **JWT Token Authentication**
- **Password Hashing** with bcrypt
- **Protected Routes** with middleware

## API Endpoints Structure

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Components Management
- `GET /components` - List components with filtering
- `POST /components` - Create component
- `PUT /components/:id` - Update component
- `DELETE /components/:id` - Delete component

### Inventory Operations
- `POST /logs/inward/:componentId` - Add inventory
- `POST /logs/outward/:componentId` - Remove inventory

### Analytics & Alerts
- `GET /alerts` - Get low stock and stale stock alerts
- `GET /stats/inward` - Inward statistics
- `GET /stats/outward` - Outward statistics

### Admin Management
- `GET /admin/users` - List all users
- `POST /admin/users` - Create user
- `PUT /admin/users/:id` - Update user
- `DELETE /admin/users/:id` - Delete user

## Scalability Considerations

1. **Horizontal Scaling**: Stateless API design allows multiple server instances
2. **Database Optimization**: Indexed queries and aggregation pipelines
3. **Caching**: Can implement Redis for session management
4. **Load Balancing**: Ready for reverse proxy implementation
5. **Microservices**: Modular design allows service separation

## Security Architecture

1. **Authentication**: JWT tokens with expiration
2. **Authorization**: Role-based middleware
3. **Data Validation**: Mongoose schema validation
4. **Input Sanitization**: Express middleware
5. **CORS**: Configured for cross-origin requests

## Performance Optimizations

1. **Database Indexes**: On frequently queried fields
2. **Pagination**: Ready for large dataset handling
3. **Aggregation**: MongoDB aggregation for statistics
4. **Caching**: Local storage for user sessions
5. **Lazy Loading**: Component-based code splitting

This architecture provides a robust, scalable, and secure foundation for the inventory management system, suitable for both small labs and large research facilities. 