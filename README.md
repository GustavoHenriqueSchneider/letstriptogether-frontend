# Let's Trip Together - Frontend

Frontend da aplicação **Let's Trip Together**, uma plataforma colaborativa para planejamento de viagens em grupo. O sistema permite que grupos de amigos votem em destinos de viagem e encontrem matches baseados nas preferências coletivas.

## 📋 Sobre o Projeto

O **Let's Trip Together** é uma aplicação web que facilita o planejamento de viagens em grupo através de um sistema de votação colaborativa. Os usuários podem:

- Criar e gerenciar grupos de viagem
- Votar em destinos de viagem (like/pass)
- Visualizar matches baseados nas preferências do grupo
- Gerenciar membros e convites
- Configurar preferências pessoais de viagem
- Receber notificações em tempo real sobre matches e atualizações

## 🚀 Tecnologias

### Core
- **React 18.3.1** - Biblioteca para construção de interfaces
- **TypeScript** - Tipagem estática
- **Vite 6.3.5** - Build tool e dev server

### Roteamento e Estado
- **React Router DOM 7.9.5** - Roteamento client-side
- **Zustand 5.0.8** - Gerenciamento de estado global

### UI/UX
- **Tailwind CSS** - Framework CSS utility-first
- **Radix UI** - Componentes acessíveis e customizáveis
- **Lucide React** - Biblioteca de ícones
- **Recharts** - Gráficos e visualizações

### Comunicação
- **Axios 1.13.2** - Cliente HTTP para requisições à API
- **SignalR (@microsoft/signalr 9.0.6)** - Comunicação em tempo real via WebSocket

### Formulários e Validação
- **React Hook Form 7.55.0** - Gerenciamento de formulários

## 🛠️ Instalação

### Pré-requisitos

- **Node.js** 18+ (recomendado: 20+)
- **npm** ou **yarn**

### Passos

1. Clone o repositório:
```bash
git clone <repository-url>
cd letstriptogether-frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente (veja seção [Configuração](#-configuração))

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_BASE_URL=http://localhost:5089/api/v1
```

**Variáveis disponíveis:**
- `VITE_API_BASE_URL` - URL base da API backend (padrão: `http://localhost:5089/api/v1`)

### Configuração do Vite

O projeto está configurado para:
- Porta padrão: `3000`
- Build output: `build/`
- Path aliases: `@/` aponta para `src/`

## 📜 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Gera build de produção
```

## 🎯 Funcionalidades Principais

### Autenticação
- ✅ Login com email e senha
- ✅ Registro em 3 etapas (dados, verificação de email, senha)
- ✅ Recuperação de senha
- ✅ Refresh token automático
- ✅ Gerenciamento de sessão

### Grupos
- ✅ Criação de grupos de viagem
- ✅ Listagem de grupos com paginação
- ✅ Visualização de detalhes do grupo
- ✅ Edição e exclusão de grupos
- ✅ Sair de grupos

### Votação
- ✅ Interface swipe-like para votar em destinos
- ✅ Votação like/pass em destinos
- ✅ Carregamento paginado de destinos
- ✅ Visualização de detalhes do destino
- ✅ Progresso de votação

### Matches
- ✅ Visualização de matches do grupo
- ✅ Detalhes dos matches (destino, preferências atendidas)
- ✅ Remoção de matches
- ✅ Atualizações em tempo real via WebSocket

### Membros
- ✅ Listagem de membros do grupo
- ✅ Convites via link
- ✅ Geração e cancelamento de links de convite
- ✅ Remoção de membros (apenas owner)
- ✅ Visualização de permissões (owner/member)

### Preferências
- ✅ Configuração de preferências pessoais:
  - Cultura (museus, monumentos, etc.)
  - Entretenimento (parques, esportes, etc.)
  - Tipos de lugar (praia, montanha, etc.)
  - Gastronomia
  - Shopping
- ✅ Validação obrigatória na primeira entrada

### Notificações
- ✅ Notificações em tempo real via SignalR
- ✅ Notificações de matches
- ✅ Notificações de atualizações de grupos
- ✅ Marcar como lida

### Perfil
- ✅ Visualização e edição de perfil
- ✅ Alteração de senha
- ✅ Exclusão/anonimização de conta

## 🔐 Segurança

- Tokens JWT armazenados de forma segura
- Refresh token em cookies httpOnly
- Interceptores Axios para renovação automática de tokens
- Validação de rotas protegidas
- Redirecionamento automático para login quando não autenticado

## 🌐 Comunicação em Tempo Real

A aplicação utiliza **SignalR** para comunicação em tempo real:

- Conexão automática após login
- Reconexão automática em caso de desconexão
- Notificações push de matches e atualizações
- Atualizações de grupos em tempo real

## 🎨 Design System

O projeto utiliza:
- **Tailwind CSS** para estilização
- **Radix UI** para componentes acessíveis
- Design system customizado com cores:
  - Primária: `#0E0652`, `#130F61`, `#002F76`
  - Secundária: `#6496D8`
  - Texto: `#01001D`

## 📱 Responsividade

A aplicação é totalmente responsiva e otimizada para:
- Desktop
- Tablet
- Mobile

## 🧪 Estrutura de Tipos

Principais tipos TypeScript definidos em `src/types/index.ts`:

- `User` - Usuário
- `Group` - Grupo de viagem
- `Destination` - Destino de viagem
- `Match` - Match de destino
- `Member` - Membro do grupo
- `Notification` - Notificação
- `UserPreferences` - Preferências do usuário

## 🔄 Fluxo de Dados

1. **Autenticação**: Login → Token armazenado → Estado global atualizado
2. **Grupos**: Listagem → Seleção → Navegação para funcionalidades
3. **Votação**: Carregamento de destinos → Votação → Atualização de estado
4. **Matches**: Cálculo no backend → Notificação via WebSocket → Atualização na UI
5. **Notificações**: WebSocket → Store → Componente de notificações

## 🚧 Desenvolvimento

### Adicionando Novos Componentes

1. Crie o componente em `src/components/`
2. Use os componentes UI de `src/components/ui/`
3. Adicione tipos em `src/types/index.ts` se necessário
4. Integre com stores Zustand se precisar de estado global

### Adicionando Novas Rotas

1. Adicione a rota em `src/app/router.tsx`
2. Crie a página em `src/pages/`
3. Configure proteção de rota se necessário

### Adicionando Novos Serviços API

1. Crie o serviço em `src/services/api/`
2. Use o `apiClient` de `src/services/api/client.ts`
3. Defina tipos de request/response
4. Integre com stores se necessário

## 📦 Build de Produção

```bash
npm run build
```

O build será gerado na pasta `build/` e pode ser servido por qualquer servidor web estático.

## 🤝 Contribuindo

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e proprietário.

## 👥 Equipe

Desenvolvido como parte do Projeto Final de Curso (PFC) da UMC.

---

**Let's Trip Together** - Planejar viagens em grupo nunca foi tão fácil! ✈️🌍
  