require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../src/config/database');
const {
  User,
  Subject,
  Chapter,
  Topic,
  Concept,
  Video,
} = require('../src/models');

/**
 * ==================================================================================
 * Database Seeding Script
 * ==================================================================================
 *
 * This script populates the database with initial data for testing and development.
 * It clears existing data for the relevant collections and then creates a sample
 * course structure: Subject -> Chapter -> Topic -> Content.
 *
 * How to run:
 * 1. Make sure your MongoDB server is running.
 * 2. Make sure your .env file is correctly configured with the DATABASE_URL.
 * 3. From the 'backend' directory, run: `node scripts/seed.js`
 *
 * ==================================================================================
 */
const seedDatabase = async () => {
  try {
    // 1. Connect to the database
    await connectDB();
    console.log('Database connected successfully.');

    // 2. Clear existing data to prevent duplicates
    console.log('Clearing existing data...');
    await Subject.deleteMany({});
    await Chapter.deleteMany({});
    await Topic.deleteMany({});
    await Concept.deleteMany({});
    await Video.deleteMany({});
    // We will not delete users, but find or create them.
    console.log('Data cleared.');

    // 3. Create or find users
    console.log('Creating or finding users...');
    const admin = await User.findOneAndUpdate(
      { email: 'admin@example.com' },
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123', // The pre-save hook will hash this
        role: 'admin',
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const teacher = await User.findOneAndUpdate(
      { email: 'teacher.gebre@example.com' },
      {
        firstName: 'Gebre',
        lastName: 'Hagos',
        email: 'teacher.gebre@example.com',
        password: 'password123',
        role: 'teacher',
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const student = await User.findOneAndUpdate(
      { email: 'student@example.com' },
      {
        firstName: 'Student',
        lastName: 'User',
        email: 'student@example.com',
        password: 'password123',
        role: 'student',
        status: 'active',
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    console.log(`Users found or created: ${admin.email}, ${teacher.email}, ${student.email}`);

    // 4. Create the Subject
    console.log('Creating "Mathematics" subject...');
    const mathSubject = await Subject.create({
      subjectName: 'Mathematics',
      subjectDescription: 'A comprehensive course on Grade 12 mathematics, covering algebra, calculus, and more.',
      gradeLevel: 'Grade 12',
      teacher: teacher._id, // Assign Mr. Gebre as the teacher
    });
    console.log(`Subject created: ${mathSubject.subjectName} (ID: ${mathSubject._id})`);

    // 5. Create the Chapter
    console.log('Creating "Arithmetic" chapter...');
    const arithmeticChapter = await Chapter.create({
      chapterName: 'Chapter 1: Arithmetic',
      chapterDescription: 'Fundamentals of arithmetic, including sequences, series, and properties of numbers.',
      subject: mathSubject._id, // Link to the Mathematics subject
    });
    console.log(`Chapter created: ${arithmeticChapter.chapterName} (ID: ${arithmeticChapter._id})`);

    // 6. Create the Topic
    console.log('Creating "Definition of Arithmetic" topic...');
    const arithmeticTopic = await Topic.create({
      topicName: 'Definition of Arithmetic',
      topicDescription: 'Understanding the basic concepts and definitions of arithmetic sequences.',
      topicObjectives: [
        'Define an arithmetic sequence.',
        'Identify the common difference.',
        'Find the nth term of a sequence.',
      ],
      chapter: arithmeticChapter._id, // Link to the Arithmetic chapter
    });
    console.log(`Topic created: ${arithmeticTopic.topicName} (ID: ${arithmeticTopic._id})`);

    // 7. Add Content to the Topic
    console.log('Adding content to the topic...');
    const concept = await Concept.create({
      content: '<h1>Definition of Arithmetic</h1><p>An arithmetic sequence is a sequence of numbers such that the difference between the consecutive terms is constant. This constant difference is called the <strong>common difference (d)</strong>.</p><p>For example, the sequence 5, 7, 9, 11, 13, 15, ... is an arithmetic sequence with a common difference of 2.</p>',
      topic: arithmeticTopic._id,
    });
    console.log(`  - Concept page added (ID: ${concept._id})`);

    const video = await Video.create({
      videoUrl: 'https://www.youtube.com/watch?v=IwW0GJWKH98',
      videoDuration: 545, // Example duration in seconds
      topic: arithmeticTopic._id,
    });
    console.log(`  - Video added (ID: ${video._id})`);

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    // 8. Disconnect from the database
    mongoose.disconnect();
    console.log('Database connection closed.');
  }
};

// Run the seed function
seedDatabase();
