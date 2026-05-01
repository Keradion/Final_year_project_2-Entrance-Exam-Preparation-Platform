import api from './api';

export const getChaptersBySubject = async (subjectId) => {
  const response = await api.get(`/content/subjects/${subjectId}/chapters`);
  return response.data;
};

export const getTopicsByChapter = async (chapterId) => {
  const response = await api.get(`/content/chapters/${chapterId}/topics`);
  return response.data;
};

export const createChapter = async (subjectId, chapterData) => {
  const response = await api.post('/content/chapters', { ...chapterData, subjectId });
  return response.data;
};

export const updateChapter = async (chapterId, chapterData) => {
  const response = await api.put(`/content/chapters/${chapterId}`, chapterData);
  return response.data;
};

export const deleteChapter = async (chapterId) => {
  const response = await api.delete(`/content/chapters/${chapterId}`);
  return response.data;
};

export const createTopic = async (chapterId, topicData) => {
  const response = await api.post('/content/topics', { ...topicData, chapterId });
  return response.data;
};

export const updateTopic = async (topicId, topicData) => {
  const response = await api.put(`/content/topics/${topicId}`, topicData);
  return response.data;
};

export const deleteTopic = async (topicId) => {
  const response = await api.delete(`/content/topics/${topicId}`);
  return response.data;
};
