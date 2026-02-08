export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  color: string;
  icon: string;
  description: string;
  isExpert?: boolean;
}

export interface ResponseMetrics {
  responseTimeMs: number;
  wordCount: number;
  tokensPerSecond: number;
}

export interface Message {
  id: string;
  content: string;
  aiModel: string;
  conversationId: string;
  timestamp: string;
  isUser?: boolean;
  metrics?: ResponseMetrics;
}

export interface Conversation {
  id: string;
  aiModel: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatState {
  conversations: Record<string, Conversation>;
  currentConversationId: string | null;
  selectedModels: string[];
  loading: Record<string, boolean>;
  errors: Record<string, string | null>;
  theme: 'light' | 'dark' | 'system';
  isSidebarOpen: boolean;
}

export interface SendMessageRequest {
  conversationId: string;
  aiModel: string;
  message: string;
  isExpertAdvice?: boolean;
}

export interface SendMessageResponse {
  id: string;
  content: string;
  aiModel: string;
  conversationId: string;
  timestamp: string;
  metrics?: ResponseMetrics;
}

export interface CreateConversationRequest {
  aiModel: string;
}

export interface ModelStat {
  modelId: string;
  displayName: string;
  messageCount: number;
  avgResponseTime: number;
  avgTokensPerSecond: number;
  totalTokens: number;
}

export interface ActivityTrend {
  date: string;
  messageCount: number;
}

export interface PersonalAnalytics {
  modelStats: ModelStat[];
  activityTrend: ActivityTrend[];
}

export interface LeaderboardEntry {
  modelId: string;
  displayName: string;
  avgResponseTime?: number;
  messageCount?: number;
  avgTokensPerSecond?: number;
  [key: string]: string | number | undefined;
}

export interface UsageTrend {
  date: string;
  modelCounts: Record<string, number>;
}

export interface GlobalLeaderboard {
  topBySpeed: LeaderboardEntry[];
  topByVolume: LeaderboardEntry[];
  topByEfficiency: LeaderboardEntry[];
  usageTrends: UsageTrend[];
}

export interface AuthCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignupData {
  email: string;
  password: string;
  fullName: string;
}