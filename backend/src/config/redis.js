const redis = require('redis');

let redisClient;

async function connectRedis() {
  // Check if Redis is disabled in environment
  if (process.env.REDIS_ENABLED === 'false') {
    console.log('⚠️  Redis is disabled');
    return null;
  }

  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            return new Error('Redis reconnect limit exceeded');
          }
          return Math.min(retries * 50, 500);
        },
      },
    });

    // Handle connection events
    redisClient.on('error', (err) => {
      console.warn('⚠️  Redis connection error - Redis will not be available');
    });

    redisClient.on('connect', () => {
      console.log('✓ Redis connected');
    });

    // Set a timeout for connection
    const connectionPromise = redisClient.connect();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Redis connection timeout')), 2000)
    );

    await Promise.race([connectionPromise, timeoutPromise]);
    return redisClient;
  } catch (error) {
    console.warn('⚠️  Redis unavailable - continuing without Redis');
    redisClient = null;
    return null;
  }
}

function getRedisClient() {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }
  return null;
}

async function disconnectRedis() {
  if (redisClient) {
    try {
      await redisClient.quit();
      console.log('Redis disconnected');
    } catch (err) {
      console.warn('Error disconnecting Redis:', err.message);
    }
  }
}

module.exports = {
  connectRedis,
  getRedisClient,
  disconnectRedis,
};
