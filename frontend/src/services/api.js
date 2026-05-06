import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://final-year-project-2-entrance-exam.onrender.com/api';
const envApiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim();
const isBrowser = typeof window !== 'undefined';
const isLocalFrontend =
  isBrowser &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const pointsToLocalApi = /localhost|127\.0\.0\.1/i.test(envApiBaseUrl);

const resolvedApiBaseUrl =
  envApiBaseUrl && (!pointsToLocalApi || isLocalFrontend)
    ? envApiBaseUrl
    : DEFAULT_API_BASE_URL;

const api = axios.create({
  baseURL: resolvedApiBaseUrl,
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
  const raw = resolvedApiBaseUrl;
  return String(raw).replace(/\/?api\/?$/, '').replace(/\/$/, '') || 'https://final-year-project-2-entrance-exam.onrender.com';
}

export default api;