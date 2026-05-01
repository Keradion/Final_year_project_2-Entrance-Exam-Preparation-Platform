import api from './api';

export const askAiTutor = async (payload) => {
  const response = await api.post('/ai/chat', payload);
  return response.data;
};
