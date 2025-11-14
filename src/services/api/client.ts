import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';
import { useAuthStore } from '@/store/authStore';
import { cookies } from '@/utils/cookies';

// Cliente HTTP configurado para chamadas de API
// A API usa versionamento: /api/v1/...
export const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5089/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Importante para cookies (sessionId)
});

// Interceptor para adicionar tokens de autenticação
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken, sessionId, isInitialized } = useAuthStore.getState();
    
    console.log('[API Client] Request interceptor - isInitialized:', isInitialized, 'hasAccessToken:', !!accessToken, 'url:', config.url);
    
    // Só adicionar tokens se já estiver inicializado
    // Isso evita que requisições sejam feitas antes dos tokens serem carregados
    if (isInitialized) {
      // Adicionar accessToken no header Authorization apenas se não foi definido manualmente
      if (accessToken && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      // Adicionar sessionId no header (ou pode ser enviado via cookie automaticamente)
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

// Flag para evitar múltiplas tentativas de refresh simultâneas
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

// Interceptor para verificar preferences após chamadas /users/me
apiClient.interceptors.response.use(
  (response) => {
    console.log('[API Client] Response interceptor - Status:', response.status, 'URL:', response.config.url);
    // Verificar se é uma resposta de /users/me e se preferences é null
    if (response.config.url?.includes('/users/me') && response.data) {
      const preferences = response.data.preferences;
      console.log('[API Client] Response interceptor - /users/me response, preferences:', preferences);
      
      // Se preferences é null e não estamos já na página de preferências, redirecionar
      if (preferences === null && !window.location.pathname.includes('/preferences')) {
        console.log('[API Client] Response interceptor - Preferences is null, redirecting to /preferences');
        // Usar setTimeout para garantir que o redirecionamento aconteça após a resposta ser processada
        setTimeout(() => {
          window.location.href = '/preferences';
        }, 100);
      }
    }
    
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; _skipRefresh?: boolean };
    
    // Se a requisição tem flag para pular refresh (ex: reset password com token expirado)
    if (originalRequest._skipRefresh) {
      return Promise.reject(error);
    }
    
    // Se erro 401 e ainda não tentou refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const { isInitialized } = useAuthStore.getState();
      console.log('[API Client] 401 error - isInitialized:', isInitialized, 'url:', originalRequest.url);
      
      // Se ainda não foi inicializado, não tentar refresh
      if (!isInitialized) {
        console.log('[API Client] 401 error before initialization, rejecting without refresh');
        return Promise.reject(error);
      }
      
      // Verificar se é uma requisição que não deve tentar refresh
      const isResetPasswordRequest = originalRequest.url?.includes('/auth/reset-password');
      const isLoginRequest = originalRequest.url?.includes('/auth/login');
      const isRegisterRequest = originalRequest.url?.includes('/auth/register');
      const isEmailSendRequest = originalRequest.url?.includes('/auth/email/send');
      const isEmailValidateRequest = originalRequest.url?.includes('/auth/email/validate');
      
      // Se for uma requisição de autenticação (login, registro, etc), não tentar refresh
      if (isLoginRequest || isRegisterRequest || isEmailSendRequest || isEmailValidateRequest || isResetPasswordRequest) {
        return Promise.reject(error);
      }
      
      if (isRefreshing) {
        // Se já está fazendo refresh, adicionar à fila
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

        // Chamar endpoint de refresh token (usando axios direto para evitar loop)
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5089/api/v1';
        const response = await axios.post(
          `${baseURL}/auth/refresh`,
          { refreshToken: refreshTokenValue },
          { withCredentials: true }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;
        
        // Atualizar tokens no store
        setTokens(newAccessToken, newRefreshToken);
        
        // Atualizar header da requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        
        processQueue(null, newAccessToken);
        isRefreshing = false;
        
        // Retentar requisição original
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        
        // Se refresh falhou e não é reset password, fazer logout
        // Não redirecionar aqui - deixar o React Router lidar com isso através do ProtectedRoute
        if (!isResetPasswordRequest) {
          const { logout, isInitialized } = useAuthStore.getState();
          
          console.log('[API Client] Refresh failed - isInitialized:', isInitialized);
          
          // Só fazer logout e redirecionar se já estiver inicializado
          // Isso evita redirecionamentos durante a inicialização
          if (isInitialized) {
            console.log('[API Client] Logging out and redirecting to /login');
            await logout();
            // Aguardar um pouco para garantir que o logout foi processado
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

