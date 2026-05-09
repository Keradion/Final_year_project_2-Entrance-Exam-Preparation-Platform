import api from './api';

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const isFormData = typeof FormData !== 'undefined' && userData instanceof FormData;
  const response = await api.post('/auth/register', userData, isFormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined);
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (payload) => {
  const isFormData = typeof FormData !== 'undefined' && payload instanceof FormData;
  const response = await api.put('/auth/profile', payload, isFormData
    ? { headers: { 'Content-Type': 'multipart/form-data' } }
    : undefined);
  return response.data;
};

export const changePassword = async (payload) => {
  const response = await api.post('/auth/change-password', payload);
  return response.data;
};

export const getAiSettings = async () => {
  const response = await api.get('/auth/ai-settings');
  return response.data;
};

export const requestPasswordReset = async (payload) => {
  const response = await api.post('/auth/request-password-reset', payload);
  return response.data;
};

export const resetPassword = async (payload) => {
  const response = await api.post('/auth/reset-password', payload);
  return response.data;
};

export const verifyEmail = async (payload) => {
  const response = await api.post('/auth/verify-email', payload);
  return response.data;
};
