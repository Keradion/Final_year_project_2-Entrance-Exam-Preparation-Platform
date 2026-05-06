// backend/src/workers/emailWorker.js
const { Worker } = require('bullmq');
const nodemailer = require('nodemailer');
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

const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const hostV4 = process.env.EMAIL_HOST_IPV4;
  const port = Number(process.env.EMAIL_PORT || 587);
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host: hostV4 || host,
    port,
    secure: port === 465,
    tls: hostV4
      ? {
          servername: host,
        }
      : undefined,
    auth: {
      user,
      pass,
    },
  });
};

const emailWorker = new Worker(
  'email',
  async (job) => {
    const { to, subject, body, html } = job.data;
    const transporter = getTransporter();

    if (!transporter) {
      console.warn('❌ Email transport is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASSWORD.');
      return;
    }

    try {
      console.log(`✉️ Sending email to: ${to} (Subject: ${subject})`);
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to,
        subject,
        text: body,
        html,
      });
      console.log(`✅ Email sent successfully to: ${to}`);
    } catch (err) {
      console.error(`❌ Failed to send email to ${to}:`, err.message);
      throw err; // Re-throw to trigger BullMQ retry
    }
  },
  { connection }
);

emailWorker.on('completed', (job) => {
  console.log(`🏁 Job ${job.id} has completed!`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`💥 Job ${job.id} has failed with ${err.message}`);
});

module.exports = emailWorker;
