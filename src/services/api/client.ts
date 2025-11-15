import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { cookies } from '@/utils/cookies';

export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5089/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken, sessionId, isInitialized } = useAuthStore.getState();
    
    if (isInitialized) {
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      if (sessionId && !config.headers['X-Session-Id']) {
        config.headers['X-Session-Id'] = sessionId;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => {
    if (response.config.url?.includes('/users/me') && response.data) {
      const preferences = response.data.preferences;
      
      if (preferences === null && !window.location.pathname.includes('/preferences')) {
        setTimeout(() => {
          window.location.href = '/preferences';
        }, 100);
      }
    }
    
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _skipRefresh?: boolean };
    
    if (originalRequest._skipRefresh) {
      return Promise.reject(error);
    }
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      const { isInitialized } = useAuthStore.getState();
      
      if (!isInitialized) {
        return Promise.reject(error);
      }
      
      const isResetPasswordRequest = originalRequest.url?.includes('/auth/reset-password');
      const isLoginRequest = originalRequest.url?.includes('/auth/login');
      const isRegisterRequest = originalRequest.url?.includes('/auth/register');
      const isEmailSendRequest = originalRequest.url?.includes('/auth/email/send');
      const isEmailValidateRequest = originalRequest.url?.includes('/auth/email/validate');
      
      if (isLoginRequest || isRegisterRequest || isEmailSendRequest || isEmailValidateRequest || isResetPasswordRequest) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { refreshToken, setTokens, logout } = useAuthStore.getState();
        const refreshTokenValue = refreshToken || cookies.get('refreshToken');
        
        if (!refreshTokenValue) {
          throw new Error('No refresh token available');
        }

        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5089/api/v1';
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken: refreshTokenValue },
          { withCredentials: true }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        setTokens(newAccessToken, newRefreshToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        processQueue(null, newAccessToken);
        isRefreshing = false;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        if (!isResetPasswordRequest) {
          const { logout, isInitialized } = useAuthStore.getState();
          
          if (isInitialized) {
            await logout();
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

