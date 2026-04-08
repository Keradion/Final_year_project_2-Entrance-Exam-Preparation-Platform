const express = require('express');
const subjectController = require('../controllers/subjectController');
const { authenticate, isAdmin, isTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * ==================================================================================
 * Subject Routes
 * ==================================================================================
 *
 * This file defines the API routes for managing subjects.
 *
 * - `authenticate`: Ensures that a user is logged in before they can access any of these routes.
 * - `isAdmin`: Ensures that only users with the 'admin' role can perform an action.
 * - `isTeacherOrAdmin`: Ensures that either a 'teacher' or an 'admin' can perform an action.
 *
 * ==================================================================================
 */

// PUBLIC ROUTE: Anyone can get the list of all subjects.
router.get('/', subjectController.getAllSubjects);

// PUBLIC ROUTE: Anyone can get a single subject by its ID.
router.get('/:id', subjectController.getSubjectById);

// ADMIN-ONLY ROUTES
router.post(
  '/',
  authenticate,
  isAdmin,
  subjectController.createSubject
);

router.put(
  '/:id',
  authenticate,
  isAdmin,
  subjectController.updateSubject
);

router.delete(
  '/:id',
  authenticate,
  isAdmin,
  subjectController.deleteSubject
);

router.put(
  '/:subjectId/assign-teacher/:teacherId',
  authenticate,
  isAdmin,
  subjectController.assignTeacherToSubject
);

module.exports = router;
