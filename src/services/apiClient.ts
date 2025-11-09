import { API_CONFIG } from '../config/api';

/**
 * Tipos de resposta da API
 */
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

/**
 * Classe para fazer requisições HTTP à API
 */
class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
    this.defaultHeaders = { ...API_CONFIG.DEFAULT_HEADERS };
  }

  /**
   * Obtém o token de autenticação do localStorage
   */
  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  /**
   * Salva o token de autenticação no localStorage
   */
  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  /**
   * Remove o token de autenticação
   */
  clearAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  /**
   * Obtém os headers da requisição
   */
  private getHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      ...this.defaultHeaders,
    };

    // Adiciona token de autenticação se existir (apenas se não foi passado um customizado)
    if (!customHeaders?.Authorization) {
      const token = this.getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    // Aplica headers customizados por último (têm prioridade)
    if (customHeaders) {
      Object.assign(headers, customHeaders);
    }

    return headers;
  }

  /**
   * Faz uma requisição HTTP com timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  /**
   * Processa a resposta da API
   */
  private async processResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { message: text } : {};
    }

    if (!response.ok) {
      const error: ApiError = {
        message: data.message || data.error || `HTTP Error ${response.status}`,
        status: response.status,
        errors: data.errors,
      };

      // Se for erro 401 (não autorizado), limpa o token
      if (response.status === 401) {
        this.clearAuthToken();
      }

      throw error;
    }

    // Retorna no formato ApiResponse<T> para manter consistência
    return { data } as ApiResponse<T>;
  }

  /**
   * Faz uma requisição GET
   */
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'GET',
        headers: this.getHeaders(headers),
      },
      this.timeout
    );

    return this.processResponse<T>(response);
  }

  /**
   * Faz uma requisição POST
   */
  async post<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: this.getHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
      },
      this.timeout
    );

    return this.processResponse<T>(response);
  }

  /**
   * Faz uma requisição PUT
   */
  async put<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'PUT',
        headers: this.getHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
      },
      this.timeout
    );

    return this.processResponse<T>(response);
  }

  /**
   * Faz uma requisição PATCH
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'PATCH',
        headers: this.getHeaders(headers),
        body: data ? JSON.stringify(data) : undefined,
      },
      this.timeout
    );

    return this.processResponse<T>(response);
  }

  /**
   * Faz uma requisição DELETE
   */
  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const response = await this.fetchWithTimeout(
      url,
      {
        method: 'DELETE',
        headers: this.getHeaders(headers),
      },
      this.timeout
    );

    return this.processResponse<T>(response);
  }
}

// Exporta uma instância singleton do cliente
export const apiClient = new ApiClient();

