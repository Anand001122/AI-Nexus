import React, { useEffect, useRef, useMemo } from 'react';
import { Message } from './Message';
import { TypingIndicator } from './LoadingIndicator';
import { useChatStore } from '../../store/chatStore';
import { AI_MODELS } from '../../utils/constants';
import * as LucideIcons from 'lucide-react';
import { MetricsDashboard } from './MetricsDashboard';

export const MessageList: React.FC = () => {
  const { conversations, currentConversationId, selectedModels, loading } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentConversation = currentConversationId ? conversations[currentConversationId] : null;
  const messages = useMemo(() => currentConversation?.messages || [], [currentConversation?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  if (!currentConversation && selectedModels.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-black">
        <div className="text-center max-w-sm sm:max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
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
    const gridCols = selectedModels.length === 2 || selectedModels.length === 4
      ? 'lg:grid-cols-2'
      : 'lg:grid-cols-3';

    return (
      <div className="flex-1 overflow-y-auto bg-black scrollbar-thin">
        <MetricsDashboard messages={messages} />
        <div className={`grid grid-cols-1 ${gridCols} gap-8 p-8 h-fit`}>
          {selectedModels.map((modelId) => {
            const model = AI_MODELS.find(m => m.id === modelId);
            const modelMessages = messages.filter(m => m.aiModel === modelId || m.isUser);
            const isLoading = loading[modelId];
            const IconComponent = model ? (LucideIcons as unknown as Record<string, React.ComponentType>)[model.icon] : LucideIcons.MessageSquare;

            return (
              <div
                key={modelId}
                className="flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl overflow-hidden min-h-[600px] transition-all duration-300 hover:shadow-blue-500/10"
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
                <div className="flex-1 overflow-y-auto p-6 space-y-6 min-h-0 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
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
                      {modelMessages.map((msg) => (
                        <Message key={msg.id} message={msg} />
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
    <div className="flex-1 overflow-y-auto bg-black scrollbar-thin">
      <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
        <MetricsDashboard messages={messages} />
        {messages.map((msg) => (
          <div key={msg.id} className="group">
            <Message message={msg} />
          </div>
        ))}
        {Object.entries(loading).some(([, isLoading]) => isLoading) && (
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