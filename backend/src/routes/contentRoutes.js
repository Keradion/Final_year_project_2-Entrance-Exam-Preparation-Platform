const express = require('express');
const contentController = require('../controllers/contentController');
const { authenticate, isTeacherOrAdmin } = require('../middleware/auth');

const router = express.Router();

/**
 * ==================================================================================
 * Content Routes
 * ==================================================================================
 *
 * This file defines the API routes for the content hierarchy (Chapters, Topics, etc.).
 * Routes are protected based on user roles to ensure that only authorized users
 * (teachers or admins) can manage content, while all users can view it.
 *
 * ==================================================================================
 */

// ----------------------------------------------------------------------------------
// Public Routes (for viewing content)
// ----------------------------------------------------------------------------------

// Get all chapters for a specific subject
router.get('/subjects/:subjectId/chapters', contentController.getChaptersBySubject);

// Get all topics for a specific chapter
router.get('/chapters/:chapterId/topics', contentController.getTopicsByChapter);

// Search for topics by title
router.get('/topics/search', contentController.searchTopics);

// Get a specific topic by ID
router.get('/topics/:topicId', contentController.getTopicById);

// Get all concepts for a specific topic
router.get('/topics/:topicId/concepts', contentController.getConceptsByTopic);

// Get a specific concept by ID
router.get('/concepts/:conceptId', contentController.getConceptById);

// Get all videos for a specific topic
router.get('/topics/:topicId/videos', contentController.getVideosByTopic);

// Get a specific video by ID
router.get('/videos/:videoId', contentController.getVideoById);


// ----------------------------------------------------------------------------------
// Protected Routes (for managing content - Teacher or Admin)
// ----------------------------------------------------------------------------------

// Use `authenticate` and `isTeacherOrAdmin` middleware for all subsequent routes in this file.
router.use(authenticate, isTeacherOrAdmin);

// Create a new chapter
router.post('/chapters', contentController.createChapter);

// Create a new topic
router.post('/topics', contentController.createTopic);

// Update a topic
router.put('/topics/:topicId', contentController.updateTopic);

// Delete a topic
router.delete('/topics/:topicId', contentController.deleteTopic);

// Add a concept to a topic
router.post('/topics/:topicId/concepts', contentController.addConceptToTopic);

// Update a concept
router.put('/concepts/:conceptId', contentController.updateConcept);

// Delete a concept
router.delete('/concepts/:conceptId', contentController.deleteConcept);

// Add a video to a topic
router.post('/topics/:topicId/videos', contentController.addVideoToTopic);

// Update a video
router.put('/videos/:videoId', contentController.updateVideo);

// Delete a video
router.delete('/videos/:videoId', contentController.deleteVideo);

// Note: Routes for updating and deleting content would be added here as well,
// following the same pattern (e.g., router.put('/chapters/:id', ...)).

module.exports = router;
