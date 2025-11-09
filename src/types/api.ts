/**
 * Tipos e interfaces para a API
 */

// ============ Autenticação ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface RegisterResponse {
  token: string;
  user: User;
}

export interface ResetPasswordRequest {
  email: string;
}

// ============ Usuário ============
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}

// ============ Grupos ============
export interface Group {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  status: 'voting' | 'matched' | 'planning' | 'completed';
  memberCount: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
  date?: string;
}

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'owner' | 'member';
  joinedAt: string;
  user: User;
}

// ============ Convites ============
export interface Invitation {
  id: string;
  groupId: string;
  group: Group;
  invitedBy: string;
  invitedByUser: User;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: string;
}

// ============ Destinos ============
export interface Destination {
  id: string;
  name: string;
  description?: string;
  image?: string;
  location: string;
  category: string;
  rating?: number;
  priceRange?: 'low' | 'medium' | 'high';
}

export interface VoteRequest {
  destinationId: string;
  vote: 'like' | 'dislike';
}

export interface Vote {
  id: string;
  destinationId: string;
  userId: string;
  vote: 'like' | 'dislike';
  createdAt: string;
}

// ============ Matches ============
export interface Match {
  id: string;
  destination: Destination;
  matchCount: number;
  totalMembers: number;
  percentage: number;
  voters: User[];
}

// ============ Notificações ============
export interface Notification {
  id: string;
  type: 'invitation' | 'vote' | 'match' | 'group_update' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

// ============ Preferências ============
export interface Preferences {
  notifications: {
    email: boolean;
    push: boolean;
    invitations: boolean;
    votes: boolean;
    matches: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    showEmail: boolean;
  };
  language: string;
  theme: 'light' | 'dark' | 'auto';
}

export interface UpdatePreferencesRequest {
  notifications?: Partial<Preferences['notifications']>;
  privacy?: Partial<Preferences['privacy']>;
  language?: string;
  theme?: 'light' | 'dark' | 'auto';
}

