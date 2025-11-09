import { apiClient } from './apiClient';
import { API_ENDPOINTS } from '../config/api';
import type {
  LoginRequest,
  LoginResponse,
  RegisterResponse,
  ResetPasswordRequest,
  UpdateProfileRequest,
  User,
} from '../types/api';

/**
 * Serviço de autenticação
 * 
 * NOTA: Login/Register/ResetPassword são feitos através da API Pública que faz proxy para a API Interna.
 * Após autenticação, o token é usado para chamar a API Pública.
 */
export const authService = {
  /**
   * Faz login do usuário (através da API Pública)
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      credentials
    );
    
    // Salva o token
    if (response.data?.token) {
      apiClient.setAuthToken(response.data.token);
    }

    return response.data!;
  },

  /**
   * Etapa 1: Envia código de confirmação por email (registro)
   */
  async sendRegisterConfirmationEmail(data: { name: string; email: string }): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>(
      '/auth/email/send',
      data
    );
    
    // Debug: verificar o que está vindo
    console.log('Resposta completa:', response);
    console.log('response.data:', response.data);
    console.log('Tipo de response.data:', typeof response.data);
    
    // A resposta sempre vem em response.data (ApiResponse<T>)
    if (!response.data || !response.data.token) {
      console.error('Token não encontrado. Resposta:', response);
      throw new Error('Token não recebido da API');
    }

    return response.data;
  },

  /**
   * Etapa 2: Valida código de confirmação (registro)
   */
  async validateRegisterConfirmationCode(code: string, token: string): Promise<{ token: string }> {
    // Usa o token temporário da etapa 1 para validar o código
    const response = await apiClient.post<{ token: string }>(
      '/auth/email/validate',
      { code },
      {
        'Authorization': `Bearer ${token}`
      }
    );
    
    return response.data!;
  },

  /**
   * Etapa 3: Registra um novo usuário com senha (através da API Pública)
   */
  async register(data: { password: string; hasAcceptedTermsOfUse: boolean }, token: string): Promise<RegisterResponse> {
    // Usa o token da etapa 2 para registrar
    const response = await apiClient.post<RegisterResponse>(
      '/auth/register',
      data,
      {
        'Authorization': `Bearer ${token}`
      }
    );
    
    // Após registro bem-sucedido, faz login para obter o token de acesso
    // Nota: A API interna retorna apenas { id }, então precisamos fazer login
    // Mas como não temos email/senha aqui, vamos apenas retornar a resposta
    // O frontend precisará fazer login separadamente após o registro

    return response.data!;
  },

  /**
   * Solicita reset de senha (através da API Pública)
   */
  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    await apiClient.post('/auth/reset-password', data);
  },

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    // Apenas limpa o token local
    apiClient.clearAuthToken();
  },

  /**
   * Obtém o perfil do usuário atual
   */
  async getProfile(): Promise<User> {
    const response = await apiClient.get<User>(API_ENDPOINTS.USER.GET_CURRENT);
    return response.data!;
  },

  /**
   * Atualiza o perfil do usuário
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>(
      API_ENDPOINTS.USER.UPDATE,
      data
    );
    return response.data!;
  },

  /**
   * Atualiza as preferências do usuário
   */
  async updatePreferences(data: any): Promise<void> {
    await apiClient.put(API_ENDPOINTS.USER.PREFERENCES, data);
  },

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!apiClient.getAuthToken();
  },
};

