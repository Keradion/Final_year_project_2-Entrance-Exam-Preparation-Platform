const { Subject, User } = require('../models');

/**
 * ==================================================================================
 * Subject Service
 * ==================================================================================
 *
 * This service encapsulates the business logic for managing subjects. It acts as an
 * intermediary between the controllers and the database models, ensuring that all
 * subject-related operations are handled consistently.
 *
 * Why use a service layer?
 * - Separation of Concerns: It keeps the business logic separate from the API routing
 *   and request/response handling (which is the controller's job).
 * - Reusability: The same service methods can be called from different parts of the
 *   application (e.g., API controllers, background jobs, etc.).
 * - Testability: Business logic is easier to test in isolation when it's not tied
 *   directly to HTTP requests.
 *
 * ==================================================================================
 */
class SubjectService {
  /**
   * Creates a new subject.
   * FR-20: The system shall allow the administrator to create a subject.
   *
   * @param {object} subjectData - The data for the new subject.
   * @returns {Promise<object>} The newly created subject document.
   */
  async createSubject(subjectData) {
    const subject = new Subject(subjectData);
    await subject.save();
    return subject;
  }

  /**
   * Retrieves all subjects from the database.
   * Also populates the 'teacher' field to include basic teacher information.
   * FR-06: The system shall allow students to view and access all content uploaded under each subject.
   *
   * @returns {Promise<Array<object>>} A list of all subjects.
   */
  async getAllSubjects() {
    // .populate() is a powerful Mongoose feature that replaces the teacher's ObjectId
    // with the actual User document. We select only the 'firstName' and 'lastName'
    // to avoid exposing sensitive user data.
    return await Subject.find({}).populate('teacher', 'firstName lastName');
  }

  /**
   * Retrieves a single subject by its ID.
   *
   * @param {string} subjectId - The ID of the subject to retrieve.
   * @returns {Promise<object|null>} The subject document or null if not found.
   */
  async getSubjectById(subjectId) {
    return await Subject.findById(subjectId).populate('teacher', 'firstName lastName');
  }

  /**
   * Updates an existing subject's information.
   * FR-21: The system shall allow the administrator to update subject information.
   *
   * @param {string} subjectId - The ID of the subject to update.
   * @param {object} updateData - The data to update.
   * @returns {Promise<object|null>} The updated subject document.
   */
  async updateSubject(subjectId, updateData) {
    // findByIdAndUpdate is a convenient Mongoose method for finding a document by its ID
    // and applying updates.
    // { new: true } is an option that tells Mongoose to return the *updated* document
    // instead of the original one.
    const subject = await Subject.findByIdAndUpdate(subjectId, updateData, {
      new: true,
      runValidators: true, // Ensures that any updates still adhere to the schema's validation rules.
    });
    return subject;
  }

  /**
   * Deletes a subject from the database.
   * Note: In a real-world application, you might want to handle what happens to
   * the chapters and topics within this subject (e.g., delete them as well).
   * For now, we'll just delete the subject itself.
   *
   * @param {string} subjectId - The ID of the subject to delete.
   * @returns {Promise<object|null>} The result of the deletion operation.
   */
  async deleteSubject(subjectId) {
    return await Subject.findByIdAndDelete(subjectId);
  }

  /**
   * Assigns a teacher to a specific subject.
   * FR-22: The system shall allow the administrator to assign a teacher to a subject.
   *
   * @param {string} subjectId - The ID of the subject.
   * @param {string} teacherId - The ID of the teacher to assign.
   * @returns {Promise<object>} The updated subject with the new teacher assigned.
   */
  async assignTeacherToSubject(subjectId, teacherId) {
    // First, we verify that the user we are trying to assign actually exists
    // and has the 'teacher' role. This prevents assigning non-existent users or students.
    const teacher = await User.findOne({ _id: teacherId, role: 'teacher' });
    if (!teacher) {
      throw { status: 404, message: 'Teacher not found or user is not a teacher.' };
    }

    const subject = await this.getSubjectById(subjectId);
    if (!subject) {
      throw { status: 404, message: 'Subject not found.' };
    }

    subject.teacher = teacherId;
    await subject.save();
    return subject;
  }
}

// Export an instance of the class, so we can use it as a singleton across the application.
// This means we'll always be working with the same instance of SubjectService.
module.exports = new SubjectService();
