'use client'

import { useParams } from 'next/navigation';
import { useProposals } from '../../../hooks/useProposals';
import { VoteButtons } from '../../../components/VoteButtons';
import { AnalyticsChart } from '../../../components/AnalyticsChart';
import { useReadContract } from 'wagmi';
import MyGovernorABI from '../../../abi/MyGovernor.json';
import contractAddress from '../../../config/contract-address.json';
import { Clock, User, ArrowLeft, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ProposalDetails() {
    const params = useParams();
    const id = params.id as string;
    const { proposals, loading } = useProposals();

    // Find proposal data from context/hook
    const proposal = proposals.find(p => p.id === id);

    // Fetch dynamic state
    const { data: state, refetch: refetchState } = useReadContract({
        address: contractAddress.governorAddress as `0x${string}`,
        abi: MyGovernorABI,
        functionName: 'state',
        args: [BigInt(id || 0)],
    });

    const { data: votes, refetch: refetchVotes } = useReadContract({
        address: contractAddress.governorAddress as `0x${string}`,
        abi: MyGovernorABI,
        functionName: 'proposalVotes',
        args: [BigInt(id || 0)],
    });

    if (loading) return <div className="min-h-screen flex items-center justify-center text-text-muted">Loading details...</div>;
    if (!proposal) return <div className="min-h-screen flex items-center justify-center text-text-muted">Proposal not found</div>;

    // Parse votes
    // proposalVotes returns (againstVotes, forVotes, abstainVotes)
    const [against, for_, abstain] = votes ? (votes as [bigint, bigint, bigint]) : [0n, 0n, 0n];

    // Parse formatting (mocking for display if needed, but using real logic)
    // Note: If Quadratic Voting, these are "weights" not raw token counts usually, depending on implementation. 
    // But Governor counts "votes".

    const stateMap = ['Pending', 'Active', 'Canceled', 'Defeated', 'Succeeded', 'Queued', 'Expired', 'Executed'];
    const statusText = state !== undefined ? stateMap[Number(state)] : 'Loading...';
    const isQuadratic = proposal.description.includes("#QV");

    const getStatusColor = (s: string) => {
        switch (s) {
            case 'Active': return 'text-status-success bg-status-success/10 border-status-success/20';
            case 'Defeated': return 'text-status-danger bg-status-danger/10 border-status-danger/20';
            case 'Executed': return 'text-status-info bg-status-info/10 border-status-info/20';
            default: return 'text-text-muted bg-dark-secondary border-dark-border';
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-primary transition-colors mb-6">
                <ArrowLeft size={16} /> Back to Dashboard
            </Link>

            <div className="grid gap-8">
                {/* Header Section */}
                <div className="glass-card p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(statusText)}`}>
                            {statusText}
                        </span>
                        <span className="text-text-muted text-sm font-mono">#{id}</span>
                        {isQuadratic && (
                            <span className="px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r from-sky-500 to-green-500 shadow-lg shadow-sky-500/20">
                                Quadratic Voting
                            </span>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-text-primary mb-6 leading-tight">
                        {proposal.description}
                    </h1>

                    <div className="flex items-center gap-6 text-sm text-text-secondary border-t border-dark-border pt-6">
                        <div className="flex items-center gap-2">
                            <User size={16} />
                            <span className="font-mono">{proposal.proposer.slice(0, 8)}...</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span>Ends in 2 days</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Voting Column */}
                    <div className="md:col-span-2 space-y-6">
                        {statusText === 'Active' ? (
                            <VoteButtons
                                proposalId={id}
                                isQuadratic={isQuadratic}
                                onVoteSubmitted={() => {
                                    setTimeout(() => {
                                        refetchVotes();
                                        refetchState();
                                    }, 2000);
                                }}
                            />
                        ) : (
                            <div className="glass-card p-6 text-center text-text-muted">
                                Voting is closed for this proposal.
                            </div>
                        )}

                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4">Description</h3>
                            <p className="text-text-secondary leading-relaxed">
                                {proposal.description}
                                {/* In real app, this would be markdown rendered */}
                            </p>
                        </div>
                    </div>

                    {/* Analytics Column */}
                    <div className="space-y-6">
                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-4">Current Results</h3>
                            <div className="h-64">
                                <AnalyticsChart
                                    forVotes={Number(for_)}
                                    againstVotes={Number(against)}
                                    abstainVotes={Number(abstain)}
                                />
                            </div>
                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-status-success">For</span>
                                    <span className="font-mono font-bold">{for_.toString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-status-danger">Against</span>
                                    <span className="font-mono font-bold">{against.toString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-muted">Abstain</span>
                                    <span className="font-mono font-bold">{abstain.toString()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <h3 className="font-bold text-lg mb-2">Quorum</h3>
                            <div className="relative pt-1">
                                <div className="overflow-hidden h-2 text-xs flex rounded bg-dark-secondary">
                                    <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"></div>
                                </div>
                                <div className="flex justify-between text-xs text-text-muted mt-1">
                                    <span>Current: 1.2M</span>
                                    <span>Required: 4M</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
