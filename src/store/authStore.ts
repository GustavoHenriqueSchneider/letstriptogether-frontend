import { create } from 'zustand';
import type { User } from '@/types';
import { cookies } from '@/utils/cookies';
import { signalRClient } from '@/services/websocket/signalrClient';
import { usersApi } from '@/services/api/users';

function isTokenExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return true;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const exp = payload.exp;
    
    if (!exp) {
      return true;
    }
    
    const expirationTime = exp * 1000;
    const now = Date.now();
    
    return now >= expirationTime;
  } catch (error) {
    console.error('[AuthStore] Error checking token expiration:', error);
    return true;
  }
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  sessionId: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  preferencesLoaded: boolean;
  login: (user: User, accessToken: string, sessionId: string, refreshToken: string, refreshTokenInCookie?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setTokens: (accessToken: string, refreshToken?: string) => void;
  init: () => void;
  fetchUserPreferences: () => Promise<void>;
}

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
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('authUser', JSON.stringify(user));
    console.log('[AuthStore] login() - Saved tokens to localStorage');
    
    if (refreshTokenInCookie) {
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
    try {
      await signalRClient.disconnect();
      console.log('[AuthStore] logout() - WebSocket disconnected');
    } catch (error) {
      console.error('[AuthStore] logout() - Erro ao desconectar WebSocket:', error);
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('authUser');
    localStorage.removeItem('refreshToken');
    console.log('[AuthStore] logout() - Cleared localStorage');
    
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
    const currentState = useAuthStore.getState();
    if (currentState.isInitialized) {
      console.log('[AuthStore] init() - Already initialized, skipping');
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = localStorage.getItem('sessionId') || cookies.get('sessionId') || null;
    const userStr = localStorage.getItem('authUser');
    
    const refreshToken = cookies.get('refreshToken') || localStorage.getItem('refreshToken');
    
    console.log('[AuthStore] init() - Checking localStorage:');
    console.log('  - accessToken exists:', !!accessToken);
    console.log('  - sessionId exists:', !!sessionId);
    console.log('  - userStr exists:', !!userStr);
    console.log('  - refreshToken exists:', !!refreshToken);
    
    if (accessToken && userStr) {
      const tokenExpired = isTokenExpired(accessToken);
      console.log('[AuthStore] init() - Token expired:', tokenExpired);
      
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
          sessionId: sessionId || null,
          refreshToken, 
          isAuthenticated: true,
          isInitialized: true,
          preferencesLoaded: false
        });
        console.log('[AuthStore] init() - State set: isAuthenticated=true, isInitialized=true');
        get().fetchUserPreferences();
      } catch (error) {
        console.error('[AuthStore] init() - Error parsing user data:', error);
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

