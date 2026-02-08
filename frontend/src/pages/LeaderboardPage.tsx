import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { useAPI } from '../hooks/useAPI';
import { Trophy, Zap, Clock, MessageSquare, Award, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { GlobalLeaderboard, UsageTrend, LeaderboardEntry } from '../types';
import { AI_MODELS } from '../utils/constants';

export const LeaderboardPage: React.FC = () => {
    const [data, setData] = useState<GlobalLeaderboard | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { getGlobalLeaderboard } = useAPI();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setIsLoading(true);
                const res = await getGlobalLeaderboard();
                setData(res);
            } catch (err) {
                console.error('Failed to fetch leaderboard', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, [getGlobalLeaderboard]);

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

    const { topBySpeed, topByVolume, topByEfficiency } = data;

    const processedTrends = (data.usageTrends || []).map((t: UsageTrend) => ({
        date: t.date,
        ...t.modelCounts
    }));

    const allModels = Array.from(new Set((data.usageTrends || []).flatMap((t: UsageTrend) => Object.keys(t.modelCounts))));
    const CHART_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#f43f5e', '#14b8a6', '#f97316'];

    return (
        <div className="min-h-screen bg-[#000000] text-slate-100 transition-all duration-500 pb-12">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-black text-white mb-4 tracking-tight uppercase italic">AI Benchmark Intelligence</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                        Real-time aggregate performance metrics across the entire AI Nexus network.
                    </p>
                </div>

                <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl mb-12">
                    <div className="flex items-center space-x-4 mb-8">
                        <Star className="w-8 h-8 text-pink-500" />
                        <div>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Market Analytics</h3>
                            <p className="text-sm text-slate-400 font-medium">Weekly model selection distribution across the ecosystem</p>
                        </div>
                    </div>
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processedTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                {allModels.map((model, index) => (
                                    <Bar key={model} dataKey={model as string} stackId="a" fill={CHART_COLORS[index % CHART_COLORS.length]} barSize={40} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                    <LeaderboardSection title="Speed Kings" subtitle="Lowest Latency" icon={<Clock className="w-6 h-6 text-purple-400" />} data={topBySpeed} metricKey="avgResponseTime" metricSuffix="ms" color="#a78bfa" />
                    <LeaderboardSection title="Ecosystem Choice" subtitle="Highest Volume" icon={<MessageSquare className="w-6 h-6 text-blue-400" />} data={topByVolume} metricKey="messageCount" metricSuffix="msgs" color="#60a5fa" />
                    <LeaderboardSection title="Throughput Elite" subtitle="Best Performance" icon={<Zap className="w-6 h-6 text-amber-400" />} data={topByEfficiency} metricKey="avgTokensPerSecond" metricSuffix="t/s" decimalPlaces={1} color="#fbbf24" />
                </div>
            </main>
        </div>
    );
};

const LeaderboardSection: React.FC<{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    data: LeaderboardEntry[];
    metricKey: string;
    metricSuffix: string;
    decimalPlaces?: number;
    color: string;
}> = ({ title, subtitle, icon, data, metricKey, metricSuffix, decimalPlaces = 0, color }) => (
    <div className="bg-[#111827] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5">
            <div className="flex items-center space-x-5 mb-2">
                <div className="p-4 bg-[#020617] rounded-2xl shadow-inner">{icon}</div>
                <div>
                    <h3 className="font-black text-xl text-white uppercase tracking-tighter leading-tight">{title}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{subtitle}</p>
                </div>
            </div>
        </div>
        <div className="flex-1 p-6">
            <div className="space-y-4">
                {data.map((item, index) => {
                    const modelData = AI_MODELS.find(m => m.id === item.modelId);
                    const value = item[metricKey];
                    const displayValue = typeof value === 'number' ? value.toFixed(decimalPlaces) : 'N/A';
                    return (
                        <div key={item.modelId} className={`flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 ${index === 0 ? 'bg-white/5 border border-white/10 shadow-lg' : 'hover:bg-white/5'}`}>
                            <div className="flex items-center space-x-5">
                                <RankBadge rank={index + 1} modelColor={modelData?.color} />
                                <div>
                                    <h4 className="font-bold text-white text-lg leading-tight">{item.displayName || item.modelId}</h4>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{item.modelId}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="block font-black text-2xl tracking-tighter" style={{ color: index === 0 ? color : '#fff' }}>{displayValue}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{metricSuffix}</span>
                            </div>
                        </div>
                    );
                })}
                {data.length === 0 && (
                    <div className="text-center py-16 text-slate-600">
                        <Award className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="font-black uppercase tracking-widest text-xs">Awaiting Analysis...</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const RankBadge: React.FC<{ rank: number; modelColor?: string }> = ({ rank, modelColor }) => {
    if (rank === 1) return (
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${modelColor || 'from-slate-700 to-slate-900'} flex items-center justify-center p-2 shadow-lg`}>
            <Trophy className="w-6 h-6 text-white" />
        </div>
    );
    return (
        <div className="w-10 h-10 rounded-xl bg-[#020617] border border-white/5 flex items-center justify-center font-black text-slate-500 text-xs">
            #{rank}
        </div>
    );
};
