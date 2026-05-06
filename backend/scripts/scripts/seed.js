require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const { connectDB } = require('../../src/config/database');
const {
  User,
  Subject,
  Chapter,
  Topic,
  Concept,
  Video,
} = require('../../src/models');

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
 * 3. From the 'backend' directory, run: `npm run seed`
 *
 * ==================================================================================
 */
const seedDatabase = async () => {
  try {
    const findOrCreateUser = async (email, userData) => {
      let user = await User.findOne({ email });

      if (!user) {
        user = new User(userData);
        await user.save();
        return user;
      }

      Object.assign(user, userData);
      await user.save();
      return user;
    };

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
    // Default admin
    const admin = await findOrCreateUser(
      'admin@example.com',
      {
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@example.com',
        password: 'password123', // The pre-save hook will hash this
        role: 'admin',
        status: 'active',
      }
    );

    // Custom admin for entranceadmin@gmail.com
    const customAdmin = await findOrCreateUser(
      'entranceadmin@gmail.com',
      {
        firstName: 'Entrance',
        lastName: 'Admin',
        email: 'entranceadmin@gmail.com',
        password: '12345Qwert@', // The pre-save hook will hash this
        role: 'admin',
        status: 'active',
      }
    );

    const teacher = await findOrCreateUser(
      'teacher.gebre@example.com',
      {
        firstName: 'Gebre',
        lastName: 'Hagos',
        email: 'teacher.gebre@example.com',
        password: 'password123',
        role: 'teacher',
        status: 'active',
      }
    );

    const student = await findOrCreateUser(
      'dan@gmail.com',
      {
        firstName: 'Dan',
        lastName: 'User',
        email: 'dan@gmail.com',
        password: '12345Qwert@',
        role: 'student',
        status: 'active',
        stream: 'Natural',
        gradeLevel: '12',
      }
    );
    console.log(`Users found or created: ${admin.email}, ${customAdmin.email}, ${teacher.email}, ${student.email}`);


    // 4. Create the Mathematics Subject
    console.log('Creating "Mathematics" subject...');
    const mathSubject = await Subject.create({
      subjectName: 'Mathematics',
      subjectDescription: 'A comprehensive course on Grade 12 mathematics, covering algebra, calculus, and more.',
      gradeLevel: 'Grade 12',
      teacher: teacher._id,
    });
    console.log(`Subject created: ${mathSubject.subjectName} (ID: ${mathSubject._id})`);

    // Mathematics Chapter, Topic, Content
    const arithmeticChapter = await Chapter.create({
      chapterName: 'Chapter 1: Arithmetic',
      chapterDescription: 'Fundamentals of arithmetic, including sequences, series, and properties of numbers.',
      subject: mathSubject._id,
    });
    const arithmeticTopic = await Topic.create({
      topicName: 'Definition of Arithmetic',
      topicDescription: 'Understanding the basic concepts and definitions of arithmetic sequences.',
      topicObjectives: [
        'Define an arithmetic sequence.',
        'Identify the common difference.',
        'Find the nth term of a sequence.',
      ],
      chapter: arithmeticChapter._id,
    });
    await Concept.create({
      title: 'Definition of Arithmetic',
      content: '<h1>Definition of Arithmetic</h1><p>An arithmetic sequence is a sequence of numbers such that the difference between the consecutive terms is constant. This constant difference is called the <strong>common difference (d)</strong>.</p><p>For example, the sequence 5, 7, 9, 11, 13, 15, ... is an arithmetic sequence with a common difference of 2.</p>',
      topic: arithmeticTopic._id,
    });
    await Video.create({
      title: 'Definition of Arithmetic',
      videoUrl: 'https://www.youtube.com/watch?v=IwW0GJWKH98',
      videoDuration: 545,
      topic: arithmeticTopic._id,
    });
    console.log('Mathematics subject, chapter, topic, and content created.');

    // 5. Create the Chemistry Subject
    console.log('Creating "Chemistry" subject...');
    const chemistrySubject = await Subject.create({
      subjectName: 'Chemistry',
      subjectDescription: 'A comprehensive course on Grade 12 chemistry, covering atomic structure, chemical bonding, and more.',
      gradeLevel: 'Grade 12',
      teacher: teacher._id,
    });
    console.log(`Subject created: ${chemistrySubject.subjectName} (ID: ${chemistrySubject._id})`);

    // Chemistry Chapter, Topic, Content
    const atomicStructureChapter = await Chapter.create({
      chapterName: 'Chapter 1: Atomic Structure',
      chapterDescription: 'Introduction to atomic theory, subatomic particles, and atomic models.',
      subject: chemistrySubject._id,
    });
    const atomicTheoryTopic = await Topic.create({
      topicName: 'Atomic Theory',
      topicDescription: 'Explore the development of atomic theory and the structure of atoms.',
      topicObjectives: [
        'Describe the historical development of atomic theory.',
        'Identify subatomic particles and their properties.',
        'Explain modern atomic models.',
      ],
      chapter: atomicStructureChapter._id,
    });
    await Concept.create({
      title: 'Atomic Theory',
      content: '<h1>Atomic Theory</h1><p>The atomic theory explains the nature of matter by stating that matter is composed of discrete units called atoms. The modern atomic theory began with John Dalton in the early 19th century and has evolved to include subatomic particles and quantum mechanics.</p>',
      topic: atomicTheoryTopic._id,
    });
    await Video.create({
      title: 'Atomic Theory',
      videoUrl: 'https://www.youtube.com/watch?v=thnDxFdkzZs',
      videoDuration: 600,
      topic: atomicTheoryTopic._id,
    });
    console.log('Chemistry subject, chapter, topic, and content created.');

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
