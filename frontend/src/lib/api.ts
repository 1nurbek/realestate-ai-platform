import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header from localStorage if a token is present
apiClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle 401 responses: clear auth + redirect to /login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== 'undefined' && error?.response?.status === 401) {
      const path = window.location.pathname || '';
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
      if (!path.startsWith('/login') && !path.startsWith('/signup') && !path.startsWith('/forgot-password') && !path.startsWith('/reset-password')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
