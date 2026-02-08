import React from 'react';
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
import { Message } from '../types';
import { AI_MODELS } from '../utils/constants';

interface MetricsDashboardProps {
    messages: Message[];
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({ messages }) => {
    // Get the latest AI responses for each selected model in the current turn
    // A "turn" here is defined as the messages after the last user message
    const lastUserIndex = [...messages].reverse().findIndex(m => m.isUser);
    const currentTurnMessages = lastUserIndex === -1 ? [] : messages.slice(messages.length - lastUserIndex);

    const aiResponses = currentTurnMessages.filter(m => !m.isUser && m.metrics);

    if (aiResponses.length < 2) return null;

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

    const chartData = aiResponses.map(m => {
        const model = AI_MODELS.find(am => am.id === m.aiModel);
        return {
            name: model?.displayName || m.aiModel,
            responseTime: m.metrics?.responseTimeMs ? m.metrics.responseTimeMs / 1000 : 0,
            wordCount: m.metrics?.wordCount || 0,
            color: getModelColor(model?.color || '')
        };
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md rounded-3xl border border-white/20 dark:border-gray-700/50 mb-8 animate-in">
            <div className="flex flex-col h-[300px]">
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 px-2 translate-x-1">
                    Response Time (seconds) - Lower is better
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: '#88888810' }}
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)'
                            }}
                        />
                        <Bar dataKey="responseTime" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-col h-[300px]">
                <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 px-2 translate-x-1">
                    Word Count - Depth comparison
                </h4>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                        <Tooltip
                            cursor={{ fill: '#88888810' }}
                            contentStyle={{
                                borderRadius: '16px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                backgroundColor: 'rgba(255, 255, 255, 0.9)'
                            }}
                        />
                        <Bar dataKey="wordCount" radius={[6, 6, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
