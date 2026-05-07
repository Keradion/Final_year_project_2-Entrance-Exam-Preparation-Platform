// backend/src/services/emailService.js
const nodemailer = require('nodemailer');

const sendViaBrevoApi = async (to, subject, body, html) => {
  const apiKey = process.env.BREVO_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  if (!apiKey || !fromEmail) {
    return false;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: fromEmail },
      to: [{ email: to }],
      subject,
      textContent: body,
      htmlContent: html,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error: ${response.status} ${errorBody}`);
  }

  return true;
};

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

const sendDirectEmail = async (to, subject, body, html) => {
  if (process.env.BREVO_API_KEY) {
    await sendViaBrevoApi(to, subject, body, html);
    return;
  }

  const transporter = getTransporter();

  if (!transporter) {
    throw new Error('Email transport is not configured');
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: body,
    html,
  });
};

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
  async sendEmail(to, subject, body, html, options = {}) {
    if (options.immediate || process.env.REDIS_ENABLED === 'false') {
      await sendDirectEmail(to, subject, body, html);
      return;
    }

    try {
      const emailQueue = require('../queues/emailQueue');
      await emailQueue.add(
        'send-email',
        { to, subject, body, html },
        {
          attempts: 3,
          backoff: {
            type: 'fixed',
            delay: 5000,
          },
        }
      );
    } catch (_err) {
      await sendDirectEmail(to, subject, body, html);
    }
  }
}

module.exports = new EmailService();
