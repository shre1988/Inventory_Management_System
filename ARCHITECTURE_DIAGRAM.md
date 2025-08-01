# Inventory Management System - Architecture Diagram

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  Dashboard  │  │  Inventory  │  │User Mgmt    │  │   Login     │     │
│  │   Page      │  │   Page      │  │   Page      │  │   Page      │     │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │
│         │                │                │                │             │
│         └────────────────┼────────────────┼────────────────┘             │
│                          │                │                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AUTHENTICATION CONTEXT                          │   │
│  │  • JWT Token Management • User Session • Protected Routes         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    EXPRESS.JS SERVER                              │   │
│  │  • CORS • Request/Response • Middleware Chain                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                    │
│  ┌─────────────┐  ┌─────────────┐  │  ┌─────────────┐  ┌─────────────┐   │
│  │   Auth      │  │   Role      │  │  │   JWT       │  │   bcrypt    │   │
│  │ Middleware  │  │ Middleware  │  │  │ Validation  │  │   Hashing   │   │
│  └─────────────┘  └─────────────┘  │  └─────────────┘  └─────────────┘   │
│                                    │                                    │
│  ┌─────────────┐  ┌─────────────┐  │  ┌─────────────┐  ┌─────────────┐   │
│  │ Component   │  │ Inventory   │  │  │   Admin     │  │   Analytics │   │
│  │   Routes    │  │   Routes    │  │  │   Routes    │  │   Routes    │   │
│  └─────────────┘  └─────────────┘  │  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Mongoose ODM
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE LAYER                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MONGODB DATABASE                           │   │
│  │                                                                   │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │   │
│  │  │   Users     │  │ Components  │  │InventoryLogs│              │   │
│  │  │ Collection  │  │ Collection  │  │ Collection  │              │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘              │   │
│  │                                                                   │   │
│  │  • Indexes: email (unique), componentId, userId                  │   │
│  │  • Aggregation: Statistics, Reports                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   React     │───▶│  AuthContext│───▶│  Express    │───▶│  MongoDB    │
│ Components  │    │   (JWT)     │    │   Server    │    │  Database   │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
   User Interface    Token Management    Business Logic    Data Storage
   • Dashboard       • Session Control   • CRUD Operations • Collections
   • Inventory       • Route Protection  • Authentication  • Indexes
   • User Mgmt       • Role Validation   • Authorization   • Aggregation
```

## Technology Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              TECHNOLOGY STACK                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  FRONTEND                    BACKEND                    DATABASE          │
│  ┌─────────────┐            ┌─────────────┐            ┌─────────────┐   │
│  │   React 18  │            │  Node.js    │            │  MongoDB    │   │
│  │   Vite      │            │  Express.js │            │  Mongoose   │   │
│  │ React Router│            │     JWT     │            │   Indexes   │   │
│  │ Context API │            │   bcryptjs  │            │Aggregation  │   │
│  │ Tailwind CSS│            │     CORS    │            │             │   │
│  └─────────────┘            └─────────────┘            └─────────────┘   │
│                                                                           │
│  SECURITY FEATURES                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Role-Based Access Control (Admin, LabTech, Researcher, Engineer)│   │
│  │  • JWT Token Authentication with Expiration                        │   │
│  │  • Password Hashing with bcrypt                                   │   │
│  │  • Protected Routes with Middleware                               │   │
│  │  • Input Validation and Sanitization                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Features

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM FEATURES                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  🔐 AUTHENTICATION & AUTHORIZATION                                       │
│  • Multi-role user system (Admin, LabTechnician, Researcher, Engineer)   │
│  • JWT-based secure authentication                                       │
│  • Role-based route protection                                           │
│                                                                           │
│  📦 INVENTORY MANAGEMENT                                                 │
│  • CRUD operations for components                                        │
│  • Real-time stock tracking                                              │
│  • Inward/Outward logging with audit trail                              │
│  • Advanced search and filtering capabilities                            │
│                                                                           │
│  📊 ANALYTICS & REPORTING                                                │
│  • Low stock alerts and notifications                                   │
│  • Stale stock detection (90+ days)                                     │
│  • Inward/Outward statistics and trends                                 │
│  • MongoDB aggregation for performance                                  │
│                                                                           │
│  👥 USER MANAGEMENT                                                      │
│  • Admin-only user creation and management                              │
│  • Role assignment and modification                                     │
│  • User activity tracking                                               │
│                                                                           │
│  🚀 PERFORMANCE & SCALABILITY                                           │
│  • Database indexing for fast queries                                   │
│  • Stateless API design for horizontal scaling                          │
│  • Modular architecture for microservices                               │
│  • CORS configuration for cross-origin requests                         │
└─────────────────────────────────────────────────────────────────────────────┘
```

## API Endpoints Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API ENDPOINTS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│  🔐 AUTHENTICATION                                                       │
│  POST /auth/login     - User authentication                              │
│  POST /auth/register  - User registration                               │
│                                                                           │
│  📦 COMPONENTS                                                           │
│  GET    /components   - List with filtering                              │
│  POST   /components   - Create component                                 │
│  PUT    /components/:id - Update component                               │
│  DELETE /components/:id - Delete component                               │
│                                                                           │
│  📋 INVENTORY OPERATIONS                                                 │
│  POST /logs/inward/:componentId  - Add inventory                        │
│  POST /logs/outward/:componentId - Remove inventory                     │
│                                                                           │
│  📊 ANALYTICS                                                            │
│  GET /alerts        - Low stock & stale stock alerts                    │
│  GET /stats/inward  - Inward statistics                                 │
│  GET /stats/outward - Outward statistics                                │
│                                                                           │
│  👥 ADMIN MANAGEMENT                                                     │
│  GET    /admin/users     - List all users                               │
│  POST   /admin/users     - Create user                                  │
│  PUT    /admin/users/:id - Update user                                  │
│  DELETE /admin/users/:id - Delete user                                  │
└─────────────────────────────────────────────────────────────────────────────┘
``` 