import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://final-year-project-2-entrance-exam.onrender.com/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/** Origin (no /api) for absolute URLs to uploaded files */
export function resolvePublicApiOrigin() {
  const raw = import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
  return String(raw).replace(/\/?api\/?$/, '').replace(/\/$/, '') || 'https://final-year-project-2-entrance-exam.onrender.com';
}

export default api;