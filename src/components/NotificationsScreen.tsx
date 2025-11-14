import React, { useMemo, useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Header } from './Header';
import { 
  Bell, 
  Heart, 
  Users, 
  Star, 
  Check
} from 'lucide-react';

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void;
}

interface Notification {
  id: number;
  type: 'vote' | 'match' | 'invite' | 'reminder' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
  groupName?: string;
  actionRequired?: boolean;
  actions?: Array<{
    label: string;
    type: 'accept' | 'reject' | 'view';
    variant?: 'default' | 'outline';
  }>;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const handleAction = (notificationId: number, actionType: string) => {
    // Handle actions like accept/reject invites
    if (actionType === 'accept' || actionType === 'reject') {
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    } else if (actionType === 'view') {
      markAsRead(notificationId);
      onNavigate('dashboard');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const sortedNotifications = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
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
                            {notification.title}
                          </h3>
                          <div className="flex items-center space-x-2 ml-2">
                            <Badge className={`text-xs ${typeBadge.color}`}>
                              {typeBadge.label}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <span>{formatDateTime(notification.time)}</span>
                        </div>

                          {notification.actionRequired && notification.actions && (
                            <div className="flex space-x-2">
                              {notification.actions.map((action, index) => (
                                <Button
                                  key={index}
                                  size="sm"
                                  variant={action.variant === 'outline' ? 'outline' : 'default'}
                                  className={
                                    action.variant === 'outline'
                                      ? 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                      : 'bg-[#0E0652] hover:bg-[#130F61] text-white'
                                  }
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(notification.id, action.type);
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}
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