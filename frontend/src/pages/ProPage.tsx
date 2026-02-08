import React, { useState } from 'react';
import { Check, Zap, Sparkles, Shield, Rocket, Target } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

export const ProPage: React.FC = () => {
    const { user, setAuth, token } = useAuthStore();
    const navigate = useNavigate();
    const [isUpgrading, setIsUpgrading] = useState(false);

    const handleUpgrade = async () => {
        setIsUpgrading(true);
        // Simulate payment/upgrade process
        setTimeout(() => {
            if (user && token) {
                setAuth(token, {
                    ...user,
                    isPremium: true,
                    credits: 100
                });
                alert('🎉 Welcome to the Expert Tier! Your prompt intelligence features are now unlocked.');
                navigate('/');
            }
            setIsUpgrading(false);
        }, 1500);
    };

    const features = [
        { name: 'Multi-Model Chat', free: true, pro: true },
        { name: 'Advanced Metrics', free: true, pro: true },
        { name: 'Global Leaderboard', free: true, pro: true },
        { name: 'Prompt Quality Meter', free: true, pro: true },
        { name: 'Master Rewrite ✨', free: false, pro: true },
        { name: 'Expert AI Advice', free: false, pro: true },
        { name: 'Premium Models Access', free: false, pro: true },
        { name: 'Priority API Queue', free: false, pro: true },
    ];

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white sm:text-6xl tracking-tight">
                        Elevate Your <span className="text-blue-600">AI Intelligence</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
                        Choose the tier that fits your journey. From learning the basics to mastering prompt engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Learner Tier */}
                    <div className="glass p-8 rounded-3xl border border-slate-200 dark:border-white/5 space-y-8 relative overflow-hidden group">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold dark:text-white">Learner</h2>
                            <p className="text-slate-500 dark:text-slate-400">Perfect for exploring AI models.</p>
                            <div className="pt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold dark:text-white">$0</span>
                                <span className="ml-1 text-slate-500">/forever</span>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {features.map((f, i) => (
                                <li key={i} className={`flex items-center space-x-3 ${f.free ? 'text-slate-700 dark:text-slate-300' : 'text-slate-300 dark:text-slate-600'}`}>
                                    <Check className={`h-5 w-5 ${f.free ? 'text-blue-500' : 'text-transparent'}`} />
                                    <span className="text-sm">{f.name}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled
                            className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-bold cursor-not-allowed transition-all"
                        >
                            Current Plan
                        </button>
                    </div>

                    {/* Expert Tier */}
                    <div className="glass p-8 rounded-3xl border-2 border-blue-500 dark:border-blue-500/50 space-y-8 relative overflow-hidden shadow-2xl shadow-blue-500/10 scale-105 group">
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-[10px] font-bold text-white rounded-full uppercase tracking-widest shadow-lg">
                            Most Popular
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold dark:text-white flex items-center">
                                Expert
                                <Sparkles className="h-5 w-5 ml-2 text-yellow-400 animate-pulse" />
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400">For masters of prompt engineering.</p>
                            <div className="pt-4 flex items-baseline">
                                <span className="text-4xl font-extrabold dark:text-white">$19</span>
                                <span className="ml-1 text-slate-500">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-4">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-center space-x-3 text-slate-700 dark:text-slate-300">
                                    <Check className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-medium">{f.name}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            disabled={isUpgrading || user?.isPremium}
                            className={`w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 ${user?.isPremium ? 'opacity-50 cursor-default' : ''}`}
                        >
                            {isUpgrading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{user?.isPremium ? 'Plan Active' : 'Upgrade to Expert'}</span>
                                    <Rocket className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Target className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">Sharper Output</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Get better answers on first try with AI optimization.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Zap className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">Faster Results</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Priority access to models even during peak hours.</p>
                    </div>
                    <div className="flex flex-col items-center text-center space-y-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-emerald-600" />
                        </div>
                        <h3 className="text-lg font-bold dark:text-white">Expert Insights</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Understand exactly why prompts work and how to fix them.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
