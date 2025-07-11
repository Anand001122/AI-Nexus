import React, { useState } from 'react';
import { Copy, Check, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message as MessageType } from '../types';
import { AI_MODELS } from '../utils/constants';
import { formatTimestamp, copyToClipboard } from '../utils/helpers';
import * as LucideIcons from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const [copied, setCopied] = useState(false);
  
  const isUser = message.isUser || message.aiModel === 'user';
  const model = AI_MODELS.find(m => m.id === message.aiModel);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const IconComponent = model ? (LucideIcons as any)[model.icon] : User;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-4`}>
        {/* Enhanced Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-4' : 'mr-4'}`}>
          {isUser ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${model?.color || 'from-gray-400 to-gray-500'} flex items-center justify-center shadow-lg`}>
              {IconComponent && <IconComponent className="h-5 w-5 text-white" />}
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {/* Enhanced Header */}
          <div className={`flex items-center mb-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {isUser ? 'You' : model?.displayName || 'AI'}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-3 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
              {formatTimestamp(message.timestamp)}
            </span>
          </div>

          {/* Enhanced Message Bubble */}
          <div 
            className={`group relative p-5 rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl ${
              isUser 
                ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white' 
                : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/20 dark:border-gray-700/50'
            }`}
          >
            {isUser ? (
              <p className="text-white whitespace-pre-wrap leading-relaxed">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Enhanced Copy Button */}
            {!isUser && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded-lg bg-gray-100/80 dark:bg-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-sm"
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            )}

            {/* Message Tail */}
            <div className={`absolute top-4 ${isUser ? 'right-0 translate-x-2' : 'left-0 -translate-x-2'} w-4 h-4 rotate-45 ${
              isUser 
                ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                : 'bg-white/90 dark:bg-gray-800/90 border-l border-t border-white/20 dark:border-gray-700/50'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};