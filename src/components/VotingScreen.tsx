import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { 
  Heart, 
  X, 
  Info, 
  MapPin, 
  DollarSign, 
  Clock, 
  Thermometer,
  ArrowLeft,
  RotateCcw,
  Users,
  Star,
  Settings,
  Globe
} from 'lucide-react';
import { Header } from './Header';
import { useModalStore } from '@/store/modalStore';
import { destinationsApi } from '@/services/api/destinations';
import { groupsApi } from '@/services/api/groups';
import type { Destination } from '@/types';
import { getPreferenceLabel } from '@/utils/preferenceLabels';

interface VotingScreenProps {
  groupId: string;
  groupName?: string;
  onNavigate: (screen: string) => void;
}

export function VotingScreen({ groupId, groupName, onNavigate }: VotingScreenProps) {
  const { openModal, closeModal, showError } = useModalStore();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<{[key: string | number]: 'like' | 'pass'}>({});
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allDestinationsLoaded, setAllDestinationsLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef(0);
  const hasHandled404 = useRef(false);
  const pageSize = 10;

  // Verificar se o grupo existe antes de carregar destinos
  useEffect(() => {
    hasHandled404.current = false; // Resetar flag ao mudar de grupo
    let isMounted = true;
    let shouldStop = false;
    
    const verifyAndLoadDestinations = async () => {
      if (!groupId || shouldStop) return;
      
      setIsLoading(true);
      openModal('loading');
      
      try {
        // Primeiro verificar se o grupo existe
        await groupsApi.getById(groupId);
        
        // Se chegou aqui, o grupo existe - carregar destinos
        if (isMounted && !shouldStop) {
          const result = await destinationsApi.getNotVotedByGroup(groupId, 1, pageSize);
          setDestinations(result.destinations);
          setHasMore(result.hasMore);
          setAllDestinationsLoaded(!result.hasMore);
          setCurrentPage(1);
        }
      } catch (error: any) {
        console.error('[VotingScreen] Erro ao verificar grupo ou carregar destinos:', error);
        if (isMounted && !shouldStop && error.response?.status === 404 && !hasHandled404.current) {
          shouldStop = true;
          hasHandled404.current = true;
          // Fechar loading antes de mostrar erro
          closeModal('loading');
          setIsLoading(false);
          // Não tentar mais carregar dados
          setHasMore(false);
          setAllDestinationsLoaded(true);
          // Pequeno delay para garantir que o modal foi fechado
          setTimeout(() => {
            if (isMounted) {
              showError(
                'Grupo não encontrado',
                'O grupo que você está tentando acessar não foi encontrado.',
                () => {
                  onNavigate('dashboard');
                }
              );
            }
          }, 100);
          return; // Sair imediatamente após tratar o 404
        }
      } finally {
        if (isMounted && !shouldStop) {
          setIsLoading(false);
          closeModal('loading');
        }
      }
    };

    verifyAndLoadDestinations();
    
    return () => {
      isMounted = false;
      shouldStop = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]); // openModal, closeModal e showError não estão nas dependências para evitar loop

  // Carregar mais destinos quando necessário
  const loadMoreDestinations = async () => {
    if (isLoadingMore || !hasMore || allDestinationsLoaded) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const result = await destinationsApi.getNotVotedByGroup(groupId, nextPage, pageSize);
      
      if (result.destinations.length > 0) {
        setDestinations(prev => [...prev, ...result.destinations]);
        setHasMore(result.hasMore);
        setCurrentPage(nextPage);
        setAllDestinationsLoaded(!result.hasMore);
      } else {
        setAllDestinationsLoaded(true);
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erro ao carregar mais destinos:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Carregar mais quando estiver próximo do fim
  useEffect(() => {
    const remainingDestinations = destinations.length - currentIndex;
    if (remainingDestinations <= 3 && hasMore && !isLoadingMore && !allDestinationsLoaded) {
      loadMoreDestinations();
    }
  }, [currentIndex, destinations.length, hasMore, isLoadingMore, allDestinationsLoaded]);



  const handleShowDetails = (destination: Destination) => {
    setSelectedDestination(destination);
    setShowDetailsModal(true);
  };

  const currentDestination = destinations[currentIndex];
  const remainingCards = destinations.length - currentIndex;
  const votedCount = Object.keys(votes).length;
  const totalDestinations = destinations.length;
  const progress = totalDestinations > 0 ? (votedCount / totalDestinations) * 100 : 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = touch.clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const diff = touch.clientX - startPos.current;
    setDragOffset(diff);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handleVote('like');
      } else {
        handleVote('pass');
      }
    }
    
    setDragOffset(0);
  };

  const handleMouseStart = (e: React.MouseEvent) => {
    startPos.current = e.clientX;
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const diff = e.clientX - startPos.current;
    setDragOffset(diff);
  };

  const handleMouseEnd = () => {
    setIsDragging(false);
    const threshold = 100;
    
    if (Math.abs(dragOffset) > threshold) {
      if (dragOffset > 0) {
        handleVote('like');
      } else {
        handleVote('pass');
      }
    }
    
    setDragOffset(0);
  };

  const handleVote = async (vote: 'like' | 'pass') => {
    if (!currentDestination) return;

    const destinationId = currentDestination.id;
    const isApproved = vote === 'like'; // true para like, false para pass
    
    try {
      // Enviar voto para a API
      await destinationsApi.vote(groupId, destinationId, isApproved);
      
      // Atualizar estado local
      setVotes(prev => ({...prev, [destinationId]: vote}));
      
      // Avançar para o próximo destino
      const nextIndex = currentIndex + 1;
      if (nextIndex < destinations.length) {
        setCurrentIndex(nextIndex);
      } else {
        // Tentar carregar mais destinos se houver
        if (hasMore && !allDestinationsLoaded) {
          const result = await destinationsApi.getNotVotedByGroup(groupId, currentPage + 1, pageSize);
          if (result.destinations.length > 0) {
            setDestinations(prev => {
              const newDestinations = [...prev, ...result.destinations];
              setHasMore(result.hasMore);
              setCurrentPage(currentPage + 1);
              setAllDestinationsLoaded(!result.hasMore);
              // Avançar para o próximo se houver
              if (newDestinations.length > nextIndex) {
                setCurrentIndex(nextIndex);
              }
              return newDestinations;
            });
          } else {
            setAllDestinationsLoaded(true);
            setHasMore(false);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao votar:', error);
      // Mesmo em caso de erro, avançar para não travar a interface
      setVotes(prev => ({...prev, [destinationId]: vote}));
    if (currentIndex < destinations.length - 1) {
      setCurrentIndex(currentIndex + 1);
      }
    }
    
    setDragOffset(0);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      const prevDestId = destinations[prevIndex].id;
      const newVotes = {...votes};
      delete newVotes[prevDestId];
      setVotes(newVotes);
      setCurrentIndex(prevIndex);
    }
  };

  const getCardRotation = () => {
    return dragOffset * 0.1;
  };

  const getCardOpacity = () => {
    return Math.max(0.7, 1 - Math.abs(dragOffset) * 0.003);
  };

  // Mostrar mensagem quando não houver mais destinos
  if (destinations.length === 0 || (currentIndex >= destinations.length && allDestinationsLoaded)) {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          title={groupName || 'Grupo'}
          onBack={() => onNavigate('dashboard')}
          showBackButton={true}
        />
        <div className="flex items-center justify-center p-6 pt-20 pb-20 max-w-7xl mx-auto">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#01001D] mb-2">
                {destinations.length === 0 ? 'Nenhum destino disponível' : 'Todos os destinos votados!'}
              </h2>
              <p className="text-gray-600">
                {destinations.length === 0 
                  ? 'Você votou em todos os destinos possíveis. Tente alterar suas preferências ou aguarde os demais membros votarem.'
                  : 'Você votou em todos os destinos disponíveis. Tente alterar suas preferências ou aguarde os demais membros votarem.'}
              </p>
              {destinations.length > 0 && (
                <div className="flex gap-4">
                  <Button 
                    onClick={() => onNavigate('preferences')}
                    className="flex-1 bg-[#6496D8] hover:bg-[#5a87c7] text-white"
                  >
                    Alterar Preferências
                  </Button>
              <Button 
                    onClick={() => onNavigate('dashboard')}
                    className="flex-1 bg-[#0E0652] hover:bg-[#130F61] text-white"
              >
                    Voltar ao Dashboard
              </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

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
              className="flex flex-col items-center p-2 text-[#0E0652] bg-blue-50 rounded-lg"
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

  // Se não há destino atual, não renderizar nada (aguardar carregamento)
  if (!currentDestination) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        title={groupName || 'Grupo'}
        onBack={() => onNavigate('dashboard')}
        showBackButton={true}
      />

      {/* Cards Stack */}
      <div className="flex justify-center px-6 mb-8 pt-8 max-w-7xl mx-auto">
        <div className="relative w-full max-w-sm">
          {/* Background cards */}
          {currentIndex + 1 < destinations.length && (
            <Card className="absolute top-2 left-2 right-2 h-96 bg-white/90 transform rotate-1" />
          )}
          {currentIndex + 2 < destinations.length && (
            <Card className="absolute top-4 left-4 right-4 h-96 bg-white/70 transform rotate-2" />
          )}
          
          {/* Current card */}
          <Card 
            ref={cardRef}
            className="relative w-full h-96 cursor-grab active:cursor-grabbing shadow-2xl overflow-hidden"
            style={{
              transform: `translateX(${dragOffset}px) rotate(${getCardRotation()}deg)`,
              opacity: getCardOpacity(),
              transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseStart}
            onMouseMove={isDragging ? handleMouseMove : undefined}
            onMouseUp={handleMouseEnd}
            onMouseLeave={handleMouseEnd}
          >
            <div 
              className="absolute inset-0 bg-black"
            />
            
            {/* Voting indicators */}
            <div className={`absolute top-8 left-8 transform rotate-12 ${dragOffset > 50 ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
              <Badge className="bg-green-500 text-white text-lg px-4 py-2">
                <Heart className="h-5 w-5 mr-2" />
                GOSTEI
              </Badge>
            </div>
            
            <div className={`absolute top-8 right-8 transform -rotate-12 ${dragOffset < -50 ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
              <Badge className="bg-red-500 text-white text-lg px-4 py-2">
                <X className="h-5 w-5 mr-2" />
                PASSAR
              </Badge>
            </div>

            <CardContent className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-sm">
              <div className="mb-3">
                <h2 className="text-2xl font-bold mb-2 text-[#01001D]">{currentDestination.name}</h2>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {currentDestination.description}
                </p>
              </div>

              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleShowDetails(currentDestination);
                }}
                className="flex items-center text-[#6496D8] hover:text-[#0E0652] text-sm transition-colors mt-4"
              >
                <Info className="h-4 w-4 mr-2" />
                Ver mais detalhes
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action buttons */}
      <div className="px-8 pb-8">
        <div className="flex justify-center space-x-8">
          <button
            onClick={() => handleVote('pass')}
            className="w-16 h-16 bg-gray-100 hover:bg-red-500 hover:text-white rounded-full flex items-center justify-center text-red-500 transition-colors shadow-lg border-2 border-red-500"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            onClick={() => handleVote('like')}
            className="w-16 h-16 bg-gray-100 hover:bg-green-500 hover:text-white rounded-full flex items-center justify-center text-green-500 transition-colors shadow-lg border-2 border-green-500"
          >
            <Heart className="h-8 w-8" />
          </button>
        </div>
      </div>

      {/* Destination Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#01001D]">
              {selectedDestination?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedDestination && (
            <div className="space-y-6 mt-4">
              {/* Descrição */}
              <div>
                <p className="text-sm text-gray-700">{selectedDestination.description}</p>
              </div>

              {/* Preferências atendidas */}
              {selectedDestination.preferences && selectedDestination.preferences.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#01001D] mb-2">Preferências do grupo atendidas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(selectedDestination.preferences)].map((pref, index) => (
                      <Badge key={index} className="bg-[#6496D8] text-white">
                        {getPreferenceLabel(pref)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Atrações */}
              {selectedDestination.attractions && selectedDestination.attractions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-[#01001D] mb-3">Atrações do destino:</h4>
                  <div className="space-y-3">
                    {selectedDestination.attractions.map((attraction, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
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
        </DialogContent>
      </Dialog>

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
            className="flex flex-col items-center p-2 text-[#0E0652] bg-blue-50 rounded-lg"
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