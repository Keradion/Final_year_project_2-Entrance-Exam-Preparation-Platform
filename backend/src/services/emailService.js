// backend/src/services/emailService.js
const emailQueue = require('../queues/emailQueue');

/**
 * What: This service provides a simple and clean interface for sending emails.
 * Why: It abstracts away the details of the queueing system. Other parts of the application
 *      (like AuthService) don't need to know that BullMQ is being used underneath. They just
 *      need to call a simple function to send an email. This makes the code easier to maintain
 *      and test. If we ever decide to switch from BullMQ to another queueing system, we would
 *      only need to update this one file.
 * How: The `sendEmail` function takes the recipient, subject, and body of the email.
 *      It then adds a new job to the `emailQueue`. The job's 'data' is an object containing
 *      the email details. The worker will receive this data object when it processes the job.
 *      We also specify a job ID to prevent duplicate jobs if the same request is accidentally
 *      processed multiple times.
 */
class EmailService {
  async sendEmail(to, subject, body, html) {
    await emailQueue.add(
      'send-email',
      { to, subject, body, html },
      {
        // Attempt each job up to 3 times if it fails
        attempts: 3,
        // Wait 5 seconds before retrying a failed job
        backoff: {
          type: 'fixed',
          delay: 5000,
        },
      }
    );
  }
}

module.exports = new EmailService();
