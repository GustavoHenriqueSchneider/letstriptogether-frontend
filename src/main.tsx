
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { useAuthStore } from "./store/authStore";
import { signalRClient } from "./services/websocket/signalrClient";
import icon from "./assets/icon.png";

useAuthStore.getState().init();

const { isAuthenticated } = useAuthStore.getState();

const favicon =
  document.querySelector<HTMLLinkElement>("link[rel*='icon']") ??
  document.createElement("link");
favicon.rel = "icon";
favicon.type = "image/png";
favicon.href = icon;
if (!favicon.parentElement) {
  document.head.appendChild(favicon);
}

if (isAuthenticated) {
  signalRClient.connect().catch(() => {
  });
}

createRoot(document.getElementById("root")!).render(<App />);
  