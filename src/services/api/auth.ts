import apiClient from './client';
import type { User } from '@/types';
import { cookies } from '@/utils/cookies';

/**
 * Serviço de Autenticação
 * 
 * Integrado com a API pública seguindo o fluxo exato:
 * - Registro: 3 etapas (enviar email → validar código → completar registro)
 * - Login: retorna accessToken, refreshToken e sessionId (cookie)
 * - Reset Password: 2 etapas (solicitar → redefinir)
 */

export interface LoginResponse {
  user: User;
  accessToken: string;
  sessionId: string;
  refreshToken: string;
}

export const authApi = {
  /**
   * Login
   * POST /api/v1/auth/login
   * 
   * Retorna: { accessToken: string, refreshToken: string }
   * sessionId vem via cookie (Set-Cookie)
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/login', {
      email,
      password
    });

    const { accessToken, refreshToken } = response.data;

    // Obter dados do usuário após login usando o accessToken recebido
    const userResponse = await apiClient.get<{ name: string; email: string; preferences: any }>('/users/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    
    const user: User = {
      id: 0, // A API não retorna ID no GetCurrentUser
      name: userResponse.data.name,
      email: userResponse.data.email,
      avatar: undefined
    };


    // sessionId vem do cookie automaticamente (Set-Cookie do servidor)
    const sessionId = cookies.get('sessionId') || '';

    return {
      user,
      accessToken,
      sessionId,
      refreshToken
    };
  },

  /**
   * Etapa 1: Enviar email de confirmação de registro
   * POST /api/v1/auth/email/send (AllowAnonymous)
   * 
   * Retorna: { token: string } - token temporário para próxima etapa
   */
  async sendRegisterConfirmationEmail(name: string, email: string): Promise<string> {
    const response = await apiClient.post<{ token: string }>('/auth/email/send', {
      name,
      email
    });
    return response.data.token;
  },

  /**
   * Etapa 2: Validar código de confirmação de email
   * POST /api/v1/auth/email/validate (Authorize - usa token da etapa 1)
   * 
   * Retorna: { token: string } - token para completar registro
   */
  async validateRegisterConfirmationCode(code: number, emailToken: string): Promise<string> {
    // Configurar token temporário no header
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

  /**
   * Etapa 3: Completar registro após validação do email
   * POST /api/v1/auth/register (Authorize - usa token da etapa 2)
   * 
   * Retorna: { id: Guid }
   */
  async completeRegister(
    password: string,
    hasAcceptedTermsOfUse: boolean,
    registerToken: string
  ): Promise<{ id: string }> {
    // Configurar token temporário no header
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

  /**
   * Etapa 1: Solicitar reset de senha
   * POST /api/v1/auth/reset-password/request (AllowAnonymous)
   * 
   * Retorna: 202 Accepted (envia email com token)
   */
  async requestResetPassword(email: string): Promise<void> {
    await apiClient.post('/auth/reset-password/request', { email });
  },

  /**
   * Etapa 2: Redefinir senha
   * POST /api/v1/auth/reset-password (Authorize - usa token de reset)
   * 
   * Retorna: 204 No Content
   */
  async resetPassword(password: string, resetToken: string): Promise<void> {
    await apiClient.post(
      '/auth/reset-password',
      { password },
      {
        headers: {
          Authorization: `Bearer ${resetToken}`
        },
        // Flag para pular refresh token no interceptor (token de reset não pode ser renovado)
        _skipRefresh: true
      } as any
    );
  },

  /**
   * Refresh Token
   * POST /api/v1/auth/refresh (AllowAnonymous)
   * 
   * Retorna: { accessToken: string, refreshToken: string }
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const response = await apiClient.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', {
      refreshToken
    });
    return {
      accessToken: response.data.accessToken,
      refreshToken: response.data.refreshToken
    };
  },

  /**
   * Logout
   * POST /api/v1/auth/logout (Authorize)
   * 
   * Retorna: 204 No Content
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  }
};

