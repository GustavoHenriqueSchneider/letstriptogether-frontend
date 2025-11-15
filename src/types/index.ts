// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  likesShopping: boolean;
  likesGastronomy: boolean;
  culture?: string[];
  entertainment?: string[];
  placeTypes?: string[];
}

// Group Types
export interface Group {
  id: string; // GUID fornecido pela API
  name: string;
  members: number;
  status: 'voting' | 'matched' | 'planning';
  avatar: string;
  date: string;
  isOwner?: boolean; // Indica se o usuário atual é dono do grupo
}

// Destination Types
export interface Destination {
  id: number | string; // Pode ser number (compatibilidade) ou string (GUID)
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
  preferences?: string[]; // Categorias de preferências atendidas
  attractions?: Array<{
    name: string;
    description: string;
    category: string;
  }>;
}

// Match Types
export interface Match {
  id: number | string; // Pode ser number (compatibilidade) ou string (GUID)
  destination: Destination;
  matchPercentage: number;
  votes: number;
  totalVotes: number;
}

// Member Types
export interface Member {
  id: number | string; // Pode ser number (compatibilidade) ou string (GUID)
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'member';
  joinedAt: string;
  votesCount: number;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'invitation' | 'match' | 'vote' | 'message';
  title?: string;
  message?: string;
  groupName?: string;
  destinationName?: string;
  avatar?: string;
  actionRequired?: boolean;
  actions?: Array<{
    label: string;
    type: 'accept' | 'reject' | 'view';
    variant?: 'default' | 'outline';
  }>;
  read: boolean;
  createdAt: string;
}

// Invitation Types
export interface Invitation {
  id: number;
  groupName: string;
  invitedBy: string;
  avatar: string;
  members: number;
}

// API Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

