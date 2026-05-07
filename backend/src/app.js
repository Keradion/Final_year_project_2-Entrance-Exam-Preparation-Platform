const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const logger = require('./utils/logger');
const getOpenApiSpec = require('./docs/openapi');

const app = express();

const openApiDocument = getOpenApiSpec();

const configuredOrigins = String(process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const allowVercelPreviewOrigins = process.env.ALLOW_VERCEL_PREVIEW_ORIGINS !== 'false';

const isAllowedOrigin = (origin) => {
  const normalizedOrigin = String(origin || '').trim().replace(/\/$/, '');
  if (!normalizedOrigin) {
    return false;
  }

  if (configuredOrigins.includes(normalizedOrigin)) {
    return true;
  }

  if (!allowVercelPreviewOrigins) {
    return false;
  }

  try {
    const { hostname } = new URL(normalizedOrigin);
    return hostname.endsWith('.vercel.app');
  } catch (error) {
    return false;
  }
};

// Middleware (skip Helmet on Swagger UI so bundled scripts/styles are not blocked by CSP)
const helmetMiddleware = helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
});
app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api/docs')) {
    return next();
  }
  return helmetMiddleware(req, res, next);
});
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser and same-origin requests with no Origin header.
    if (!origin) {
      return callback(null, true);
    }

    if (isAllowedOrigin(origin)) {
      return callback(null, true);
    }

    logger.warn('Blocked by CORS policy', { origin });
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const CRITICAL_PATHS = [
  '/api/auth/register',
  '/api/auth/login',
  '/api/auth/request-password-reset',
  '/api/auth/reset-password',
  '/api/auth/change-password',
  '/api/auth/logout',
  '/api/admin/users',
  '/api/subjects',
  '/api/content',
];

const CRITICAL_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const isCriticalRequest = (req) =>
  CRITICAL_METHODS.has(req.method) &&
  CRITICAL_PATHS.some((pathPrefix) => req.originalUrl.startsWith(pathPrefix));

// Log only critical endpoint operations to keep noise low.
app.use((req, res, next) => {
  if (!isCriticalRequest(req)) {
    return next();
  }

  const startedAt = Date.now();

  res.on('finish', () => {
    const payload = {
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      userId: req.user?.id || null,
      ip: req.ip,
    };

    if (res.statusCode >= 500) {
      logger.error('Critical endpoint failed', payload);
    } else if (res.statusCode >= 400) {
      logger.warn('Critical endpoint rejected', payload);
    } else {
      logger.info('Critical endpoint succeeded', payload);
    }
  });

  return next();
});

// Health check endpoint (required by deployment platforms)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api/docs/openapi.json', (req, res) => {
  res.json(openApiDocument);
});

app.use(
  '/api/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: 'LMS API Docs',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      tryItOutEnabled: true,
    },
  })
);

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminUserRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/content', require('./routes/contentRoutes'));
app.use('/api/exercises', require('./routes/exerciseRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/answers', require('./routes/answerRoutes'));
app.use('/api/issues', require('./routes/issueRoutes'));
app.use('/api/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/questions', require('./routes/questionRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: 'Route not found',
    statusCode: 404,
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  const logMeta = {
    name: err.name,
    message: err.message || 'Unknown error',
    method: req.method,
    path: req.originalUrl,
    stack: err.stack,
  };

  const logAndRespond = (status, body) => {
    if (status >= 500) {
      logger.error('Unhandled application error', { ...logMeta, status });
    } else {
      logger.warn('Request rejected', { ...logMeta, status });
    }
    return res.status(status).json(body);
  };

  // Best-effort local error log; never fail request handling if file path is unavailable.
  try {
    const fs = require('fs');
    const logPath = path.join(__dirname, '../logs/validation_error.log');
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.appendFileSync(
      logPath,
      `[${new Date().toISOString()}] GLOBAL ERROR: ${err.name} - ${err.message}\n${JSON.stringify(
        err.errors || {},
        null,
        2
      )}\n`
    );
  } catch (logErr) {
    logger.warn('Failed to write validation_error.log', { message: logErr.message });
  }

  // Mongoose/ObjectId casting issues (e.g., invalid :id in URL)
  if (err.name === 'CastError') {
    return logAndRespond(400, {
      success: false,
      message: `Invalid ${err.path || 'id'} format.`,
      error: `Invalid ${err.path || 'id'} format.`,
      statusCode: 400,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Mongoose schema validation failures
  if (err.name === 'ValidationError' && err.errors) {
    const details = Object.values(err.errors).map((validationErr) => ({
      field: validationErr.path,
      message: validationErr.message,
    }));

    return logAndRespond(400, {
      success: false,
      message: 'Validation failed.',
      error: 'Validation failed.',
      statusCode: 400,
      details,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Mongo duplicate key errors
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || {})[0] || 'field';
    return logAndRespond(409, {
      success: false,
      message: `${duplicateField} already exists.`,
      error: `${duplicateField} already exists.`,
      statusCode: 409,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return logAndRespond(401, {
      success: false,
      message: 'Invalid or expired authentication token.',
      error: 'Invalid or expired authentication token.',
      statusCode: 401,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle custom error objects
  if (err.status && err.message) {
    return logAndRespond(err.status, {
      success: false,
      message: err.message,
      error: err.message,
      statusCode: err.status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';

  return logAndRespond(statusCode, {
    success: false,
    message,
    error: message,
    statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

module.exports = app;
