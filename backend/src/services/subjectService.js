
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
   * Invite and assign a teacher to a subject by email.
   * If the teacher does not exist, create them and send invite email.
   * If exists, assign and notify.
   */
  async inviteAndAssignTeacherByEmail(subjectId, email, firstName, lastName) {
    // Try to find teacher by email
    let teacher = await User.findOne({ email });
    let isNew = false;
    if (!teacher) {
      // Create teacher with random password
      const randomPassword = Math.random().toString(36).slice(-8);
      teacher = new User({
        firstName: firstName || 'Teacher',
        lastName: lastName || '',
        email,
        password: randomPassword,
        role: 'teacher',
        status: 'active',
      });
      await teacher.save();
      isNew = true;
    } else if (teacher.role !== 'teacher') {
      throw { status: 400, message: 'User exists but is not a teacher.' };
    }

    // Assign teacher to subject
    const subject = await this.getSubjectById(subjectId);
    if (!subject) throw { status: 404, message: 'Subject not found.' };
    subject.teacher = teacher._id;
    await subject.save();

    // Send email with login/register link (Non-blocking)
    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login`;
    let emailBody;
    if (isNew) {
      // Use the plain text randomPassword instead of teacher.password (which is now hashed)
      emailBody = `Hello,\n\nYou have been assigned to ${subject.subjectName} for Entrance Exam Prep.\n\nTemporary Password: ${randomPassword}\nPortal: ${loginUrl}`;
    } else {
      emailBody = `Hello,\n\nYou have been assigned to ${subject.subjectName} for Entrance Exam Prep.\n\nPortal: ${loginUrl}`;
    }

    const htmlBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background-color: #f8fafc; color: #0f172a;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #f8fafc; padding: 40px 0;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; border: 1px solid #f1f5f9; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); overflow: hidden;">
          <tr>
            <td style="padding: 40px 48px; text-align: center; border-bottom: 1px solid #f1f5f9;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #0f172a; letter-spacing: -0.025em;">Entrance Exam Prep</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 48px;">
              <p style="margin: 0 0 24px; font-size: 16px; line-height: 24px; color: #334155;">Hello <strong style="color: #0f172a;">${firstName || 'Teacher'}</strong>,</p>
              <p style="margin: 0 0 32px; font-size: 16px; line-height: 24px; color: #334155;">You have been assigned to the following subject for <strong>Entrance Exam Prep</strong>:</p>
              
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 32px; border: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px;">Assigned Subject</p>
                <p style="margin: 0; font-size: 20px; font-weight: 800; color: #0f172a;">${subject.subjectName}</p>
                ${isNew ? `
                  <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 8px;">Temporary Password</p>
                    <code style="font-size: 18px; font-weight: 700; color: #0f172a; background: #ffffff; padding: 4px 8px; border-radius: 4px; border: 1px solid #e2e8f0;">${randomPassword}</code>
                  </div>
                ` : ''}
              </div>

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <a href="${loginUrl}" style="display: inline-block; padding: 16px 32px; background-color: #0f172a; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; border-radius: 12px; text-transform: uppercase; letter-spacing: 0.05em;">Access Portal</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 48px; background-color: #f8fafc; text-align: center; border-top: 1px solid #f1f5f9;">
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">&copy; ${new Date().getFullYear()} Entrance Exam Prep. All rights reserved.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // We don't await this to avoid blocking the response if email service (Redis) is slow or down
    require('./emailService').sendEmail(
      teacher.email,
      'Subject Assignment Notification',
      emailBody,
      htmlBody
    ).catch(err => {
      console.error('Failed to queue assignment email:', err.message);
    });

    return { success: true, teacherId: teacher._id, subjectId: subject._id, isNew };
  }
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
    return await Subject.find({}).populate('teacher', 'firstName lastName email');
  }

  /**
   * Retrieves a single subject by its ID.
   *
   * @param {string} subjectId - The ID of the subject to retrieve.
   * @returns {Promise<object|null>} The subject document or null if not found.
   */
  async getSubjectById(subjectId) {
    return await Subject.findById(subjectId).populate('teacher', 'firstName lastName email');
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
