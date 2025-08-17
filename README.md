# Event Management API

A RESTful API built with Node.js, TypeScript, Express, and MongoDB for managing and attending events.

## 🚀 Features

- **User Registration & Authorization**: User registration and JWT-based authentication with role-based access control
- **Event Management**: Full CRUD operations and attending for events
- **Attendance Tracking**: Track user attendance at events

## 📋 Prerequisites

- Node.js
- npm
- MongoDB
- Docker

## 🛠️ Installation

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/gokhanaker/event-management-api
   cd event-management-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   NODE_ENV=development
   PORT=6000
   MONGO_URI=mongodb://localhost:27017/event-management
   JWT_SECRET=your-super-secret-jwt-key-change-in
   JWT_EXPIRATION_DURATION=24h
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Run the application**

   ```bash
   # Development mode with hot reload
   npm run dev
   ```

### Docker Setup

1. **Using Docker Compose**

   ```bash
   # Start all services (app, MongoDB, Mongo Express)
   npm run docker:compose

   # Stop services
   npm run docker:compose:down
   ```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run clean` - Clean build directory
- `npm run docker:compose` - Start with Docker Compose
- `npm run docker:compose:down` - Stop Docker Compose services
