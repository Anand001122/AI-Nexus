import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Zap } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useAPI } from '../hooks/useAPI';
import { generateId } from '../utils/helpers';

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const { 
    selectedModels, 
    currentConversationId, 
    createConversation, 
    addUserMessage, 
    addMessage, 
    setLoading,
    setError
  } = useChatStore();
  
  const { sendMessage } = useAPI();

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isSending || selectedModels.length === 0) return;

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      // Add user message to store
      addUserMessage(userMessage);

      // Get or create conversation ID
      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = createConversation(selectedModels[0]);
      }

      // Send message to each selected model
      const promises = selectedModels.map(async (modelId) => {
        setLoading(modelId, true);
        setError(modelId, null);

        try {
          const response = await sendMessage({
            conversationId,
            aiModel: modelId,
            message: userMessage
          });

          const aiMessage = {
            id: generateId(),
            content: response.content,
            aiModel: modelId,
            conversationId,
            timestamp: new Date().toISOString(),
            isUser: false
          };

          addMessage(conversationId, aiMessage);
        } catch (error) {
          console.error(`Error sending message to ${modelId}:`, error);
          setError(modelId, error instanceof Error ? error.message : 'Failed to send message');
        } finally {
          setLoading(modelId, false);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending messages:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  const handleStop = () => {
    setIsSending(false);
    selectedModels.forEach(modelId => {
      setLoading(modelId, false);
    });
  };

  return (
    <div className="border-t border-white/20 dark:border-gray-700/50 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl shadow-2xl">
      <div className="max-w-5xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-4">
            {/* Enhanced Message Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedModels.length === 0 
                    ? "Select an AI model to start chatting..." 
                    : selectedModels.length === 1 
                      ? `Ask ${selectedModels[0]}...` 
                      : `Ask ${selectedModels.length} AI models...`
                }
                disabled={selectedModels.length === 0 || isSending}
                className="w-full px-6 py-4 pr-16 bg-gray-50/80 dark:bg-gray-700/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-600/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
                style={{ minHeight: '60px', maxHeight: '120px' }}
                rows={1}
              />
              
              {/* Enhanced Character count */}
              {message.length > 0 && (
                <div className="absolute bottom-2 right-20 text-xs text-gray-400 bg-white/80 dark:bg-gray-800/80 px-2 py-1 rounded-full backdrop-blur-sm">
                  {message.length}
                </div>
              )}
            </div>

            {/* Enhanced Send/Stop Button */}
            <button
              type={isSending ? "button" : "submit"}
              onClick={isSending ? handleStop : undefined}
              disabled={selectedModels.length === 0 || (!isSending && !message.trim())}
              className={`p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 ${
                isSending
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white'
                  : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white'
              }`}
              aria-label={isSending ? "Stop generation" : "Send message"}
            >
              {isSending ? (
                <Square className="h-6 w-6" />
              ) : (
                <Send className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Enhanced Keyboard shortcut hint */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-mono">Ctrl+Enter</kbd>
              <span>to send</span>
            </div>
            {selectedModels.length > 1 && (
              <div className="flex items-center space-x-2">
                <Zap className="h-3 w-3" />
                <span>Multi-model comparison active</span>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};