# 🤔 O que é Zustand?

## Explicação Simples

**Zustand** é uma biblioteca para **compartilhar dados** entre componentes React.

### Analogia
Imagine uma "caixa compartilhada" onde você guarda informações que vários componentes precisam acessar:
- Quem está logado?
- Qual token de autenticação?
- Qual modal está aberto?

### Por que usar?

**Sem Zustand (Context API nativo):**
```typescript
// Muito código boilerplate
const AuthContext = createContext();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // ... muito código
  return <AuthContext.Provider value={{...}}>{children}</AuthContext.Provider>
}
```

**Com Zustand:**
```typescript
// Simples e direto
export const useAuthStore = create((set) => ({
  user: null,
  login: (user) => set({ user })
}));
```

### O que está sendo usado no projeto?

1. **`authStore`** - Guarda informações do usuário logado
2. **`modalStore`** - Controla quais modais estão abertos

### Posso remover?

Sim, mas você teria que:
- Usar Context API (mais código)
- Ou passar props manualmente (muito trabalhoso)

**Recomendação:** Manter Zustand - é leve, simples e padrão de mercado.

