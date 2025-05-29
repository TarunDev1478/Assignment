# Subscription Management Microservice

A scalable microservice for managing user subscriptions built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Subscription management (create, read, update, cancel)
- Plan management
- Automatic subscription expiry
- RESTful API design
- Input validation and error handling
- Rate limiting and security best practices

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <Rpository name>
```
## Install dependencies
``` bash
npm install
```
## Create a .env file in the root directory

```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/subscription-service
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=30d
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```
## Start the server
```bash
# Development
npm run dev

# Production
npm start
```
## API Documentation

### Reister User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Subscription
```bash
POST /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "60d5eca77dd70b1234567890"
}
```

### Get User Subscription
```bash
GET /api/subscriptions/:userId
Authorization: Bearer <token>
```

### Update Subscription

```bash
PUT /api/subscriptions/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "60d5eca77dd70b1234567891"
}
```

### Cancel Subscription

```bash
DELETE /api/subscriptions/:userId
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Too expensive"
}
```

### Get All Plans
```bash
GET /api/plans
```

### Get Single Plan
```bash
GET /api/plans/:id
```

### Create Plan (Protected)

```bash
POST /api/plans
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Basic Plan",
  "description": "Perfect for individuals",
  "price": 9.99,
  "features": ["Feature 1", "Feature 2", "Feature 3"],
  "duration": 1,
  "durationUnit": "months"
}
```



