const { User, Topic, Chapter, Subject, Concept, Video, Exercise, Quiz, QuizProblem, ExamQuestion } = require('../models');
const geminiService = require('../services/geminiService');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errors');

const summarizeTopicResources = async (topicId, page) => {
  if (!topicId) return '';

  const sections = [];
  if (!page || page === 'concept') {
    const concepts = await Concept.find({ topic: topicId }).select('title content').limit(5).lean();
    if (concepts.length) {
      sections.push(`Concepts:\n${concepts.map((c) => `- ${c.title}: ${String(c.content || '').slice(0, 400)}`).join('\n')}`);
    }
  }

  if (!page || page === 'video') {
    const videos = await Video.find({ topic: topicId }).select('title videoUrl videoDuration').limit(5).lean();
    if (videos.length) {
      sections.push(`Videos:\n${videos.map((video) => {
        const duration = video.videoDuration ? ` (${Math.round(video.videoDuration / 60)} min)` : '';
        return `- ${video.title || 'Untitled video'}${duration}: ${video.videoUrl}`;
      }).join('\n')}`);
    }
  }

  if (!page || page === 'exercise') {
    const exercises = await Exercise.find({ topic: topicId }).select('title question options difficulty').limit(5).lean();
    if (exercises.length) {
      sections.push(`Exercises:\n${exercises.map((ex) => `- ${ex.title}: ${ex.question}\nOptions: ${(ex.options || []).join(' | ')}`).join('\n')}`);
    }
  }

  if (!page || page === 'quiz') {
    const quizzes = await Quiz.find({ topic: topicId }).select('_id title description').limit(3).lean();
    const quizIds = quizzes.map((quiz) => quiz._id);
    const problems = quizIds.length
      ? await QuizProblem.find({ quizId: { $in: quizIds } }).select('questionText choices').limit(5).lean()
      : [];
    if (quizzes.length || problems.length) {
      sections.push(`Quizzes:\n${quizzes.map((q) => `- ${q.title}: ${q.description || ''}`).join('\n')}\nQuestions:\n${problems.map((p) => `- ${p.questionText}`).join('\n')}`);
    }
  }

  if (!page || page === 'exam') {
    const examQuestions = await ExamQuestion.find({ topic: topicId }).select('questionText choices tag').limit(5).lean();
    if (examQuestions.length) {
      sections.push(`Exam references:\n${examQuestions.map((q) => `- ${q.questionText}`).join('\n')}`);
    }
  }

  return sections.join('\n\n');
};

const getServerGeminiApiKey = () => {
  const key = String(process.env.GEMINI_API_KEY || '').trim();
  return key || null;
};

exports.chat = asyncHandler(async (req, res, next) => {
  const { message, topicId, page } = req.body || {};
  const text = typeof message === 'string' ? message.trim() : '';

  if (!text) {
    return next(new ErrorResponse('message is required', 400));
  }

  const apiKey = getServerGeminiApiKey();
  if (!apiKey) {
    return next(new ErrorResponse('AI tutor is not configured on the server.', 503));
  }

  const student = await User.findById(req.user.id).select('firstName role');
  if (!student || student.role !== 'student') {
    return next(new ErrorResponse('AI chat is only available for students', 403));
  }

  let topicContext = 'No specific topic is open. Answer as a general study tutor.';
  let resourceSummary = '';
  if (topicId) {
    const topic = await Topic.findById(topicId).select('topicName topicDescription chapter').lean();
    if (topic) {
      const chapter = topic.chapter ? await Chapter.findById(topic.chapter).select('chapterName subject').lean() : null;
      const subject = chapter?.subject ? await Subject.findById(chapter.subject).select('subjectName gradeLevel stream').lean() : null;
      topicContext = [
        `Subject: ${subject?.subjectName || 'Unknown'}${subject?.gradeLevel ? ` (Grade ${subject.gradeLevel})` : ''}`,
        `Chapter: ${chapter?.chapterName || 'Unknown'}`,
        `Topic: ${topic.topicName}`,
        topic.topicDescription ? `Topic description: ${topic.topicDescription}` : '',
        page ? `Current page: ${page}` : '',
      ].filter(Boolean).join('\n');
      resourceSummary = await summarizeTopicResources(topicId, page);
    }
  }

  const prompt = `
You are a helpful AI tutor for an entrance exam preparation platform.
Answer the student clearly and step by step.
Format responses for readability: use short paragraphs, section labels, bullet points, or numbered steps when useful. Keep spacing clean and avoid long dense blocks of text.
For math, use simple ASCII notation only. Examples: use x for multiplication, / for division, sqrt(16), x^2, <=, >=, and write equations on their own lines. Do not use LaTeX delimiters, Unicode math symbols, or decorative formula formatting.
Stay focused on the current subject/topic when context is provided.
STRICT HINT-ONLY RULE: For all exercises, quizzes, and exam questions, you are ABSOLUTELY FORBIDDEN from providing the final answer or the correct choice (e.g., "A", "B", "C", or "D"). You must only provide conceptual hints, guided questions, or explanations of the underlying logic to help the student arrive at the answer themselves. If a student asks for the answer directly, politely explain that you can only guide them with hints to support their learning.
For video questions, use the video title, URL, topic, and available concept/resource context. If no transcript is available, say you can summarize the lesson focus from the stored metadata and topic context, not the exact spoken transcript.
If the question is unrelated, briefly redirect the student back to studying.

Context:
${topicContext}

Available resource summary:
${resourceSummary || 'No resource summary available.'}

Student question:
${text}
`;

  const answer = await geminiService.generateAnswer(apiKey, prompt);

  res.status(200).json({
    success: true,
    data: { answer },
  });
});
