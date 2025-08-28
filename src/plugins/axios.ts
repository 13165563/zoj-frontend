import axios from 'axios';

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || 'http://localhost:8101/api',
  timeout: 10000,
  withCredentials: true, // 允许携带cookie
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    // 可以在这里统一处理响应数据
    return response.data;
  },
  (error) => {
    // 统一处理错误
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

export default http;