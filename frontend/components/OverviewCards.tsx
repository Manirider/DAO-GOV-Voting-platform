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
                <div key={index} className="glass-card p-6 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-500 relative overflow-hidden border border-white/5 hover:border-white/10 animate-tilt">
                    <div className="absolute inset-0 bg-noise opacity-[0.03]"></div>
                    <div className={`absolute top-0 right-0 w-32 h-32 ${stat.bg} rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-20 group-hover:opacity-40`} />
                    
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ring-1 ring-white/5 shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                            <stat.icon size={24} className="drop-shadow-sm" />
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${stat.change.includes('+') || stat.change.includes('On') ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-text-muted border-white/5'}`}>
                            {stat.change}
                        </span>
                    </div>

                    <div className="relative z-10">
                        <h3 className="text-3xl font-black text-white tracking-tight mb-1">{stat.value}</h3>
                        <p className="text-text-secondary text-sm font-medium tracking-wide uppercase opacity-80">{stat.title}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
