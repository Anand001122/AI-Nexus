import React, { useState } from 'react';
import { Send, MessageSquare, Mail, Github, ExternalLink, ThumbsUp, HelpCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export const FeedbackPage: React.FC = () => {
    const [content, setContent] = useState('');
    const [type, setType] = useState('suggestion');
    const [contactInfo, setContactInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const token = localStorage.getItem('auth-storage');
            let jwt = '';
            if (token) {
                const parsed = JSON.parse(token);
                jwt = parsed.state.token;
            }

            await axios.post(`${API_BASE_URL}/feedback`, {
                content,
                type,
                contactInfo
            }, {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });

            setSubmitted(true);
            setContent('');
            setContactInfo('');
        } catch (err) {
            console.error('Feedback error:', err);
            setError('Failed to submit feedback. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        { id: 'suggestion', label: 'Suggestion', icon: ThumbsUp, color: 'text-green-500' },
        { id: 'query', label: 'Query', icon: HelpCircle, color: 'text-blue-500' },
        { id: 'bug', label: 'Report Bug', icon: AlertCircle, color: 'text-red-500' },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-5xl tracking-tight">
                        Suggestions & <span className="text-blue-600">Support</span>
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        Help us improve AI Nexus. Share your ideas, report issues, or just say hello!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Feedback Form */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="glass p-8 rounded-3xl shadow-xl border border-white/20 dark:border-white/5">
                            {submitted ? (
                                <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                                        <Send className="h-10 w-10 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Thank You!</h3>
                                        <p className="text-slate-600 dark:text-slate-400">Your feedback has been received. We appreciate your input!</p>
                                    </div>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-medium hover:opacity-90 transition-opacity"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Feedback Type
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setType(cat.id)}
                                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${type === cat.id
                                                            ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
                                                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50'
                                                        }`}
                                                >
                                                    <cat.icon className={`h-6 w-6 mb-2 ${cat.color}`} />
                                                    <span className="text-xs font-medium dark:text-slate-300">{cat.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="content" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Detailed Suggestion or Bug Report
                                        </label>
                                        <textarea
                                            id="content"
                                            required
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={6}
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            placeholder="What should we add or fix?"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label htmlFor="contact" className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                                            Contact Info (Optional)
                                        </label>
                                        <input
                                            id="contact"
                                            type="text"
                                            value={contactInfo}
                                            onChange={(e) => setContactInfo(e.target.value)}
                                            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                                            placeholder="Email or Telegram handle"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center space-x-2 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                                    >
                                        {isSubmitting ? (
                                            <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Submit Feedback</span>
                                                <Send className="h-5 w-5" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="space-y-6">
                        <div className="glass p-8 rounded-3xl shadow-lg border border-white/20 dark:border-white/5 space-y-8">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5 text-blue-500" />
                                <span>Contact Creator</span>
                            </h2>

                            <div className="space-y-4">
                                <a
                                    href="mailto:anandhiremath.dev@gmail.com"
                                    className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors group"
                                >
                                    <Mail className="h-6 w-6 text-slate-400 group-hover:text-blue-500 transition-colors mr-4" />
                                    <div>
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</div>
                                        <div className="text-sm font-medium dark:text-white">anandhiremath.dev@gmail.com</div>
                                    </div>
                                </a>

                                <a
                                    href="https://github.com/Anand001122"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors group"
                                >
                                    <Github className="h-6 w-6 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors mr-4" />
                                    <div>
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">GitHub</div>
                                        <div className="text-sm font-medium dark:text-white">@Anand001122</div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 ml-auto text-slate-300 group-hover:text-slate-400" />
                                </a>
                            </div>

                            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="p-4 rounded-2xl bg-blue-600/5 dark:bg-blue-400/5 border border-blue-500/10">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                        "Building AI Nexus to empower developers with clear AI insights. Your feedback is what drives our progress!"
                                    </p>
                                    <div className="mt-3 flex items-center space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600" />
                                        <div>
                                            <div className="text-xs font-bold dark:text-white">Anand Hiremath</div>
                                            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Lead Creator</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
