import React, { useState } from 'react';
import { Copy, Check, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Message as MessageType } from '../../types';
import { AI_MODELS } from '../../utils/constants';
import { formatTimestamp, copyToClipboard } from '../../utils/helpers';
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

  const IconComponent = model ? (LucideIcons as unknown as Record<string, React.ComponentType>)[model.icon] : User;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-4`}>
        {/* Enhanced Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-4' : 'mr-4'} animate-in`}>
          {isUser ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg border border-white/10">
              <User className="h-5 w-5 text-white" />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model?.color || 'from-slate-400 to-slate-500'} flex items-center justify-center shadow-lg border border-white/10`}>
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
            {message.metrics && (
              <>
                <span className="text-xs text-blue-500 dark:text-blue-400 ml-2 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full border border-blue-200/50 dark:border-blue-800/50">
                  {message.metrics.responseTimeMs / 1000}s
                </span>
                <span className="text-xs text-emerald-500 dark:text-emerald-400 ml-2 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
                  {message.metrics.wordCount} words
                </span>
              </>
            )}
          </div>

          {/* Enhanced Message Bubble */}
          <div
            className={`group relative p-5 rounded-3xl shadow-md transition-all duration-300 hover:shadow-xl ${isUser
              ? 'bg-gradient-to-br from-slate-700 to-slate-900 text-white'
              : `bg-gradient-to-br ${model?.color || 'from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900'} text-white`
              }`}
          >
            {isUser ? (
              <p className="text-white whitespace-pre-wrap leading-relaxed">{message.content}</p>
            ) : (
              <div className="prose prose-sm max-w-none prose-invert prose-headings:text-white prose-p:text-white/95 prose-code:bg-white/10 prose-code:text-white prose-pre:bg-black/20">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            )}

            {/* Enhanced Copy Button */}
            {!isUser && (
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 opacity-0 group-hover:opacity-100 backdrop-blur-sm shadow-sm"
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4 text-white/70" />
                )}
              </button>
            )}

            {/* Message Tail */}
            <div className={`absolute top-4 ${isUser ? 'right-0 translate-x-1' : 'left-0 -translate-x-1'} w-3 h-3 rotate-45 ${isUser
              ? 'bg-slate-800'
              : `bg-gradient-to-br ${model?.color || 'from-slate-100 to-slate-200 dark:from-slate-800'}`
              }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};