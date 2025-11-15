
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useAuthStore } from "./store/authStore";
import { signalRClient } from "./services/websocket/signalrClient";

useAuthStore.getState().init();

const { isAuthenticated } = useAuthStore.getState();

if (isAuthenticated) {
  signalRClient.connect().catch(() => {
  });
}

createRoot(document.getElementById("root")!).render(<App />);
  