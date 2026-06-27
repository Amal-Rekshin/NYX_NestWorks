import axios from 'axios';

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API = axios.create({ baseURL: `${BASE_URL}/api` });

API.interceptors.request.use((req) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    req.headers.Authorization = `Bearer ${JSON.parse(userInfo).token}`;
  }
  return req;
});

export default API;
