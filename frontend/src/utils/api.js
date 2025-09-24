import axios from 'axios';
import { toast } from 'react-toastify';

// Use explicit backend API URL to avoid relying on CRA proxy
const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Inject token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ww_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Global error handler
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Request failed';
    if (err.response?.status !== 401) toast.error(msg);
    return Promise.reject(err);
  }
);

export default api;
