const path = require('path');

require('dotenv').config({ path: path.resolve(__dirname, '../.env'), override: true });
const app = require('./app');
const { connectDB, disconnectDB } = require('./config/database');
const { connectRedis, disconnectRedis } = require('./config/redis');

if (process.env.REDIS_ENABLED !== 'false') {
  try {
    require('./workers/emailWorker'); // Import to start the worker when Redis is available.
  } catch (error) {
    console.warn('⚠️  Email worker could not start:', error.message);
  }
}

const PORT = 5000;

async function start() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Connect to Redis (optional - don't block startup if unavailable)
    await connectRedis().catch((err) => {
      console.warn('⚠️  Redis connection failed - continuing without Redis');
    });

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n✓ Server running on http://localhost:${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('\n✓ SIGTERM received, shutting down gracefully...');
  await disconnectDB();
  await disconnectRedis();
  process.exit(0);
});

start();
