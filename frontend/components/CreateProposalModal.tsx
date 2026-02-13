'use client'

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, encodeFunctionData, parseAbi } from 'viem';
import { X, Loader2, AlertCircle, CheckCircle2, Plus } from 'lucide-react';
import MyGovernor from '../abi/MyGovernor.json';
import contractAddress from '../config/contract-address.json';

interface CreateProposalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateProposalModal({ isOpen, onClose }: CreateProposalModalProps) {
    const [description, setDescription] = useState('');
    const [target, setTarget] = useState('');
    const [functionSignature, setFunctionSignature] = useState('transfer(address,uint256)');
    const [args, setArgs] = useState('');
    const [isQuadratic, setIsQuadratic] = useState(false);
    const [error, setError] = useState('');

    const { writeContract, data: hash, isPending } = useWriteContract();
    const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
        hash,
    });

    const handlePropose = async () => {
        try {
            setError('');
            if (!description || !target ) return;

            // Simple Calldata Generation (Demo Purpose)
            let calldata = '0x';
            try {
               if (functionSignature && args) {
                   // Fallback: If function signature is standard ERC20 transfer
                   if(functionSignature.includes("transfer")) {
                        const abi = parseAbi(['function transfer(address to, uint256 amount)']);
                        const argArray = args.split(',').map(a => a.trim());
                        
                        if (argArray.length === 2) {
                             calldata = encodeFunctionData({
                                abi,
                                functionName: 'transfer',
                                args: [argArray[0] as `0x${string}`, parseEther(argArray[1])]
                            });
                        }
                   } else {
                        // For other functions, we would need a more complex parser.
                        // For the demo, we only strictly support transfer or empty args.
                        if(args) {
                             throw new Error("Only transfer(address,uint256) is supported for demo arguments.");
                        }
                   }
               }
            } catch (err) {
                        // Try raw encoding (dangerous/brittle without type info)
                        // Better approach: Just take raw calldata input for advanced users
                        // For this demo: Let's assume standard calldata input not supported mostly
                        // Let's rely on empty calldata for "Signal Only" proposals if args are empty
                        if(args) {
                             throw new Error("Complex arg encoding not implemented in demo. Use empty args for signal proposal.");
                        }
                   }
               }
            } catch (err) {
                 console.error(err);
                 setError("Error encoding data. Check console.");
                 return;
            }

            const finalDescription = isQuadratic ? `${description} #QV` : description;

            writeContract({
                address: contractAddress.governorAddress as `0x${string}`,
                abi: MyGovernor,
                functionName: 'propose',
                args: [
                    [target as `0x${string}`],
                    [0n], // Value (0 ETH)
                    [calldata as `0x${string}`],
                    finalDescription
                ],
            });
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Transaction failed");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-dark-card border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl relative overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-text-primary">Create Proposal</h2>
                        <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="inline-flex p-4 rounded-full bg-green-500/20 mb-4 text-green-400">
                                <CheckCircle2 size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Proposal Created!</h3>
                            <p className="text-text-secondary mb-6">Transaction submitted successfully.</p>
                            <button onClick={onClose} className="btn-primary w-full py-3">Close</button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Proposal Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-dark-bg/50 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all h-24 resize-none"
                                    placeholder="What is this proposal about?"
                                />
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-all" onClick={() => setIsQuadratic(!isQuadratic)}>
                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isQuadratic ? 'bg-primary border-primary' : 'border-text-muted'}`}>
                                    {isQuadratic && <CheckCircle2 size={14} className="text-white" />}
                                </div>
                                <span className="text-sm font-medium text-text-primary">Enable Quadratic Voting (#QV)</span>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <p className="text-xs text-text-muted uppercase font-bold mb-3 tracking-wider">Action Details (Optional)</p>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs text-text-secondary mb-1">Target Address</label>
                                        <input
                                            value={target}
                                            onChange={(e) => setTarget(e.target.value)}
                                            className="w-full bg-dark-bg/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none"
                                            placeholder="0x..."
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                         <div>
                                            <label className="block text-xs text-text-secondary mb-1">Function</label>
                                            <input
                                                value={functionSignature}
                                                onChange={(e) => setFunctionSignature(e.target.value)}
                                                className="w-full bg-dark-bg/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none"
                                                placeholder="transfer(address,uint256)"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-text-secondary mb-1">Args (comma sep)</label>
                                            <input
                                                value={args}
                                                onChange={(e) => setArgs(e.target.value)}
                                                className="w-full bg-dark-bg/50 border border-white/10 rounded-lg p-2 text-sm text-white focus:border-primary focus:outline-none"
                                                placeholder="0x123..., 100"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-xs text-text-muted italic">
                                        *For demo, only supports `transfer(address,uint256)` args or empty args.
                                    </p>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handlePropose}
                                disabled={!description || !target || isPending || isConfirming}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isPending || isConfirming ? <Loader2 size={20} className="animate-spin" /> : <Plus size={20} />}
                                {isPending ? 'Confirming...' : isConfirming ? 'Processing...' : 'Create Proposal'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
