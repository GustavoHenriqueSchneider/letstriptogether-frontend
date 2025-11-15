import React, { useEffect, useMemo } from 'react';
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Header } from './Header';
import { 
  Bell, 
  Heart, 
  Users, 
  Star
} from 'lucide-react';
import { useNotificationsStore } from '@/store/notificationsStore';

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void;
}

const formatDateTime = (timestamp: string) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const notifications = useNotificationsStore((state) => state.notifications);
  const markAllAsRead = useNotificationsStore((state) => state.markAllAsRead);

  useEffect(() => {
    if (notifications.length > 0) {
      markAllAsRead();
    }
  }, [notifications.length, markAllAsRead]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'match': return Star;
      case 'vote': return Heart;
      case 'invite': return Users;
      case 'reminder': return Bell;
      case 'system': return Bell;
      default: return Bell;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'match': return 'text-yellow-500';
      case 'vote': return 'text-red-500';
      case 'invite': return 'text-blue-500';
      case 'reminder': return 'text-orange-500';
      case 'system': return 'text-gray-500';
      default: return 'text-gray-500';
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'match': return { label: 'Match', color: 'bg-yellow-100 text-yellow-800' };
      case 'vote': return { label: 'Votação', color: 'bg-red-100 text-red-800' };
      case 'invite': return { label: 'Convite', color: 'bg-blue-100 text-blue-800' };
      case 'reminder': return { label: 'Lembrete', color: 'bg-orange-100 text-orange-800' };
      case 'system': return { label: 'Sistema', color: 'bg-gray-100 text-gray-800' };
      default: return { label: 'Notificação', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [notifications]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Notificações"
        subtitle="Notificações"
        onBack={() => onNavigate('dashboard')}
      />

      <main className="p-6 pb-20 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#01001D]">Suas notificações</h2>
          <p className="text-gray-600">Fique por dentro dos convites, votos e novidades dos grupos.</p>
        </div>

        <div className="mb-8 bg-white border border-blue-100 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#0E0652]">Feed em tempo real</p>
              <p className="text-xs text-gray-500">
                Novas notificações aparecem automaticamente enquanto você está aqui.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Este feed usa apenas um cache local deste dispositivo, então o histórico completo não fica salvo.
              </p>
            </div>
          </div>
        </div>

        {sortedNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma notificação
              </h3>
              <p className="text-gray-600">
                Assim que algo acontecer nos seus grupos, a notificação chega aqui automaticamente.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {sortedNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);
              const typeBadge = getTypeBadge(notification.type);
              const fallbackTitle =
                notification.title ??
                (notification.destinationName
                  ? `Novo match: ${notification.destinationName}`
                  : notification.groupName
                    ? `Atualização em ${notification.groupName}`
                    : 'Nova notificação');
              const fallbackMessage =
                notification.message ??
                (notification.destinationName && notification.groupName
                  ? `${notification.groupName} escolheu ${notification.destinationName} como novo destino.`
                  : 'Abra para ver os detalhes desta atualização.');
              
              return (
                <Card 
                  key={notification.id} 
                  className="border border-gray-100 bg-white transition-all hover:shadow-md"
                >
                  <CardContent className="p-4">
                    <div className="flex space-x-3">
                      {/* Icon/Avatar */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-[#6496D8] text-white">
                              {notification.avatar}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${iconColor}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className={`font-medium ${!notification.read ? 'text-[#01001D]' : 'text-gray-900'}`}>
                            {fallbackTitle}
                          </h3>
                          <div className="flex items-center space-x-2 ml-2">
                            <Badge className={`text-xs ${typeBadge.color}`}>
                              {typeBadge.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                          {fallbackMessage}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <span>{formatDateTime(notification.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

    </div>
  );
}