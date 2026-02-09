'use client'

import { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import MyGovernorABI from '../abi/MyGovernor.json';
import contractAddress from '../config/contract-address.json';
import { Loader2 } from 'lucide-react';

interface VoteButtonsProps {
    proposalId: string;
    isQuadratic: boolean;
    onVoteSubmitted?: () => void;
}

export function VoteButtons({ proposalId, isQuadratic, onVoteSubmitted }: VoteButtonsProps) {
    const [qvVotes, setQvVotes] = useState<string>("1");
    const { writeContract, isPending } = useWriteContract();

    const handleVote = (support: number) => {
        if (isQuadratic) {
            const params = encodeAbiParameters(
                parseAbiParameters('uint256'),
                [BigInt(qvVotes)]
            );
            writeContract({
                address: contractAddress.governorAddress as `0x${string}`,
                abi: MyGovernorABI,
                functionName: 'castVoteWithParams',
                args: [BigInt(proposalId), support, params],
            }, {
                onSuccess: () => onVoteSubmitted?.()
            });
        } else {
            writeContract({
                address: contractAddress.governorAddress as `0x${string}`,
                abi: MyGovernorABI,
                functionName: 'castVote',
                args: [BigInt(proposalId), support],
            }, {
                onSuccess: () => onVoteSubmitted?.()
            });
        }
    };

    const cost = isQuadratic ? BigInt(qvVotes) ** 2n : 0n;

    return (
        <div className="bg-dark-secondary/50 p-6 rounded-2xl border border-dark-border">
            <h3 className="text-lg font-bold text-text-primary mb-4">Cast Your Vote</h3>

            {isQuadratic && (
                <div className="mb-6 bg-dark-bg p-4 rounded-xl border border-dashed border-dark-border">
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                        Votes to cast (Voice Credits)
                    </label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="number"
                            min="1"
                            value={qvVotes}
                            onChange={(e) => setQvVotes(e.target.value)}
                            className="input-field w-full"
                        />
                        <div className="text-right">
                            <div className="text-sm font-bold text-primary">Cost</div>
                            <div className="text-xs text-text-muted">{cost.toString()} Tokens</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-3 gap-3">
                <button
                    data-testid="vote-for-button"
                    onClick={() => handleVote(1)}
                    disabled={isPending}
                    className="py-3 rounded-xl bg-status-success/10 text-status-success font-bold hover:bg-status-success hover:text-white transition-all border border-status-success/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="animate-spin mx-auto" /> : "For"}
                </button>
                <button
                    data-testid="vote-against-button"
                    onClick={() => handleVote(0)}
                    disabled={isPending}
                    className="py-3 rounded-xl bg-status-danger/10 text-status-danger font-bold hover:bg-status-danger hover:text-white transition-all border border-status-danger/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="animate-spin mx-auto" /> : "Against"}
                </button>
                <button
                    data-testid="vote-abstain-button"
                    onClick={() => handleVote(2)}
                    disabled={isPending}
                    className="py-3 rounded-xl bg-gray-500/10 text-gray-400 font-bold hover:bg-gray-500 hover:text-white transition-all border border-gray-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? <Loader2 className="animate-spin mx-auto" /> : "Abstain"}
                </button>
            </div>
        </div>
    );
}
