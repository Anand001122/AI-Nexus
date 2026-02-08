import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini',
    name: 'Gemini 2.5',
    displayName: 'Gemini 2.5 Pro',
    color: 'from-indigo-600 via-purple-600 to-violet-700',
    icon: 'Sparkles',
    description: 'Google\'s next-gen intelligence',
    isExpert: true
  },
  {
    id: 'gpt5',
    name: 'GPT-5',
    displayName: 'GPT-5 Chat',
    color: 'from-emerald-500 via-teal-600 to-cyan-700',
    icon: 'Zap',
    description: 'OpenAI\'s future-leap model'
  },
  {
    id: 'grok',
    name: 'Grok 4.1',
    displayName: 'Grok 4.1',
    color: 'from-amber-500 via-orange-600 to-red-600',
    icon: 'Brain',
    description: 'xAI\'s real-time reasoning'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    displayName: 'DeepSeek',
    color: 'from-cyan-500 via-blue-600 to-indigo-700',
    icon: 'Eye',
    description: 'Advanced logical reasoning',
    isExpert: true
  }
];

export const ALL_MODELS_ID = 'all-models';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const ENDPOINTS = {
  SEND_MESSAGE: `${API_BASE_URL}/chat/send`,
  CREATE_CONVERSATION: `${API_BASE_URL}/conversations`,
  GET_CONVERSATION: (id: string) => `${API_BASE_URL}/conversations/${id}`,
  DELETE_CONVERSATION: (id: string) => `${API_BASE_URL}/conversations/${id}`
};