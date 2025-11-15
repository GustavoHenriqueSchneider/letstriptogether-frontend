
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useAuthStore } from "./store/authStore";
import { signalRClient } from "./services/websocket/signalrClient";

console.log('[main.tsx] Calling init()...');
useAuthStore.getState().init();

const { isAuthenticated, isInitialized, accessToken, sessionId, user } = useAuthStore.getState();
console.log('[main.tsx] After init() - State:');
console.log('  - isInitialized:', isInitialized);
console.log('  - isAuthenticated:', isAuthenticated);
console.log('  - hasAccessToken:', !!accessToken);
console.log('  - hasSessionId:', !!sessionId);
console.log('  - hasUser:', !!user);
console.log('  - Current pathname:', window.location.pathname);

if (isAuthenticated) {
  console.log('[main.tsx] User is authenticated, connecting WebSocket...');
  signalRClient.connect().catch((error) => {
    console.error('[main.tsx] Erro ao conectar WebSocket na inicialização:', error);
  });
} else {
  console.log('[main.tsx] User is NOT authenticated');
}

console.log('[main.tsx] Rendering App component...');
createRoot(document.getElementById("root")!).render(<App />);
  