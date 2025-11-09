import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { 
  Star, 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  Thermometer,
  Users,
  Heart,
  Calendar,
  Share2,
  Bookmark,
  ChevronRight,
  Trophy,
  Settings,
  Globe
} from 'lucide-react';
import { Header } from './Header';

interface MatchesScreenProps {
  onNavigate: (screen: string) => void;
}

interface Match {
  id: number;
  name: string;
  country: string;
  image: string;
  price: string;
  duration: string;
  temperature: string;
  rating: number;
  votes: number;
  totalMembers: number;
  percentage: number;
  description: string;
  highlights: string[];
  category: string;
  voters: Array<{
    name: string;
    avatar: string;
  }>;
}

export function MatchesScreen({ onNavigate }: MatchesScreenProps) {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);

  const matches: Match[] = [
    {
      id: 1,
      name: "Santorini",
      country: "Grécia",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYW50b3JpbmklMjBncmVlY2V8ZW58MXx8fHwxNzU3MDU3MDYxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "R$ 2.500 - 4.000",
      duration: "5-7 dias",
      temperature: "25°C",
      rating: 4.8,
      votes: 6,
      totalMembers: 6,
      percentage: 100,
      description: "Ilha paradisíaca com vistas deslumbrantes do mar Egeu, casas brancas e pôr do sol icônico. Perfeito para quem busca romance e paisagens de tirar o fôlego.",
      highlights: ["Pôr do sol em Oia", "Vinícolas locais", "Praias vulcânicas", "Arquitetura cicládica"],
      category: "Romance",
      voters: [
        { name: "Ana", avatar: "A" },
        { name: "João", avatar: "J" },
        { name: "Maria", avatar: "M" },
        { name: "Pedro", avatar: "P" },
        { name: "Sofia", avatar: "S" },
        { name: "Lucas", avatar: "L" }
      ]
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
      votes: 5,
      totalMembers: 6,
      percentage: 83,
      description: "Cidade histórica com templos ancestrais, jardins zen e tradições milenares preservadas. Uma experiência cultural única.",
      highlights: ["Templo Kiyomizu", "Floresta de Bambu", "Distrito das Gueixas", "Cerimônia do chá"],
      category: "Cultural",
      voters: [
        { name: "Ana", avatar: "A" },
        { name: "Maria", avatar: "M" },
        { name: "Pedro", avatar: "P" },
        { name: "Sofia", avatar: "S" },
        { name: "Lucas", avatar: "L" }
      ]
    },
    {
      id: 3,
      name: "Bali",
      country: "Indonésia", 
      image: "https://images.unsplash.com/photo-1604394089666-6d365c060c6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWxpJTIwaW5kb25lc2lhJTIwdGVtcGxlfGVufDF8fHx8MTc1NzA5NjY2MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      price: "R$ 2.000 - 3.500",
      duration: "8-12 dias",
      temperature: "28°C",
      rating: 4.6,
      votes: 4,
      totalMembers: 6,
      percentage: 67,
      description: "Ilha tropical com praias paradisíacas, templos hinduístas e cultura balinesa única. Ideal para relaxar e se conectar com a natureza.",
      highlights: ["Templo Tanah Lot", "Terraços de arroz de Tegallalang", "Ubud cultural", "Praias de Uluwatu"],
      category: "Praia",
      voters: [
        { name: "João", avatar: "J" },
        { name: "Maria", avatar: "M" },
        { name: "Sofia", avatar: "S" },
        { name: "Lucas", avatar: "L" }
      ]
    }
  ];

  const topMatch = matches[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        title="Matches do Grupo"
        subtitle="Férias Europa 2024"
        onBack={() => onNavigate('dashboard')}
      />

      <div className="p-4 pb-24 space-y-6">
        {/* Top Match - Winner */}
        <Card className="border-2 border-[#6496D8] bg-gradient-to-r from-[#6496D8]/5 to-[#0E0652]/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <CardTitle className="text-[#0E0652]">Match Perfeito!</CardTitle>
              </div>
              <Badge className="bg-[#0E0652] text-white px-3 py-1">
                {topMatch.percentage}% concordam
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div 
                className="relative h-48 bg-cover bg-center rounded-lg overflow-hidden cursor-pointer"
                style={{ backgroundImage: `url('${topMatch.image}')` }}
                onClick={() => setSelectedMatch(selectedMatch === topMatch.id ? null : topMatch.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{topMatch.name}</h3>
                  <p className="text-sm text-gray-200">{topMatch.country}</p>
                </div>
                <Badge className="absolute top-4 right-4 bg-[#6496D8] text-white">
                  {topMatch.category}
                </Badge>
              </div>

              {/* Match stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {topMatch.price}
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {topMatch.duration}
                </div>
                <div className="flex items-center text-gray-600">
                  <Thermometer className="h-4 w-4 mr-2" />
                  {topMatch.temperature}
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="h-4 w-4 mr-2" />
                  {topMatch.rating}/5
                </div>
              </div>

              {/* Voters */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">
                    Votaram a favor ({topMatch.votes}/{topMatch.totalMembers})
                  </span>
                  <div className="flex -space-x-2">
                    {topMatch.voters.map((voter, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-white">
                        <AvatarFallback className="bg-[#6496D8] text-white text-xs">
                          {voter.avatar}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#6496D8] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${topMatch.percentage}%` }}
                  />
                </div>
              </div>


            </div>
          </CardContent>
        </Card>

        {/* Other Matches */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-[#01001D]">Outros Matches</h2>
          
          {matches.slice(1).map((match) => (
            <Card 
              key={match.id} 
              className={`cursor-pointer transition-all ${
                selectedMatch === match.id ? 'ring-2 ring-[#6496D8] shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
            >
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <div 
                    className="w-24 h-24 bg-cover bg-center rounded-lg flex-shrink-0"
                    style={{ backgroundImage: `url('${match.image}')` }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-[#01001D] truncate">{match.name}</h3>
                        <p className="text-sm text-gray-600">{match.country}</p>
                      </div>
                      <Badge className="bg-gray-100 text-gray-700">
                        {match.percentage}%
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1" />
                        {match.price.split(' - ')[0]}
                      </div>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        {match.rating}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {match.votes} de {match.totalMembers} votaram
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                {selectedMatch === match.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <p className="text-sm text-gray-700">{match.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {match.duration}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Thermometer className="h-4 w-4 mr-2" />
                        {match.temperature}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-sm font-medium">Votaram a favor:</span>
                      <div className="flex -space-x-1">
                        {match.voters.map((voter, index) => (
                          <Avatar key={index} className="h-6 w-6 border border-white">
                            <AvatarFallback className="bg-[#6496D8] text-white text-xs">
                              {voter.avatar}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button 
                        size="sm"
                        variant="outline" 
                        className="flex-1 border-[#6496D8] text-[#6496D8] hover:bg-[#6496D8] hover:text-white"
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
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