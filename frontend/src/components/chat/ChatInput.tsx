import React, { useState, useRef, useEffect } from 'react';
import { Send, Square, Zap, Sparkles, Brain } from 'lucide-react';
import { useChatStore } from '../../store/chatStore';
import { useAuthStore } from '../../store/authStore';
import { useAPI } from '../../hooks/useAPI';
import { generateId } from '../../utils/helpers';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

export const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { user } = useAuthStore();
  const {
    selectedModels,
    currentConversationId,
    createConversation,
    addUserMessage,
    addMessage,
    setLoading,
    setError
  } = useChatStore();

  const { sendMessage } = useAPI();

  const calculateSimpleScore = (text: string) => {
    if (!text.trim()) return 0;
    let score = Math.min(10, text.length / 30 + 1);
    const keywords = ['how', 'why', 'what', 'explain', 'compare', 'analyze', 'debug', 'code', 'example'];
    const lowerText = text.toLowerCase();

    keywords.forEach(word => {
      if (lowerText.includes(word)) score += 0.5;
    });

    if (text.includes('?')) score += 1;
    if (text.split(/\s+/).length > 15) score += 2;
    return Math.min(10, Math.floor(score));
  };

  const currentScore = calculateSimpleScore(message);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [message]);

  const handleOptimize = async () => {
    if (!message.trim() || isAnalyzing) return;

    if (!user?.isPremium) {
      alert("✨ Master Rewrite is a Pro feature. Upgrade to optimize your prompts!");
      return;
    }

    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('auth-storage');
      let jwt = '';
      if (token) {
        const parsed = JSON.parse(token);
        jwt = parsed.state.token;
      }

      const res = await axios.post(`${API_BASE_URL}/prompt/analyze`, { prompt: message }, {
        headers: { Authorization: `Bearer ${jwt}` }
      });

      if (res.data && res.data.optimizedPrompt) {
        setMessage(res.data.optimizedPrompt);
      }
    } catch (err) {
      console.error('Optimization error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isSending || selectedModels.length === 0) return;

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);

    try {
      addUserMessage(userMessage);

      let conversationId = currentConversationId;
      if (!conversationId) {
        conversationId = createConversation(selectedModels[0]);
      }

      const promises = selectedModels.map(async (modelId) => {
        setLoading(modelId, true);
        setError(modelId, null);

        try {
          const response = await sendMessage({
            conversationId,
            aiModel: modelId,
            message: userMessage,
            isExpertAdvice: isExpertMode
          });

          const aiMessage = {
            id: generateId(),
            content: response.content,
            aiModel: modelId,
            conversationId,
            timestamp: new Date().toISOString(),
            isUser: false,
            metrics: response.metrics
          };

          addMessage(conversationId, aiMessage);
        } catch (error) {
          console.error(`Error sending message to ${modelId}:`, error);
          setError(modelId, error instanceof Error ? error.message : 'Failed to send message');
        } finally {
          setLoading(modelId, false);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error('Error sending messages:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleStop = () => {
    setIsSending(false);
    selectedModels.forEach(modelId => {
      setLoading(modelId, false);
    });
  };

  const getScoreColor = (score: number) => {
    if (score < 4) return 'bg-rose-500';
    if (score < 7) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="bg-white/95 dark:bg-black/95 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div className="max-w-5xl mx-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
        {/* Real-time Prompt Quality Meter */}
        <div className={`transition-all duration-500 overflow-hidden ${message.length > 2 ? 'h-auto opacity-100 mb-2' : 'h-0 opacity-0'}`}>
          <div className="flex items-center justify-between mb-1.5 px-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Prompt Strength</span>
              {currentScore < 5 && message.length > 5 && (
                <span className="hidden sm:inline-block text-[8px] font-black text-rose-500 uppercase tracking-tighter bg-rose-500/10 px-1.5 py-0.5 rounded-md">Improve for better results</span>
              )}
            </div>
            <span className="text-[10px] font-bold text-slate-500">{currentScore}/10</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getScoreColor(currentScore)} shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
              style={{ width: `${currentScore * 10}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-end space-x-2 sm:space-x-4">
            <div className="flex-1 relative group">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedModels.length === 0
                    ? "Select AI..."
                    : selectedModels.length === 1
                      ? `Ask ${selectedModels[0]}...`
                      : `Ask ${selectedModels.length} models...`
                }
                disabled={selectedModels.length === 0 || isSending}
                className="w-full px-4 sm:px-6 py-4 pr-24 sm:pr-32 bg-slate-50/50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 rounded-3xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300 disabled:opacity-50 text-slate-900 dark:text-zinc-100 shadow-inner text-sm sm:text-base"
                style={{ minHeight: '56px', maxHeight: '120px' }}
                rows={1}
              />

              <div className="absolute right-3 sm:right-4 bottom-3 flex items-center space-x-1 sm:space-x-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (!user?.isPremium) {
                      alert("🧠 Expert Advice mode is a Pro feature. Upgrade for deeper insights!");
                      return;
                    }
                    setIsExpertMode(!isExpertMode);
                  }}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all group/expert border ${isExpertMode
                    ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-white dark:hover:bg-slate-700/50 border-transparent'}`}
                  title={isExpertMode ? "Expert Advice: ON" : "Expert Advice (Pro)"}
                >
                  <Brain className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform ${isExpertMode ? 'scale-110' : 'group-hover/expert:scale-110'}`} />
                </button>

                <button
                  type="button"
                  onClick={handleOptimize}
                  disabled={isAnalyzing || message.length < 5}
                  className={`p-1.5 sm:p-2 rounded-xl transition-all group/opt border ${message.length >= 5
                    ? 'text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700/50 border-transparent'
                    : 'text-slate-300 opacity-40 cursor-not-allowed border-transparent'}`}
                  title={message.length < 5 ? "Type more to use AI Optimize" : "AI Optimize (Pro)"}
                >
                  {isAnalyzing ? (
                    <div className="h-4 w-4 sm:h-5 sm:w-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 group-hover/opt:scale-110 transition-transform" />
                  )}
                </button>
                <div className="hidden sm:block text-[8px] font-mono text-slate-400 opacity-50 w-6 text-center tabular-nums">{message.length}</div>
              </div>
            </div>

            <button
              type={isSending ? "button" : "submit"}
              onClick={isSending ? handleStop : undefined}
              disabled={selectedModels.length === 0 || (!isSending && !message.trim())}
              className={`p-3.5 sm:p-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-95 ${isSending
                ? 'bg-gradient-to-tr from-rose-500 to-red-600 text-white'
                : 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 text-white'
                }`}
              aria-label={isSending ? "Stop generation" : "Send message"}
            >
              {isSending ? (
                <Square className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <Send className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center space-x-4 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            <div className="hidden sm:flex items-center space-x-2">
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-mono shadow-sm">Enter</kbd>
              <span>to send</span>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-[10px] font-mono shadow-sm">Shift+Enter</kbd>
              <span>new line</span>
            </div>
            {selectedModels.length > 1 && (
              <div className="flex items-center space-x-2">
                <Zap className="h-3 w-3" />
                <span>Multi-model comparison active</span>
              </div>
            )}
          </div>
        </form>
      </div >
    </div >
  );
};