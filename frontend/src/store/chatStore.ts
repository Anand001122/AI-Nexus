import { create } from 'zustand';
import { ChatState, Conversation, Message } from '../types';
import { generateId, getSystemTheme, applyTheme } from '../utils/helpers';
import { AI_MODELS } from '../utils/constants';

interface ChatActions {
  setSelectedModels: (models: string[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setLoading: (model: string, loading: boolean) => void;
  setError: (model: string, error: string | null) => void;
  createConversation: (aiModel: string) => string;
  setCurrentConversation: (conversationId: string | null) => void;
  clearConversation: (conversationId: string) => void;
  clearAllConversations: () => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  addUserMessage: (message: string) => void;
}

export const useChatStore = create<ChatState & ChatActions>((set, get) => ({
  conversations: {},
  currentConversationId: null,
  selectedModels: [AI_MODELS[0].id],
  loading: {},
  errors: {},
  theme: 'system',

  setSelectedModels: (models) => set({ selectedModels: models }),

  addMessage: (conversationId, message) => set((state) => ({
    conversations: {
      ...state.conversations,
      [conversationId]: {
        ...state.conversations[conversationId],
        messages: [...(state.conversations[conversationId]?.messages || []), message],
        updatedAt: new Date().toISOString()
      }
    }
  })),

  setLoading: (model, loading) => set((state) => ({
    loading: { ...state.loading, [model]: loading }
  })),

  setError: (model, error) => set((state) => ({
    errors: { ...state.errors, [model]: error }
  })),

  createConversation: (aiModel) => {
    const id = generateId();
    const conversation: Conversation = {
      id,
      aiModel,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    set((state) => ({
      conversations: { ...state.conversations, [id]: conversation },
      currentConversationId: id
    }));

    return id;
  },

  setCurrentConversation: (conversationId) => set({ currentConversationId: conversationId }),

  clearConversation: (conversationId) => set((state) => {
    const newConversations = { ...state.conversations };
    delete newConversations[conversationId];
    
    return {
      conversations: newConversations,
      currentConversationId: state.currentConversationId === conversationId ? null : state.currentConversationId
    };
  }),

  clearAllConversations: () => set({
    conversations: {},
    currentConversationId: null,
    loading: {},
    errors: {}
  }),

  setTheme: (theme) => {
    set({ theme });
    applyTheme(theme);
    localStorage.setItem('chat-theme', theme);
  },

  addUserMessage: (message) => {
    const state = get();
    const { selectedModels, currentConversationId } = state;
    
    // Create conversation if none exists
    let conversationId = currentConversationId;
    if (!conversationId) {
      conversationId = state.createConversation(selectedModels[0]);
    }

    // Add user message
    const userMessage: Message = {
      id: generateId(),
      content: message,
      aiModel: 'user',
      conversationId,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    state.addMessage(conversationId, userMessage);
  }
}));

// Initialize theme on store creation
const initialTheme = (localStorage.getItem('chat-theme') as 'light' | 'dark' | 'system') || 'system';
useChatStore.getState().setTheme(initialTheme);