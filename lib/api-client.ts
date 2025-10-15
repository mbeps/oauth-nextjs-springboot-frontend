import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: sends cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized globally
    if (error.response?.status === 401) {
      // Only redirect if we're not already on the home page
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        console.warn('Unauthorized access - redirecting to login');
        window.location.href = '/';
      }
    }

    // Log other errors
    if (error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url,
      });
    }

    return Promise.reject(error);
  }
);

// Request interceptor (if needed for future enhancements)
apiClient.interceptors.request.use(
  (config) => {
    // Could add tokens or other headers here in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);