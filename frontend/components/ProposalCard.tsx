'use client'

import Link from 'next/link';
import { Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

interface Proposal {
    id: string;
    proposer: string;
    description: string;
    status: string; // 'Active', 'Pending', etc.
    type: 'Standard' | 'Quadratic';
    votesFor: number;
    votesAgainst: number;
    endTime: string;
}

// Helper to determine status style
const getStatusStyle = (status: string) => {
    switch (status) {
        case 'Active':
            return 'bg-status-success/10 text-status-success border-status-success/20';
        case 'Defeated':
            return 'bg-status-danger/10 text-status-danger border-status-danger/20';
        case 'Executed':
            return 'bg-status-info/10 text-status-info border-status-info/20';
        case 'Pending':
            return 'bg-status-warning/10 text-status-warning border-status-warning/20';
        default:
            return 'bg-dark-secondary text-text-muted border-dark-border';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'Active': return <Clock size={14} />;
        case 'Defeated': return <XCircle size={14} />;
        case 'Executed': return <CheckCircle2 size={14} />;
        case 'Pending': return <AlertCircle size={14} />;
        default: return <Clock size={14} />;
    }
};

export function ProposalCard({ proposal }: { proposal: any }) {
    // Mock data integration for now, mapped from real proposal props
    const isQuadratic = proposal.description.includes("#QV");

    // Status Logic (Reuse from previous ProposalItem or pass down)
    // For now we assume the parent passed a processed 'status' string or we derive it.
    // The previous component derived it from a contract read. 
    // Ideally, the list fetches state for all. 
    // To keep it simple and performant, we might want to fetch state inside here or accept it as prop.
    // Let's assume the parent `ProposalList` handles fetching or we fetch here.
    // Re-implementing the hook call here for now to match previous logic.

    // ... logic would go here. For UI demo purposes, I'll structure the card layout first.

    return (
        <Link href={`/proposal/${proposal.id}`} className="block group relative">
            {/* Gradient Border Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-green-400 rounded-2xl opacity-0 group-hover:opacity-30 blur transition duration-500" />

            <div data-testid="proposal-list-item" className="glass-card p-6 relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-xs text-text-muted bg-dark-secondary/80 px-2 py-1 rounded backdrop-blur-sm">
                            #{proposal.id.toString()}
                        </span>
                        <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm ${getStatusStyle(proposal.status || 'Active')}`}>
                            {getStatusIcon(proposal.status || 'Active')}
                            {proposal.status || 'Active'}
                        </div>
                        {isQuadratic && (
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-sky-500 to-green-500 shadow-md shadow-sky-500/20">
                                Quadratic
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-green-400 transition-all duration-300 line-clamp-2">
                    {proposal.description}
                </h3>

                <div className="flex items-center justify-between mt-6 text-sm text-text-secondary">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Proposer</span>
                            <span className="font-mono text-xs">{proposal.proposer.slice(0, 6)}...</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Ends In</span>
                            <span className="font-medium">2 days</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-primary font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                        View Details <ChevronRight size={16} />
                    </div>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="mt-5 h-2 w-full bg-dark-secondary/50 rounded-full overflow-hidden backdrop-blur-sm">
                    <div className="h-full bg-gradient-to-r from-primary to-green-400 w-[70%] shadow-[0_0_10px_rgba(14,165,233,0.3)]" />
                </div>
            </div>
        </Link>
    );
}
