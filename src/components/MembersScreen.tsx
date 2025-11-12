import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  ArrowLeft,
  Users,
  Globe,
  Star,
  Settings,
  Crown,
  UserPlus,
  MoreVertical,
  Calendar,
  MapPin
} from 'lucide-react';
import { Header } from './Header';

interface MembersScreenProps {
  onNavigate: (screen: string) => void;
  showInviteLink: () => void;
}

interface Member {
  id: number;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  status: 'voted' | 'pending' | 'offline';
  joinedDate: string;
  votesCount: number;
}

export function MembersScreen({ onNavigate, showInviteLink }: MembersScreenProps) {
  const [members] = useState<Member[]>([
    {
      id: 1,
      name: "João Silva",
      isAdmin: true,
      status: "voted",
      joinedDate: "2024-01-15",
      votesCount: 12
    },
    {
      id: 2,
      name: "Maria Santos",
      isAdmin: false,
      status: "voted",
      joinedDate: "2024-01-16",
      votesCount: 8
    },
    {
      id: 3,
      name: "Pedro Costa",
      isAdmin: false,
      status: "pending",
      joinedDate: "2024-01-18",
      votesCount: 5
    },
    {
      id: 4,
      name: "Ana Oliveira",
      isAdmin: false,
      status: "voted",
      joinedDate: "2024-01-17",
      votesCount: 10
    },
    {
      id: 5,
      name: "Carlos Pereira",
      isAdmin: false,
      status: "offline",
      joinedDate: "2024-01-19",
      votesCount: 3
    },
    {
      id: 6,
      name: "Lucia Ferreira",
      isAdmin: false,
      status: "voted",
      joinedDate: "2024-01-20",
      votesCount: 7
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'voted': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'voted': return 'Votou';
      case 'pending': return 'Pendente';
      case 'offline': return 'Offline';
      default: return 'Desconhecido';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n.charAt(0)).slice(0, 2).join('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header 
        title="Membros do Grupo"
        subtitle="Férias Europa 2024"
        onBack={() => onNavigate('dashboard')}
        rightContent={
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreVertical className="h-6 w-6 text-gray-600" />
          </button>
        }
      />

      <div className="p-4 space-y-6">
        {/* Group Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#01001D]">{members.length}</div>
              <div className="text-sm text-gray-600">Membros</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {members.filter(m => m.status === 'voted').length}
              </div>
              <div className="text-sm text-gray-600">Votaram</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {members.filter(m => m.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pendentes</div>
            </CardContent>
          </Card>
        </div>

        {/* Add Member Button */}
        <Card className="border-dashed border-2 border-[#6496D8] bg-blue-50">
          <CardContent className="p-4">
            <button 
              onClick={showInviteLink}
              className="w-full flex items-center justify-center space-x-3 text-[#0E0652] hover:text-[#130F61]"
            >
              <UserPlus className="h-5 w-5" />
              <span className="font-medium">Convidar Novos Membros</span>
            </button>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Users className="h-5 w-5 mr-2" />
              Lista de Membros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="bg-[#6496D8] text-white">
                        {getInitials(member.name)}
                      </AvatarFallback>
                    </Avatar>
                    {member.isAdmin && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                        <Crown className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-[#01001D]">{member.name}</h3>
                      {member.isAdmin && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(member.joinedDate)}
                      </span>
                      <span className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {member.votesCount} votos
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-1">
                  <Badge className={getStatusColor(member.status)}>
                    {getStatusText(member.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Group Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Criado em:</span>
              <span className="font-medium text-[#01001D]">15 de Janeiro, 2024</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => onNavigate('group-members')}
            className="flex flex-col items-center p-2 text-[#0E0652] bg-blue-50 rounded-lg"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Membros</span>
          </button>
          <button 
            onClick={() => onNavigate('group-voting')}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <Globe className="h-5 w-5" />
            <span className="text-xs mt-1">Votar</span>
          </button>
          <button 
            onClick={() => onNavigate('group-matches')}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <Star className="h-5 w-5" />
            <span className="text-xs mt-1">Matches</span>
          </button>
          <button 
            onClick={() => onNavigate('group-preferences')}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Config</span>
          </button>
        </div>
      </nav>
    </div>
  );
}