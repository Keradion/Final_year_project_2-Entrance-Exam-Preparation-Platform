// backend/src/queues/emailQueue.js
const { Queue } = require('bullmq');
const { connection } = require('../config/bullmq');

/**
 * What: This file defines the 'email' queue.
 * Why: A queue is a list of jobs waiting to be processed. By creating a specific queue for emails,
 *      we can manage all email-related background tasks in one place. This separation of concerns
 *      makes the system more organized and scalable. For example, we could later add other queues
 *      for different types of jobs (e.g., image processing, report generation) without them
 *      interfering with email sending.
 * How: We instantiate a new Queue object from BullMQ, giving it the name 'email'.
 *      We also pass the Redis connection configuration so BullMQ knows where to store the queue.
 *      The queue is then exported so it can be used by other parts of the application (like the EmailService)
 *      to add new jobs.
 */

const emailQueue = new Queue('email', { connection });

module.exports = emailQueue;
