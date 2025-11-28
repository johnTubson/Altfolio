# Altfolio

Alternative Investments Tracker - A full-stack MERN application for tracking alternative investments like startups, crypto funds, farmland, and collectibles.

## Features

- **Authentication**: JWT-based authentication with admin and viewer roles
- **Investment Management**: CRUD operations for investments with comprehensive validation
- **Dashboard**: Analytics and visualizations with charts
- **Role-Based Access**: Admins can manage investments, viewers can only view

## Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend**: React, React Router, Recharts, Vite
- **Validation**: express-validator, Mongoose validators

## Setup

### Prerequisites

- Node.js (v20+)
- MongoDB (running locally or connection string)

### Installation

1. Install dependencies:

```bash
npm run install:all
```

2. Set up environment variables:

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. Start development servers:

```bash
npm run dev
```

This will start:

- Backend server on `http://localhost:5001`
- Frontend app on `http://localhost:3000`

## Default Users

The application seeds two users on first run:

- **Admin**: `admin@altfolio.com` / `admin123`
- **Viewer**: `viewer@altfolio.com` / `viewer123`

## API Endpoints

### Authentication

- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Users

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID (admin only)
- `GET /api/v1/users/search?q=query` - Search users by name or email (admin only)

### Investments

- `GET /api/v1/investments` - Get all investments
- `GET /api/v1/investments/stats` - Get dashboard statistics
- `GET /api/v1/investments/:id` - Get single investment
- `POST /api/v1/investments` - Create investment (admin only)
- `PUT /api/v1/investments/:id` - Update investment (admin only)
- `DELETE /api/v1/investments/:id` - Delete investment (admin only)

## Investment Fields

- `assetName` - Name of the investment
- `assetType` - One of: Startup, Crypto Fund, Farmland, Collectible, Other
- `investedAmount` - Initial investment amount
- `investmentDate` - Date of investment
- `currentValue` - Current value (manually updated)
- `owners` - Array of user IDs (many-to-many relationship)
