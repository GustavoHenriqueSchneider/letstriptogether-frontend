import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { 
  Settings,
  Globe,
  Star,
  Users,
  Trash2,
  LogOut
} from 'lucide-react';
import { Header } from './Header';
import { useModalStore } from '@/store/modalStore';
import { groupsApi } from '@/services/api/groups';

interface GroupSettingsScreenProps {
  groupId: string;
  groupName?: string;
  onNavigate: (screen: string) => void;
}

export function GroupSettingsScreen({ groupId, groupName, onNavigate }: GroupSettingsScreenProps) {
  const { showDeleteConfirmation, openModal, closeModal, showSuccess, showError } = useModalStore();
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
  const hasHandled404 = useRef(false);

  useEffect(() => {
    let isMounted = true;
    hasHandled404.current = false;
    const loadGroupInfo = async () => {
      try {
        const group = await groupsApi.getById(groupId);
        if (isMounted) {
          setIsCurrentUserOwner(group.isCurrentMemberOwner || false);
        }
      } catch (error: any) {
        console.error('[GroupSettingsScreen] Erro ao carregar informações do grupo:', error);
        if (isMounted && [404, 400].includes(error.response?.status) && !hasHandled404.current) {
          hasHandled404.current = true;
          showError(
            'Grupo não encontrado',
            'O grupo que você está tentando acessar não foi encontrado.',
            () => {
              onNavigate('dashboard');
            }
          );
        }
      }
    };
    loadGroupInfo();
    
    return () => {
      isMounted = false;
    };
  }, [groupId]);

  const handleDeleteGroup = () => {
    showDeleteConfirmation(
      async () => {
        try {
          openModal('loading');
          await groupsApi.delete(groupId);
          closeModal('loading');
          showSuccess(
            'Grupo excluído',
            'O grupo foi excluído com sucesso.',
            () => {
              onNavigate('dashboard');
            }
          );
        } catch (error: any) {
          closeModal('loading');
          showError(
            'Erro ao excluir grupo',
            error.response?.data?.message || 'Não foi possível excluir o grupo. Tente novamente.'
          );
        }
      },
      'Excluir grupo',
      'Tem certeza que deseja excluir este grupo? Todos os dados, votos e matches serão perdidos permanentemente. Esta ação não pode ser desfeita.'
    );
  };

  const handleLeaveGroup = () => {
    showDeleteConfirmation(
      async () => {
        try {
          openModal('loading');
          await groupsApi.leave(groupId);
          closeModal('loading');
          showSuccess(
            'Você saiu do grupo',
            'Você saiu do grupo com sucesso.',
            () => {
              onNavigate('dashboard');
            }
          );
        } catch (error: any) {
          closeModal('loading');
          showError(
            'Erro ao sair do grupo',
            error.response?.data?.message || 'Não foi possível sair do grupo. Tente novamente.'
          );
        }
      },
      'Sair do grupo',
      'Tem certeza que deseja sair deste grupo? Você perderá acesso a todos os dados, votos e matches do grupo. Esta ação não pode ser desfeita.'
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        title="Configurações do Grupo"
        subtitle={groupName || 'Carregando...'}
        onBack={() => onNavigate('dashboard')}
      />

      <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Settings className="h-5 w-5 mr-2" />
              Configurações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isCurrentUserOwner ? (
              <Button
                variant="outline"
                className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 hover:text-red-600"
                onClick={handleDeleteGroup}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir grupo
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full justify-start text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                onClick={handleLeaveGroup}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair do grupo
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex items-center justify-around py-2">
          <button 
            onClick={() => onNavigate('group-members')}
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <Users className="h-5 w-5" />
            <span className="text-xs mt-1">Membros</span>
          </button>
          <button 
            onClick={() => onNavigate('group-vote')}
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
            onClick={() => onNavigate('group-settings')}
            className="flex flex-col items-center p-2 text-[#0E0652] bg-blue-50 rounded-lg"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Configurações</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

