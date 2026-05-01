const { Subject, Chapter, Topic, User, Progress } = require('../models');
const notificationService = require('./notificationService');
const emailService = require('./emailService');

const buildSubjectStudentFilter = (subject) => {
  const filter = {
    role: 'student',
    status: 'active',
  };

  if (subject.gradeLevel) {
    filter.gradeLevel = String(subject.gradeLevel);
  }

  if (subject.stream && subject.stream !== 'General') {
    filter.$or = [{ stream: subject.stream }, { stream: null }, { stream: '' }];
  }

  return filter;
};

const notifyStudentsOfSubjectUpdate = async (subjectId, title, message) => {
  const subject = await Subject.findById(subjectId).select('subjectName gradeLevel stream');
  if (!subject) {
    return;
  }

  const chapters = await Chapter.find({ subject: subjectId }).select('_id').lean();
  const chapterIds = chapters.map((chapter) => chapter._id);
  const topics = chapterIds.length
    ? await Topic.find({ chapter: { $in: chapterIds } }).select('_id').lean()
    : [];
  const topicIds = topics.map((topic) => topic._id);
  const progressStudentIds = topicIds.length
    ? await Progress.distinct('studentId', { topicId: { $in: topicIds } })
    : [];

  const students = await User.find({
    $or: [{ _id: { $in: progressStudentIds } }, buildSubjectStudentFilter(subject)],
  })
    .select('_id email firstName')
    .lean();

  await Promise.all(
    students.map(async (student) => {
      await notificationService.sendNotification(student._id, title, message);
      if (student.email) {
        await emailService.sendEmail(
          student.email,
          `${subject.subjectName} update`,
          `Hi ${student.firstName || 'Student'},\n\n${message}`
        );
      }
    })
  );
};

module.exports = {
  notifyStudentsOfSubjectUpdate,
};
