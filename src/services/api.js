import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  timeout: 30000, // 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: useful for logging or appending tokens later
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: unifies error processing
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const errorDetails = error.response?.data?.detail || error.message || 'API request failed';
    console.error(`[API Error]`, errorDetails);
    
    // Create a custom error payload structure
    const customError = new Error(errorDetails);
    customError.status = error.response?.status;
    customError.data = error.response?.data;
    
    return Promise.reject(customError);
  }
);

export default api;
