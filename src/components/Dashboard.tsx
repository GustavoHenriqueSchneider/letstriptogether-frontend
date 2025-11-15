import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  Plus, 
  Users, 
  MapPin, 
  Calendar,
  Settings,
  Bell,
  Search,
  Filter,
  ChevronRight,
  Globe,
  Star,
  Copy,
  Check,
  User
} from 'lucide-react';
import { groupsApi } from '@/services/api/groups';
import { usersApi } from '@/services/api/users';
import { useModalStore } from '@/store/modalStore';
import { useAuthStore } from '@/store/authStore';
import { useNotificationsStore } from '@/store/notificationsStore';
import type { Group } from '@/types';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [groupFormData, setGroupFormData] = useState({ name: '', date: '' });
  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 10;
  const { openModal, closeModal, showError } = useModalStore();
  const unreadNotifications = useNotificationsStore(
    (state) => state.notifications.filter((notification) => !notification.read).length
  );

  // Usar hook do Zustand para reagir a mudanças no isInitialized
  const isInitialized = useAuthStore((state) => state.isInitialized);

  // Carregar grupos ao montar o componente
  // Aguardar inicialização do authStore antes de fazer chamadas
  useEffect(() => {
    console.log('[Dashboard] useEffect - isInitialized:', isInitialized);
    if (isInitialized) {
      console.log('[Dashboard] Initialized, calling loadGroups...');
      loadGroups(1, true);
    } else {
      console.log('[Dashboard] Not initialized yet, waiting...');
    }
  }, [isInitialized]);

  // Detectar scroll para carregar mais grupos
  useEffect(() => {
    const handleScroll = () => {
      // Verificar se chegou ao final da página
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 // 100px antes do fim
      ) {
        if (!isLoadingMore && hasMore && !isLoading) {
          loadMoreGroups();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, isLoading]);

  const loadGroups = async (page = 1, isInitial = false) => {
    console.log('[Dashboard] loadGroups() - Starting, page:', page, 'isInitial:', isInitial);
    if (isInitial) {
      setIsLoading(true);
      openModal('loading');
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      console.log('[Dashboard] loadGroups() - Calling API...');
      const result = await groupsApi.getAllWithDetails(page, pageSize);
      console.log('[Dashboard] loadGroups() - API success, groups count:', result.groups.length);
      
      if (isInitial) {
        setGroups(result.groups);
      } else {
        setGroups(prev => [...prev, ...result.groups]);
      }
      
      setHasMore(result.hasMore);
      setPageNumber(page);
    } catch (error: any) {
      console.error('[Dashboard] loadGroups() - API error:', error);
      console.error('[Dashboard] loadGroups() - Error response:', error.response);
      showError('Erro ao carregar grupos', error.response?.data?.message || 'Não foi possível carregar os grupos');
    } finally {
      if (isInitial) {
        setIsLoading(false);
        closeModal('loading');
      } else {
        setIsLoadingMore(false);
      }
      console.log('[Dashboard] loadGroups() - Finished');
    }
  };

  const loadMoreGroups = () => {
    if (!isLoadingMore && hasMore) {
      loadGroups(pageNumber + 1, false);
    }
  };

  // ⚠️ DADOS MOCKADOS - Substituir por chamada de API
  // TODO: Usar invitationsApi.getAll() quando API estiver pronta
  const invitations = [
    {
      id: 1,
      groupName: "Carnaval Salvador",
      invitedBy: "Maria Santos",
      avatar: "🎭",
      members: 12
    },
    {
      id: 2,
      groupName: "Praia e Sol",
      invitedBy: "João Silva",
      avatar: "🏖️",
      members: 5
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'voting': return 'bg-yellow-100 text-yellow-800';
      case 'matched': return 'bg-green-100 text-green-800';
      case 'planning': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'matched': return 'Match';
      default: return 'Aguardando';
    }
  };

  const handleCreateGroupModalChange = (open: boolean) => {
    setShowCreateGroupModal(open);
    if (!open) {
      setGroupFormData({ name: '', date: '' });
    }
  };

  const handleCreateGroup = () => {
    handleCreateGroupModalChange(true);
  };

  const handleConfirmCreateGroup = async () => {
    try {
      openModal('loading');
      
      // Verificar se o usuário possui preferências
      const userData = await usersApi.getCurrentUser();
      const hasPreferences = userData.preferences && (
        (userData.preferences.culture && userData.preferences.culture.length > 0) ||
        (userData.preferences.entertainment && userData.preferences.entertainment.length > 0) ||
        (userData.preferences.placeTypes && userData.preferences.placeTypes.length > 0) ||
        userData.preferences.likesGastronomy ||
        userData.preferences.likesShopping
      );
      
      closeModal('loading');
      
      if (!hasPreferences) {
        // Se não tiver preferências, mostrar modal e redirecionar
        openModal('confirmation', {
          title: 'Preferências necessárias',
          message: 'Para criar um grupo, você precisa definir suas preferências de viagem primeiro. Deseja ser redirecionado para a página de preferências?',
          confirmText: 'Ir para preferências',
          cancelText: 'Cancelar',
          onConfirm: () => {
            setShowCreateGroupModal(false);
            onNavigate('preferences');
          }
        });
        return;
      }
      
      // Se tiver preferências, criar o grupo
      openModal('loading');
      const newGroup = await groupsApi.create({
        name: groupFormData.name,
        date: groupFormData.date
      });
      
      // Obter link de convite
      let newInviteLink = `https://letstrip.app/invite/${Math.random().toString(36).substring(7)}`;
      try {
        const { membersApi } = await import('@/services/api/members');
        const invitation = await membersApi.getActiveInvitation(newGroup.id);
        if (invitation) {
          newInviteLink = invitation.inviteLink;
        }
      } catch {
        // Se não conseguir obter o link, usar o gerado
      }
      
      setInviteLink(newInviteLink);
      setShowCreateGroupModal(false);
      setGroupFormData({ name: '', date: '' });
      
      // Recarregar lista de grupos (resetar para primeira página)
      setPageNumber(1);
      setHasMore(true);
      await loadGroups(1, true);
      
      // Mostrar modal de sucesso e redirecionar para votação
      closeModal('loading');
      const { showSuccess } = useModalStore.getState();
      showSuccess('Grupo criado com sucesso!', 'Agora você pode convidar seus amigos para começar.', () => {
        onNavigate(`groups/${newGroup.id}/members`);
        setShowInviteLinkModal(true);
      });
    } catch (error: any) {
      showError('Erro ao criar grupo', 'Não foi possível criar o grupo!');
    } finally {
      closeModal('loading');
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      // Fallback para navegadores que não suportam clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#0E0652] via-[#130F61] to-[#002F76] shadow-lg border-b border-[#002F76] sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">
                Let's Trip Together
              </h1>
              <p className="text-sm text-blue-200">Bem-vindo de volta!</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onNavigate('notifications')}
                className="relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-[10px] font-semibold text-white flex items-center justify-center shadow-lg">
                    {unreadNotifications > 99 ? '99+' : unreadNotifications}
                  </span>
                )}
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6 pb-20 max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#01001D] mb-1">Meus Grupos</h2>
          <p className="text-gray-600">Gerencie seus grupos e planeje viagens incríveis...</p>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">Carregando grupos...</p>
            </div>
          ) : (
            <>
              {/* Create New Group Card */}
              <Card 
                onClick={handleCreateGroup}
                className="border-2 border-dashed border-gray-300 hover:border-[#6496D8] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-0 h-full min-h-[320px] flex items-center justify-center" style={{ paddingBottom: 0 }}>
                  <div className="text-center p-6">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#6496D8] to-[#0E0652] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg text-[#01001D] mb-2">Criar Grupo</h3>
                    <p className="text-sm text-gray-600">Comece a planejar uma nova aventura!</p>
                  </div>
                </CardContent>
              </Card>

              {groups.length > 0 && (
                <>
                  {groups.map((group, index) => {
                    // Define gradient colors based on index
                    const gradients = [
                      'from-blue-500 to-purple-600',
                      'from-green-500 to-teal-600',
                      'from-orange-500 to-pink-600',
                      'from-indigo-500 to-blue-600',
                      'from-red-500 to-orange-600',
                      'from-cyan-500 to-blue-600',
                    ];
                    const gradient = gradients[index % gradients.length];
                    
                    return (
                      <Card key={group.id} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-0" style={{ paddingBottom: 0 }}>
                          {/* Image/Gradient Header */}
                          <div className={`h-40 bg-gradient-to-br ${gradient} flex items-center justify-center relative`}>
                            <div className="text-6xl">{group.avatar}</div>
                            {/* Status Badge */}
                            <div className="absolute top-3 right-3">
                              <Badge className={`${getStatusColor(group.status)} border-0 shadow-sm`}>
                                {getStatusText(group.status)}
                              </Badge>
                            </div>
                          </div>

                          {/* Card Content */}
                          <div className="p-5 bg-white">
                            <h3 className="font-semibold text-lg text-[#01001D] mb-3 group-hover:text-[#0E0652] transition-colors">
                              {group.name}
                            </h3>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center text-sm text-gray-600">
                                <Users className="h-4 w-4 mr-2 text-[#6496D8]" />
                                <span>{group.members} {group.members > 1 ? 'membros' : 'membro'}</span>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Calendar className="h-4 w-4 mr-2 text-[#6496D8]" />
                                <span>{group.date ? new Date(group.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : group.date}</span>
                              </div>
                            </div>

                            <Button
                              onClick={() => {
                                const groupId = group.id;
                                if (group.status === 'voting') {
                                  onNavigate(`groups/${groupId}/vote`);
                                } else if (group.status === 'matched') {
                                  onNavigate(`groups/${groupId}/matches`);
                                } else {
                                  onNavigate(`groups/${groupId}/vote`);
                                }
                              }}
                              className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                            >
                              {group.status === 'voting' ? 'Continuar votando' : 
                              group.status === 'matched' ? 'Ver matches' : 'Abrir grupo'}
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}

                  {/* Loading More Indicator */}
                  {isLoadingMore && (
                    <div className="col-span-full text-center py-8">
                      <div className="inline-block">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E0652]"></div>
                        <p className="text-gray-600 mt-2">Carregando mais grupos...</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {/* Create Group Modal */}
      <Dialog open={showCreateGroupModal} onOpenChange={handleCreateGroupModalChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#01001D]">Criando um grupo</DialogTitle>
            <DialogDescription>
              Defina os seguintes dados para seu novo grupo de viagem:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Nome do grupo</Label>
              <Input
                id="group-name"
                placeholder="Ex: Férias de Verão 2024"
                value={groupFormData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 30) {
                    setGroupFormData({ ...groupFormData, name: value });
                  }
                }}
                maxLength={30}
              />
              {groupFormData.name.length === 30 && (
                <p className="text-xs text-gray-500">Máximo de 30 caracteres</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="travel-date">Data prevista</Label>
              <Input
                id="travel-date"
                type="date"
                value={groupFormData.date}
                onChange={(e) => setGroupFormData({ ...groupFormData, date: e.target.value })}
                min={new Date().toISOString().slice(0, 10)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => handleCreateGroupModalChange(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmCreateGroup}
              className="bg-[#0E0652] hover:bg-[#130F61] text-white"
              disabled={
                !groupFormData.name.trim() || 
                groupFormData.name.length > 30 || 
                !groupFormData.date || 
                new Date(groupFormData.date) <= new Date()
              }
            >
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite Link Modal */}
      <Dialog open={showInviteLinkModal} onOpenChange={setShowInviteLinkModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#01001D]">Convite Gerado!</DialogTitle>
            <DialogDescription>
              Compartilhe este link para convidar seus amigos para o grupo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Link de convite:</p>
              <div className="flex items-center space-x-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className={`${linkCopied 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-[#0E0652] hover:bg-[#130F61]'
                  } text-white`}
                >
                  {linkCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {linkCopied && (
                <p className="text-xs text-green-600 mt-1">Link copiado!</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => setShowInviteLinkModal(false)}
              className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}