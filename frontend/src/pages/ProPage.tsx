import React, { useState } from 'react';
import { Header } from '../components/layout/Header';
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
        <div className="min-h-screen bg-[#000000] transition-all duration-500">
            <Header />
            <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-16">
                    <h1 className="text-4xl font-black text-white sm:text-6xl tracking-tight uppercase italic">
                        Quantum <span className="text-blue-600">Intelligence</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto font-medium">
                        Choose the tier that fits your journey. From learning the basics to mastering prompt engineering.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Learner Tier */}
                    <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 space-y-8 relative overflow-hidden group shadow-2xl">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Standard</h2>
                            <p className="text-slate-500 font-medium">Perfect for exploring AI models.</p>
                            <div className="pt-4 flex items-baseline">
                                <span className="text-5xl font-black text-white tracking-tighter">$0</span>
                                <span className="ml-2 text-slate-500 font-black uppercase tracking-widest text-[10px]">/forever</span>
                            </div>
                        </div>

                        <ul className="space-y-5">
                            {features.map((f, i) => (
                                <li key={i} className={`flex items-center space-x-4 ${f.free ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <Check className={`h-5 w-5 ${f.free ? 'text-blue-500' : 'text-transparent'}`} />
                                    <span className="text-sm font-bold uppercase tracking-wide">{f.name}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            disabled
                            className="w-full py-5 bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs cursor-not-allowed transition-all border border-white/5"
                        >
                            Active
                        </button>
                    </div>

                    {/* Expert Tier */}
                    <div className="bg-[#111827] p-8 rounded-[2.5rem] border-2 border-blue-600 space-y-8 relative overflow-hidden shadow-2xl shadow-blue-500/20 scale-105 group">
                        <div className="absolute top-4 right-4 px-4 py-1.5 bg-blue-600 text-[10px] font-black text-white rounded-full uppercase tracking-[0.2em] shadow-lg">
                            Elite Choice
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white flex items-center uppercase tracking-tight">
                                Expert
                                <Sparkles className="h-6 w-6 ml-3 text-yellow-400 animate-pulse" />
                            </h2>
                            <p className="text-slate-400 font-medium">For masters of prompt engineering.</p>
                            <div className="pt-4 flex items-baseline">
                                <span className="text-5xl font-black text-white tracking-tighter">$19</span>
                                <span className="ml-2 text-slate-400 font-black uppercase tracking-widest text-[10px]">/month</span>
                            </div>
                        </div>

                        <ul className="space-y-5">
                            {features.map((f, i) => (
                                <li key={i} className="flex items-center space-x-4 text-slate-200">
                                    <Check className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm font-bold uppercase tracking-wide">{f.name}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={handleUpgrade}
                            disabled={isUpgrading || user?.isPremium}
                            className={`w-full py-5 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-500/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center space-x-3 ${user?.isPremium ? 'opacity-50 cursor-default' : ''}`}
                        >
                            {isUpgrading ? (
                                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{user?.isPremium ? 'Expert Access Active' : 'Unlock Expert Tier'}</span>
                                    <Rocket className="h-5 w-5" />
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Benefits Grid */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <BenefitCard icon={<Target className="h-8 w-8 text-blue-500" />} title="Output Precision" description="Get better answers on first try with AI-driven optimization." />
                    <BenefitCard icon={<Zap className="h-8 w-8 text-purple-500" />} title="Maximum Velocity" description="Priority access to models even during global peak hours." />
                    <BenefitCard icon={<Shield className="h-8 w-8 text-emerald-500" />} title="Expert Clarity" description="Understand exactly why prompts work and how to fix them." />
                </div>
            </div>
        </div>
    );
};

const BenefitCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
    <div className="flex flex-col items-center text-center space-y-6 group">
        <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all duration-500 shadow-xl shadow-black/40">
            {icon}
        </div>
        <div className="space-y-2">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{description}</p>
        </div>
    </div>
);
