// backend/src/workers/emailWorker.js
const { Worker } = require('bullmq');
const { connection } = require('../config/bullmq');

/**
 * What: This file defines the worker that processes jobs from the 'email' queue.
 * Why: A worker is a background process that listens for and executes jobs from a queue.
 *      This is crucial for tasks that shouldn't block the main application thread, like sending an email,
 *      which can be slow due to network latency. By offloading this to a worker, the user gets a
 *      fast response from the API, and the email is sent asynchronously.
 * How: We create a new Worker instance, telling it to connect to the 'email' queue.
 *      The second argument is an async function that contains the logic for processing a job.
 *      In this simulation, the worker's job is to log the email details to the console.
 *      In a real application, this is where you would integrate with an email sending service
 *      like SendGrid, Mailgun, or Nodemailer.
 *      We also add event listeners to log the worker's status, which is helpful for debugging.
 */

const emailWorker = new Worker(
  'email',
  async (job) => {
    const { to, subject, body } = job.data;
    console.log('--- Sending Email ---');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);
    console.log('--- Email Sent (Simulated) ---');
    // In a real implementation, you would use a service like Nodemailer to send the email.
    // For example: await emailService.send(to, subject, body);
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.log(`Job ${job.id} has failed with ${err.message}`);
});

module.exports = emailWorker;
