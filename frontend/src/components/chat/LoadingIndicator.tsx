import React from 'react';

interface LoadingIndicatorProps {
  model?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ 
  model, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`animate-spin rounded-full border-2 border-gray-200 border-t-blue-500 ${sizeClasses[size]}`} />
      {model && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {model} is thinking...
        </span>
      )}
    </div>
  );
};

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-1 p-3">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="text-sm text-gray-500 ml-2">AI is typing...</span>
    </div>
  );
};