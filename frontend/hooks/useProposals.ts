import { useState, useEffect } from 'react';
import { usePublicClient } from 'wagmi';
import { parseAbiItem } from 'viem';
import contractAddress from '../config/contract-address.json';

export interface Proposal {
    id: string;
    proposer: string;
    targets: string[];
    values: string[];
    signatures: string[];
    calldatas: string[];
    startBlock: string;
    endBlock: string;
    description: string;
    status?: number;
}

export function useProposals() {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(true);
    const publicClient = usePublicClient();

    useEffect(() => {
        async function fetchProposals() {
            if (!publicClient) return;

            try {
                const logs = await publicClient.getLogs({
                    address: contractAddress.governorAddress as `0x${string}`,
                    event: parseAbiItem('event ProposalCreated(uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)'),
                    fromBlock: 'earliest'
                });

                const parsedProposals = logs.map(log => {
                    const args = log.args as any;
                    return {
                        id: args.proposalId.toString(),
                        proposer: args.proposer,
                        targets: args.targets,
                        values: args.values.map((v: bigint) => v.toString()),
                        signatures: args.signatures,
                        calldatas: args.calldatas,
                        startBlock: args.startBlock.toString(),
                        endBlock: args.endBlock.toString(),
                        description: args.description
                    }
                });

                setProposals(parsedProposals.reverse());
            } catch (error) {
                console.error("Error fetching proposals:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProposals();
    }, [publicClient]);

    return { proposals, loading };
}
