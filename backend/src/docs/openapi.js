/**
 * OpenAPI 3 specification for the LMS backend.
 * Servers URL: set SWAGGER_SERVER_URL (e.g. https://your-api.onrender.com) for accurate "Try it out".
 */

const EX = {
  subjectId: '674aa1111111111111111111',
  chapterId: '674aa2222222222222222222',
  topicId: '674aa3333333333333333333',
  conceptId: '674aa4444444444444444444',
  videoId: '674aa5555555555555555555',
  exerciseId: '674aa6666666666666666666',
  exerciseProblemId: '674aa7777777777777777777',
  quizId: '674aa8888888888888888888',
  quizProblemId: '674aa9999999999999999999',
  paperId: '674aabaaaaaaaaaaaaaaaaaaa',
  examQuestionId: '674aabbbbbbbbbbbbbbbbbbbb',
  teacherId: '674aabccccccccccccccccccc',
  bookmarkId: '674aabddddddddddddddddddd',
  questionId: '674aabeeeeeeeeeeeeeeeeeee',
  answerId: '674aabfffffffffffffffffff',
  issueId: '674aab0000000000000000001',
  notificationId: '674aab1111111111111111112',
};

function getOpenApiSpec() {
  const port = process.env.PORT || 5000;
  const defaultServer = `http://localhost:${port}`;
  const serverUrl = (process.env.SWAGGER_SERVER_URL || defaultServer).replace(/\/$/, '');

  const spec = {
    openapi: '3.0.3',
    info: {
      title: 'Learning Management System API',
      version: '1.0.0',
      description: [
        'REST API for curriculum, assessments, progress, and student tools.',
        '',
        '### Authentication',
        'Most routes require a JWT in the header: `Authorization: Bearer <token>` from `POST /api/auth/login` or `POST /api/auth/register`.',
        '',
        '### Sample calls (curl)',
        '',
        '**Health**',
        '```bash',
        `curl -s "${serverUrl}/health"`,
        '```',
        '',
        '**Login**',
        '```bash',
        `curl -s -X POST "${serverUrl}/api/auth/login" \\`,
        '  -H "Content-Type: application/json" \\',
        '  -d \'{"email":"student@example.com","password":"Secret1a"}\'',
        '```',
        '',
        '**Subjects (public)**',
        '```bash',
        `curl -s "${serverUrl}/api/subjects"`,
        '```',
        '',
        '**Authenticated request**',
        '```bash',
        `TOKEN="your_jwt_here"`,
        `curl -s "${serverUrl}/api/auth/profile" -H "Authorization: Bearer $TOKEN"`,
        '```',
      ].join('\n'),
    },
    servers: [{ url: serverUrl, description: 'API server' }],
    tags: [
      { name: 'Health', description: 'Service status' },
      { name: 'Auth', description: 'Registration, login, profile, passwords, AI availability' },
      { name: 'Admin', description: 'Admin user management' },
      { name: 'Subjects', description: 'Subjects and teacher assignment' },
      { name: 'Content', description: 'Chapters, topics, concepts, videos' },
      { name: 'Exercises', description: 'Practice exercises and problems' },
      { name: 'Quizzes', description: 'Timed quizzes and attempts' },
      { name: 'Exams', description: 'Exam papers and questions' },
      { name: 'Answers', description: 'Generic answer submission' },
      { name: 'Issues', description: 'Student issue reports' },
      { name: 'Bookmarks', description: 'Student bookmarks' },
      { name: 'Questions', description: 'Topic Q&A between students and teachers' },
      { name: 'Progress', description: 'Student progress (student role)' },
      { name: 'Notifications', description: 'User notifications' },
      { name: 'AI', description: 'AI tutor (server-configured Gemini)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiError: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            error: { type: 'string' },
            statusCode: { type: 'integer' },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', format: 'password' },
          },
          example: { email: 'student@example.com', password: 'Secret1a' },
        },
        ChangePasswordRequest: {
          type: 'object',
          required: ['oldPassword', 'newPassword'],
          properties: {
            oldPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 6 },
          },
          example: { oldPassword: 'Secret1a', newPassword: 'Secret2b' },
        },
        PasswordResetRequest: {
          type: 'object',
          required: ['email'],
          properties: { email: { type: 'string', format: 'email' } },
          example: { email: 'student@example.com' },
        },
        ResetPasswordConfirm: {
          type: 'object',
          required: ['resetToken', 'newPassword'],
          properties: {
            resetToken: { type: 'string' },
            newPassword: { type: 'string', minLength: 6 },
          },
          example: { resetToken: 'paste_token_from_email', newPassword: 'Secret2b' },
        },
        VerifyEmailRequest: {
          type: 'object',
          required: ['email', 'code'],
          properties: {
            email: { type: 'string', format: 'email' },
            code: { type: 'string', description: 'Verification code from email' },
          },
          example: { email: 'student@example.com', code: '123456' },
        },
        GeminiKeyRequest: {
          type: 'object',
          deprecated: true,
          description: 'Deprecated — Gemini is configured server-side via GEMINI_API_KEY',
          properties: { apiKey: { type: 'string' } },
        },
        SubjectCreate: {
          type: 'object',
          required: ['subjectName', 'gradeLevel'],
          properties: {
            subjectName: { type: 'string' },
            gradeLevel: { type: 'string', example: 'Grade 12' },
            stream: { type: 'string', enum: ['Natural', 'Social'] },
            description: { type: 'string' },
          },
          example: {
            subjectName: 'Geography',
            gradeLevel: 'Grade 12',
            stream: 'Social',
            description: 'Physical and human geography',
          },
        },
        InviteTeacher: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
          },
          example: { email: 'teacher@example.com', firstName: 'Jane', lastName: 'Educator' },
        },
        ChapterCreate: {
          type: 'object',
          properties: {
            subject: { type: 'string', description: 'Subject ObjectId' },
            chapterName: { type: 'string' },
            chapterNumber: { type: 'integer' },
            description: { type: 'string' },
          },
          example: {
            subject: EX.subjectId,
            chapterName: 'Unit 1: Map skills',
            chapterNumber: 1,
            description: 'Introduction to maps',
          },
        },
        TopicCreate: {
          type: 'object',
          properties: {
            chapter: { type: 'string' },
            topicName: { type: 'string' },
            topicNumber: { type: 'integer' },
            topicDescription: { type: 'string' },
          },
          example: {
            chapter: EX.chapterId,
            topicName: 'Contour lines',
            topicNumber: 1,
            topicDescription: 'Reading elevation from maps',
          },
        },
        ExerciseCreate: {
          type: 'object',
          properties: {
            topic: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            question: { type: 'string' },
            options: { type: 'array', items: { type: 'string' } },
            correctAnswer: { type: 'integer', description: 'Index into options' },
            hint: { type: 'string' },
            difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
          },
          example: {
            topic: EX.topicId,
            title: 'Quick check: scale',
            description: 'Choose the correct definition.',
            question: 'What does map scale describe?',
            options: ['Direction only', 'Distance ratio', 'Climate zones'],
            correctAnswer: 1,
            hint: 'Think ratio between map and ground.',
            difficulty: 'Easy',
          },
        },
        ExerciseProblemCreate: {
          type: 'object',
          required: ['questionText', 'correctAnswer', 'exerciseId'],
          properties: {
            questionText: { type: 'string' },
            choices: {
              type: 'array',
              items: {
                type: 'object',
                properties: { text: { type: 'string' }, value: { type: 'string' } },
              },
            },
            correctAnswer: { type: 'string' },
            answerExplanation: { type: 'string' },
            exerciseId: { type: 'string' },
          },
          example: {
            questionText: 'Which symbol shows a school on a topographic map?',
            choices: [
              { text: 'House icon', value: 'A' },
              { text: 'Building with flag', value: 'B' },
            ],
            correctAnswer: 'B',
            answerExplanation: 'Schools use the standardized education symbol.',
          },
        },
        QuizCreate: {
          type: 'object',
          required: ['topic', 'title', 'duration'],
          properties: {
            topic: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            duration: { type: 'number', description: 'Minutes' },
          },
          example: {
            topic: EX.topicId,
            title: 'Unit 1 quiz',
            description: 'Mixed MCQs',
            duration: 15,
          },
        },
        QuizProblemCreate: {
          type: 'object',
          properties: {
            questionText: { type: 'string' },
            choices: {
              type: 'array',
              items: {
                type: 'object',
                properties: { text: { type: 'string' }, value: { type: 'string' } },
              },
            },
            correctAnswer: { type: 'string' },
            answerExplanation: { type: 'string' },
          },
          example: {
            questionText: '1:50,000 means…',
            choices: [
              { text: '1 cm = 500 m', value: 'A' },
              { text: '1 cm = 50 km', value: 'B' },
            ],
            correctAnswer: 'A',
            answerExplanation: '50,000 cm = 500 m.',
          },
        },
        QuizSubmit: {
          type: 'object',
          required: ['answers'],
          properties: {
            answers: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  problemId: { type: 'string' },
                  submittedAnswer: { type: 'string' },
                },
              },
            },
          },
          example: {
            answers: [{ problemId: EX.quizProblemId, submittedAnswer: 'A' }],
          },
        },
        SubmitProblemAnswer: {
          type: 'object',
          required: ['submittedAnswer'],
          properties: { submittedAnswer: { type: 'string' } },
          example: { submittedAnswer: 'B' },
        },
        SubmitExerciseAnswer: {
          type: 'object',
          required: ['submittedAnswer'],
          properties: {
            submittedAnswer: {
              type: 'integer',
              description: 'Zero-based index of chosen option',
            },
          },
          example: { submittedAnswer: 1 },
        },
        GenericAnswerSubmit: {
          type: 'object',
          required: ['questionId', 'questionModel', 'submittedAnswer'],
          properties: {
            questionId: { type: 'string' },
            questionModel: {
              type: 'string',
              enum: ['QuizProblem', 'ExerciseProblem', 'ExamQuestion'],
            },
            submittedAnswer: { type: 'string' },
          },
          example: {
            questionId: EX.quizProblemId,
            questionModel: 'QuizProblem',
            submittedAnswer: 'A',
          },
        },
        BookmarkCreate: {
          type: 'object',
          required: ['resourceType', 'resourceId'],
          properties: {
            resourceType: {
              type: 'string',
              enum: ['topic', 'video', 'concept', 'exercise', 'quiz', 'exercise-question', 'exam-question'],
            },
            resourceId: { type: 'string' },
            note: { type: 'string' },
          },
          example: { resourceType: 'topic', resourceId: EX.topicId, note: 'Revise before exam' },
        },
        IssueCreate: {
          type: 'object',
          required: ['topicId', 'issueDescription'],
          properties: {
            topicId: { type: 'string' },
            title: { type: 'string' },
            issueDescription: { type: 'string' },
            issueType: { type: 'string', enum: ['bug', 'feature-request', 'error', 'other'] },
          },
          example: {
            topicId: EX.topicId,
            title: 'Video will not load',
            issueDescription: 'The third video returns 404.',
            issueType: 'bug',
          },
        },
        IssueStatusUpdate: {
          type: 'object',
          required: ['issueStatus'],
          properties: {
            issueStatus: { type: 'string', enum: ['open', 'in-progress', 'resolved', 'closed'] },
            response: { type: 'string' },
          },
          example: { issueStatus: 'resolved', response: 'Fixed the CDN link.' },
        },
        StudentQuestionCreate: {
          type: 'object',
          required: ['topicId', 'questionText'],
          properties: {
            topicId: { type: 'string' },
            questionText: { type: 'string' },
          },
          example: {
            topicId: EX.topicId,
            questionText: 'Can you clarify contour spacing vs cliff?',
          },
        },
        TeacherAnswerCreate: {
          type: 'object',
          properties: { answerText: { type: 'string' } },
          example: { answerText: 'Closer contours mean steeper slope; cliffs show touching lines.' },
        },
        AiChatRequest: {
          type: 'object',
          required: ['message'],
          properties: {
            message: { type: 'string' },
            topicId: { type: 'string' },
            page: {
              type: 'string',
              description: 'Optional UI context: concept | video | exercise | quiz | exam',
            },
          },
          example: {
            message: 'Give me a hint for reading contour lines—do not give the final answer.',
            topicId: EX.topicId,
            page: 'concept',
          },
        },
      },
    },
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          responses: {
            '200': {
              description: 'OK',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: { type: 'string', example: 'ok' },
                      timestamp: { type: 'string', format: 'date-time' },
                      uptime: { type: 'number' },
                    },
                  },
                  example: {
                    status: 'ok',
                    timestamp: '2026-05-07T12:00:00.000Z',
                    uptime: 123.45,
                  },
                },
              },
            },
          },
        },
      },
      '/api/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register user',
          description:
            'JSON body works without profile image. For avatar upload use multipart field `profileImageFile` plus text fields.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['firstName', 'lastName', 'email', 'password'],
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', description: 'Min 6 chars; mixed case + digit' },
                    phoneNumber: { type: 'string' },
                    role: { type: 'string', enum: ['student', 'teacher', 'admin'] },
                    stream: { type: 'string' },
                    gradeLevel: { type: 'string', example: 'Grade 12' },
                    profileImage: { type: 'string', description: 'URL if no file upload' },
                  },
                },
                examples: {
                  student: {
                    summary: 'Student registration',
                    value: {
                      firstName: 'Almaz',
                      lastName: 'Kebede',
                      email: 'student@example.com',
                      password: 'Secret1a',
                      role: 'student',
                      gradeLevel: 'Grade 12',
                      stream: 'Natural',
                    },
                  },
                },
              },
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    profileImageFile: { type: 'string', format: 'binary' },
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    email: { type: 'string' },
                    password: { type: 'string' },
                    role: { type: 'string' },
                    gradeLevel: { type: 'string' },
                    stream: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Created' },
            '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiError' } } } },
          },
        },
      },
      '/api/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
          },
          responses: {
            '200': { description: 'JWT returned in data.token' },
            '400': { description: 'Validation error' },
            '401': { description: 'Invalid credentials' },
          },
        },
      },
      '/api/auth/request-password-reset': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PasswordResetRequest' } } },
          },
          responses: { '200': { description: 'Processed (email sent if account exists)' } },
        },
      },
      '/api/auth/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Confirm password reset',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordConfirm' } } },
          },
          responses: { '200': { description: 'Success' } },
        },
      },
      '/api/auth/verify-email': {
        post: {
          tags: ['Auth'],
          summary: 'Verify email / complete registration',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyEmailRequest' } } },
          },
          responses: { '200': { description: 'Verified' } },
        },
      },
      '/api/auth/profile': {
        get: {
          tags: ['Auth'],
          summary: 'Get profile',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'User profile' }, '401': { description: 'Unauthorized' } },
        },
        put: {
          tags: ['Auth'],
          summary: 'Update profile',
          security: [{ bearerAuth: [] }],
          description: 'Multipart supported with `profileImageFile`.',
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    firstName: { type: 'string' },
                    lastName: { type: 'string' },
                    phoneNumber: { type: 'string' },
                    profileImage: { type: 'string' },
                  },
                },
                example: { firstName: 'Almaz', phoneNumber: '+251900000000' },
              },
            },
          },
          responses: { '200': { description: 'Updated' } },
        },
      },
      '/api/auth/ai-settings': {
        get: {
          tags: ['Auth'],
          summary: 'AI tutor availability (student)',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'aiTutorEnabled: whether GEMINI_API_KEY is set on the server' } },
        },
      },
      '/api/auth/change-password': {
        post: {
          tags: ['Auth'],
          summary: 'Change password',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } },
          },
          responses: { '200': { description: 'Success' } },
        },
      },
      '/api/auth/logout': {
        post: {
          tags: ['Auth'],
          summary: 'Logout (blacklist token)',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Logged out' } },
        },
      },
      '/api/admin/users': {
        get: {
          tags: ['Admin'],
          summary: 'List users',
          security: [{ bearerAuth: [] }],
          description: 'Admin only.',
          responses: { '200': { description: 'User list' }, '403': { description: 'Forbidden' } },
        },
      },
      '/api/admin/users/{userId}': {
        get: {
          tags: ['Admin'],
          summary: 'Get user by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'User' }, '404': { description: 'Not found' } },
        },
      },
      '/api/admin/users/{userId}/role': {
        patch: {
          tags: ['Admin'],
          summary: 'Update user role',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { role: { type: 'string', enum: ['student', 'teacher', 'admin'] } },
                },
                example: { role: 'teacher' },
              },
            },
          },
          responses: { '200': { description: 'Updated' } },
        },
      },
      '/api/admin/users/{userId}/status': {
        patch: {
          tags: ['Admin'],
          summary: 'Update account status',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'userId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: { status: { type: 'string', enum: ['active', 'inactive', 'suspended'] } },
                },
                example: { status: 'active' },
              },
            },
          },
          responses: { '200': { description: 'Updated' } },
        },
      },
      '/api/subjects': {
        get: {
          tags: ['Subjects'],
          summary: 'List subjects',
          responses: { '200': { description: 'Array of subjects' } },
        },
        post: {
          tags: ['Subjects'],
          summary: 'Create subject',
          security: [{ bearerAuth: [] }],
          description: 'Admin only.',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SubjectCreate' } } },
          },
          responses: { '201': { description: 'Subject created' } },
        },
      },
      '/api/subjects/{id}': {
        get: {
          tags: ['Subjects'],
          summary: 'Get subject',
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Subject' } },
        },
        put: {
          tags: ['Subjects'],
          summary: 'Update subject',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Subjects'],
          summary: 'Delete subject',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/subjects/{subjectId}/assign-teacher/{teacherId}': {
        put: {
          tags: ['Subjects'],
          summary: 'Assign teacher to subject',
          security: [{ bearerAuth: [] }],
          description: 'Admin only.',
          parameters: [
            { name: 'subjectId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'teacherId', in: 'path', required: true, schema: { type: 'string', example: EX.teacherId } },
          ],
          responses: { '200': { description: 'Assigned' } },
        },
      },
      '/api/subjects/{subjectId}/invite-assign-teacher': {
        post: {
          tags: ['Subjects'],
          summary: 'Invite teacher by email and assign',
          security: [{ bearerAuth: [] }],
          description: 'Admin only.',
          parameters: [{ name: 'subjectId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/InviteTeacher' } } },
          },
          responses: { '200': { description: 'Invitation result' } },
        },
      },
      '/api/content/subjects/{subjectId}/chapters': {
        get: {
          tags: ['Content'],
          summary: 'Chapters by subject',
          parameters: [{ name: 'subjectId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Chapters' } },
        },
      },
      '/api/content/chapters/{chapterId}/topics': {
        get: {
          tags: ['Content'],
          summary: 'Topics by chapter',
          parameters: [{ name: 'chapterId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Topics' } },
        },
      },
      '/api/content/chapters/{chapterId}': {
        get: {
          tags: ['Content'],
          summary: 'Chapter by id',
          parameters: [{ name: 'chapterId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Chapter' } },
        },
      },
      '/api/content/topics/search': {
        get: {
          tags: ['Content'],
          summary: 'Search topics',
          parameters: [{ name: 'q', in: 'query', schema: { type: 'string' }, example: 'economics' }],
          responses: { '200': { description: 'Matching topics' } },
        },
      },
      '/api/content/topics/{topicId}': {
        get: {
          tags: ['Content'],
          summary: 'Topic by id',
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Topic' } },
        },
        put: {
          tags: ['Content'],
          summary: 'Update topic',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Content'],
          summary: 'Delete topic',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/content/topics/{topicId}/concepts': {
        get: {
          tags: ['Content'],
          summary: 'Concepts by topic',
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Concepts' } },
        },
        post: {
          tags: ['Content'],
          summary: 'Add concept (multipart optional image)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {
                    contentImage: { type: 'string', format: 'binary' },
                    title: { type: 'string' },
                    content: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: { '201': { description: 'Concept added' } },
        },
      },
      '/api/content/concepts/{conceptId}': {
        get: {
          tags: ['Content'],
          summary: 'Concept by id',
          parameters: [{ name: 'conceptId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Concept' } },
        },
        put: {
          tags: ['Content'],
          summary: 'Update concept',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'conceptId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Content'],
          summary: 'Delete concept',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'conceptId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/content/topics/{topicId}/videos': {
        get: {
          tags: ['Content'],
          summary: 'Videos by topic',
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Videos' } },
        },
        post: {
          tags: ['Content'],
          summary: 'Add video',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    title: { type: 'string' },
                    videoUrl: { type: 'string' },
                    videoDuration: { type: 'number' },
                  },
                },
                example: {
                  title: 'Contour lines explained',
                  videoUrl: 'https://example.com/video.mp4',
                  videoDuration: 480,
                },
              },
            },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/content/videos/{videoId}': {
        get: {
          tags: ['Content'],
          summary: 'Video by id',
          parameters: [{ name: 'videoId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Video' } },
        },
        put: {
          tags: ['Content'],
          summary: 'Update video',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'videoId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Content'],
          summary: 'Delete video',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'videoId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/content/chapters': {
        post: {
          tags: ['Content'],
          summary: 'Create chapter',
          security: [{ bearerAuth: [] }],
          description: 'Teacher or admin.',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ChapterCreate' } } },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/content/chapters/{id}': {
        put: {
          tags: ['Content'],
          summary: 'Update chapter',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Content'],
          summary: 'Delete chapter',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/content/topics': {
        post: {
          tags: ['Content'],
          summary: 'Create topic',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TopicCreate' } } },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/exercises/topics/{topicId}/exercises': {
        get: {
          tags: ['Exercises'],
          summary: 'Exercises by topic',
          parameters: [
            { name: 'topicId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer', example: 1 } },
            { name: 'limit', in: 'query', schema: { type: 'integer', example: 10 } },
          ],
          responses: { '200': { description: 'Paginated exercises' } },
        },
      },
      '/api/exercises': {
        post: {
          tags: ['Exercises'],
          summary: 'Create exercise',
          security: [{ bearerAuth: [] }],
          description: 'Teacher.',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseCreate' } } },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/exercises/{exerciseId}': {
        put: {
          tags: ['Exercises'],
          summary: 'Update exercise',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Exercises'],
          summary: 'Delete exercise',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/exercises/{exerciseId}/submit': {
        post: {
          tags: ['Exercises'],
          summary: 'Submit answer (single exercise MCQ)',
          security: [{ bearerAuth: [] }],
          description: 'Student; `submittedAnswer` is option index.',
          parameters: [{ name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SubmitExerciseAnswer' } } },
          },
          responses: { '201': { description: 'Graded response' } },
        },
      },
      '/api/exercises/{exerciseId}/problems': {
        post: {
          tags: ['Exercises'],
          summary: 'Add exercise problem',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ExerciseProblemCreate' } } },
          },
          responses: { '201': { description: 'Problem created' } },
        },
      },
      '/api/exercises/{exerciseId}/problems/{problemId}': {
        put: {
          tags: ['Exercises'],
          summary: 'Update exercise problem',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'problemId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Exercises'],
          summary: 'Delete exercise problem',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'exerciseId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'problemId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/exercises/problems/{problemId}/submit': {
        post: {
          tags: ['Exercises'],
          summary: 'Submit exercise problem answer',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          parameters: [{ name: 'problemId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SubmitProblemAnswer' } } },
          },
          responses: { '201': { description: 'Graded' } },
        },
      },
      '/api/quizzes/topics/{topicId}/quizzes': {
        get: {
          tags: ['Quizzes'],
          summary: 'Quizzes by topic',
          parameters: [
            { name: 'topicId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Paginated quizzes (student may see attempt status when authorized)' } },
        },
      },
      '/api/quizzes': {
        post: {
          tags: ['Quizzes'],
          summary: 'Create quiz',
          security: [{ bearerAuth: [] }],
          description: 'Teacher.',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/QuizCreate' } } },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/quizzes/{quizId}': {
        get: {
          tags: ['Quizzes'],
          summary: 'Quiz detail with problems',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Quiz + problems' } },
        },
        put: {
          tags: ['Quizzes'],
          summary: 'Update quiz',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Quizzes'],
          summary: 'Delete quiz',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/quizzes/{quizId}/start': {
        post: {
          tags: ['Quizzes'],
          summary: 'Start attempt',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Attempt started / score row updated' } },
        },
      },
      '/api/quizzes/{quizId}/submit': {
        post: {
          tags: ['Quizzes'],
          summary: 'Submit attempt',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/QuizSubmit' } } },
          },
          responses: { '200': { description: 'Final score' } },
        },
      },
      '/api/quizzes/{quizId}/reset': {
        post: {
          tags: ['Quizzes'],
          summary: 'Reset attempt',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Reset' } },
        },
      },
      '/api/quizzes/{quizId}/problems': {
        post: {
          tags: ['Quizzes'],
          summary: 'Add quiz problem',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/QuizProblemCreate' } } },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/quizzes/{quizId}/problems/{problemId}': {
        put: {
          tags: ['Quizzes'],
          summary: 'Update quiz problem',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'quizId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'problemId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Quizzes'],
          summary: 'Delete quiz problem',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'quizId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'problemId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/quizzes/{quizId}/score': {
        get: {
          tags: ['Quizzes'],
          summary: 'Get quiz score',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          parameters: [{ name: 'quizId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Score' } },
        },
      },
      '/api/quizzes/problems/{problemId}/validate': {
        post: {
          tags: ['Quizzes'],
          summary: 'Validate single quiz answer',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'problemId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/SubmitProblemAnswer' } } },
          },
          responses: { '201': { description: 'Result' } },
        },
      },
      '/api/exams/papers/subjects/{subjectId}': {
        get: {
          tags: ['Exams'],
          summary: 'Exam papers by subject',
          parameters: [
            { name: 'subjectId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Papers' } },
        },
      },
      '/api/exams/papers/search': {
        get: {
          tags: ['Exams'],
          summary: 'Search papers',
          parameters: [
            { name: 'year', in: 'query', schema: { type: 'string' } },
            { name: 'title', in: 'query', schema: { type: 'string' } },
            { name: 'subjectId', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Results' } },
        },
      },
      '/api/exams/papers': {
        post: {
          tags: ['Exams'],
          summary: 'Create exam paper',
          security: [{ bearerAuth: [] }],
          description: 'Teacher or admin.',
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object' },
                example: { subjectId: EX.subjectId, year: 2019, title: 'National exit exam' },
              },
            },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/exams/papers/{paperId}': {
        put: {
          tags: ['Exams'],
          summary: 'Update exam paper',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'paperId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Exams'],
          summary: 'Delete exam paper',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'paperId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/exams/papers/{paperId}/questions': {
        get: {
          tags: ['Exams'],
          summary: 'Questions on paper',
          parameters: [
            { name: 'paperId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: { '200': { description: 'Questions' } },
        },
        post: {
          tags: ['Exams'],
          summary: 'Add exam question',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'paperId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: { type: 'object' },
                example: {
                  questionText: 'Sample MCQ',
                  choices: [{ text: 'A', value: 'A' }],
                  correctAnswer: 'A',
                  topic: EX.topicId,
                },
              },
            },
          },
          responses: { '201': { description: 'Created' } },
        },
      },
      '/api/exams/questions/search': {
        get: {
          tags: ['Exams'],
          summary: 'Search exam questions',
          parameters: [
            { name: 'subjectId', in: 'query', schema: { type: 'string' } },
            { name: 'chapterId', in: 'query', schema: { type: 'string' } },
            { name: 'topicId', in: 'query', schema: { type: 'string' } },
            { name: 'year', in: 'query', schema: { type: 'string' } },
            { name: 'q', in: 'query', schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Results' } },
        },
      },
      '/api/exams/questions/{questionId}': {
        put: {
          tags: ['Exams'],
          summary: 'Update exam question',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Exams'],
          summary: 'Delete exam question',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/exams/questions/{questionId}/validate': {
        post: {
          tags: ['Exams'],
          summary: 'Validate exam answer',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['submittedAnswer'],
                  properties: { submittedAnswer: { type: 'string' } },
                },
                example: { submittedAnswer: 'A' },
              },
            },
          },
          responses: { '200': { description: 'Result' } },
        },
      },
      '/api/answers': {
        post: {
          tags: ['Answers'],
          summary: 'Submit generic answer',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/GenericAnswerSubmit' } } },
          },
          responses: { '201': { description: 'Stored answer' } },
        },
      },
      '/api/issues': {
        post: {
          tags: ['Issues'],
          summary: 'Submit issue',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/IssueCreate' } } },
          },
          responses: { '201': { description: 'Created' } },
        },
        get: {
          tags: ['Issues'],
          summary: 'Issues for review',
          security: [{ bearerAuth: [] }],
          description: 'Teacher/admin; optional filters: status, issueType, studentId, topicId.',
          responses: { '200': { description: 'Issues' } },
        },
      },
      '/api/issues/me': {
        get: {
          tags: ['Issues'],
          summary: 'My issues',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Issues' } },
        },
      },
      '/api/issues/{issueId}/status': {
        put: {
          tags: ['Issues'],
          summary: 'Update issue status',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'issueId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/IssueStatusUpdate' } } },
          },
          responses: { '200': { description: 'Updated' } },
        },
      },
      '/api/bookmarks': {
        get: {
          tags: ['Bookmarks'],
          summary: 'List bookmarks',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Bookmarks' } },
        },
        post: {
          tags: ['Bookmarks'],
          summary: 'Add bookmark',
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/BookmarkCreate' } } },
          },
          responses: { '201': { description: 'Upserted bookmark' } },
        },
      },
      '/api/bookmarks/{bookmarkId}': {
        delete: {
          tags: ['Bookmarks'],
          summary: 'Remove bookmark',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'bookmarkId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Removed' } },
        },
      },
      '/api/questions': {
        post: {
          tags: ['Questions'],
          summary: 'Ask topic question',
          security: [{ bearerAuth: [] }],
          description: 'Student.',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/StudentQuestionCreate' } } },
          },
          responses: { '201': { description: 'Created' } },
        },
        get: {
          tags: ['Questions'],
          summary: 'List questions',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Questions' } },
        },
      },
      '/api/questions/{questionId}': {
        put: {
          tags: ['Questions'],
          summary: 'Update question',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['questionText'],
                  properties: { questionText: { type: 'string' } },
                },
                example: { questionText: 'Updated wording…' },
              },
            },
          },
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Questions'],
          summary: 'Delete question',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Deleted' } },
        },
        get: {
          tags: ['Questions'],
          summary: 'Question by id',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Question' } },
        },
      },
      '/api/questions/topics/{topicId}': {
        get: {
          tags: ['Questions'],
          summary: 'Questions for topic',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Questions' } },
        },
      },
      '/api/questions/search': {
        get: {
          tags: ['Questions'],
          summary: 'Search questions',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Results' } },
        },
      },
      '/api/questions/{questionId}/answers': {
        get: {
          tags: ['Questions'],
          summary: 'Answers for question',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Answers' } },
        },
        post: {
          tags: ['Questions'],
          summary: 'Teacher reply',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'questionId', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/TeacherAnswerCreate' } } },
          },
          responses: { '201': { description: 'Answer posted' } },
        },
      },
      '/api/questions/{questionId}/answers/{answerId}': {
        put: {
          tags: ['Questions'],
          summary: 'Update teacher answer',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'questionId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'answerId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Updated' } },
        },
        delete: {
          tags: ['Questions'],
          summary: 'Delete teacher answer',
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: 'questionId', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'answerId', in: 'path', required: true, schema: { type: 'string' } },
          ],
          responses: { '200': { description: 'Deleted' } },
        },
      },
      '/api/progress/subjects': {
        get: {
          tags: ['Progress'],
          summary: 'Subject progress',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Progress' } },
        },
      },
      '/api/progress/results': {
        get: {
          tags: ['Progress'],
          summary: 'Results summary',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Summary' } },
        },
      },
      '/api/progress/streak': {
        get: {
          tags: ['Progress'],
          summary: 'Learning streak',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Streak' } },
        },
      },
      '/api/progress/grades/{gradeLevel}': {
        get: {
          tags: ['Progress'],
          summary: 'Progress by grade',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'gradeLevel', in: 'path', required: true, schema: { type: 'string', example: '12' } }],
          responses: { '200': { description: 'Grade progress' } },
        },
      },
      '/api/progress/subjects/{subjectId}/chapters': {
        get: {
          tags: ['Progress'],
          summary: 'Chapter progress',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'subjectId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Chapters' } },
        },
      },
      '/api/progress/subjects/{subjectId}': {
        get: {
          tags: ['Progress'],
          summary: 'Progress for subject',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'subjectId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Progress' } },
        },
      },
      '/api/progress/topics/{topicId}/eligibility': {
        get: {
          tags: ['Progress'],
          summary: 'Topic completion eligibility',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Eligibility' } },
        },
      },
      '/api/progress/topics/{topicId}/complete': {
        post: {
          tags: ['Progress'],
          summary: 'Mark topic complete',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'topicId', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Completed' } },
        },
      },
      '/api/notifications': {
        get: {
          tags: ['Notifications'],
          summary: 'All notifications',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Notifications' } },
        },
      },
      '/api/notifications/unread': {
        get: {
          tags: ['Notifications'],
          summary: 'Unread notifications',
          security: [{ bearerAuth: [] }],
          responses: { '200': { description: 'Unread list' } },
        },
      },
      '/api/notifications/{id}/read': {
        put: {
          tags: ['Notifications'],
          summary: 'Mark read',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { '200': { description: 'Updated' } },
        },
      },
      '/api/ai/chat': {
        post: {
          tags: ['AI'],
          summary: 'AI tutor chat',
          security: [{ bearerAuth: [] }],
          description: 'Requires student role. Uses GEMINI_API_KEY configured on the server.',
          requestBody: {
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AiChatRequest' } } },
          },
          responses: { '200': { description: 'Assistant reply in data.answer' } },
        },
      },
    },
  };

  return spec;
}

module.exports = getOpenApiSpec;
