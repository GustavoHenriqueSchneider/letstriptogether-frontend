/**
 * ⚠️ DADOS MOCKADOS - SUBSTITUIR POR CHAMADAS DE API
 * 
 * Este arquivo contém dados mockados para desenvolvimento.
 * Quando a API estiver pronta, substitua as importações deste arquivo
 * pelas chamadas reais em src/services/api/
 */

import type { Group, Destination, Match, Member, Notification, Invitation } from '@/types';

// MOCK: Grupos do usuário
export const mockGroups: Group[] = [
  {
    id: 1,
    name: 'Férias Europa 2024',
    members: 6,
    status: 'voting',
    avatar: '🇪🇺',
    date: 'Dezembro 2024'
  },
  {
    id: 2,
    name: 'Weekend Relax',
    members: 4,
    status: 'matched',
    avatar: '🏔️',
    date: 'Novembro 2024'
  }
];

// MOCK: Destinos para votação
export const mockDestinations: Destination[] = [
  {
    id: 1,
    name: 'Santorini',
    country: 'Grécia',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1080',
    price: 'R$ 2.500 - 4.000',
    duration: '5-7 dias',
    temperature: '25°C',
    rating: 4.8,
    description: 'Ilha paradisíaca com vistas deslumbrantes do mar Egeu, casas brancas e pôr do sol icônico.',
    highlights: ['Pôr do sol em Oia', 'Vinícolas', 'Praias vulcânicas', 'Arquitetura única'],
    category: 'Romance'
  },
  {
    id: 2,
    name: 'Kyoto',
    country: 'Japão',
    image: 'https://images.unsplash.com/photo-1614334342593-656fdf19525d?w=1080',
    price: 'R$ 3.000 - 5.000',
    duration: '7-10 dias',
    temperature: '18°C',
    rating: 4.9,
    description: 'Cidade histórica com templos ancestrais, jardins zen e tradições milenares preservadas.',
    highlights: ['Templo Kiyomizu', 'Floresta de Bambu', 'Gueixas', 'Cerimônia do chá'],
    category: 'Cultural'
  },
  {
    id: 3,
    name: 'Machu Picchu',
    country: 'Peru',
    image: 'https://images.unsplash.com/photo-1580619305218-8423a7ef79b4?w=1080',
    price: 'R$ 1.800 - 3.200',
    duration: '4-6 dias',
    temperature: '15°C',
    rating: 4.7,
    description: 'Cidadela inca nas montanhas dos Andes, uma das sete maravilhas do mundo moderno.',
    highlights: ['Trilha Inca', 'Huayna Picchu', 'Vale Sagrado', 'Cusco'],
    category: 'Aventura'
  },
  {
    id: 4,
    name: 'Bali',
    country: 'Indonésia',
    image: 'https://images.unsplash.com/photo-1604394089666-6d365c060c6c?w=1080',
    price: 'R$ 2.000 - 3.500',
    duration: '8-12 dias',
    temperature: '28°C',
    rating: 4.6,
    description: 'Ilha tropical com praias paradisíacas, templos hinduístas e cultura balinesa única.',
    highlights: ['Templo Tanah Lot', 'Terraços de arroz', 'Ubud', 'Praias de Uluwatu'],
    category: 'Praia'
  }
];

// MOCK: Matches encontrados
export const mockMatches: Match[] = [
  {
    id: 1,
    destination: mockDestinations[0],
    matchPercentage: 100,
    votes: 6,
    totalVotes: 6
  },
  {
    id: 2,
    destination: mockDestinations[1],
    matchPercentage: 83,
    votes: 5,
    totalVotes: 6
  }
];

// MOCK: Membros do grupo
export const mockMembers: Member[] = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao@email.com',
    role: 'owner',
    joinedAt: '2024-01-15',
    votesCount: 12
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria@email.com',
    role: 'member',
    joinedAt: '2024-01-16',
    votesCount: 8
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    role: 'member',
    joinedAt: '2024-01-18',
    votesCount: 5
  }
];

// MOCK: Notificações
export const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'invitation',
    title: 'Novo convite',
    message: 'Você foi convidado para o grupo "Carnaval Salvador"',
    read: false,
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    id: '2',
    type: 'match',
    title: 'Novo match!',
    message: 'Seu grupo encontrou um destino perfeito: Santorini',
    read: false,
    createdAt: '2024-01-19T15:30:00Z'
  }
];

// MOCK: Convites pendentes
export const mockInvitations: Invitation[] = [
  {
    id: 1,
    groupName: 'Carnaval Salvador',
    invitedBy: 'Maria Santos',
    avatar: '🎭',
    members: 12
  },
  {
    id: 2,
    groupName: 'Praia e Sol',
    invitedBy: 'João Silva',
    avatar: '🏖️',
    members: 5
  }
];

