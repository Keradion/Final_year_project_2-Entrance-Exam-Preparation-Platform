const { getRedisClient } = require('../config/redis');

/**
 * Middleware to limit login attempts.
 * If a user fails 3 times, they are blocked for 30 seconds.
 */
const loginRateLimiter = async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next();

  const redisClient = getRedisClient();
  // If Redis is not available, bypass the rate limiter
  if (!redisClient) return next();

  const key = `login_attempts:${email}`;
  
  try {
    const attempts = await redisClient.get(key);

    if (attempts && parseInt(attempts) >= 3) {
      const ttl = await redisClient.ttl(key);
      if (ttl > 0) {
        return res.status(429).json({
          success: false,
          message: `Too many failed attempts. Please try again in ${ttl} seconds.`,
        });
      }
    }
    next();
  } catch (err) {
    console.error('Rate limiter error:', err);
    next();
  }
};

module.exports = loginRateLimiter;
