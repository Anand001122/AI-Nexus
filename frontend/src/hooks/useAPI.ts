import { useState } from 'react';
import { SendMessageRequest, SendMessageResponse, CreateConversationRequest, Conversation } from '../types';
import apiClient from '../api/client';

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await apiClient.post<SendMessageResponse>('/chat/send', request);
    return response.data;
  };

  const createConversation = async (request: CreateConversationRequest): Promise<Conversation> => {
    const response = await apiClient.post<Conversation>('/conversations', request);
    return response.data;
  };

  const getConversation = async (conversationId: string): Promise<Conversation> => {
    const response = await apiClient.get<Conversation>(`/conversations/${conversationId}`);
    return response.data;
  };

  const getUserConversations = async (): Promise<Conversation[]> => {
    const response = await apiClient.get<Conversation[]>('/conversations');
    return response.data;
  }

  const getPersonalAnalytics = async (): Promise<any> => {
    const response = await apiClient.get('/analytics/personal');
    return response.data;
  };

  const getGlobalLeaderboard = async (): Promise<any> => {
    const response = await apiClient.get('/analytics/leaderboard');
    return response.data;
  };

  const deleteConversation = async (conversationId: string): Promise<void> => {
    await apiClient.delete(`/conversations/${conversationId}`);
  };

  const login = async (credentials: any) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  };

  const signup = async (data: any) => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  };

  const getMe = async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  };

  return {
    sendMessage,
    createConversation,
    getConversation,
    getUserConversations,
    getPersonalAnalytics,
    getGlobalLeaderboard,
    deleteConversation,
    login,
    signup,
    getMe,
    isLoading,
    setIsLoading
  };
};