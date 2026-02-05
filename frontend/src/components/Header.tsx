import React from 'react';
import { Trash2, MessageSquare, Sparkles } from 'lucide-react';
import { ModelSelector } from './ModelSelector';
import { ThemeToggle } from './ThemeToggle';
import { useChatStore } from '../store/chatStore';
import { API_BASE_URL } from '../utils/constants';

const BackendStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(API_BASE_URL.replace('/api', ''));
        setIsOnline(res.ok);
      } catch {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) return null;

  return (
    <div className="flex items-center space-x-1.5 px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 animate-pulse'}`} />
      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {isOnline ? 'API Online' : 'API Connecting...'}
      </span>
    </div>
  );
};

export const Header: React.FC = () => {
  const { clearAllConversations, conversations } = useChatStore();

  const hasConversations = Object.keys(conversations).length > 0;

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all conversations? This action cannot be undone.')) {
      clearAllConversations();
    }
  };

  return (
    <header className="glass-header shadow-sm">
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
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  AI Chat Pro
                </h1>
                <BackendStatus />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
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