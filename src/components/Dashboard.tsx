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
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-[#01001D]">Let's Trip Together</h1>
              <p className="text-sm text-gray-600">Bem-vindo de volta!</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onNavigate('notifications')}
                className="relative p-2 text-gray-600 hover:text-[#0E0652] hover:bg-gray-100 rounded-full"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
              </button>
              <button 
                onClick={() => onNavigate('preferences')}
                className="p-2 text-gray-600 hover:text-[#0E0652] hover:bg-gray-100 rounded-full"
              >
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onNavigate('profile')}
                className="hover:scale-105 transition-transform"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/api/placeholder/40/40" />
                  <AvatarFallback className="bg-[#6496D8] text-white">U</AvatarFallback>
                </Avatar>
              </button>
            </div>
          </div>
        </div>
      </header>



      {/* Content */}
      <main className="p-4 pb-20">
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Grupos Ativos</p>
                    <p className="text-2xl font-bold text-[#01001D]">{groups.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-[#6496D8]" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Matches</p>
                    <p className="text-2xl font-bold text-[#01001D]">
                      {groups.filter(g => g.status === 'matched').length}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Create New Group */}
          <Card className="border-dashed border-2 border-[#6496D8] bg-blue-50">
            <CardContent className="p-6">
              <button
                onClick={handleCreateGroup}
                className="w-full flex items-center justify-center space-x-3 text-[#0E0652] hover:text-[#130F61]"
              >
                <Plus className="h-6 w-6" />
                <span className="font-medium">Criar Novo Grupo</span>
              </button>
            </CardContent>
          </Card>

          {/* Groups List */}
          <div className="space-y-4">
            {groups.map((group) => (
              <Card key={group.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">{group.avatar}</div>
                      <div>
                        <h3 className="font-semibold text-[#01001D]">{group.name}</h3>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Users className="h-4 w-4 mr-1" />
                          {group.members} membros
                        </p>
                        <p className="text-sm text-gray-600 flex items-center mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          {group.date}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(group.status)}>
                      {getStatusText(group.status)}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => group.status === 'voting' ? onNavigate('group-voting') : group.status === 'matched' ? onNavigate('group-matches') : onNavigate('group-voting')}
                    variant="outline"
                    className="w-full justify-between border-[#6496D8] text-[#0E0652] hover:bg-[#6496D8] hover:text-white"
                  >
                    {group.status === 'voting' ? 'Continuar Votação' : 
                     group.status === 'matched' ? 'Ver Match' : 'Abrir Grupo'}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
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