import { useEffect, useCallback, useState } from 'react';
import { router } from '@/app/router';
import { signalRClient } from '@/services/websocket/signalrClient';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import type { Notification } from '@/types';
import { useNotificationsStore } from '@/store/notificationsStore';

const PUBLIC_ROUTES = ['/', '/login', '/register', '/terms-of-use', '/about-us'];

export function useWebSocket() {
  const { isAuthenticated } = useAuthStore();
  const { showSuccess, showError } = useModalStore();
  const addNotification = useNotificationsStore((state) => state.addNotification);
  const [currentPath, setCurrentPath] = useState(router.state.location.pathname);

  useEffect(() => {
    const unsubscribe = router.subscribe((state) => {
      setCurrentPath(state.location.pathname);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    if (isAuthenticated && !isPublicRoute) {
      signalRClient.connect().catch((error) => {
        console.error('Erro ao conectar WebSocket:', error);
        showError('Erro ao conectar com o servidor em tempo real');
      });
    } else {
      signalRClient.disconnect().catch((error) => {
        console.error('Erro ao desconectar WebSocket:', error);
      });
    }

    return () => {
      if (!isAuthenticated) {
        signalRClient.disconnect().catch(console.error);
      }
    };
  }, [isAuthenticated, currentPath, showError]);

  const handleNotification = useCallback((notification: Notification) => {
    console.log('Nova notificação recebida:', notification);

    const normalizedType = (notification.type ?? 'match') as Notification['type'];
    const createdAt = notification.createdAt ?? new Date().toISOString();

    const destination = notification.destinationName;
    const groupName = notification.groupName;

    const computedTitle =
      notification.title ??
      (normalizedType === 'match'
        ? destination
          ? `Novo match: ${destination}`
          : groupName
            ? `Novo match em ${groupName}`
            : 'Novo match encontrado'
        : 'Nova notificação');

    const computedMessage =
      notification.message ??
      (normalizedType === 'match'
        ? destination && groupName
          ? `${groupName} confirmou ${destination} como destino preferido.`
          : 'Seu grupo recebeu um novo match.'
        : 'Você tem uma nova atualização.');

    addNotification({
      id: notification.id,
      type: normalizedType,
      title: computedTitle,
      message: computedMessage,
      groupName,
      destinationName: destination,
      avatar: notification.avatar,
      createdAt,
    });

  }, [addNotification, showSuccess]);

  const handleGroupUpdated = useCallback((group: any) => {
    console.log('Grupo atualizado:', group);
  }, []);

  const handleMatchUpdated = useCallback((match: any) => {
    console.log('Match atualizado:', match);
  }, []);

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.includes(currentPath);

    if (isAuthenticated && !isPublicRoute) {
      signalRClient.onNotificationReceived(handleNotification);
      signalRClient.onGroupUpdated(handleGroupUpdated);
      signalRClient.onMatchUpdated(handleMatchUpdated);
    }

    return () => {
      signalRClient.removeAllHandlers();
    };
  }, [isAuthenticated, currentPath, handleNotification, handleGroupUpdated, handleMatchUpdated]);

  return {
    isConnected: signalRClient.isConnected(),
    connectionState: signalRClient.getState()
  };
}

