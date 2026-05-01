const Exercise = require('../models/Exercise');
const ExerciseProblem = require('../models/ExerciseProblem');
const Topic = require('../models/Topic');
const Chapter = require('../models/Chapter');
const Answer = require('../models/Answer');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');
const { notifyStudentsOfSubjectUpdate } = require('../services/contentNotificationService');

const getRequester = (req) => ({
  id: req.user?.id || req.user?._id?.toString(),
  role: req.user?.role,
});

const getSubjectIdForTopic = async (topicId) => {
  const topic = await Topic.findById(topicId).select('chapter topicName').lean();
  if (!topic?.chapter) {
    return null;
  }

  const chapter = await Chapter.findById(topic.chapter).select('subject').lean();
  return chapter?.subject || null;
};

// @desc    Create an exercise
// @route   POST /api/exercises
// @access  Private (Teacher)
exports.createExercise = asyncHandler(async (req, res, next) => {
  const { topic: topicId, title, description, question, options, correctAnswer, hint, difficulty } = req.body;

  const topic = await Topic.findById(topicId);
  if (!topic) {
    return next(new ErrorResponse(`Topic not found with id of ${topicId}`, 404));
  }

  const exercise = await Exercise.create({
    topic: topicId,
    title,
    description,
    question,
    options,
    correctAnswer,
    hint,
    difficulty,
    createdBy: req.user.id,
  });

  const subjectId = await getSubjectIdForTopic(topicId);
  if (subjectId) {
    await notifyStudentsOfSubjectUpdate(
      subjectId,
      'New exercise available',
      `A new practice exercise "${exercise.title}" was added.`
    );
  }

  res.status(201).json({
    success: true,
    data: exercise
  });
});

// @desc    Add a problem to an exercise
// @route   POST /api/exercises/:exerciseId/problems
// @access  Private (Teacher)
exports.addExerciseProblem = asyncHandler(async (req, res, next) => {
  const { exerciseId } = req.params;
  req.body.exerciseId = exerciseId;

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found with id of ${exerciseId}`, 404));
  }

  // Make sure user is exercise owner
  if (exercise.createdBy.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a problem to exercise ${exercise._id}`, 401));
  }

  const problem = await ExerciseProblem.create(req.body);

  res.status(201).json({
    success: true,
    data: problem,
  });
});

// @desc    Update an exercise
// @route   PUT /api/exercises/:exerciseId
// @access  Private (Teacher/Admin)
exports.updateExercise = asyncHandler(async (req, res, next) => {
  const { exerciseId } = req.params;
  const { id: requesterId, role } = getRequester(req);

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found with id of ${exerciseId}`, 404));
  }

  if (role === 'teacher' && exercise.createdBy.toString() !== requesterId) {
    return next(new ErrorResponse('Not authorized to update this exercise', 403));
  }

  if (req.body.topic) {
    const topic = await Topic.findById(req.body.topic);
    if (!topic) {
      return next(new ErrorResponse(`Topic not found with id of ${req.body.topic}`, 404));
    }
  }

  const allowedUpdates = ['title', 'description', 'question', 'options', 'correctAnswer', 'hint', 'difficulty', 'topic'];
  allowedUpdates.forEach(update => {
    if (req.body[update] !== undefined) {
      exercise[update] = req.body[update];
    }
  });
  
  await exercise.save();

  const subjectId = await getSubjectIdForTopic(exercise.topic);
  if (subjectId) {
    await notifyStudentsOfSubjectUpdate(
      subjectId,
      'Exercise updated',
      `Practice exercise "${exercise.title}" was updated.`
    );
  }

  res.status(200).json({
    success: true,
    data: exercise,
  });
});

// @desc    Delete an exercise
// @route   DELETE /api/exercises/:exerciseId
// @access  Private (Teacher/Admin)
exports.deleteExercise = asyncHandler(async (req, res, next) => {
  const { exerciseId } = req.params;
  const { id: requesterId, role } = getRequester(req);

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found with id of ${exerciseId}`, 404));
  }

  if (role === 'teacher' && exercise.createdBy.toString() !== requesterId) {
    return next(new ErrorResponse('Not authorized to delete this exercise', 403));
  }

  await ExerciseProblem.deleteMany({ exerciseId });
  await exercise.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Exercise deleted successfully',
  });
});

// @desc    Update an exercise problem
// @route   PUT /api/exercises/:exerciseId/problems/:problemId
// @access  Private (Teacher/Admin)
exports.updateExerciseProblem = asyncHandler(async (req, res, next) => {
  const { exerciseId, problemId } = req.params;
  const { id: requesterId, role } = getRequester(req);

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found with id of ${exerciseId}`, 404));
  }

  if (role === 'teacher' && exercise.createdBy.toString() !== requesterId) {
    return next(new ErrorResponse('Not authorized to update this exercise problem', 403));
  }

  const problem = await ExerciseProblem.findOne({ _id: problemId, exerciseId });
  if (!problem) {
    return next(new ErrorResponse(`Exercise problem not found with id of ${problemId}`, 404));
  }

  Object.assign(problem, req.body);
  await problem.save();

  res.status(200).json({
    success: true,
    data: problem,
  });
});

// @desc    Delete an exercise problem
// @route   DELETE /api/exercises/:exerciseId/problems/:problemId
// @access  Private (Teacher/Admin)
exports.deleteExerciseProblem = asyncHandler(async (req, res, next) => {
  const { exerciseId, problemId } = req.params;
  const { id: requesterId, role } = getRequester(req);

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found with id of ${exerciseId}`, 404));
  }

  if (role === 'teacher' && exercise.createdBy.toString() !== requesterId) {
    return next(new ErrorResponse('Not authorized to delete this exercise problem', 403));
  }

  const deleted = await ExerciseProblem.findOneAndDelete({ _id: problemId, exerciseId });
  if (!deleted) {
    return next(new ErrorResponse(`Exercise problem not found with id of ${problemId}`, 404));
  }

  res.status(200).json({
    success: true,
    message: 'Exercise problem deleted successfully',
  });
});

// @desc    Get exercises by topic
// @route   GET /api/topics/:topicId/exercises
// @access  Public
exports.getExercisesByTopic = asyncHandler(async (req, res, next) => {
  const { topicId } = req.params;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const skip = (page - 1) * limit;

  const topic = await Topic.findById(topicId);
  if (!topic) {
    return next(new ErrorResponse(`Topic not found with id of ${topicId}`, 404));
  }

  const filter = { topic: topicId };
  const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
  const [exercises, total] = await Promise.all([
    Exercise.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit),
    Exercise.countDocuments(filter),
  ]);
  exercises.sort((a, b) => {
    const byDifficulty = (difficultyOrder[a.difficulty] || 99) - (difficultyOrder[b.difficulty] || 99);
    if (byDifficulty !== 0) return byDifficulty;
    return new Date(a.createdAt || a.created_at || 0) - new Date(b.createdAt || b.created_at || 0);
  });

  res.status(200).json({
    success: true,
    count: exercises.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
    data: exercises,
  });
});

// @desc    Submit an answer for an exercise problem
// @route   POST /api/exercises/problems/:problemId/submit
// @access  Private (Student)
exports.submitProblemAnswer = asyncHandler(async (req, res, next) => {
  const { problemId } = req.params;
  const { submittedAnswer } = req.body;
  const studentId = req.user.id || req.user._id;

  const problem = await ExerciseProblem.findById(problemId);
  if (!problem) {
    return next(new ErrorResponse(`Exercise problem not found with id of ${problemId}`, 404));
  }

  const isCorrect = problem.correctAnswer === submittedAnswer;

  const answer = await Answer.create({
    student: studentId,
    question: problemId,
    questionModel: 'ExerciseProblem',
    submittedAnswer,
    isCorrect,
  });

  res.status(201).json({
    success: true,
    isCorrect,
    correctAnswer: problem.correctAnswer,
    answerExplanation: problem.answerExplanation,
    answer,
  });
});

// @desc    Submit an answer for a direct exercise
// @route   POST /api/exercises/:exerciseId/submit
// @access  Private (Student)
exports.submitExerciseAnswer = asyncHandler(async (req, res, next) => {
  const { exerciseId } = req.params;
  const { submittedAnswer } = req.body;
  const studentId = req.user.id || req.user._id;

  const exercise = await Exercise.findById(exerciseId);
  if (!exercise) {
    return next(new ErrorResponse(`Exercise not found with id of ${exerciseId}`, 404));
  }

  const answerIndex = Number(submittedAnswer);
  if (!Number.isInteger(answerIndex) || answerIndex < 0 || answerIndex >= exercise.options.length) {
    return next(new ErrorResponse('A valid submittedAnswer option index is required', 400));
  }

  const isCorrect = exercise.correctAnswer === answerIndex;
  const answer = await Answer.create({
    student: studentId,
    question: exerciseId,
    questionModel: 'Exercise',
    submittedAnswer: String(answerIndex),
    isCorrect,
  });

  res.status(201).json({
    success: true,
    isCorrect,
    correctAnswer: exercise.correctAnswer,
    correctOption: exercise.options[exercise.correctAnswer],
    hint: exercise.hint,
    answer,
  });
});
