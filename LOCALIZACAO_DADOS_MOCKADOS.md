# 📍 Localização dos Dados Mockados para Integração com API

Este documento lista **exatamente onde** estão todos os dados mockados que precisam ser substituídos por chamadas reais de API.

## 🗂️ Arquivo Principal de Dados Mockados

**`src/services/mock/data.ts`** - Arquivo central com todos os dados mockados:
- `mockGroups` - Grupos do usuário
- `mockDestinations` - Destinos para votação
- `mockMatches` - Matches encontrados
- `mockMembers` - Membros dos grupos
- `mockNotifications` - Notificações
- `mockInvitations` - Convites pendentes

## 🔌 Serviços de API (Atualmente usando Mocks)

Todos os arquivos em `src/services/api/` estão usando dados mockados. Cada arquivo tem comentários `⚠️` e `TODO` indicando onde fazer as substituições:

### 1. **`src/services/api/auth.ts`**
- ⚠️ `login()` - **Linha ~20**: Mock retorna usuário e token fake
- ⚠️ `register()` - **Linha ~35**: Mock retorna usuário e token fake
- ⚠️ `resetPassword()` - **Linha ~50**: Mock apenas loga no console
- ⚠️ `verifyCode()` - **Linha ~60**: Mock aceita código "123456"

**Substituir por:**
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/reset-password`
- `POST /api/auth/verify-code`

### 2. **`src/services/api/groups.ts`**
- ⚠️ `getAll()` - **Linha ~15**: Retorna `mockGroups`
- ⚠️ `getById()` - **Linha ~25**: Busca em `mockGroups`
- ⚠️ `create()` - **Linha ~35**: Cria grupo localmente
- ⚠️ `update()` - **Linha ~50**: Não implementado
- ⚠️ `delete()` - **Linha ~60**: Não implementado

**Substituir por:**
- `GET /api/groups`
- `GET /api/groups/:id`
- `POST /api/groups`
- `PUT /api/groups/:id`
- `DELETE /api/groups/:id`

### 3. **`src/services/api/destinations.ts`**
- ⚠️ `getByGroup()` - **Linha ~15**: Retorna `mockDestinations`
- ⚠️ `vote()` - **Linha ~25**: Mock apenas loga no console

**Substituir por:**
- `GET /api/groups/:groupId/destinations`
- `POST /api/destinations/:id/vote`

### 4. **`src/services/api/matches.ts`**
- ⚠️ `getByGroup()` - **Linha ~15**: Retorna `mockMatches`

**Substituir por:**
- `GET /api/groups/:groupId/matches`

### 5. **`src/services/api/members.ts`**
- ⚠️ `getByGroup()` - **Linha ~15**: Retorna `mockMembers`
- ⚠️ `invite()` - **Linha ~25**: Mock gera link fake

**Substituir por:**
- `GET /api/groups/:groupId/members`
- `POST /api/groups/:groupId/members/invite`

### 6. **`src/services/api/notifications.ts`**
- ⚠️ `getAll()` - **Linha ~15**: Retorna `mockNotifications`
- ⚠️ `markAsRead()` - **Linha ~25**: Mock apenas loga no console

**Substituir por:**
- `GET /api/notifications`
- `PUT /api/notifications/:id/read`

## 📝 Componentes com Dados Mockados Inline

Alguns componentes têm dados mockados diretamente no código:

### **`src/components/Dashboard.tsx`**
- ⚠️ **Linha ~35**: `useState` com grupos mockados
- ⚠️ **Linha ~54**: Array `invitations` mockado

**Substituir por:**
```typescript
import { groupsApi } from '@/services/api/groups';
import { useEffect } from 'react';

useEffect(() => {
  groupsApi.getAll().then(setGroups).catch(console.error);
}, []);
```

### **`src/components/VotingScreen.tsx`**
- ⚠️ Array `destinations` mockado (verificar linha específica)

### **`src/components/MatchesScreen.tsx`**
- ⚠️ Array `matches` mockado (verificar linha específica)

### **`src/components/MembersScreen.tsx`**
- ⚠️ Array `members` mockado (verificar linha específica)

### **`src/components/NotificationsScreen.tsx`**
- ⚠️ Array `notifications` mockado (verificar linha específica)

## 🔧 Como Substituir

### Passo 1: Configurar URL da API
Crie `.env` na raiz:
```env
VITE_API_BASE_URL=http://localhost:5089/api
```

### Passo 2: Em cada serviço
1. Descomente linhas com `// IMPLEMENTAÇÃO REAL:`
2. Comente/remova linhas com `// MOCK:`
3. Remova import: `import { mockX } from '../mock/data'`

### Passo 3: Atualizar componentes
Substitua `useState([...mock])` por `useEffect(() => { api.getAll().then(setData) })`

## ✅ Checklist Rápido

- [ ] `src/services/api/auth.ts` - 4 métodos
- [ ] `src/services/api/groups.ts` - 5 métodos
- [ ] `src/services/api/destinations.ts` - 2 métodos
- [ ] `src/services/api/matches.ts` - 1 método
- [ ] `src/services/api/members.ts` - 2 métodos
- [ ] `src/services/api/notifications.ts` - 2 métodos
- [ ] `src/components/Dashboard.tsx` - 2 arrays mockados
- [ ] Outros componentes com dados inline

