import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useChatStore();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ] as const;

  return (
    <div className="flex bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`p-2 rounded-lg transition-all duration-200 flex items-center justify-center group relative ${theme === value
            ? 'bg-white dark:bg-slate-700 shadow-sm text-blue-600 dark:text-blue-400'
            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          aria-label={`Switch to ${label} theme`}
          title={label}
        >
          <Icon className="h-4 w-4" />
          {theme === value && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"></span>
          )}
        </button>
      ))}
    </div>
  );
};