// API utility for making HTTP requests to backend
// Uses axios for HTTP requests

import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - adds auth token to all requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If data is FormData, remove Content-Type header to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response && error.response.status === 401) {
      // Get current path to check if we're on auth pages
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/' || 
                         currentPath === '/login' || 
                         currentPath === '/register' ||
                         currentPath.startsWith('/auth/');
      
      // Only redirect if not on auth pages (to allow login errors to be displayed)
      if (!isAuthPage) {
        // Remove token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

// Utility function to get base URL for static assets (images, etc.)
export const getBaseURL = () => {
  return import.meta.env.VITE_API_URL || 'http://localhost:5000';
};

export default api;

