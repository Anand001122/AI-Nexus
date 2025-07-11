import { useState } from 'react';
import { SendMessageRequest, SendMessageResponse, CreateConversationRequest, Conversation } from '../types';
import { ENDPOINTS } from '../utils/constants';

export const useAPI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    const response = await fetch(ENDPOINTS.SEND_MESSAGE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const createConversation = async (request: CreateConversationRequest): Promise<Conversation> => {
    const response = await fetch(ENDPOINTS.CREATE_CONVERSATION, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const getConversation = async (conversationId: string): Promise<Conversation> => {
    const response = await fetch(ENDPOINTS.GET_CONVERSATION(conversationId));

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  const deleteConversation = async (conversationId: string): Promise<void> => {
    const response = await fetch(ENDPOINTS.DELETE_CONVERSATION(conversationId), {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  };

  // Mock API for development
  const mockSendMessage = async (request: SendMessageRequest): Promise<SendMessageResponse> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    const responses = [
      "That's an interesting question! Let me think about it...",
      "I understand what you're asking. Here's my perspective on that...",
      "Great question! This is a complex topic that involves several factors...",
      "I'd be happy to help you with that. Based on my understanding...",
      "That's a thoughtful inquiry. From my analysis, I can see that...",
    ];

    return {
      id: Math.random().toString(36).substring(2),
      content: responses[Math.floor(Math.random() * responses.length)] + 
               " Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      aiModel: request.aiModel,
      conversationId: request.conversationId,
      timestamp: new Date().toISOString()
    };
  };

  return {
    sendMessage, // Use mockSendMessage for development
    createConversation,
    getConversation,
    deleteConversation,
    isLoading,
    setIsLoading
  };
};