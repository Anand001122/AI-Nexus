import React, { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { Message } from '../../types';
import { AI_MODELS } from '../../utils/constants';
import { useChatStore } from '../../store/chatStore';
import { LayoutPanelLeft, ListFilter, Activity } from 'lucide-react';

interface MetricsDashboardProps {
    messages: Message[];
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ messages }) => {
    const [viewMode, setViewMode] = useState<'turn' | 'session'>('turn');
    const { selectedModels } = useChatStore();

    // Custom function to get color from tailwind class roughly
    const getModelColor = (tailwindColor: string) => {
        if (tailwindColor.includes('blue')) return '#3b82f6';
        if (tailwindColor.includes('purple')) return '#a855f7';
        if (tailwindColor.includes('emerald')) return '#10b981';
        if (tailwindColor.includes('orange')) return '#f97316';
        if (tailwindColor.includes('rose')) return '#f43f5e';
        if (tailwindColor.includes('indigo')) return '#6366f1';
        return '#8884d8';
    };

    const metricsData = useMemo(() => {
        if (viewMode === 'turn') {
            // Get the latest AI responses for each selected model in the current turn
            const lastUserIndex = [...messages].reverse().findIndex(m => m.isUser);
            const currentTurnMessages = lastUserIndex === -1 ? [] : messages.slice(messages.length - lastUserIndex);
            const aiResponses = currentTurnMessages.filter(m => !m.isUser && m.metrics && selectedModels.includes(m.aiModel));

            return aiResponses.map(m => {
                const model = AI_MODELS.find(am => am.id === m.aiModel);
                return {
                    name: model?.displayName || m.aiModel,
                    modelId: m.aiModel,
                    responseTime: m.metrics?.responseTimeMs ? m.metrics.responseTimeMs / 1000 : 0,
                    wordCount: m.metrics?.wordCount || 0,
                    color: getModelColor(model?.color || '')
                };
            });
        } else {
            // Aggregate metrics across the entire session for selected models
            const sessionStats: Record<string, { totalTime: number; totalWords: number; count: number }> = {};

            messages.forEach(m => {
                if (!m.isUser && m.metrics && selectedModels.includes(m.aiModel)) {
                    if (!sessionStats[m.aiModel]) {
                        sessionStats[m.aiModel] = { totalTime: 0, totalWords: 0, count: 0 };
                    }
                    sessionStats[m.aiModel].totalTime += m.metrics.responseTimeMs;
                    sessionStats[m.aiModel].totalWords += m.metrics.wordCount;
                    sessionStats[m.aiModel].count += 1;
                }
            });

            return Object.entries(sessionStats).map(([modelId, stats]) => {
                const model = AI_MODELS.find(am => am.id === modelId);
                return {
                    name: model?.displayName || modelId,
                    modelId,
                    responseTime: (stats.totalTime / stats.count) / 1000,
                    wordCount: Math.round(stats.totalWords / stats.count),
                    color: getModelColor(model?.color || '')
                };
            });
        }
    }, [messages, viewMode, selectedModels]);

    if (metricsData.length < 2) return null;

    return (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 mb-12 shadow-2xl relative overflow-hidden group">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-all group-hover:bg-blue-500/10 pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-center justify-between mb-10 relative z-10 gap-6">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-500/10 rounded-2xl">
                        <Activity className="w-6 h-6 text-blue-400 animate-pulse" />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic">
                            Live <span className="text-blue-500">Comparison</span>
                        </h3>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                            {viewMode === 'turn' ? 'Deep-dive into last response' : 'Average performance this session'}
                        </p>
                    </div>
                </div>

                {/* Modern Toggle Switch */}
                <div className="bg-[#111111] p-1.5 rounded-2xl flex items-center border border-white/5 shadow-inner">
                    <button
                        onClick={() => setViewMode('turn')}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'turn'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <LayoutPanelLeft className="w-3.5 h-3.5" />
                        <span>Last Turn</span>
                    </button>
                    <button
                        onClick={() => setViewMode('session')}
                        className={`flex items-center space-x-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'session'
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                            : 'text-slate-500 hover:text-slate-300'
                            }`}
                    >
                        <ListFilter className="w-3.5 h-3.5" />
                        <span>Session Avg</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="flex flex-col h-[320px]">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Efficiency Velocity (s)</span>
                        <span className="text-[10px] font-medium text-slate-600 italic">Lower = Faster</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    backgroundColor: '#0a0a0a',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold', fontSize: '10px' }}
                            />
                            <Bar dataKey="responseTime" radius={[12, 12, 12, 12]} barSize={40}>
                                {metricsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex flex-col h-[320px]">
                    <div className="flex items-center justify-between mb-6 px-2">
                        <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Information density (words)</span>
                        <span className="text-[10px] font-medium text-slate-600 italic">Higher = Detailed</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={metricsData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 'bold' }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                contentStyle={{
                                    borderRadius: '20px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                                    backgroundColor: '#0a0a0a',
                                    padding: '12px 16px'
                                }}
                                itemStyle={{ color: '#fff' }}
                                labelStyle={{ color: '#64748b', marginBottom: '4px', fontWeight: 'bold', fontSize: '10px' }}
                            />
                            <Bar dataKey="wordCount" radius={[12, 12, 12, 12]} barSize={40}>
                                {metricsData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
