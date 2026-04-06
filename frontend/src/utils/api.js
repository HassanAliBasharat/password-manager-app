import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Passwords
export const getPasswords = (params) => API.get('/passwords', { params });
export const getPassword = (id) => API.get(`/passwords/${id}`);
export const createPassword = (data) => API.post('/passwords', data);
export const updatePassword = (id, data) => API.put(`/passwords/${id}`, data);
export const deletePassword = (id) => API.delete(`/passwords/${id}`);
export const toggleFavorite = (id) => API.patch(`/passwords/${id}/favorite`);
