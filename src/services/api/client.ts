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
    
    console.log('[API Client] Request interceptor - isInitialized:', isInitialized, 'hasAccessToken:', !!accessToken, 'url:', config.url);
    
    if (isInitialized) {
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      if (sessionId && !config.headers['X-Session-Id']) {
        config.headers['X-Session-Id'] = sessionId;
      }
    } else {
      console.warn('[API Client] Request made before initialization! URL:', config.url);
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
    console.log('[API Client] Response interceptor - Status:', response.status, 'URL:', response.config.url);
    if (response.config.url?.includes('/users/me') && response.data) {
      const preferences = response.data.preferences;
      console.log('[API Client] Response interceptor - /users/me response, preferences:', preferences);
      
      if (preferences === null && !window.location.pathname.includes('/preferences')) {
        console.log('[API Client] Response interceptor - Preferences is null, redirecting to /preferences');
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
      console.log('[API Client] 401 error - isInitialized:', isInitialized, 'url:', originalRequest.url);
      
      if (!isInitialized) {
        console.log('[API Client] 401 error before initialization, rejecting without refresh');
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
          
          console.log('[API Client] Refresh failed - isInitialized:', isInitialized);
          
          if (isInitialized) {
            console.log('[API Client] Logging out and redirecting to /login');
            await logout();
            setTimeout(() => {
              window.location.href = '/login';
            }, 100);
          } else {
            console.log('[API Client] Not initialized yet, skipping logout/redirect');
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

