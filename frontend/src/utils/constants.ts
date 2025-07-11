import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    displayName: 'Gemini Pro',
    color: 'from-violet-500 via-purple-500 to-blue-500',
    icon: 'Sparkles',
    description: 'Google\'s most advanced multimodal AI'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    displayName: 'DeepSeek V3',
    color: 'from-emerald-400 via-teal-500 to-cyan-600',
    icon: 'Eye',
    description: 'Advanced reasoning and coding model'
  },
  {
    id: 'copilot',
    name: 'Copilot',
    displayName: 'GitHub Copilot',
    color: 'from-orange-400 via-pink-500 to-red-500',
    icon: 'Bot',
    description: 'Microsoft\'s AI-powered assistant'
  }
];

export const ALL_MODELS_ID = 'all-models';

export const API_BASE_URL = 'https://chat-grid.onrender.com/api';

export const ENDPOINTS = {
  SEND_MESSAGE: `${API_BASE_URL}/chat/send`,
  CREATE_CONVERSATION: `${API_BASE_URL}/conversations`,
  GET_CONVERSATION: (id: string) => `${API_BASE_URL}/conversations/${id}`,
  DELETE_CONVERSATION: (id: string) => `${API_BASE_URL}/conversations/${id}`
};