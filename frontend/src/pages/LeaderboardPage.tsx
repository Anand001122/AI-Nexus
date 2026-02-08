import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { useAPI } from '../hooks/useAPI';
import { Trophy, Zap, Clock, MessageSquare, Award, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export const LeaderboardPage: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const { getGlobalLeaderboard, isLoading, setIsLoading } = useAPI();

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await getGlobalLeaderboard();
                setData(result);
            } catch (err) {
                console.error('Failed to fetch leaderboard:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

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

    const { topBySpeed, topByVolume, topByEfficiency, usageTrends } = data;

    // Process usage trends for stacked bar chart
    const processedTrends = usageTrends.map((t: any) => ({
        date: t.date,
        ...t.modelCounts
    }));

    const allModels = Array.from(new Set(usageTrends.flatMap((t: any) => Object.keys(t.modelCounts))));
    const CHART_COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#f43f5e', '#14b8a6', '#f97316'];

    return (
        <div className="min-h-screen bg-[#000000] text-slate-100 transition-all duration-500 pb-12">
            <Header />
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-white mb-4 tracking-tight">AI Benchmark Intelligence</h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                        Real-time aggregate performance metrics across the entire AI Nexus network.
                    </p>
                </div>

                {/* Market Share Trend - NEW */}
                <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl mb-12">
                    <div className="flex items-center space-x-3 mb-8">
                        <Star className="w-7 h-7 text-pink-500" />
                        <div>
                            <h3 className="text-2xl font-bold text-white">Top Models Market Share</h3>
                            <p className="text-sm text-slate-400">Compare weekly usage of models across the ecosystem</p>
                        </div>
                    </div>
                    <div className="h-[450px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={processedTrends} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#94a3b8' }}
                                />
                                {(allModels as any[]).map((model: any, index: number) => (
                                    <Bar
                                        key={model}
                                        dataKey={model}
                                        stackId="a"
                                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                                        barSize={40}
                                    />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
                    {/* Top by Speed */}
                    <LeaderboardSection
                        title="Speed Kings"
                        subtitle="Fastest response times"
                        icon={<Clock className="w-6 h-6 text-purple-400" />}
                        data={topBySpeed}
                        metricKey="avgResponseTime"
                        metricSuffix="ms"
                        color="#a78bfa"
                    />

                    {/* Top by Volume */}
                    <LeaderboardSection
                        title="Community Choice"
                        subtitle="Most used models"
                        icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
                        data={topByVolume}
                        metricKey="messageCount"
                        metricSuffix="msgs"
                        color="#60a5fa"
                    />

                    {/* Top by Efficiency */}
                    <LeaderboardSection
                        title="Efficiency Elite"
                        subtitle="Highest tokens per second"
                        icon={<Zap className="w-6 h-6 text-amber-400" />}
                        data={topByEfficiency}
                        metricKey="avgTokensPerSecond"
                        metricSuffix="t/s"
                        decimalPlaces={1}
                        color="#fbbf24"
                    />
                </div>

                {/* Comparative Performance Chart - REDESIGNED */}
                <div className="bg-[#111827] p-8 rounded-[2rem] border border-white/5 shadow-2xl">
                    <div className="flex items-center space-x-3 mb-8">
                        <Award className="w-7 h-7 text-blue-400" />
                        <div>
                            <h3 className="text-2xl font-bold text-white">Comparative Efficiency</h3>
                            <p className="text-sm text-slate-400">Tokens per second across top models</p>
                        </div>
                    </div>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={topByEfficiency} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                <XAxis
                                    dataKey="aiModel"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 13 }}
                                />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{
                                        backgroundColor: '#0f172a',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '16px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="avgTokensPerSecond" name="Efficiency" radius={[12, 12, 12, 12]} barSize={80}>
                                    {topByEfficiency.map((_: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={index === 0 ? '#f59e0b' : '#3b82f6'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
};

const LeaderboardSection: React.FC<{
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    data: any[];
    metricKey: string;
    metricSuffix: string;
    decimalPlaces?: number;
    color: string;
}> = ({ title, subtitle, icon, data, metricKey, metricSuffix, decimalPlaces = 0, color }) => (
    <div className="bg-[#111827] rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5">
            <div className="flex items-center space-x-4 mb-2">
                <div className="p-3 bg-[#020617] rounded-2xl shadow-inner">
                    {icon}
                </div>
                <div>
                    <h3 className="font-black text-xl text-white uppercase tracking-tighter leading-tight">{title}</h3>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">{subtitle}</p>
                </div>
            </div>
        </div>

        <div className="flex-1 p-6">
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={item.aiModel} className={`flex items-center justify-between p-5 rounded-[1.5rem] transition-all duration-300 ${index === 0 ? 'bg-[#0f172a] border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.15)] scale-[1.02]' : 'hover:bg-white/5'}`}>
                        <div className="flex items-center space-x-5">
                            <RankBadge rank={index + 1} />
                            <div>
                                <h4 className="font-bold text-white text-lg leading-tight">{item.aiModel}</h4>
                                <div className="flex items-center space-x-1.5 mt-0.5">
                                    <Star className={`w-3.5 h-3.5 ${index === 0 ? 'text-amber-400 fill-amber-400' : 'text-slate-600 opacity-40'}`} />
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{index === 0 ? 'Platform Leader' : 'Top Tier'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="block font-black text-2xl tracking-tighter" style={{ color: index === 0 ? color : '#fff' }}>
                                {item[metricKey].toFixed(decimalPlaces)}
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{metricSuffix}</span>
                        </div>
                    </div>
                ))}
                {data.length === 0 && (
                    <div className="text-center py-16 text-slate-600">
                        <Award className="w-16 h-16 mx-auto mb-4 opacity-10" />
                        <p className="font-bold uppercase tracking-widest text-sm">Waiting for Data...</p>
                    </div>
                )}
            </div>
        </div>
    </div>
);

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
    if (rank === 1) return (
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-600/30 transform -rotate-3">
            <Trophy className="w-7 h-7 text-white" />
        </div>
    );
    if (rank === 2) return (
        <div className="w-11 h-11 rounded-2xl bg-[#334155] flex items-center justify-center border border-white/10 shadow-lg">
            <span className="font-black text-white text-xl">2</span>
        </div>
    );
    if (rank === 3) return (
        <div className="w-10 h-10 rounded-2xl bg-[#334155]/60 flex items-center justify-center border border-white/5">
            <span className="font-black text-slate-300 text-lg">3</span>
        </div>
    );
    return (
        <div className="w-10 h-10 rounded-2xl bg-[#0f172a] flex items-center justify-center border border-white/5 text-slate-600 font-bold">
            {rank}
        </div>
    );
};
