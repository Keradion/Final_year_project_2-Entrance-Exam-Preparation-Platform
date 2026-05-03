import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
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
  const raw = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  return String(raw).replace(/\/?api\/?$/, '').replace(/\/$/, '') || 'http://localhost:5000';
}

export default api;