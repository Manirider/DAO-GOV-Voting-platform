'use client'

import { useProposals } from '../hooks/useProposals';
import { ProposalCard } from './ProposalCard';

export function ProposalList() {
    const { proposals, loading } = useProposals();

    if (loading) {
        return (
            <div className="grid gap-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-40 bg-dark-card rounded-2xl border border-dark-border" />
                ))}
            </div>
        );
    }

    if (proposals.length === 0) {
        return (
            <div className="text-center py-20 bg-dark-card rounded-2xl border border-dark-border border-dashed">
                <p className="text-text-muted text-lg">No proposals found.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4">
            {proposals.map(p => (
                <ProposalCard key={p.id} proposal={p} />
            ))}
        </div>
    );
}
