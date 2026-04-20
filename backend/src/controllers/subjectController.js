
const subjectService = require('../services/subjectService');
const mongoose = require('mongoose');

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

/**
 * ==================================================================================
 * Subject Controller
 * ==================================================================================
 *
 * This controller is responsible for handling incoming HTTP requests related to subjects.
 * Its primary job is to receive requests, call the appropriate service method to
 * execute the business logic, and then send back an HTTP response.
 *
 * Why use a controller?
 * - It acts as the bridge between the web layer (HTTP requests) and the business logic
 *   layer (services).
 * - It keeps the code organized. All subject-related request handling is in one place.
 * - It handles the "web stuff": parsing request bodies, handling URL parameters (like :id),
 *   and sending back status codes (like 200 OK, 201 Created, 404 Not Found).
 *
 * ==================================================================================
 */
class SubjectController {

    /**
     * Handles inviting and assigning a teacher to a subject by email.
     * If the teacher does not exist, creates the user and sends an invite email.
     * If the teacher exists, assigns and notifies them.
     */
    async inviteAndAssignTeacherByEmail(req, res, next) {
      try {
        const { subjectId } = req.params;
        const { email, firstName, lastName } = req.body;
        if (!email) {
          return res.status(400).json({ success: false, message: 'Email is required.' });
        }
        const result = await subjectService.inviteAndAssignTeacherByEmail(subjectId, email, firstName, lastName);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  /**
   * Handles the request to create a new subject.
   * Expected to be used by an administrator.
   */
  async createSubject(req, res, next) {
    try {
      if (!req.body?.subjectName || !req.body?.gradeLevel) {
        return res.status(400).json({
          success: false,
          message: 'subjectName and gradeLevel are required.',
        });
      }

      // The request body (req.body) contains the data sent from the client.
      const subject = await subjectService.createSubject(req.body);
      // Send a 201 Created status code, which is the standard for a successful creation.
      res.status(201).json(subject);
    } catch (error) {
      // If anything goes wrong, pass the error to the global error handler.
      next(error);
    }
  }

  /**
   * Handles the request to get all subjects.
   * This is a public endpoint, accessible to all users.
   */
  async getAllSubjects(req, res, next) {
    try {
      const subjects = await subjectService.getAllSubjects();
      res.status(200).json(subjects);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to get a single subject by its ID.
   */
  async getSubjectById(req, res, next) {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subject id format.',
        });
      }

      // URL parameters are available in req.params.
      const subject = await subjectService.getSubjectById(req.params.id);
      if (!subject) {
        // If the service returns null, it means the subject wasn't found.
        return res.status(404).json({ success: false, message: 'Subject not found' });
      }
      res.status(200).json(subject);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to update a subject.
   * Expected to be used by an administrator.
   */
  async updateSubject(req, res, next) {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subject id format.',
        });
      }

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Request body is required for update.',
        });
      }

      const subject = await subjectService.updateSubject(req.params.id, req.body);
      if (!subject) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
      }
      res.status(200).json(subject);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to delete a subject.
   * Expected to be used by an administrator.
   */
  async deleteSubject(req, res, next) {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subject id format.',
        });
      }

      const subject = await subjectService.deleteSubject(req.params.id);
      if (!subject) {
        return res.status(404).json({ success: false, message: 'Subject not found' });
      }
      // A 204 No Content response is standard for a successful deletion where no body is sent back.
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles the request to assign a teacher to a subject.
   * Expected to be used by an administrator.
   */
  async assignTeacherToSubject(req, res, next) {
    try {
      const { subjectId, teacherId } = req.params;

      if (!isValidObjectId(subjectId) || !isValidObjectId(teacherId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid subjectId or teacherId format.',
        });
      }

      const subject = await subjectService.assignTeacherToSubject(subjectId, teacherId);
      res.status(200).json(subject);
    } catch (error) {
      // The service layer throws errors with status codes, which will be handled
      // by the global error handler.
      next(error);
    }
  }
}

// Export a singleton instance of the controller.
module.exports = new SubjectController();
