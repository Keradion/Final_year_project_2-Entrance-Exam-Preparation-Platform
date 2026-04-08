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

### Health Check
- `GET /health` - Server health status

### Authentication (Coming Soon)
- `POST /api/v1/auth/register` - Create new account
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh` - Refresh JWT token
- `POST /api/v1/auth/reset-password` - Reset password

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
