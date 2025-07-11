import React from 'react';
import { Trash2, MessageSquare, Sparkles } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { ThemeToggle } from './ThemeToggle';
import { useChatStore } from '../store/chatStore';

export const Header: React.FC = () => {
  const { clearAllConversations, conversations } = useChatStore();
  
  const hasConversations = Object.keys(conversations).length > 0;

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      clearAllConversations();
    }
  };

  return (
    <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-b border-white/20 dark:border-gray-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Enhanced Logo */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-xl">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="h-2 w-2 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-gray-100 dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                AI Chat Pro
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Compare AI responses instantly
              </p>
            </div>
          </div>

          {/* Enhanced Controls */}
          <div className="flex items-center space-x-4">
            <ModelSelector />
            
            {hasConversations && (
              <button
                onClick={handleClearAll}
                className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 group"
                aria-label="Clear all conversations"
                title="Clear all conversations"
              >
                <Trash2 className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
              </button>
            )}
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};