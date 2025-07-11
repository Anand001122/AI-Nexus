import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useChatStore();

  const themes = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' }
  ] as const;

  return (
    <div className="relative">
      <select
        value={theme}
        onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
        className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        aria-label="Select theme"
      >
        {themes.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
        {themes.find(t => t.value === theme)?.icon && 
          React.createElement(themes.find(t => t.value === theme)!.icon, {
            className: "h-4 w-4 text-gray-400"
          })
        }
      </div>
    </div>
  );
};