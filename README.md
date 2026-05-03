# EduPortal - Ethiopian University Entrance Exam Preparation Platform

EduPortal is a modern, responsive, and comprehensive Learning Management System (LMS) designed specifically for students preparing for the Ethiopian University Entrance Exam. It provides a robust dual-interface system for educators and students, featuring interactive assessments, AI-assisted tutoring, and progress tracking.

## 🚀 Features

### For Students
*   **Curriculum Tracking:** Organized progression through subjects, chapters, and topics.
*   **Timed Assessments:** Interactive, strictly-timed quizzes that automatically submit when time expires.
*   **AI Tutor (Gemini Integration):** An intelligent, contextual chatbot that provides conceptual hints (rather than direct answers) to maintain academic integrity during assessments.
*   **Instant Feedback & Notifications:** Detailed result breakdowns (only visible after passing) and automated congratulatory emails upon topic completion.
*   **Modern Responsive Interface:** A "glassmorphic", premium user interface that works flawlessly across desktop, tablet, and mobile devices.

### For Teachers & Administrators
*   **Curriculum Builder:** Intuitive dashboard for creating and managing subjects, chapters, and topics.
*   **Assessment Creator:** Build complex quizzes with custom durations and detailed answer explanations.
*   **Performance Monitoring:** Tools to track student enrollment and progress.

## 🛠️ Technology Stack

EduPortal is built on the **MERN** stack with modern tooling:

### Frontend
*   **Framework:** React 19 powered by Vite
*   **Styling:** Tailwind CSS (v4) for rapid, responsive utility-first design
*   **Routing:** React Router DOM (v7)
*   **Form Management:** React Hook Form & Zod for robust validation
*   **Icons:** Lucide React

### Backend
*   **Environment:** Node.js & Express.js
*   **Database:** MongoDB (with Mongoose ODM)
*   **Caching & Queues:** Redis & BullMQ
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **Email Services:** Nodemailer

## 🏗️ Project Structure

The repository is organized into a monorepo-style structure:

```text
.
├── backend/            # Express.js REST API
│   ├── src/
│   │   ├── controllers/ # Request handlers
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   └── services/    # Business logic (Email, Cache, Gemini AI)
│   ├── Dockerfile
│   └── package.json
├── frontend/           # React SPA
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── pages/       # Application views (Dashboards, Quizzes)
│   │   └── utils/       # API clients and helpers
│   ├── Dockerfile
│   ├── vite.config.js
│   └── package.json
└── docker-compose.yml  # Local development orchestration
```

## ⚙️ Setup and Installation

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18+ recommended)
*   [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)
*   [Redis](https://redis.io/) (Optional, but recommended for caching)
*   [Docker](https://www.docker.com/) (Optional, for containerized execution)

### Local Development Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/EduPortal.git
    cd EduPortal
    ```

2.  **Environment Configuration:**
    *   Navigate to the `backend/` directory and create a `.env` file based on `.env.example`.
    *   Required variables include `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and SMTP credentials for emails.

3.  **Start the Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```

4.  **Start the Frontend:**
    Open a new terminal window:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

5.  The application will be available at `http://localhost:5173`.

### Docker Setup
For a streamlined setup, you can use Docker Compose to spin up the entire stack:
```bash
docker-compose up --build
```

## 🛡️ Security & Integrity

*   **Role-Based Access Control (RBAC):** Strict separation of concerns between Students, Teachers, and Admins.
*   **Assessment Integrity:** The AI Tutor is explicitly instructed via system prompts to refuse direct answers to quiz questions, instead offering pedagogical hints. Failed quizzes hide the correct answers until the student successfully passes.
*   **Data Protection:** Sensitive endpoints are protected, and passwords are comprehensively hashed.

## 📄 License

This project is licensed under the MIT License.
