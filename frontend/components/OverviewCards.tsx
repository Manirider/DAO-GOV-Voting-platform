import { FileText, Users, Landmark, Activity } from 'lucide-react';

export function OverviewCards() {
    const stats = [
        {
            title: "Total Proposals",
            value: "12",
            icon: FileText,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            change: "+2 this week"
        },
        {
            title: "Active Proposals",
            value: "3",
            icon: Activity,
            color: "text-green-500",
            bg: "bg-green-500/10",
            change: "On track"
        },
        {
            title: "Participation",
            value: "68%",
            icon: Users,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            change: "+5% vs last month"
        },
        {
            title: "Treasury",
            value: "1.2M DTK",
            icon: Landmark,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            change: "≈ $450k"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
                <div key={index} className="glass-card p-6 flex items-start justify-between group hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full blur-2xl -mr-12 -mt-12 transition-opacity opacity-50 group-hover:opacity-100`} />

                    <div className="relative z-10">
                        <p className="text-text-secondary text-sm font-medium mb-1">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</h3>
                        <p className="text-xs font-medium flex items-center gap-1">
                            <span className={stat.change.includes('+') ? 'text-green-400' : 'text-text-muted'}>
                                {stat.change}
                            </span>
                        </p>
                    </div>
                    <div className={`p-3.5 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-inner relative z-10`}>
                        <stat.icon size={22} className="drop-shadow-sm" />
                    </div>
                </div>
            ))}
        </div>
    );
}
