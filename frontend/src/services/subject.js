import api from './api';

export const updateSubject = async (id, data) => {
  const response = await api.put(`/subjects/${id}`, data);
  return response.data;
};

export const getSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data;
};
