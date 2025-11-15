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
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('authUser', JSON.stringify(user));
    
    if (refreshTokenInCookie) {
      cookies.set('refreshToken', refreshToken, 30);
    } else {
      localStorage.setItem('refreshToken', refreshToken);
    }
    
    set({ 
      user, 
      accessToken, 
      sessionId, 
      refreshToken, 
      isAuthenticated: true 
    });

    try {
      await signalRClient.connect();
    } catch (error) {
    }

    await get().fetchUserPreferences();
  },
  
  logout: async () => {
    try {
      await signalRClient.disconnect();
    } catch (error) {
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('authUser');
    localStorage.removeItem('refreshToken');
    
    cookies.remove('refreshToken');
    
    set({ 
      user: null, 
      accessToken: null, 
      sessionId: null, 
      refreshToken: null, 
      isAuthenticated: false,
      isInitialized: true,
      preferencesLoaded: false
    });
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
    localStorage.setItem('accessToken', accessToken);
    if (refreshToken) {
      const existingInCookie = cookies.get('refreshToken');
      if (existingInCookie) {
        cookies.set('refreshToken', refreshToken, 30);
      } else {
        localStorage.setItem('refreshToken', refreshToken);
      }
    }
    set({ accessToken, refreshToken: refreshToken || null });
  },
  
  init: () => {
    const currentState = useAuthStore.getState();
    if (currentState.isInitialized) {
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    const sessionId = localStorage.getItem('sessionId') || cookies.get('sessionId') || null;
    const userStr = localStorage.getItem('authUser');
    
    const refreshToken = cookies.get('refreshToken') || localStorage.getItem('refreshToken');
    
    if (accessToken && userStr) {
      const tokenExpired = isTokenExpired(accessToken);
      
      if (tokenExpired && !refreshToken) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('authUser');
        localStorage.removeItem('refreshToken');
        cookies.remove('refreshToken');
        cookies.remove('sessionId');
        set({ isInitialized: true });
        return;
      }
      
      try {
        const user = JSON.parse(userStr);
        set({ 
          user, 
          accessToken, 
          sessionId: sessionId || null,
          refreshToken, 
          isAuthenticated: true,
          isInitialized: true,
          preferencesLoaded: false
        });
        get().fetchUserPreferences();
      } catch (error) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('sessionId');
        localStorage.removeItem('authUser');
        localStorage.removeItem('refreshToken');
        cookies.remove('refreshToken');
        set({ isInitialized: true });
      }
    } else {
      set({ isInitialized: true });
    }
  },
  fetchUserPreferences: async () => {
    set({ preferencesLoaded: false });
    try {
      const response = await usersApi.getCurrentUser();
      set((state) => state.user ? { user: { ...state.user, preferences: response.preferences || null } } : state);
    } catch (error) {
    } finally {
      set({ preferencesLoaded: true });
    }
  },
}));

