'use client'

import { useProposals } from '../hooks/useProposals';
import { ProposalCard } from './ProposalCard';
import { FileSearch } from 'lucide-react';

export function ProposalList() {
    const { proposals, loading } = useProposals();

    if (loading) {
        return (
            <div className="grid gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="glass-card p-6 animate-pulse border border-white/5">
                        <div className="flex justify-between mb-4">
                            <div className="h-4 w-24 bg-dark-border rounded-full" />
                            <div className="h-6 w-20 bg-dark-border rounded-full" />
                        </div>
                        <div className="h-8 w-3/4 bg-dark-border rounded-lg mb-6" />
                        <div className="flex justify-between">
                            <div className="h-4 w-32 bg-dark-border rounded" />
                            <div className="h-4 w-24 bg-dark-border rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (proposals.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 glass-card border-dashed border-dark-border/50 text-center">
                <div className="p-4 bg-dark-secondary rounded-full mb-4 animate-bounce duration-[3000ms]">
                    <FileSearch size={32} className="text-text-muted" />
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">No active proposals</h3>
                <p className="text-text-secondary max-w-sm mb-6">
                    There are currently no proposals open for voting. Be the first to start a conversation!
                </p>
                <button className="btn-secondary text-sm">Create New Proposal</button>
            </div>
        );
    }

    return (
        <div className="grid gap-6">
            {proposals.map(p => (
                <ProposalCard key={p.id} proposal={p} />
            ))}
        </div>
    );
}
