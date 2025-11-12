import React, { useState } from 'react';
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
  Check
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showInviteLinkModal, setShowInviteLinkModal] = useState(false);
  const [groupFormData, setGroupFormData] = useState({ name: '', date: '' });
  const [inviteLink, setInviteLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Férias Europa 2024",
      members: 6,
      status: "voting",
      avatar: "🇪🇺",
      date: "Dezembro 2024"
    },
    {
      id: 2,
      name: "Weekend Relax",
      members: 4,
      status: "matched",
      avatar: "🏔️",
      date: "Novembro 2024"
    }
  ]);

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
      case 'voting': return 'Votando';
      case 'matched': return 'Combinado';
      case 'planning': return 'Planejando';
      default: return 'Ativo';
    }
  };

  const handleCreateGroup = () => {
    setShowCreateGroupModal(true);
  };

  const handleConfirmCreateGroup = () => {
    // Adicionar o novo grupo à lista
    const newGroup = {
      id: groups.length + 1,
      name: groupFormData.name,
      members: 1,
      status: "voting",
      avatar: "🆕",
      date: new Date(groupFormData.date).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    };
    
    setGroups([...groups, newGroup]);
    
    // Simular criação do grupo
    const newInviteLink = `https://letstrip.app/invite/${Math.random().toString(36).substring(7)}`;
    setInviteLink(newInviteLink);
    setShowCreateGroupModal(false);
    setShowInviteLinkModal(true);
    setGroupFormData({ name: '', date: '' });
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
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center animate-pulse">3</span>
              </button>
              <button 
                onClick={() => onNavigate('preferences')}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="hover:scale-105 transition-transform duration-200"
              >
                <Avatar className="h-8 w-8 ring-2 ring-white/30">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback className="bg-gradient-to-br from-[#6496D8] to-[#0E0652] text-white">U</AvatarFallback>
                </Avatar>
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
          <p className="text-gray-600">Gerencie seus grupos e planeje viagens incríveis</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Grupos Ativos</p>
                  <p className="text-3xl font-bold text-[#01001D]">{groups.length}</p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Users className="h-6 w-6 text-[#0E0652]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Matches Encontrados</p>
                  <p className="text-3xl font-bold text-[#01001D]">
                    {groups.filter(g => g.status === 'matched').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                  <Star className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Em Votação</p>
                  <p className="text-3xl font-bold text-[#01001D]">
                    {groups.filter(g => g.status === 'voting').length}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-xl bg-yellow-100 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <Card key={group.id} className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
                <CardContent className="p-0">
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
                        <span>{group.members} membros</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-[#6496D8]" />
                        <span>{group.date}</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => group.status === 'voting' ? onNavigate('group-voting') : group.status === 'matched' ? onNavigate('group-matches') : onNavigate('group-voting')}
                      className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
                    >
                      {group.status === 'voting' ? 'Continuar Votação' : 
                       group.status === 'matched' ? 'Ver Match' : 'Abrir Grupo'}
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Create New Group Card */}
          <Card 
            onClick={handleCreateGroup}
            className="border-2 border-dashed border-gray-300 hover:border-[#6496D8] shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <CardContent className="p-0 h-full min-h-[320px] flex items-center justify-center">
              <div className="text-center p-6">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#6496D8] to-[#0E0652] flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-[#01001D] mb-2">Criar Novo Grupo</h3>
                <p className="text-sm text-gray-600">Comece a planejar uma nova aventura</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Create Group Modal */}
      <Dialog open={showCreateGroupModal} onOpenChange={setShowCreateGroupModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#01001D]">Criar Novo Grupo</DialogTitle>
            <DialogDescription>
              Defina o nome do grupo e a data prevista para a viagem.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="group-name">Nome do Grupo</Label>
              <Input
                id="group-name"
                placeholder="Ex: Férias de Verão 2024"
                value={groupFormData.name}
                onChange={(e) => setGroupFormData({ ...groupFormData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travel-date">Data Prevista</Label>
              <Input
                id="travel-date"
                type="month"
                value={groupFormData.date}
                onChange={(e) => setGroupFormData({ ...groupFormData, date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateGroupModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirmCreateGroup}
              className="bg-[#0E0652] hover:bg-[#130F61] text-white"
              disabled={!groupFormData.name || !groupFormData.date}
            >
              Criar Grupo
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