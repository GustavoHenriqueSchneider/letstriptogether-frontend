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

export interface Group {
  id: string;
  name: string;
  members: number;
  status: 'voting' | 'matched' | 'planning';
  avatar: string;
  date: string;
  isCurrentMemberOwner?: boolean;
}

export interface Destination {
  id: number | string;
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
  preferences?: string[];
  attractions?: Array<{
    name: string;
    description: string;
    category: string;
  }>;
}

export interface Match {
  id: number | string;
  destination: Destination;
  matchPercentage: number;
  votes: number;
  totalVotes: number;
}

export interface Member {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'member';
  joinedAt: string;
  votesCount: number;
}

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

export interface Invitation {
  id: number;
  groupName: string;
  invitedBy: string;
  avatar: string;
  members: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

