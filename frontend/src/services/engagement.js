import api from './api';

export const getUnreadNotifications = async () => {
  const response = await api.get('/notifications/unread');
  return response.data;
};

export const getAllNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data;
};

export const searchTopics = async (q) => {
  const response = await api.get('/content/topics/search', { params: { q } });
  return response.data;
};

export const createIssue = async (payload) => {
  const response = await api.post('/issues', payload);
  return response.data;
};

export const getMyIssues = async () => {
  const response = await api.get('/issues/me');
  return response.data;
};

export const getIssuesForReview = async (params = {}) => {
  const response = await api.get('/issues', { params });
  return response.data;
};

export const updateIssueStatus = async (issueId, payload) => {
  const response = await api.put(`/issues/${issueId}/status`, payload);
  return response.data;
};

export const getBookmarks = async () => {
  const response = await api.get('/bookmarks');
  return response.data;
};

export const addBookmark = async (payload) => {
  const response = await api.post('/bookmarks', payload);
  return response.data;
};

export const removeBookmark = async (bookmarkId) => {
  const response = await api.delete(`/bookmarks/${bookmarkId}`);
  return response.data;
};

export const listQuestions = async (params = {}) => {
  const response = await api.get('/questions', { params });
  return response.data;
};

export const askQuestion = async (payload) => {
  const response = await api.post('/questions', payload);
  return response.data;
};

export const updateQuestion = async (questionId, payload) => {
  const response = await api.put(`/questions/${questionId}`, payload);
  return response.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await api.delete(`/questions/${questionId}`);
  return response.data;
};

export const getQuestionAnswers = async (questionId) => {
  const response = await api.get(`/questions/${questionId}/answers`);
  return response.data;
};

export const answerQuestion = async (questionId, payload) => {
  const response = await api.post(`/questions/${questionId}/answers`, payload);
  return response.data;
};

export const updateAnswer = async (questionId, answerId, payload) => {
  const response = await api.put(`/questions/${questionId}/answers/${answerId}`, payload);
  return response.data;
};

export const deleteAnswer = async (questionId, answerId) => {
  const response = await api.delete(`/questions/${questionId}/answers/${answerId}`);
  return response.data;
};

export const getSubjectProgress = async () => {
  const response = await api.get('/progress/subjects');
  return response.data;
};

export const getStudentResultsSummary = async (gradeLevel) => {
  const response = await api.get('/progress/results', {
    params: gradeLevel ? { gradeLevel } : {},
  });
  return response.data;
};

export const getLearningStreak = async (gradeLevel) => {
  const response = await api.get('/progress/streak', {
    params: gradeLevel ? { gradeLevel } : {},
  });
  return response.data;
};

export const getGradeProgress = async (gradeLevel) => {
  const response = await api.get(`/progress/grades/${gradeLevel}`);
  return response.data;
};

export const getSubjectChapterProgress = async (subjectId) => {
  const response = await api.get(`/progress/subjects/${subjectId}/chapters`);
  return response.data;
};

export const getTopicCompletionEligibility = async (topicId) => {
  const response = await api.get(`/progress/topics/${topicId}/eligibility`);
  return response.data;
};

export const markTopicComplete = async (topicId) => {
  const response = await api.post(`/progress/topics/${topicId}/complete`);
  return response.data;
};

