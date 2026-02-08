import React, { useEffect, useState } from 'react';
import { Header } from '../components/layout/Header';
import { useAPI } from '../hooks/useAPI';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { Activity, Clock, Zap, MessageSquare, TrendingUp } from 'lucide-react';

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

import { PersonalAnalytics, ModelStat } from '../types';

export const AnalyticsPage: React.FC = () => {
    const [data, setData] = useState<PersonalAnalytics | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getPersonalAnalytics } = useAPI();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await getPersonalAnalytics();
                setData(res);
            } catch (err) {
                console.error('Failed to fetch analytics', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [getPersonalAnalytics]);

    if (isLoading || !data) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

    const { modelStats, activityTrend } = data;

    return (
        <div className="min-h-screen bg-[#000000] text-slate-100 transition-all duration-500 pb-12">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Personal Intelligence</h1>
                        <p className="text-slate-400 font-medium">Deep insights into your AI interactions and performance trends</p>
                    </div>
                    <div className="hidden sm:flex items-center space-x-3 bg-blue-500/10 text-blue-400 px-6 py-3 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-500/5">
                        <Activity className="w-5 h-5 animate-pulse" />
                        <span className="font-black uppercase tracking-widest text-sm">Live Pulse</span>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        title="Total Interaction"
                        value={modelStats.reduce((acc: number, s: ModelStat) => acc + s.messageCount, 0)}
                        icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
                        suffix="Queries"
                        color="text-blue-400"
                    />
                    <StatCard
                        title="Real-time Speed"
                        value={Math.round(modelStats.reduce((acc: number, s: ModelStat) => acc + s.avgResponseTime * s.messageCount, 0) / modelStats.reduce((acc: number, s: ModelStat) => acc + s.messageCount, 0) || 0)}
                        icon={<Clock className="w-6 h-6 text-purple-400" />}
                        suffix="ms"
                        color="text-purple-400"
                    />
                    <StatCard
                        title="Agg. Efficiency"
                        value={(modelStats.reduce((acc: number, s: ModelStat) => acc + s.avgTokensPerSecond * s.messageCount, 0) / modelStats.reduce((acc: number, s: ModelStat) => acc + s.messageCount, 0) || 0).toFixed(1)}
                        icon={<Zap className="w-6 h-6 text-amber-400" />}
                        suffix="t/s"
                        color="text-amber-400"
                    />
                    <StatCard
                        title="Model Reach"
                        value={modelStats.length}
                        icon={<TrendingUp className="w-6 h-6 text-emerald-400" />}
                        suffix="Active"
                        color="text-emerald-400"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Activity Trend */}
                    <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-tight">
                            <Activity className="w-6 h-6 mr-3 text-blue-400" />
                            Engagement Velocity
                        </h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={activityTrend}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="messageCount" name="Queries" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Model Comparison - Response Time */}
                    <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-tight">
                            <Clock className="w-6 h-6 mr-3 text-purple-400" />
                            Model Latency Benchmarks
                        </h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={modelStats} layout="vertical" margin={{ left: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1f2937" />
                                    <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} hide />
                                    <YAxis dataKey="modelId" type="category" axisLine={false} tickLine={false} tick={{ fill: '#fff', fontSize: 12, fontWeight: 'bold' }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                    />
                                    <Bar dataKey="avgResponseTime" name="Latency (ms)" radius={[0, 10, 10, 0]} barSize={25}>
                                        {modelStats.map((_unused: ModelStat, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Usage Distribution */}
                    <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-tight">
                            <TrendingUp className="w-6 h-6 mr-3 text-emerald-400" />
                            Selection Preference
                        </h3>
                        <div className="h-[350px] flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={modelStats}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={120}
                                        paddingAngle={8}
                                        dataKey="messageCount"
                                        nameKey="modelId"
                                        stroke="none"
                                    >
                                        {modelStats.map((_unused: ModelStat, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                        labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Tokens Per Second */}
                    <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                        <h3 className="text-xl font-black text-white mb-8 flex items-center uppercase tracking-tight">
                            <Zap className="w-6 h-6 mr-3 text-amber-400" />
                            Throughput Precision
                        </h3>
                        <div className="h-[350px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={modelStats} margin={{ bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis dataKey="aiModel" axisLine={false} tickLine={false} tick={{ fill: '#cbd5e1', fontSize: 10, fontWeight: 'bold' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                                    />
                                    <Bar dataKey="avgTokensPerSecond" name="T/s" radius={[10, 10, 10, 10]} fill="#f59e0b" barSize={50} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; suffix: string; color: string }> = ({ title, value, icon, suffix, color }) => (
    <div className="bg-[#111827] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-white/10 transition-all group overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-colors" />
        <div className="flex items-center space-x-5 mb-6 relative z-10">
            <div className="p-4 bg-[#020617] rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h4 className="text-slate-400 font-extrabold text-xs uppercase tracking-[0.2em]">{title}</h4>
        </div>
        <div className="flex items-baseline space-x-2 relative z-10">
            <span className={`text-4xl font-black tracking-tighter ${color}`}>{value}</span>
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{suffix}</span>
        </div>
    </div>
);
