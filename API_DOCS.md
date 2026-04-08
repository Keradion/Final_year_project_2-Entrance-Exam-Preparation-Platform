# Comprehensive API Documentation and Examples

This document serves as an in-depth reference for all major endpoint subsystems in the application.

*Note: Almost all endpoints (except Registration and Login) require an authorized JSON Web Token (JWT) in the request header:*
`Authorization: Bearer <your_jwt_token>`

## 1. Authentication (`/api/auth`)

### Post Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName": "John", "lastName": "Doe", "email": "john@example.com", "password": "Password123!", "role": "student"}'
```

### Post Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "Password123!"}'
```

### Get User Profile
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>"
```

### Update User Profile
```bash
curl -X PUT http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"firstName": "Johnny Updated"}'
```

---

## 2. Subjects Subsystem (`/api/subjects`)

### Get All Subjects
```bash
curl -X GET http://localhost:5000/api/subjects
```

### Create a Subject *(Admin/Teacher)*
```bash
curl -X POST http://localhost:5000/api/subjects \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mathematics",
    "description": "High school math",
    "grade": 12
  }'
```

---

## 3. Course Content Subsystem (`/api/content`)

### Get Chapters by Subject ID
```bash
curl -X GET http://localhost:5000/api/content/subjects/<subjectId>/chapters
```

### Create a Chapter *(Teacher/Admin)*
```bash
curl -X POST http://localhost:5000/api/content/chapters \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Algebra", "subject": "<subjectId>", "order": 1}'
```

### Add a Concept to a Topic *(Teacher/Admin)*
```bash
curl -X POST http://localhost:5000/api/content/topics/<topicId>/concepts \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Linear Equations", "content": "Variables represent unknowns..."}'
```

---

## 4. Quizzes Subsystem (`/api/quizzes`)

### Get Quizzes by Topic
```bash
curl -X GET http://localhost:5000/api/quizzes/topics/<topicId>/quizzes \
  -H "Authorization: Bearer <token>"
```

### Create a Quiz *(Teacher/Admin)*
```bash
curl -X POST http://localhost:5000/api/quizzes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "Basic Algebra Quiz", "description": "Test your algebra skills", "topic": "<topicId>"}'
```

### Fetch a Specific Quiz Score
```bash
curl -X GET http://localhost:5000/api/quizzes/<quizId>/score \
  -H "Authorization: Bearer <token>"
```

---

## 5. Exercises Subsystem (`/api/exercises`)

### Get Exercises by Topic
```bash
curl -X GET http://localhost:5000/api/exercises/topics/<topicId>/exercises \
  -H "Authorization: Bearer <token>"
```

### Create an Exercise *(Teacher/Admin)*
```bash
curl -X POST http://localhost:5000/api/exercises \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Practice: Linear Equations",
    "topic": "<topicId>",
    "difficulty": "medium"
  }'
```

### Submit an Exercise Problem Answer
```bash
curl -X POST http://localhost:5000/api/exercises/problems/<problemId>/submit \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"answer": "x = 5"}'
```

---

## 6. Official Exams Subsystem (`/api/exams`)

### Search Exam Papers
```bash
curl -X GET 'http://localhost:5000/api/exams/papers/search?year=2023&subject=<subjectId>' \
  -H "Authorization: Bearer <token>"
```

### Create Exam Paper *(Teacher/Admin)*
```bash
curl -X POST http://localhost:5000/api/exams/papers \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title": "EUEE 2023 Math", "year": 2023, "duration": 120, "subject": "<subjectId>"}'
```

### Validate Answer to an Exam Question
```bash
curl -X POST http://localhost:5000/api/exams/questions/<questionId>/validate \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"selectedOption": 2}'
```

---

## 7. User Notifications Subsystem (`/api/notifications`)

### Get All Notifications
```bash
curl -X GET http://localhost:5000/api/notifications \
  -H "Authorization: Bearer <token>"
```

### Get Unread Notifications
```bash
curl -X GET http://localhost:5000/api/notifications/unread \
  -H "Authorization: Bearer <token>"
```

### Mark a Notification as Read
```bash
curl -X PUT http://localhost:5000/api/notifications/<notificationId>/read \
  -H "Authorization: Bearer <token>"
```

---

## 8. General Platform Administration (`/api/admin`)

### Get All Users *(Admin)*
```bash
curl -X GET http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer <admin_token>"
```

### Update a User's Role *(Admin)*
```bash
curl -X PATCH http://localhost:5000/api/admin/users/<userId>/role \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"role": "teacher"}'
```

### Update User Activation Status *(Admin)*
```bash
curl -X PATCH http://localhost:5000/api/admin/users/<userId>/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{" isActive": false }'
```
