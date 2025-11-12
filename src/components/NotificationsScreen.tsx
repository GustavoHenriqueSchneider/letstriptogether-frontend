import React, { useState } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { 
  ArrowLeft, 
  Bell, 
  Heart, 
  Users, 
  Star, 
  Calendar,
  MapPin,
  Check,
  X,
  Filter,
  MoreHorizontal
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

export function NotificationsScreen({ onNavigate }: NotificationsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'invites'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'match',
      title: 'Match Encontrado! 🎉',
      message: 'Seu grupo "Férias Europa 2024" encontrou um match perfeito: Santorini!',
      time: '2 min',
      read: false,
      groupName: 'Férias Europa 2024'
    }
  ]);

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

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'invites') return notif.type === 'invite';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6 text-[#01001D]" />
          </button>
          
          <div className="text-center flex-1 mx-4">
            <h1 className="text-lg font-semibold text-[#01001D]">Notificações</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600">{unreadCount} não lidas</p>
            )}
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white border-b">
        <div className="flex px-4">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-2 text-sm font-medium ${
              filter === 'all'
                ? 'text-[#0E0652] border-b-2 border-[#0E0652] bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Todas
            <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
              {notifications.length}
            </span>
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 py-3 px-2 text-sm font-medium ${
              filter === 'unread'
                ? 'text-[#0E0652] border-b-2 border-[#0E0652] bg-blue-50'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Não Lidas
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4">
        {filteredNotifications.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'unread' ? 'Tudo em dia!' : 'Nenhuma notificação'}
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' 
                  ? 'Você não tem notificações não lidas.'
                  : 'Você receberá notificações aqui quando houver novidades.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = getIcon(notification.type);
              const iconColor = getIconColor(notification.type);
              const typeBadge = getTypeBadge(notification.type);
              
              return (
                <Card 
                  key={notification.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    !notification.read ? 'bg-blue-50 border-[#6496D8]' : ''
                  }`}
                  onClick={() => !notification.actionRequired && markAsRead(notification.id)}
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
                            {!notification.read && (
                              <div className="w-2 h-2 bg-[#0E0652] rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-sm mb-2 ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                          {notification.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span>{notification.time}</span>
                            {notification.groupName && (
                              <>
                                <span>•</span>
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {notification.groupName}
                                </span>
                              </>
                            )}
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
      </div>

      {/* Quick Actions */}
      {unreadCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4">
          <Card className="bg-[#0E0652] text-white border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  {unreadCount} notificaç{unreadCount > 1 ? 'ões' : 'ão'} não lida{unreadCount > 1 ? 's' : ''}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-[#0E0652]"
                  onClick={() => {
                    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
                  }}
                >
                  <Check className="h-4 w-4 mr-1" />
                  Marcar todas como lidas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}