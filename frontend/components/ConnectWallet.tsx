'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Loader2, LogOut, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ConnectWallet() {
    const { address, isConnected } = useAccount()
    const { connectors, connect, status, error } = useConnect()
    const { disconnect } = useDisconnect()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) return null;

    if (isConnected) {
        return (
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-dark-secondary border border-dark-border rounded-xl">
                    <div className="w-2 h-2 bg-status-success rounded-full animate-pulse" />
                    <span data-testid="user-address" className="font-mono text-sm text-text-secondary">
                        {address?.slice(0, 6)}...{address?.slice(-4)}
                    </span>
                </div>
                <button
                    onClick={() => disconnect()}
                    className="p-2 text-text-muted hover:text-status-danger hover:bg-dark-card rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center relative">
             <button
                data-testid="connect-wallet-button"
                onClick={() => {
                    const connector = connectors[0];
                    if (connector) {
                        connect({ connector })
                    } else {
                        // If no connectors exist at all (rare with wagmi defaults)
                        window.open('https://metamask.io/download/', '_blank');
                    }
                }}
                disabled={status === 'pending'}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'pending' ? <Loader2 className="animate-spin" size={18} /> : <Wallet size={18} />}
                {status === 'pending' ? "Connecting..." : "Connect Wallet"}
            </button>
            
            {error && (
                <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-dark-card border border-status-danger/50 rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start gap-2">
                        <div className="text-status-danger mt-0.5">
                            <LogOut size={16} className="rotate-180" /> {/* Using LogOut as Alert icon proxy or import AlertCircle */}
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-bold text-white mb-1">Connection Failed</p>
                            <p className="text-xs text-text-secondary mb-2">
                                {error.message.includes("Provider not found") 
                                    ? "No wallet detected. You need a crypto wallet to interact." 
                                    : error.message}
                            </p>
                            {error.message.includes("Provider not found") && (
                                <a 
                                    href="https://metamask.io/download/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block text-center py-1.5 px-3 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 text-xs font-bold transition-colors"
                                >
                                    Install MetaMask
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
