export interface AIModel {
  id: string;
  name: string;
  displayName: string;
  color: string;
  icon: string;
  description: string;
}

export interface Message {
  id: string;
  content: string;
  aiModel: string;
  conversationId: string;
  timestamp: string;
  isUser?: boolean;
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
}

export interface SendMessageRequest {
  conversationId: string;
  aiModel: string;
  message: string;
}

export interface SendMessageResponse {
  id: string;
  content: string;
  aiModel: string;
  conversationId: string;
  timestamp: string;
}

export interface CreateConversationRequest {
  aiModel: string;
}