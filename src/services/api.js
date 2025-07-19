import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
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

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
};

// Profile API functions
export const profileAPI = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  
  getPublicProfile: async (userId) => {
    const response = await api.get(`/profile/${userId}`);
    return response.data;
  },
};

// Download API functions
export const downloadAPI = {
  downloadHTML: async (userId) => {
    const response = await api.get(`/download/portfolio/${userId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
  
  downloadJSON: async (userId) => {
    const response = await api.get(`/download/portfolio/${userId}/json`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;
