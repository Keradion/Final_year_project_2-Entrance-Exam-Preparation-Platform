const mongoose = require('mongoose');

async function connectDB() {
  try {
    const mongoURI = process.env.DATABASE_URL;
    
    if (!mongoURI) {
      throw new Error('DATABASE_URL is not defined in environment variables');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected successfully');
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
    process.exit(1);
  }
}

module.exports = {
  connectDB,
  disconnectDB,
};
