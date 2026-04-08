# Learning Management System - Backend API

A Node.js + Express + MongoDB backend for a comprehensive learning management system supporting students, teachers, and administrators.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT
- **Validation**: express-validator
- **Password Hashing**: bcryptjs
- **Security**: helmet, CORS
- **Logging**: morgan
- **Testing**: Jest, Supertest

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and app configuration
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── controllers/     # Request handlers
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   ├── utils/           # Helper functions
│   ├── app.js           # Express app setup
│   └── server.js        # Entry point
├── tests/               # Test files
├── .env.example         # Environment variables template
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 14+ installed
- MongoDB Atlas account and connection string

### Installation

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your MongoDB Atlas connection string**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lms?retryWrites=true&w=majority
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Verify health endpoint**
   ```bash
   curl http://localhost:5000/health
   ```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

## API Endpoints

[Get a detailed list of ALL available endpoint examples across the 8 subsystems here in API_DOCS.md](./API_DOCS.md).

Here are some sample API calls and their expected responses. This reflects the current API functionality in the system.

### Health Check
```bash
curl -X GET http://localhost:5000/health
```
**Response:**
```json
{
  "status": "up",
  "port": 5000,
  "env": "development"
}
```

### Authentication

#### 1. Register User
```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@example.com",
    "password": "Password123!",
    "role": "student"
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "lastName": "Doe",
      "email": "johndoe@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

#### 2. Login User
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "johndoe@example.com",
    "password": "Password123!"
  }'
```
**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "firstName": "John",
      "lastName": "Doe",
      "email": "johndoe@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR..."
  }
}
```

### Quizzes & Assessments

*(Note: Requires a valid JWT token in the `Authorization: Bearer <token>` header)*

#### 1. Create a Quiz (Teacher/Admin)
```bash
curl -X POST http://localhost:5000/api/v1/quizzes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "Algebra Basics",
    "description": "A preliminary quiz on basic algebra concepts.",
    "topic": "60d21b4667d0d8992e610c85"
  }'
```
**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "60d22f1867d0d8992e610c86",
    "title": "Algebra Basics",
    "description": "A preliminary quiz on basic algebra concepts.",
    "topic": "60d21b4667d0d8992e610c85",
    "problems": [],
    "createdAt": "2026-04-08T10:00:00.000Z"
  }
}
```

#### 2. Get Quizzes by Topic
```bash
curl -X GET http://localhost:5000/api/v1/quizzes/topics/60d21b4667d0d8992e610c85/quizzes \
  -H "Authorization: Bearer <your_jwt_token>"
```
**Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": "60d22f1867d0d8992e610c86",
      "title": "Algebra Basics",
      "description": "A preliminary quiz on basic algebra concepts."
    }
  ]
}
```

## Features (In Development)

### Subsystem 1: Identity & Accounts
- User registration/login
- Account management
- Password reset

### Subsystem 2: Learning Content
- Subjects and chapters
- Topics and concepts
- Video content

### Subsystem 3: Assessment & Progress
- Exercises and quizzes
- Previous-year exams
- Progress tracking

### Subsystem 4: Community & Support
- Q&A between students and teachers
- Issue reporting
- Bookmarks

### Subsystem 5: Notifications
- In-app notifications
- Email notifications
- Progress milestones

## Environment Variables

See `.env.example` for all available configuration options.

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## Deployment

Recommended platforms:
- **Render** - Best free tier with auto-deploy from GitHub
- **Railway** - Generous free credits
- **Fly.io** - Good for containerized apps

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linter and tests
4. Submit pull request

## License

MIT
