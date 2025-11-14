# 🔌 Configuração WebSocket (SignalR)

## ✅ Implementação Completa

### Backend (API Pública)

1. **SignalR adicionado** ao projeto
2. **NotificationHub criado** em `src/WebApi/Hubs/NotificationHub.cs`
3. **Configurado no Startup.cs**:
   - `services.AddSignalR()` em `ConfigureServices`
   - `endpoints.MapHub<NotificationHub>("/hubs/notifications")` em `Configure`

### Frontend

1. **@microsoft/signalr instalado**
2. **Cliente SignalR criado** em `src/services/websocket/signalrClient.ts`
3. **Hook useWebSocket** em `src/hooks/useWebSocket.ts`
4. **Integrado com authStore**:
   - Conecta automaticamente após login
   - Desconecta no logout
   - Reconecta automaticamente em caso de falha

## 🔧 Como Funciona

### Conexão Automática

1. **Após Login**: WebSocket conecta automaticamente
2. **Na Inicialização**: Se usuário já estiver autenticado, conecta
3. **Reconexão Automática**: Até 5 tentativas com delay crescente

### Eventos Disponíveis

O frontend está preparado para receber:

- **ReceiveNotification**: Notificações do usuário
- **GroupUpdated**: Atualizações de grupos
- **MatchUpdated**: Atualizações de matches

### Métodos Disponíveis

- **MarkNotificationAsReceived**: Marcar notificação como recebida

## 📡 Endpoint

- **URL**: `/hubs/notifications`
- **Autenticação**: Bearer Token (via `accessTokenFactory`)
- **Transporte**: WebSockets com fallback para Long Polling

## 🚀 Como Enviar Notificações do Backend

No seu código backend, injete `IHubContext<NotificationHub>` e envie notificações:

```csharp
public class NotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    
    public NotificationService(IHubContext<NotificationHub> hubContext)
    {
        _hubContext = hubContext;
    }
    
    public async Task SendNotificationToUser(string userId, object notification)
    {
        await _hubContext.Clients.Group($"user_{userId}")
            .SendAsync("ReceiveNotification", notification);
    }
    
    public async Task NotifyGroupUpdated(string userId, object group)
    {
        await _hubContext.Clients.Group($"user_{userId}")
            .SendAsync("GroupUpdated", group);
    }
    
    public async Task NotifyMatchUpdated(string userId, object match)
    {
        await _hubContext.Clients.Group($"user_{userId}")
            .SendAsync("MatchUpdated", match);
    }
}
```

## 🔍 Debug

No console do navegador, você verá logs:
- `[WebSocket] Conectado com sucesso!`
- `[WebSocket] Notificação recebida: ...`
- `[WebSocket] Reconectando...`

## ⚙️ Configuração

A URL do WebSocket é derivada de `VITE_API_BASE_URL`:
- Se `VITE_API_BASE_URL=http://localhost:5089/api/v1`
- WebSocket será: `http://localhost:5089/hubs/notifications`

## 📝 Próximos Passos

1. Implementar `NotificationService` no backend para enviar notificações
2. Integrar com eventos de domínio (quando match é criado, etc.)
3. Adicionar mais tipos de notificações conforme necessário

