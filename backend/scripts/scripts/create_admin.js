require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../../src/config/database');
const { User } = require('../../src/models');

const createAdmin = async () => {
  try {
    await connectDB();
    console.log('Database connected.');

    const adminEmail = 'testadmin@example.com';
    const adminPassword = 'Password123!';

    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      console.log(`User ${adminEmail} already exists. Updating to admin...`);
      existingUser.role = 'admin';
      existingUser.status = 'active';
      await existingUser.save();
    } else {
      console.log(`Creating new admin user: ${adminEmail}`);
      await User.create({
        firstName: 'Test',
        lastName: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        status: 'active',
        stream: 'Natural',
        isEmailVerified: true
      });
    }

    console.log('\n✅ Admin account created/updated successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
};

createAdmin();
