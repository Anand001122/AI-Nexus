import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
import { Send, MessageSquare, Mail, Github, ExternalLink, ThumbsUp, HelpCircle, AlertCircle, Linkedin, ArrowUpRight } from 'lucide-react';
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
        <div className="min-h-screen bg-[#000000] text-slate-100 transition-all duration-500">
            <Header />
            <div className="max-w-4xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight uppercase">
                        Suggestions & <span className="text-blue-600">Support</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium">
                        Help us improve AI Nexus. Share your ideas, report issues, or just say hello!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Feedback Form */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                            {submitted ? (
                                <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in">
                                    <div className="w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                                        <Send className="h-10 w-10 text-green-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-white">Thank You!</h3>
                                        <p className="text-slate-400">Your feedback has been received. We appreciate your input!</p>
                                    </div>
                                    <button
                                        onClick={() => setSubmitted(false)}
                                        className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 transition-opacity"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">
                                            Feedback Type
                                        </label>
                                        <div className="grid grid-cols-3 gap-4">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => setType(cat.id)}
                                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300 ${type === cat.id
                                                        ? 'border-blue-500 bg-blue-500/10'
                                                        : 'border-white/5 bg-slate-800/50 hover:border-white/10'
                                                        }`}
                                                >
                                                    <cat.icon className={`h-6 w-6 mb-2 ${cat.color}`} />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{cat.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="content" className="block text-sm font-black text-slate-400 uppercase tracking-widest">
                                            Message
                                        </label>
                                        <textarea
                                            id="content"
                                            required
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            rows={6}
                                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-slate-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-500"
                                            placeholder="What should we add or fix?"
                                        />
                                    </div>

                                    <div className="space-y-3">
                                        <label htmlFor="contact" className="block text-sm font-black text-slate-400 uppercase tracking-widest">
                                            Contact Info
                                        </label>
                                        <input
                                            id="contact"
                                            type="text"
                                            value={contactInfo}
                                            onChange={(e) => setContactInfo(e.target.value)}
                                            className="w-full px-5 py-4 rounded-2xl border border-white/5 bg-slate-800/50 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-white placeholder-slate-500"
                                            placeholder="Email or Telegram handle"
                                        />
                                    </div>

                                    {error && (
                                        <div className="p-4 bg-red-900/20 text-red-400 text-sm rounded-2xl border border-red-500/20 font-bold">
                                            {error}
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center space-x-3 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
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
                        <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl space-y-8">
                            <h2 className="text-xl font-black text-white flex items-center space-x-3 uppercase tracking-tight">
                                <MessageSquare className="h-6 w-6 text-blue-500" />
                                <span>Creator</span>
                            </h2>

                            <div className="space-y-4">
                                <a
                                    href="mailto:anandhiremath.dev@gmail.com"
                                    className="flex items-center p-5 rounded-2xl bg-slate-800/50 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 transition-all group"
                                >
                                    <Mail className="h-6 w-6 text-slate-500 group-hover:text-blue-500 transition-colors mr-4" />
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email</div>
                                        <div className="text-sm font-bold text-white break-all">anandhiremath.dev@gmail.com</div>
                                    </div>
                                </a>

                                <a
                                    href="https://www.linkedin.com/in/anand-hiremath-833b4a251/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-5 rounded-2xl bg-slate-800/50 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/20 transition-all group"
                                >
                                    <Linkedin className="h-6 w-6 text-slate-500 group-hover:text-blue-600 transition-colors mr-4" />
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">LinkedIn</div>
                                        <div className="text-sm font-bold text-white">Anand Hiremath</div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 ml-auto text-slate-600 group-hover:text-blue-500" />
                                </a>

                                <a
                                    href="https://github.com/Anand001122"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-5 rounded-2xl bg-slate-800/50 hover:bg-slate-700/50 border border-white/5 hover:border-white/10 transition-all group"
                                >
                                    <Github className="h-6 w-6 text-slate-500 group-hover:text-white transition-colors mr-4" />
                                    <div>
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">GitHub</div>
                                        <div className="text-sm font-bold text-white">@Anand001122</div>
                                    </div>
                                    <ExternalLink className="h-4 w-4 ml-auto text-slate-600 group-hover:text-slate-400" />
                                </a>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                                    <p className="text-sm text-slate-400 leading-relaxed italic font-medium">
                                        "Building AI Nexus to empower developers with clear AI insights. Your feedback is what drives our progress!"
                                    </p>
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg" />
                                        <div>
                                            <div className="text-sm font-black text-white uppercase tracking-tight">Anand Hiremath</div>
                                            <div className="text-[10px] text-blue-500 uppercase font-black tracking-widest">Lead Creator</div>
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
