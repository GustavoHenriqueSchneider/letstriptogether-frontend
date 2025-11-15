import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Users,
  Globe,
  Settings,
  UserPlus,
  Star,
  X
} from 'lucide-react';
import { Header } from './Header';
import { useModalStore } from '@/store/modalStore';
import { membersApi } from '@/services/api/members';
import { groupsApi } from '@/services/api/groups';
import type { Member } from '@/types';

interface MembersScreenProps {
  groupId: string;
  groupName?: string;
  onNavigate: (screen: string) => void;
  showInviteLink: () => void;
}

export function MembersScreen({ groupId, groupName, onNavigate, showInviteLink }: MembersScreenProps) {
  const { showDeleteConfirmation, closeModal, openModal, showSuccess, showError } = useModalStore();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMembersLoaded, setAllMembersLoaded] = useState(false);
  const [isCurrentUserOwner, setIsCurrentUserOwner] = useState(false);
  const hasHandled404 = useRef(false);
  const pageSize = 10;

  useEffect(() => {
    const loadGroupInfo = async () => {
      try {
        const group = await groupsApi.getById(groupId);
        setIsCurrentUserOwner(group.isCurrentMemberOwner || false);
      } catch (error) {
        console.error('[MembersScreen] Erro ao carregar informações do grupo:', error);
      }
    };
    loadGroupInfo();
  }, [groupId]);

  useEffect(() => {
    hasHandled404.current = false;
    let isMounted = true;
    
    const verifyAndLoadMembers = async () => {
      try {
        await groupsApi.getById(groupId);
        if (isMounted) {
          await loadMembers(1, true);
        }
      } catch (error: any) {
        console.error('[MembersScreen] Erro ao verificar grupo:', error);
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
    
    verifyAndLoadMembers();
    
    return () => {
      isMounted = false;
    };
  }, [groupId]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        if (!isLoadingMore && hasMore && !isLoading && !allMembersLoaded) {
          loadMoreMembers();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, isLoading, allMembersLoaded]);

  const loadMembers = async (page = 1, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
      openModal('loading');
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const result = await membersApi.getByGroup(groupId, page, pageSize);
      
      if (isInitial) {
        setMembers(result.members);
      } else {
        setMembers(prev => [...prev, ...result.members]);
      }
      
      setHasMore(result.hasMore);
      setCurrentPage(page);
      setAllMembersLoaded(!result.hasMore);
    } catch (error: any) {
      console.error('[MembersScreen] Erro ao carregar membros:', error);
      if (isInitial) {
        if ([404, 400].includes(error.response?.status) && !hasHandled404.current) {
          hasHandled404.current = true;
          showError(
            'Grupo não encontrado',
            'O grupo que você está tentando acessar não foi encontrado.',
            () => {
              onNavigate('dashboard');
            }
          );
        } else if (![404, 400].includes(error.response?.status)) {
          showError('Erro ao carregar membros', error.response?.data?.message || 'Não foi possível carregar os membros do grupo');
        }
      }
    } finally {
      if (isInitial) {
        setIsLoading(false);
        closeModal('loading');
      } else {
        setIsLoadingMore(false);
      }
    }
  };

  const loadMoreMembers = async () => {
    if (isLoadingMore || !hasMore || allMembersLoaded) return;
    
    const nextPage = currentPage + 1;
    await loadMembers(nextPage, false);
  };

  const sortedMembers = useMemo(() => {
    return [...members].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [members]);

  const handleRemoveMember = (memberId: string, memberName: string) => {
    showDeleteConfirmation(
      async () => {
        try {
          openModal('loading');
          await membersApi.remove(groupId, memberId);
          closeModal('loading');
          showSuccess('Membro removido', `${memberName} foi removido do grupo com sucesso.`);
          await loadMembers(1, true);
        } catch (error: any) {
          closeModal('loading');
          showError('Erro ao remover membro', error.response?.data?.message || 'Não foi possível remover o membro do grupo');
        }
      },
      'Remover membro do grupo',
      `Tem certeza que deseja remover ${memberName} do grupo? Esta ação não pode ser desfeita.`
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header 
        title="Membros do Grupo"
        subtitle={groupName || 'Carregando...'}
        onBack={() => onNavigate('dashboard')}
      />

      <div className="p-6 pb-20 max-w-7xl mx-auto space-y-6">
        {isCurrentUserOwner && (
          <Card className="border-dashed border-2 border-[#6496D8] bg-blue-50 hover:bg-blue-100 hover:border-[#0E0652] transition-all duration-200">
            <CardContent className="p-4 pb-4 flex items-center justify-center">
              <button 
                onClick={showInviteLink}
                className="w-full flex items-center justify-center space-x-3 text-[#0E0652] hover:text-[#130F61] py-2 transition-all duration-200 hover:scale-105"
              >
                <UserPlus className="h-5 w-5" />
                <span className="font-medium">Convidar novos membros</span>
              </button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-[#01001D]">
              <Users className="h-5 w-5 mr-2" />
              Lista de membros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando membros...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 flex-1">
                    <h3 className="font-medium text-[#01001D]">Você</h3>
                    {isCurrentUserOwner && (
                      <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>

                {sortedMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 flex-1">
                      <h3 className="font-medium text-[#01001D]">{member.name}</h3>
                      {!isCurrentUserOwner && member.role === 'owner' && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          Admin
                        </Badge>
                      )}
                    </div>
                    {isCurrentUserOwner && (
                      <button
                        onClick={() => handleRemoveMember(member.id, member.name)}
                        className="p-1 hover:bg-blue-100 hover:border-2 hover:border-[#6496D8] rounded-full transition-all duration-200 text-gray-500 hover:text-[#6496D8] hover:scale-110 border-2 border-transparent"
                        aria-label="Remover membro"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}

                {isLoadingMore && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#0E0652]"></div>
                    <p className="text-sm text-gray-600 mt-2">Carregando mais membros...</p>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

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
            className="flex flex-col items-center p-2 text-gray-600"
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Configurações</span>
          </button>
        </div>
      </nav>
    </div>
  );
}