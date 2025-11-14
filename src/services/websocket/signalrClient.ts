import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/store/authStore';

class SignalRClient {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000; // 3 segundos
  private isManualDisconnect = false;

  /**
   * Conectar ao Hub SignalR
   */
  async connect(): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      console.log('[WebSocket] Já está conectado');
      return;
    }

    const { accessToken } = useAuthStore.getState();
    
    if (!accessToken) {
      console.warn('[WebSocket] Não há token de acesso. Não é possível conectar.');
      return;
    }

    // Construir URL do hub (remover /api/v1 e adicionar /hubs/notifications)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5089/api/v1';
    const baseUrl = apiBaseUrl.replace('/api/v1', '').replace('/api', '');
    const hubUrl = `${baseUrl}/hubs/notifications`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => accessToken,
        withCredentials: true,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return this.reconnectDelay * (retryContext.previousRetryCount + 1);
          }
          return null; // Para tentativas após maxReconnectAttempts
        }
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    // Eventos de conexão
    this.connection.onclose((error) => {
      console.log('[WebSocket] Conexão fechada', error);
      if (!this.isManualDisconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`[WebSocket] Tentando reconectar (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      }
    });

    this.connection.onreconnecting((error) => {
      console.log('[WebSocket] Reconectando...', error);
    });

    this.connection.onreconnected((connectionId) => {
      console.log('[WebSocket] Reconectado com sucesso. ConnectionId:', connectionId);
      this.reconnectAttempts = 0;
    });

    // Eventos de erro
    this.connection.onclose((error) => {
      if (error) {
        console.error('[WebSocket] Erro na conexão:', error);
      }
    });

    try {
      await this.connection.start();
      console.log('[WebSocket] Conectado com sucesso!');
      this.reconnectAttempts = 0;
    } catch (error) {
      console.error('[WebSocket] Erro ao conectar:', error);
      throw error;
    }
  }

  /**
   * Desconectar do Hub SignalR
   */
  async disconnect(): Promise<void> {
    this.isManualDisconnect = true;
    
    if (this.connection) {
      try {
        await this.connection.stop();
        console.log('[WebSocket] Desconectado com sucesso');
      } catch (error) {
        console.error('[WebSocket] Erro ao desconectar:', error);
      } finally {
        this.connection = null;
        this.reconnectAttempts = 0;
      }
    }
    
    // Resetar flag após um delay para permitir reconexão automática se necessário
    setTimeout(() => {
      this.isManualDisconnect = false;
    }, 5000);
  }

  /**
   * Verificar se está conectado
   */
  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Obter estado da conexão
   */
  getState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  /**
   * Registrar handler para receber notificações
   */
  onNotificationReceived(callback: (notification: any) => void): void {
    if (!this.connection) {
      console.warn('[WebSocket] Conexão não existe. Não é possível registrar handler.');
      return;
    }

    this.connection.on('ReceiveNotification', (notification) => {
      console.log('[WebSocket] Notificação recebida:', notification);
      callback(notification);
    });
  }

  /**
   * Registrar handler para receber atualizações de grupo
   */
  onGroupUpdated(callback: (group: any) => void): void {
    if (!this.connection) {
      console.warn('[WebSocket] Conexão não existe. Não é possível registrar handler.');
      return;
    }

    this.connection.on('GroupUpdated', (group) => {
      console.log('[WebSocket] Grupo atualizado:', group);
      callback(group);
    });
  }

  /**
   * Registrar handler para receber atualizações de match
   */
  onMatchUpdated(callback: (match: any) => void): void {
    if (!this.connection) {
      console.warn('[WebSocket] Conexão não existe. Não é possível registrar handler.');
      return;
    }

    this.connection.on('MatchUpdated', (match) => {
      console.log('[WebSocket] Match atualizado:', match);
      callback(match);
    });
  }

  /**
   * Remover todos os handlers
   */
  removeAllHandlers(): void {
    if (this.connection) {
      this.connection.off('ReceiveNotification');
      this.connection.off('GroupUpdated');
      this.connection.off('MatchUpdated');
    }
  }
}

// Exportar instância singleton
export const signalRClient = new SignalRClient();

