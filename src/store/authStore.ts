import { create } from 'zustand';
import type { User } from '@/types';
import { cookies } from '@/utils/cookies';
import { signalRClient } from '@/services/websocket/signalrClient';
import { usersApi } from '@/services/api/users';

/**
 * Verifica se um JWT token está expirado
 * @param token JWT token
 * @returns true se o token está expirado ou inválido
 */
function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true; // Token inválido
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    
    if (!exp) {
      return true; // Token sem expiração
    }
    
    // exp é um timestamp Unix em segundos
    const expirationTime = exp * 1000; // Converter para milissegundos
    const now = Date.now();
    
    // Considerar expirado apenas se realmente passou do tempo de expiração
    // Não usar margem de segurança aqui, deixar o interceptor do Axios lidar com refresh
    return now >= expirationTime;
  } catch (error) {
    console.error('[AuthStore] Error checking token expiration:', error);
    return true; // Em caso de erro, considerar expirado
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  sessionId: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Flag para indicar se a inicialização foi concluída
  preferencesLoaded: boolean;
  login: (user: User, accessToken: string, sessionId: string, refreshToken: string, refreshTokenInCookie?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  init: () => void; // Inicializar do localStorage/cookies
  fetchUserPreferences: () => Promise<void>;
}

/**
 * Store de autenticação
 * 
 * Gerencia:
 * - accessToken: Token de acesso (localStorage)
 * - sessionId: ID da sessão (localStorage)
 * - refreshToken: Token de renovação (cookie ou localStorage, configurável)
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  sessionId: null,
  refreshToken: null,
  isAuthenticated: false,
  isInitialized: false,
  preferencesLoaded: false,
  
  login: async (user, accessToken, sessionId, refreshToken, refreshTokenInCookie = true) => {
    console.log('[AuthStore] login() - Starting login process');
    // Salvar accessToken e sessionId no localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('authUser', JSON.stringify(user));
    console.log('[AuthStore] login() - Saved tokens to localStorage');
    
    // Salvar refreshToken em cookie ou localStorage
    if (refreshTokenInCookie) {
      // Cookie expira em 30 dias (ajuste conforme necessário)
      cookies.set('refreshToken', refreshToken, 30);
      console.log('[AuthStore] login() - Saved refreshToken to cookie');
    } else {
      localStorage.setItem('refreshToken', refreshToken);
      console.log('[AuthStore] login() - Saved refreshToken to localStorage');
    }
    
    set({ 
      user, 
      accessToken, 
      sessionId, 
      refreshToken, 
      isAuthenticated: true 
    });
    console.log('[AuthStore] login() - State updated, isAuthenticated: true');

    // Conectar WebSocket após login
    try {
      await signalRClient.connect();
      console.log('[AuthStore] login() - WebSocket connected');
    } catch (error) {
      console.error('[AuthStore] login() - Erro ao conectar WebSocket após login:', error);
    }

    await get().fetchUserPreferences();
  },
  
  logout: async () => {
    console.log('[AuthStore] logout() - Starting logout process');
    // Desconectar WebSocket antes de fazer logout
    try {
      await signalRClient.disconnect();
      console.log('[AuthStore] logout() - WebSocket disconnected');
    } catch (error) {
      console.error('[AuthStore] logout() - Erro ao desconectar WebSocket:', error);
    }

    // Limpar localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('authUser');
    localStorage.removeItem('refreshToken');
    console.log('[AuthStore] logout() - Cleared localStorage');
    
    // Limpar cookie
    cookies.remove('refreshToken');
    console.log('[AuthStore] logout() - Cleared refreshToken cookie');
    
    set({ 
      user: null, 
      accessToken: null, 
      sessionId: null, 
      refreshToken: null, 
      isAuthenticated: false,
      isInitialized: true,
      preferencesLoaded: false
    });
    console.log('[AuthStore] logout() - State updated, isAuthenticated: false, isInitialized: true');
  },
  
  updateUser: (userData) =>
    set((state) => {
      const updatedUser = state.user ? { ...state.user, ...userData } : null;
      if (updatedUser) {
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
      }
      return { user: updatedUser };
    }),
  
  setTokens: (accessToken, refreshToken) => {
    console.log('[AuthStore] setTokens() - Updating tokens');
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      // Atualizar refreshToken no mesmo lugar onde estava
      const existingInCookie = cookies.get('refreshToken');
      if (existingInCookie) {
        cookies.set('refreshToken', refreshToken, 30);
        console.log('[AuthStore] setTokens() - Updated refreshToken in cookie');
      } else {
        localStorage.setItem('refreshToken', refreshToken);
        console.log('[AuthStore] setTokens() - Updated refreshToken in localStorage');
      }
    }
    set({ accessToken, refreshToken: refreshToken || null });
    console.log('[AuthStore] setTokens() - State updated');
  },
  
  init: () => {
    console.log('[AuthStore] init() - Starting initialization');
    // Verificar se já foi inicializado para evitar múltiplas chamadas
    const currentState = useAuthStore.getState();
    if (currentState.isInitialized) {
      console.log('[AuthStore] init() - Already initialized, skipping');
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    // sessionId pode estar no localStorage ou no cookie
    const sessionId = localStorage.getItem('sessionId') || cookies.get('sessionId') || null;
    const userStr = localStorage.getItem('authUser');
    
    // Tentar obter refreshToken de cookie primeiro, depois localStorage
    const refreshToken = cookies.get('refreshToken') || localStorage.getItem('refreshToken');
    
    console.log('[AuthStore] init() - Checking localStorage:');
    console.log('  - accessToken exists:', !!accessToken);
    console.log('  - sessionId exists:', !!sessionId);
    console.log('  - userStr exists:', !!userStr);
    console.log('  - refreshToken exists:', !!refreshToken);
    
    // Se temos accessToken e userStr, considerar autenticado
    // O interceptor do Axios vai lidar com renovação automática se o token estiver expirado
    // (AccessToken expira em 5 minutos, RefreshToken em 1440 minutos = 24 horas)
    if (accessToken && userStr) {
      // Verificar se o token está expirado apenas para log
      const tokenExpired = isTokenExpired(accessToken);
      console.log('[AuthStore] init() - Token expired:', tokenExpired);
      
      // Se o token está expirado e não temos refreshToken, limpar tudo
      if (tokenExpired && !refreshToken) {
        console.log('[AuthStore] init() - Token is expired and no refreshToken, clearing storage');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('authUser');
        localStorage.removeItem('refreshToken');
        cookies.remove('refreshToken');
        cookies.remove('sessionId');
        set({ isInitialized: true });
        console.log('[AuthStore] init() - Cleared expired tokens, set isInitialized=true, isAuthenticated=false');
        return;
      }
      
      // Se temos refreshToken (mesmo que o accessToken esteja expirado), manter autenticado
      // O interceptor do Axios vai renovar automaticamente na primeira requisição
      if (tokenExpired && refreshToken) {
        console.log('[AuthStore] init() - Token is expired but has refreshToken, will refresh on next API call');
      }
      
      try {
        const user = JSON.parse(userStr);
        console.log('[AuthStore] init() - AccessToken and user found, setting authenticated state');
        console.log('[AuthStore] init() - User:', user.email || 'no email');
        console.log('[AuthStore] init() - sessionId:', sessionId || 'missing (will be set on next API call)');
        set({ 
          user, 
          accessToken, 
          sessionId: sessionId || null, // Pode ser null, será recuperado na próxima chamada
          refreshToken, 
          isAuthenticated: true,
          isInitialized: true,
          preferencesLoaded: false
        });
        console.log('[AuthStore] init() - State set: isAuthenticated=true, isInitialized=true');
        get().fetchUserPreferences();
      } catch (error) {
        console.error('[AuthStore] init() - Error parsing user data:', error);
        // Limpar dados corrompidos
        localStorage.removeItem('accessToken');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('authUser');
        localStorage.removeItem('refreshToken');
        cookies.remove('refreshToken');
        set({ isInitialized: true });
        console.log('[AuthStore] init() - Cleared corrupted data, set isInitialized=true');
      }
    } else {
      console.log('[AuthStore] init() - Missing required tokens, marking as initialized (not authenticated)');
      console.log('[AuthStore] init() - Tokens status:', {
        hasAccessToken: !!accessToken,
        hasUserStr: !!userStr
      });
      // Mesmo sem tokens, marcar como inicializado
      set({ isInitialized: true });
      console.log('[AuthStore] init() - State set: isInitialized=true, isAuthenticated=false');
    }
    console.log('[AuthStore] init() - Initialization complete');
  },
  fetchUserPreferences: async () => {
    set({ preferencesLoaded: false });
    try {
      const response = await usersApi.getCurrentUser();
      set((state) => state.user ? { user: { ...state.user, preferences: response.preferences || null } } : state);
      console.log('[AuthStore] fetchUserPreferences() - Preferences updated');
    } catch (error) {
      console.error('[AuthStore] fetchUserPreferences() - Error fetching preferences:', error);
    } finally {
      set({ preferencesLoaded: true });
    }
  },
}));

