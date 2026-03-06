export enum MapCategory {
  MEETING_POINT = 'Ponto de Encontro',
  DONATION = 'Doações/Coleta',
  MST_COMMUNITY = 'Comunidade MST',
  LEADERSHIP = 'Liderança PT',
  EVENT = 'Evento'
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  bio?: string;
  joinedDate?: string;
  following?: number;
  followers?: string;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  user: User;
  content: string;
  timestamp: string;
  likes: string; 
  comments: string;
  retweets: string;
  views?: string;
  image?: string;
  isRepost?: boolean;
  repostUser?: string;
  // Interaction states for UI
  hasLiked?: boolean;
  hasRetweeted?: boolean;
  hasSaved?: boolean;
}

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description: string;
  category: MapCategory;
  address?: string;
  isLive?: boolean; 
}

export interface Trend {
  id: string;
  category: string;
  topic: string;
  postsCount: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'retweet' | 'follow' | 'mention';
  user: User;
  content?: string; // For mentions
  postContent?: string; // For likes/retweets
  timestamp: string;
}

export interface ActionEvent {
  id: string;
  title: string;
  location: string;
  region?: string; // New: Filter by region
  date: string;
  timestamp: string; 
  organizer: string;
  confirmedCount: number;
  image?: string; // Cover image
  gallery?: string[]; // New: Multiple images
  type: 'PROTEST' | 'MEETING';
  lat?: number; 
  lng?: number;
}

export interface PetitionAttachment {
  type: 'LINK' | 'PDF';
  title: string;
  url: string;
}

export interface Petition {
  id: string;
  title: string;
  description: string;
  targetGoal: number;
  currentSignatures: number;
  createdBy: User;
  attachments?: PetitionAttachment[]; // New: Documents/Links
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percent: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  createdBy: User;
  timeLeft: string;
}

export interface UniversityEntity {
  id: string;
  name: string;
  university: string;
  type: 'DCE' | 'CA';
  members: string;
}

export interface SocialAidInfo {
  id: string;
  title: string;
  description: string;
  type: 'BOLSA_FAMILIA' | 'AID_REQUEST' | 'INFO';
}

export interface FactCheck {
  id: string;
  fakeNews: string;
  fact: string;
  source: string;
  date: string;
}