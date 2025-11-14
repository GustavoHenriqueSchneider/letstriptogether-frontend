# 🔐 Gerenciamento de Tokens e Sessão

Este documento explica como o sistema gerencia `sessionId` e `refreshToken`.

## 📦 O que é gerenciado

1. **accessToken** - Token de acesso (localStorage)
2. **sessionId** - ID da sessão (localStorage)
3. **refreshToken** - Token de renovação (cookie ou localStorage, configurável)

## 🗂️ Onde está implementado

### Store de Autenticação
**`src/store/authStore.ts`** - Gerencia todo o estado de autenticação

### Cliente API
**`src/services/api/client.ts`** - Configurado para:
- Enviar `accessToken` no header `Authorization: Bearer {token}`
- Enviar `sessionId` no header `X-Session-Id`
- Enviar cookies automaticamente (`withCredentials: true`)
- Renovar token automaticamente quando expirar (401)

### Utilitários de Cookies
**`src/utils/cookies.ts`** - Funções para gerenciar cookies

## 🔧 Como funciona

### Login
```typescript
const response = await authApi.login(email, password);
// response contém: { user, accessToken, sessionId, refreshToken }

login(
  response.user,
  response.accessToken,
  response.sessionId,
  response.refreshToken,
  true // true = salvar refreshToken em cookie, false = localStorage
);
```

### Armazenamento

**accessToken e sessionId:**
- Sempre salvos em `localStorage`

**refreshToken:**
- Por padrão: salvo em **cookie** (mais seguro)
- Opcional: pode ser salvo em `localStorage` (passar `false` no login)

### Renovação Automática

Quando o `accessToken` expira (erro 401):
1. O interceptor do axios detecta
2. Usa o `refreshToken` para obter novo `accessToken`
3. Retenta a requisição original automaticamente
4. Se refresh falhar, faz logout

## 🔌 Integração com API

### Endpoint de Login esperado:
```typescript
POST /api/auth/login
Body: { email, password }
Response: {
  data: {
    user: User,
    accessToken: string,
    sessionId: string,
    refreshToken: string
  }
}
```

### Endpoint de Refresh esperado:
```typescript
POST /api/auth/refresh
Body: { refreshToken: string }
Headers: Cookie: sessionId=xxx (se usar cookies)
Response: {
  data: {
    accessToken: string,
    refreshToken?: string (opcional, se fornecido atualiza)
  }
}
```

## ⚙️ Configuração

### Para usar refreshToken em Cookie (Recomendado):
```typescript
login(user, accessToken, sessionId, refreshToken, true);
```

### Para usar refreshToken em localStorage:
```typescript
login(user, accessToken, sessionId, refreshToken, false);
```

## 📝 Onde está implementado

- ✅ `src/store/authStore.ts` - Store com gerenciamento completo
- ✅ `src/services/api/client.ts` - Interceptors para tokens
- ✅ `src/utils/cookies.ts` - Utilitários de cookies
- ✅ `src/services/api/auth.ts` - Serviço de autenticação (mock)

## 🔄 Fluxo de Renovação

1. Requisição falha com 401
2. Interceptor captura
3. Busca `refreshToken` (cookie ou localStorage)
4. Chama `/api/auth/refresh`
5. Atualiza `accessToken` (e `refreshToken` se fornecido)
6. Retenta requisição original
7. Se falhar, faz logout

## ⚠️ Dados Mockados

Atualmente `authApi.login()` retorna dados mockados. Quando integrar com API real:

1. Descomente código em `src/services/api/auth.ts`
2. A API deve retornar `accessToken`, `sessionId` e `refreshToken`
3. O sistema já está preparado para usar!

