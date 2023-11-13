import axios from 'axios';
import { BASE_URL } from 'config';

const axiosServices = axios.create();

// interceptor for http
axiosServices.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    console.log(error);
    let originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = window.localStorage.getItem('refreshToken');
      const response = await axios.post(`${BASE_URL}/admin/refresh`, { refreshToken });
      const access_token = response.data.token;
      axiosServices.defaults.headers.common.Authorization = `Bearer ${access_token}`;
      localStorage.setItem('serviceToken', access_token);
      originalRequest = {
        ...originalRequest,
        headers: {
          ...originalRequest.headers,
          Authorization: `Bearer ${access_token}`
        }
      };
      return axiosServices(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default axiosServices;
