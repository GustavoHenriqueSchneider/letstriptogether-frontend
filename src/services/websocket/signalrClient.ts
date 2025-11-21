import * as signalR from '@microsoft/signalr';
import { useAuthStore } from '@/store/authStore';

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

class SignalRClient {
  private connection: signalR.HubConnection | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private isManualDisconnect = false;
  private shouldReconnect = true;
  private isConnecting = false;

  async connect(): Promise<void> {
    if (this.isConnecting) {
      return;
    }

    if (this.connection) {
      const state = this.connection.state;
      if (state === signalR.HubConnectionState.Connected || 
          state === signalR.HubConnectionState.Connecting ||
          state === signalR.HubConnectionState.Reconnecting) {
        return;
      }
      if (state === signalR.HubConnectionState.Disconnecting) {
        await this.connection.stop().catch(() => {});
        await new Promise(resolve => setTimeout(resolve, 100));
        this.connection = null;
      }
      if (state === signalR.HubConnectionState.Disconnected) {
        this.connection = null;
      }
    }

    this.isConnecting = true;

    const { accessToken, isAuthenticated } = useAuthStore.getState();
    
    if (!accessToken || !isAuthenticated) {
      return;
    }

    if (isTokenExpired(accessToken)) {
      this.shouldReconnect = false;
      return;
    }

    this.shouldReconnect = true;

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5089/api/v1';
    const baseUrl = apiBaseUrl.replace('/api/v1', '').replace('/api', '');
    const hubUrl = `${baseUrl}/hubs/notifications`;

    const originalError = window.console.error.bind(window.console);
    const originalWarn = window.console.warn.bind(window.console);
    const originalLog = window.console.log.bind(window.console);
    const originalInfo = window.console.info?.bind(window.console) || originalLog;
    const originalDebug = window.console.debug?.bind(window.console) || originalLog;
    
    const errorInterceptor = (...args: any[]) => {
      const fullMessage = args.map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return arg.message;
        if (arg && typeof arg === 'object') {
          try { return JSON.stringify(arg); } catch { return String(arg); }
        }
        return String(arg);
      }).join(' ');
      
      const lowerMessage = fullMessage.toLowerCase();
      
      const isWebSocketError = 
        (lowerMessage.includes('websocket') && lowerMessage.includes('failed')) ||
        (lowerMessage.includes('websocket connection to') && lowerMessage.includes('failed')) ||
        (lowerMessage.includes('websocket connection') && lowerMessage.includes('failed'));
      
      const isSignalREndpoint =
        lowerMessage.includes('hubs/notifications') ||
        lowerMessage.includes('localhost:5089') ||
        lowerMessage.includes('ws://localhost:5089') ||
        lowerMessage.includes('ws://localhost') ||
        (fullMessage.includes('hubs/notifications') || fullMessage.includes('localhost:5089'));
      
      if (isWebSocketError && isSignalREndpoint) {
        return;
      }
      
      if ((fullMessage.includes("WebSocket connection to") || fullMessage.includes("websocket connection to")) && 
          (fullMessage.includes("hubs/notifications") || fullMessage.includes("Hubs/notifications")) && 
          (fullMessage.includes("failed") || fullMessage.includes("Failed"))) {
        return;
      }
      
      if (fullMessage.match(/websocket.*failed/i) && fullMessage.match(/hubs\/notifications|localhost:5089/i)) {
        return;
      }
      
      if (/websocket/i.test(fullMessage) && /failed/i.test(fullMessage) && 
          (/hubs\/notifications|localhost:5089|ws:\/\/localhost/i.test(fullMessage))) {
        return;
      }
      
      originalError(...args);
    };
    
    const warnInterceptor = (...args: any[]) => {
      const fullMessage = args.map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return arg.message;
        if (arg && typeof arg === 'object') {
          try { return JSON.stringify(arg); } catch { return String(arg); }
        }
        return String(arg);
      }).join(' ').toLowerCase();
      
      if ((fullMessage.includes('websocket') || fullMessage.includes('signalr')) &&
          (fullMessage.includes('transport') || fullMessage.includes('connection') || 
           fullMessage.includes('hubs') || fullMessage.includes('localhost'))) {
        return;
      }
      originalWarn(...args);
    };
    
    const logInterceptor = (...args: any[]) => {
      const fullMessage = args.map(arg => {
        if (typeof arg === 'string') return arg;
        if (arg instanceof Error) return arg.message;
        if (arg && typeof arg === 'object') {
          try { return JSON.stringify(arg); } catch { return String(arg); }
        }
        return String(arg);
      }).join(' ').toLowerCase();
      
      if ((fullMessage.includes('websocket') || 
           fullMessage.includes('signalr') ||
           fullMessage.includes('notificationhub') ||
           fullMessage.includes('connected') ||
           fullMessage.includes('disconnected')) &&
          (fullMessage.includes('hubs') || 
           fullMessage.includes('localhost:5089') ||
           fullMessage.includes('connection'))) {
        return;
      }
      
      originalLog(...args);
    };
    
    window.console.error = errorInterceptor;
    window.console.warn = warnInterceptor;
    window.console.log = logInterceptor;
    if (window.console.info) window.console.info = logInterceptor;
    if (window.console.debug) window.console.debug = logInterceptor;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => {
          const currentState = useAuthStore.getState();
          const currentToken = currentState.accessToken;
          
          if (!currentToken || !currentState.isAuthenticated || isTokenExpired(currentToken)) {
            this.shouldReconnect = false;
            throw new Error('Token inválido ou expirado');
          }
          
          return currentToken;
        },
        withCredentials: true,
        skipNegotiation: false,
        transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (!this.shouldReconnect) {
            return null;
          }
          
          const { accessToken, isAuthenticated } = useAuthStore.getState();
          if (!accessToken || !isAuthenticated || isTokenExpired(accessToken)) {
            this.shouldReconnect = false;
            return null;
          }
          
          if (retryContext.previousRetryCount < this.maxReconnectAttempts) {
            return this.reconnectDelay * (retryContext.previousRetryCount + 1);
          }
          return null;
        }
      })
      .configureLogging(signalR.LogLevel.None)
      .build();

    this.connection.onclose((error) => {
      if (this.isManualDisconnect) {
        this.connection = null;
        return;
      }

      if (error) {
        const errorMessage = error.message || error.toString();
        
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
          this.shouldReconnect = false;
          this.connection = null;
          return;
        }
        
        if (errorMessage.includes('WebSocket failed to connect') || 
            errorMessage.includes('connection could not be found')) {
          this.shouldReconnect = false;
          this.connection = null;
          return;
        }
      }
      
      this.isManualDisconnect = false;
      this.connection = null;
    });

    this.connection.onreconnecting((error) => {
      if (error) {
        const errorMessage = error.message || error.toString();
        
        if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') ||
            errorMessage.includes('WebSocket failed to connect') ||
            errorMessage.includes('connection could not be found')) {
          this.shouldReconnect = false;
          if (this.connection) {
            this.connection.stop().catch(() => {});
            this.connection = null;
          }
        }
      }
    });

    this.connection.onreconnected((connectionId) => {
      this.reconnectAttempts = 0;
      this.shouldReconnect = true;
    });

    try {
      await this.connection.start();
      this.reconnectAttempts = 0;
      this.shouldReconnect = true;
      this.isConnecting = false;
    } catch (error: any) {
      this.isConnecting = false;
      const errorMessage = error?.message || error?.toString() || '';
      
      if (errorMessage.includes('401') || errorMessage.includes('Unauthorized') ||
          errorMessage.includes('WebSocket failed to connect') ||
          errorMessage.includes('connection could not be found') ||
          errorMessage.includes('Failed to start the transport') ||
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('ERR_CONNECTION_REFUSED')) {
        this.shouldReconnect = false;
        this.connection = null;
        if (import.meta.env.DEV) {
          console.debug('[SignalR] Conexão não disponível - API pública pode não estar rodando na porta 5089');
        }
        this.isConnecting = false;
        return;
      }
      
      this.isConnecting = false;
      throw error;
    } finally {
      setTimeout(() => {
        window.console.error = originalError;
        window.console.warn = originalWarn;
        window.console.log = originalLog;
        if (window.console.info) window.console.info = originalInfo;
        if (window.console.debug) window.console.debug = originalDebug;
      }, 5000);
    }
  }

  async disconnect(): Promise<void> {
    this.isManualDisconnect = true;
    
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
      } finally {
        this.connection = null;
        this.reconnectAttempts = 0;
      }
    }
    
    setTimeout(() => {
      this.isManualDisconnect = false;
    }, 5000);
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  getState(): signalR.HubConnectionState | null {
    return this.connection?.state ?? null;
  }

  onNotificationReceived(callback: (notification: any) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on('ReceiveNotification', (notification) => {
      callback(notification);
    });
  }

  onGroupUpdated(callback: (group: any) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on('GroupUpdated', (group) => {
      callback(group);
    });
  }

  onMatchUpdated(callback: (match: any) => void): void {
    if (!this.connection) {
      return;
    }

    this.connection.on('MatchUpdated', (match) => {
      callback(match);
    });
  }

  removeAllHandlers(): void {
    if (this.connection) {
      this.connection.off('ReceiveNotification');
      this.connection.off('GroupUpdated');
      this.connection.off('MatchUpdated');
    }
  }
}

export const signalRClient = new SignalRClient();

