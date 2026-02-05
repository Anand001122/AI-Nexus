import { AIModel } from '../types';

export const AI_MODELS: AIModel[] = [
  {
    id: 'gemini',
    name: 'Gemini',
    displayName: 'Gemini 1.5 Pro',
    color: 'from-indigo-600 via-purple-600 to-violet-700',
    icon: 'Sparkles',
    description: 'Google\'s multimodal intelligence'
  },
  {
    id: 'gpt4',
    name: 'GPT-4o',
    displayName: 'GPT-4o',
    color: 'from-emerald-500 via-teal-600 to-cyan-700',
    icon: 'Zap',
    description: 'OpenAI\'s most versatile model'
  },
  {
    id: 'claude',
    name: 'Claude',
    displayName: 'Claude 3.5 Sonnet',
    color: 'from-amber-500 via-orange-600 to-red-600',
    icon: 'Brain',
    description: 'Anthropic\'s reasoning specialist'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    displayName: 'DeepSeek V3',
    color: 'from-cyan-500 via-blue-600 to-indigo-700',
    icon: 'Eye',
    description: 'Advanced coding & math capability'
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