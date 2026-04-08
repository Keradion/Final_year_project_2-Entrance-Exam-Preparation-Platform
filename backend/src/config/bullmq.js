// backend/src/config/bullmq.js

/**
 * What: This file configures the connection to Redis for BullMQ.
 * Why: BullMQ uses Redis as a message broker to store queues and the jobs within them.
 *      Both the main application (which adds jobs) and the background worker (which processes jobs)
 *      need to connect to the same Redis instance to communicate.
 * How: We define a standard connection object with the host and port of the Redis server.
 *      This configuration can be easily extended to include passwords or other options
 *      by sourcing them from environment variables for better security and flexibility.
 */

const connection = {
  host: process.env.REDIS_HOST || '127.0.0.1', // Default to localhost if not specified
  port: process.env.REDIS_PORT || 6379,       // Default Redis port
};

module.exports = { connection };
