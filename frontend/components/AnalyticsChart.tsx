'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface AnalyticsChartProps {
    forVotes: number;
    againstVotes: number;
    abstainVotes: number;
}

export function AnalyticsChart({ forVotes, againstVotes, abstainVotes }: AnalyticsChartProps) {
    const data = [
        { name: 'For', value: forVotes, color: '#22C55E' },
        { name: 'Against', value: againstVotes, color: '#EF4444' },
        { name: 'Abstain', value: abstainVotes, color: '#6B7280' },
    ];

    // Filter out zero values for better chart rendering
    const activeData = data.filter(d => d.value > 0);
    const totalVotes = forVotes + againstVotes + abstainVotes;

    if (totalVotes === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-text-muted bg-dark-bg/50 rounded-xl border border-dark-border border-dashed">
                No votes cast yet
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={activeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {activeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{ backgroundColor: '#16161F', borderColor: '#262630', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
