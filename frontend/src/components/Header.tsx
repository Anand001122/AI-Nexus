import React from 'react';
import { MessageSquare, Sparkles, BarChart2, Trophy, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ModelSelector } from './ModelSelector';
import { ThemeToggle } from './ThemeToggle';
import { useAuthStore } from '../store/authStore';
import { API_BASE_URL } from '../utils/constants';

const BackendStatus: React.FC = () => {
  const [isOnline, setIsOnline] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkStatus = async () => {
      try {
        const rootUrl = API_BASE_URL.replace('/api', '');
        const res = await fetch(rootUrl);
        setIsOnline(res.ok);
      } catch (err) {
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
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        {isOnline ? 'Online' : 'Offline'}
      </span>
    </div>
  );
};

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-2 px-4 py-2 rounded-xl transition-all ${isActive
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="glass-header shadow-sm border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <NavLink to="/" className="flex items-center space-x-5 group">
              <div className="relative transform transition-all duration-500 group-hover:scale-105 group-hover:rotate-1">
                {/* Multi-layered Mesh Gradient Logo */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
                  <MessageSquare className="h-5 w-5 text-white relative z-10 filter drop-shadow-md" />
                </div>
                {/* Premium Shine Accent */}
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-gradient-to-tr from-yellow-300 to-orange-500 flex items-center justify-center border-2 border-white dark:border-black shadow-lg">
                  <Sparkles className="h-1.5 w-1.5 text-white animate-pulse" />
                </div>
                {/* Subtle Outer Glow */}
                <div className="absolute inset-0 rounded-2xl bg-blue-500/20 blur-xl group-hover:bg-blue-500/30 transition-all -z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 dark:text-white leading-none tracking-tighter uppercase italic">
                  AI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-400">Nexus</span>
                </h1>
                <div className="mt-1">
                  <BackendStatus />
                </div>
              </div>
            </NavLink>

            <nav className="hidden lg:flex items-center space-x-2">
              <NavLink to="/" end className={navItemClass}>
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-semibold">Chat</span>
              </NavLink>
              <NavLink to="/analytics" className={navItemClass}>
                <BarChart2 className="w-4 h-4" />
                <span className="text-sm font-semibold">Analytics</span>
              </NavLink>
              <NavLink to="/leaderboard" className={navItemClass}>
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">Leaderboard</span>
              </NavLink>
              <NavLink to="/feedback" className={navItemClass}>
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm font-semibold">Support</span>
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <ModelSelector />
            </div>

            <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 hidden md:block"></div>

            <div className="flex items-center space-x-4">
              {!user?.isPremium && (
                <NavLink
                  to="/pro"
                  className="hidden md:flex items-center space-x-2 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Go Pro</span>
                </NavLink>
              )}

              <div className="flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold relative ${user?.isPremium ? 'bg-gradient-to-tr from-yellow-400 to-orange-500' : 'bg-blue-500'}`}>
                  {user?.fullName?.charAt(0) || 'U'}
                  {user?.isPremium && (
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-start leading-none hidden md:flex">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 max-w-[80px] truncate">
                    {user?.fullName?.split(' ')[0]}
                  </span>
                  {user?.isPremium && (
                    <span className="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Pro Expert</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1 hover:text-rose-500 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};