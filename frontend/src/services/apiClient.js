import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecobot-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
