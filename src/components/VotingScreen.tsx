import React, { useState, useRef } from 'react';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
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

interface VotingScreenProps {
  onNavigate: (screen: string) => void;
}

interface Destination {
  id: number;
  name: string;
  country: string;
  image: string;
  price: string;
  duration: string;
  temperature: string;
  rating: number;
  description: string;
  highlights: string[];
  category: string;
}

export function VotingScreen({ onNavigate }: VotingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [votes, setVotes] = useState<{[key: number]: 'like' | 'pass'}>({});
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const startPos = useRef(0);

  const destinations: Destination[] = [
    {
      id: 1,
      name: "Santorini",
      country: "Grécia",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2V8ZW58MXx8fHwxNzU3MDU3MDYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "R$ 2.500 - 4.000",
      duration: "5-7 dias",
      temperature: "25°C",
      rating: 4.8,
      description: "Ilha paradisíaca com vistas deslumbrantes do mar Egeu, casas brancas e pôr do sol icônico.",
      highlights: ["Pôr do sol em Oia", "Vinícolas", "Praias vulcânicas", "Arquitetura única"],
      category: "Romance"
    },
    {
      id: 2,
      name: "Kyoto",
      country: "Japão",
      image: "https://images.unsplash.com/photo-1614334342593-656fdf19525d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxreW90byUyMGphcGFuJTIwdGVtcGxlfGVufDF8fHx8MTc1NzA5NjY1MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "R$ 3.000 - 5.000",
      duration: "7-10 dias",
      temperature: "18°C",
      rating: 4.9,
      description: "Cidade histórica com templos ancestrais, jardins zen e tradições milenares preservadas.",
      highlights: ["Templo Kiyomizu", "Floresta de Bambu", "Gueixas", "Cerimônia do chá"],
      category: "Cultural"
    },
    {
      id: 3,
      name: "Machu Picchu",
      country: "Peru",
      image: "https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNodSUyMHBpY2NodSUyMHBlcnV8ZW58MXx8fHwxNzU3MDkwODUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "R$ 1.800 - 3.200",
      duration: "4-6 dias",
      temperature: "15°C",
      rating: 4.7,
      description: "Cidadela inca nas montanhas dos Andes, uma das sete maravilhas do mundo moderno.",
      highlights: ["Trilha Inca", "Huayna Picchu", "Vale Sagrado", "Cusco"],
      category: "Aventura"
    },
    {
      id: 4,
      name: "Bali",
      country: "Indonésia",
      image: "https://images.unsplash.com/photo-1604394089666-6d365c060c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwaW5kb25lc2lhJTIwdGVtcGxlfGVufDF8fHx8MTc1NzA5NjY2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "R$ 2.000 - 3.500",
      duration: "8-12 dias",
      temperature: "28°C",
      rating: 4.6,
      description: "Ilha tropical com praias paradisíacas, templos hinduístas e cultura balinesa única.",
      highlights: ["Templo Tanah Lot", "Terraços de arroz", "Ubud", "Praias de Uluwatu"],
      category: "Praia"
    },
    {
      id: 5,
      name: "Islândia",
      country: "Islândia",
      image: "https://images.unsplash.com/photo-1615593249123-212337d9f4fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VsYW5kJTIwbGFuZHNjYXBlJTIwYXVyb3JhfGVufDF8fHx8MTc1NzA3MTg1MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "R$ 4.000 - 6.500",
      duration: "8-10 dias",
      temperature: "8°C",
      rating: 4.8,
      description: "Terra de fogo e gelo com paisagens únicas, gêiseres, cachoeiras e aurora boreal.",
      highlights: ["Aurora boreal", "Blue Lagoon", "Cachoeira Gullfoss", "Círculo Dourado"],
      category: "Natureza"
    }
  ];

  const currentDestination = destinations[currentIndex];
  const remainingCards = destinations.length - currentIndex;
  const votedCount = Object.keys(votes).length;
  const progress = (votedCount / destinations.length) * 100;

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

  const handleVote = (vote: 'like' | 'pass') => {
    setVotes(prev => ({...prev, [currentDestination.id]: vote}));
    
    if (currentIndex < destinations.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Voting completed - return to dashboard
      onNavigate('dashboard');
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

  if (currentIndex >= destinations.length) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#0E0652] h-16"></div>
        <div className="flex items-center justify-center p-4 pt-20">
          <Card className="w-full max-w-md text-center">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-[#01001D] mb-2">Votação Completa!</h2>
              <p className="text-gray-600 mb-6">
                Você votou em {destinations.length} destinos. Agora vamos ver os matches do seu grupo!
              </p>
              <Button 
                onClick={() => onNavigate('matches')}
                className="w-full bg-[#0E0652] hover:bg-[#130F61] text-white"
              >
                Ver Matches
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        title="Grupo: Férias Europa 2024"
        onBack={() => onNavigate('dashboard')}
        showBackButton={true}
      />

      {/* Cards Stack */}
      <div className="flex justify-center px-4 mb-8 pt-8">
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
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7)), url('${currentDestination.image}')`
              }}
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

            <CardContent className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="text-2xl font-bold">{currentDestination.name}</h2>
                  <p className="text-lg text-gray-200">{currentDestination.country}</p>
                </div>
                <Badge className="bg-[#6496D8] text-white">
                  {currentDestination.category}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {currentDestination.price}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  {currentDestination.duration}
                </div>
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2" />
                  {currentDestination.temperature}
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2" />
                  {currentDestination.rating}/5
                </div>
              </div>

              <p className="text-sm text-gray-200 mb-4 line-clamp-2">
                {currentDestination.description}
              </p>

              <button className="flex items-center text-[#6496D8] hover:text-white text-sm">
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
        
        <div className="text-center mt-6">
          <p className="text-gray-600 text-sm">
            Arraste para os lados ou use os botões para votar
          </p>
        </div>
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
            onClick={() => onNavigate('group-voting')}
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