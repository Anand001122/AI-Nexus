import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { MessageList } from './components/chat/MessageList';
import { ChatInput } from './components/chat/ChatInput';
import { useChatStore } from './store/chatStore';
import { useAuthStore } from './store/authStore';
import { AuthPage } from './pages/AuthPage';
import { AuthCallback } from './pages/AuthCallback';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ProPage } from './pages/ProPage';

import { Sidebar } from './components/layout/Sidebar';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

const ChatInterface = () => (
  <div className="flex h-screen overflow-hidden bg-black relative">
    <Sidebar />
    <div className="flex-1 flex flex-col relative overflow-hidden">
      <Header />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <MessageList />
        <ChatInput />
      </div>
    </div>
  </div>
);

function App() {
  const { theme } = useChatStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = () => {
      if (theme === 'system') {
        const isDark = mediaQuery.matches;
        document.documentElement.classList.toggle('dark', isDark);
      }
    };
    mediaQuery.addEventListener('change', handleThemeChange);
    handleThemeChange();
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, [theme]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#000000] transition-all duration-500">
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <LeaderboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pro"
          element={
            <ProtectedRoute>
              <ProPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;