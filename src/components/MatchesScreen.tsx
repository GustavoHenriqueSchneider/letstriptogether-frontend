import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Star, 
  DollarSign, 
  Clock, 
  Thermometer,
  ChevronRight,
  ChevronDown,
  Settings,
  Globe,
  Users,
  X
} from 'lucide-react';
import { Header } from './Header';
import { useModalStore } from '@/store/modalStore';
import { getPreferenceLabel } from '@/utils/preferenceLabels';
import { matchesApi } from '@/services/api/matches';
import { groupsApi } from '@/services/api/groups';
import type { Match } from '@/types';

interface MatchesScreenProps {
  groupId: string;
  groupName?: string;
  onNavigate: (screen: string) => void;
}


export function MatchesScreen({ groupId, groupName, onNavigate }: MatchesScreenProps) {
  const { showDeleteConfirmation, closeModal, openModal, showSuccess, showError } = useModalStore();
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<string | number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [allMatchesLoaded, setAllMatchesLoaded] = useState(false);
  const hasHandled404 = useRef(false);
  const pageSize = 10;

  // Definir loadMatches antes de usar no useEffect
  const loadMatches = async (page = 1, isInitial = false) => {
    if (isInitial) {
      setIsLoading(true);
      openModal('loading');
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const result = await matchesApi.getByGroup(groupId, page, pageSize);
      
      if (isInitial) {
        setMatches(result.matches);
      } else {
        setMatches(prev => [...prev, ...result.matches]);
      }
      
      setHasMore(result.hasMore);
      setCurrentPage(page);
      setAllMatchesLoaded(!result.hasMore);
    } catch (error: any) {
      console.error('[MatchesScreen] Erro ao carregar matches:', error);
      if (isInitial) {
        // Verificar se é erro 404 (grupo não encontrado) apenas uma vez
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
          showError('Erro ao carregar matches', error.response?.data?.message || 'Não foi possível carregar os matches do grupo');
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

  // Verificar se o grupo existe antes de carregar matches
  useEffect(() => {
    hasHandled404.current = false; // Resetar flag ao mudar de grupo
    let isMounted = true;
    
    const verifyAndLoadMatches = async () => {
      try {
        // Primeiro verificar se o grupo existe
        await groupsApi.getById(groupId);
        // Se chegou aqui, o grupo existe - carregar matches
        if (isMounted) {
          await loadMatches(1, true);
        }
      } catch (error: any) {
        console.error('[MatchesScreen] Erro ao verificar grupo:', error);
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
    
    verifyAndLoadMatches();
    
    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]); // loadMatches não está nas dependências para evitar loop

  // Detectar scroll para carregar mais matches
  useEffect(() => {
    const handleScroll = () => {
      // Verificar se chegou ao final da página
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 // 100px antes do fim
      ) {
        if (!isLoadingMore && hasMore && !isLoading && !allMatchesLoaded) {
          loadMoreMatches();
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoadingMore, hasMore, isLoading, allMatchesLoaded]);

  const loadMoreMatches = async () => {
    if (isLoadingMore || !hasMore || allMatchesLoaded) return;
    
    const nextPage = currentPage + 1;
    await loadMatches(nextPage, false);
  };


  const handleRemoveMatch = (matchId: string | number, matchName: string) => {
    showDeleteConfirmation(
      async () => {
        try {
          openModal('loading');
          await matchesApi.remove(groupId, matchId);
          closeModal('loading');
          showSuccess('Match removido', `${matchName} foi removido dos matches do grupo com sucesso.`);
          // Recarregar lista de matches do início
          await loadMatches(1, true);
        } catch (error: any) {
          closeModal('loading');
          showError('Erro ao remover match', error.response?.data?.message || 'Não foi possível remover o match do grupo');
        }
      },
      'Remover match do grupo',
      `Tem certeza que deseja remover ${matchName} dos matches do grupo? Esta ação não pode ser desfeita.`
    );
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title="Matches do Grupo"
        subtitle={groupName || 'Carregando...'}
        onBack={() => onNavigate('dashboard')}
      />

      {isLoading ? (
        <div className="p-6 pb-24 max-w-7xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-[#01001D]">
                <Star className="h-5 w-5 mr-2" />
                Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-8">
                <p className="text-gray-600">Carregando matches...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : matches.length === 0 ? (
        <div className="flex items-center justify-center p-6 pt-20 max-w-7xl mx-auto">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#01001D] mb-2">
                Nenhum match encontrado
              </h2>
              <p className="text-gray-600">
                Continue votando para gerar novos matches ou aguarde!
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="p-6 pb-24 max-w-7xl mx-auto space-y-6">
          {/* Matches List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-[#01001D]">
                <Star className="h-5 w-5 mr-2" />
                Matches
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <>
                {matches.map((match) => (
                  <div 
                    key={match.id} 
                    className={`p-3 bg-gray-50 rounded-lg transition-all ${
                      selectedMatch === match.id ? 'ring-2 ring-[#6496D8] shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 flex-1 items-center">
                        <div 
                          className="w-24 h-24 bg-black rounded-lg flex-shrink-0"
                        />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#01001D] mb-1">{match.destination.name}</h3>
                          <p className="text-sm text-gray-600 line-clamp-2">{match.destination.description}</p>
                        </div>
                      </div>

                  <div className="flex items-center space-x-2 ml-2">
                    <button
                      onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                      className="p-1 hover:bg-blue-100 hover:border-2 hover:border-[#6496D8] rounded-full transition-all duration-200 text-gray-500 hover:text-[#6496D8] hover:scale-110 border-2 border-transparent"
                      aria-label={selectedMatch === match.id ? "Recolher" : "Expandir"}
                    >
                      {selectedMatch === match.id ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveMatch(match.id, match.destination.name);
                      }}
                      className="p-1 hover:bg-blue-100 hover:border-2 hover:border-[#6496D8] rounded-full transition-all duration-200 text-gray-500 hover:text-[#6496D8] hover:scale-110 border-2 border-transparent"
                      aria-label="Remover match"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {selectedMatch === match.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    {/* Preferências atendidas */}
                    {match.destination.preferences && match.destination.preferences.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#01001D] mb-2">Preferências do grupo atendidas:</h4>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(new Set(match.destination.preferences)).map((pref, index) => (
                            <Badge key={index} className="bg-[#6496D8] text-white">
                              {getPreferenceLabel(pref as string)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Atrações */}
                    {match.destination.attractions && match.destination.attractions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-[#01001D] mb-3">Atrações do destino:</h4>
                        <div className="space-y-3">
                          {match.destination.attractions.map((attraction, index) => (
                            <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between mb-1">
                                <h5 className="font-medium text-[#01001D]">{attraction.name}</h5>
                                {attraction.category && (
                                  <Badge variant="outline" className="text-xs">
                                    {getPreferenceLabel(attraction.category)}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">{attraction.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
                ))}
                
                {/* Loading indicator ao carregar mais */}
                {isLoadingMore && (
                  <div className="text-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#0E0652]"></div>
                    <p className="text-sm text-gray-600 mt-2">Carregando mais matches...</p>
                  </div>
                )}
              </>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bottom Navigation */}
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
            className="flex flex-col items-center p-2 text-[#0E0652] bg-blue-50 rounded-lg"
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