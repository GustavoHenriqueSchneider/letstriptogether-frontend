import apiClient from './client';
import type { User } from '@/types';
import { cookies } from '@/utils/cookies';

export interface LoginResponse {
  user: User;
  accessToken: string;
  sessionId: string;
  refreshToken: string;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/login', {
      email,
      password
    });

    const { accessToken, refreshToken } = response.data;

    let sessionId = cookies.get('sessionId') || '';
    
    if (!sessionId) {
      const sessionIdFromResponse = response.headers['set-cookie']
        ?.find((cookie: string) => cookie.startsWith('sessionId='))
        ?.split(';')[0]
        ?.split('=')[1];
      
      if (sessionIdFromResponse) {
        sessionId = sessionIdFromResponse;
        cookies.set('sessionId', sessionId, 30);
      } else {
        const generatedSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        sessionId = generatedSessionId;
        cookies.set('sessionId', sessionId, 30);
      }
    }

    const userResponse = await apiClient.get<{ name: string; email: string; preferences: any }>('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    const user: User = {
      id: 0,
      name: userResponse.data.name,
      email: userResponse.data.email,
      avatar: undefined
    };

    return {
      user,
      accessToken,
      sessionId,
      refreshToken
    };
  },

  async sendRegisterConfirmationEmail(name: string, email: string): Promise<string> {
    const response = await apiClient.post<{ token: string }>('/auth/email/send', {
      name,
      email
    });
    return response.data.token;
  },

  async validateRegisterConfirmationCode(code: number, emailToken: string): Promise<string> {
    const response = await apiClient.post<{ token: string }>(
      '/auth/email/validate',
      { code },
      {
        headers: {
          Authorization: `Bearer ${emailToken}`
        }
      }
    );
    return response.data.token;
  },

  async completeRegister(
    password: string,
    hasAcceptedTermsOfUse: boolean,
    registerToken: string
  ): Promise<{ id: string }> {
    const response = await apiClient.post<{ id: string }>(
      '/auth/register',
      {
        password,
        hasAcceptedTermsOfUse
      },
      {
        headers: {
          Authorization: `Bearer ${registerToken}`
        }
      }
    );
    return response.data;
  },

  async requestResetPassword(email: string): Promise<void> {
    await apiClient.post('/auth/reset-password/request', { email });
  },

  async resetPassword(password: string, resetToken: string): Promise<void> {
    await apiClient.post(
      '/auth/reset-password',
      { password },
      {
        headers: {
          Authorization: `Bearer ${resetToken}`
        },
        _skipRefresh: true
      } as any
    );
  },

  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken
    });
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  },

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
};

