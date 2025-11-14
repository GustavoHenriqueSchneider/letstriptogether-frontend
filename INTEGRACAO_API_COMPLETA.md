# ✅ Integração com API Pública - Completa

Todos os serviços foram integrados com a API pública (`letstriptogether-public-api`).

## 🔌 Serviços Integrados

### ✅ Autenticação (`src/services/api/auth.ts`)
- `login()` - POST `/api/v1/auth/login`
- `register()` - Fluxo completo com confirmação de email
- `sendRegisterConfirmationEmail()` - POST `/api/v1/auth/email/send`
- `validateRegisterConfirmationCode()` - POST `/api/v1/auth/email/validate`
- `completeRegister()` - POST `/api/v1/auth/register`
- `resetPassword()` - POST `/api/v1/auth/reset-password/request`
- `refreshToken()` - POST `/api/v1/auth/refresh`
- `logout()` - POST `/api/v1/auth/logout`

### ✅ Grupos (`src/services/api/groups.ts`)
- `getAll()` - GET `/api/v1/groups?pageNumber=1&pageSize=10`
- `getById()` - GET `/api/v1/groups/:groupId`
- `create()` - POST `/api/v1/groups`
- `update()` - PUT `/api/v1/groups/:groupId`
- `delete()` - DELETE `/api/v1/groups/:groupId`
- `leave()` - PATCH `/api/v1/groups/:groupId/leave`
- `getNotVotedDestinations()` - GET `/api/v1/groups/:groupId/destinations-not-voted`

### ✅ Destinos (`src/services/api/destinations.ts`)
- `getById()` - GET `/api/v1/destinations/:destinationId`
- `getByGroup()` - GET `/api/v1/groups/:groupId/destinations-not-voted`
- `vote()` - POST `/api/v1/groups/:groupId/destination-votes`
- `updateVote()` - PUT `/api/v1/groups/:groupId/destination-votes/:destinationVoteId`
- `getVotes()` - GET `/api/v1/groups/:groupId/destination-votes`

### ✅ Matches (`src/services/api/matches.ts`)
- `getByGroup()` - GET `/api/v1/groups/:groupId/matches`
- `getById()` - GET `/api/v1/groups/:groupId/matches/:matchId`
- `remove()` - DELETE `/api/v1/groups/:groupId/matches/:matchId`

### ✅ Membros (`src/services/api/members.ts`)
- `getByGroup()` - GET `/api/v1/groups/:groupId/members`
- `getById()` - GET `/api/v1/groups/:groupId/members/:memberId`
- `invite()` - POST `/api/v1/groups/:groupId/invitations`
- `getActiveInvitation()` - GET `/api/v1/groups/:groupId/invitations`
- `cancelInvitation()` - PATCH `/api/v1/groups/:groupId/invitations/cancel`
- `remove()` - DELETE `/api/v1/groups/:groupId/members/:memberId`

### ⚠️ Notificações (`src/services/api/notifications.ts`)
- A API pública **não expõe** endpoint de notificações
- Por enquanto, ainda usa dados mockados
- **Solução futura**: Implementar SignalR/WebSockets ou criar endpoint na API interna

## 🔧 Configuração

### Variável de Ambiente
Crie arquivo `.env` na raiz:
```env
VITE_API_BASE_URL=http://localhost:5089/api/v1
```

### Cliente API
O cliente está configurado em `src/services/api/client.ts`:
- Base URL: `/api/v1` (versionamento)
- `withCredentials: true` (para cookies/sessionId)
- Interceptor de refresh token automático
- Interceptor de autenticação (Bearer token)

## 📝 Observações Importantes

1. **IDs são GUIDs**: A API usa GUIDs (strings), mas o frontend usa números. Há conversão temporária.

2. **SessionId**: Vem automaticamente via cookie (Set-Cookie do servidor). Não precisa ser enviado manualmente.

3. **Refresh Token**: Salvo em cookie por padrão (mais seguro). Pode ser configurado para localStorage.

4. **Paginação**: Todos os endpoints de listagem suportam `pageNumber` e `pageSize`.

5. **Transformação de Dados**: As respostas da API são transformadas para o formato esperado pelo frontend.

## 🚀 Próximos Passos

1. Testar todas as integrações
2. Ajustar tipos conforme respostas reais da API
3. Implementar tratamento de erros específicos
4. Adicionar loading states nos componentes
5. Implementar notificações (SignalR ou polling)

