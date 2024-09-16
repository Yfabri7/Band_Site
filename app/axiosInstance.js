import axios from 'axios';

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL

const axiosInstance = axios.create({  
  baseURL: `${serverUrl}`,
});

// Add JWT token to the Authorization header for every request
axiosInstance.interceptors.request.use(
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

export default axiosInstance;
