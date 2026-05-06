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

function buildConnection() {
  const redisUrl = process.env.REDIS_URL;
  if (redisUrl) {
    const parsed = new URL(redisUrl);
    const connection = {
      host: parsed.hostname,
      port: Number(parsed.port || 6379),
    };

    if (parsed.username) {
      connection.username = decodeURIComponent(parsed.username);
    }
    if (parsed.password) {
      connection.password = decodeURIComponent(parsed.password);
    }
    if (parsed.protocol === 'rediss:') {
      connection.tls = {};
    }

    return connection;
  }

  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
  };
}

const connection = buildConnection();

module.exports = { connection };
