import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { LoadingIndicator, TypingIndicator } from './LoadingIndicator';
import { useChatStore } from '../store/chatStore';
import { AI_MODELS } from '../utils/constants';
import * as LucideIcons from 'lucide-react';

export const MessageList: React.FC = () => {
  const { conversations, currentConversationId, selectedModels, loading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = currentConversationId ? conversations[currentConversationId] : null;
  const messages = currentConversation?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (!currentConversation && selectedModels.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            Welcome to AI Chat
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Select AI models and start your conversation with the most advanced AI assistants
          </p>
        </div>
      </div>
    );
  }

  // Multi-model view with enhanced scrolling
  if (selectedModels.length > 1) {
    return (
      <div className="flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900">
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
          {selectedModels.map((modelId) => {
            const model = AI_MODELS.find(m => m.id === modelId);
            const modelMessages = messages.filter(m => m.aiModel === modelId || m.isUser);
            const isLoading = loading[modelId];
            const IconComponent = model ? (LucideIcons as any)[model.icon] : null;

            return (
              <div
                key={modelId}
                className="flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden"
              >
                {/* Enhanced Model Header */}
                <div className={`p-6 bg-gradient-to-r ${model?.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10"></div>
                  <div className="relative z-10 flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      {IconComponent && <IconComponent className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{model?.displayName}</h3>
                      <p className="text-sm text-white/80">{model?.description}</p>
                    </div>
                  </div>
                  <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-white/10"></div>
                  <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/5"></div>
                </div>

                {/* Enhanced Messages Container with Scroll */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 max-h-[calc(100vh-300px)] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                  {modelMessages.length === 0 && !isLoading ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          {IconComponent && <IconComponent className="h-6 w-6 text-gray-400" />}
                        </div>
                        <p className="text-sm">Start a conversation with {model?.displayName}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      {modelMessages.map((message) => (
                        <Message key={message.id} message={message} />
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-4 max-w-xs">
                            <TypingIndicator />
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Single model view with enhanced scrolling
  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className="group">
            <Message message={message} />
          </div>
        ))}
        {Object.entries(loading).some(([_, isLoading]) => isLoading) && (
          <div className="flex justify-start">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-4 shadow-lg border border-white/20 dark:border-gray-700/50">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};