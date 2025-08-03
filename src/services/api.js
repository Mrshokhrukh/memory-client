import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { showToast } from '../store/slices/uiSlice';

// Create axios instance
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    'https://memory-space-backend.onrender.com/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      store.dispatch(logout());
      store.dispatch(
        showToast({
          message: 'Session expired. Please login again.',
          type: 'error',
        })
      );
    } else if (response?.status === 403) {
      store.dispatch(
        showToast({
          message: "Access denied. You don't have permission for this action.",
          type: 'error',
        })
      );
    } else if (response?.status === 404) {
      store.dispatch(
        showToast({
          message: 'Resource not found.',
          type: 'error',
        })
      );
    } else if (response?.status >= 500) {
      store.dispatch(
        showToast({
          message: 'Server error. Please try again later.',
          type: 'error',
        })
      );
    } else if (error.code === 'ECONNABORTED') {
      store.dispatch(
        showToast({
          message: 'Request timeout. Please check your connection.',
          type: 'error',
        })
      );
    } else if (!response) {
      store.dispatch(
        showToast({
          message: 'Network error. Please check your connection.',
          type: 'error',
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;
