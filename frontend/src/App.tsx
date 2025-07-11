import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { MessageList } from './components/MessageList';
import { ChatInput } from './components/ChatInput';
import { useChatStore } from './store/chatStore';

function App() {
  const { theme } = useChatStore();

  useEffect(() => {
    // Handle system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    handleThemeChange(); // Apply initial theme

    return () => {
      mediaQuery.removeEventListener('change', handleThemeChange);
    };
  }, [theme]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-800 dark:to-gray-900 transition-all duration-500">
      <div className="flex flex-col h-screen">
        <Header />
        <MessageList />
        <ChatInput />
      </div>
    </div>
  );
}

export default App;