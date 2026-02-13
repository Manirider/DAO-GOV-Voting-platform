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

    // Find the injected connector (usually MetaMask or browser wallet)
    const injectedConnector = connectors.find((c) => c.type === 'injected')

    return (
        <div className="flex flex-col items-center">
             <button
                data-testid="connect-wallet-button"
                onClick={() => {
                    if (injectedConnector) {
                        connect({ connector: injectedConnector })
                    } else {
                        // Fallback: Try the first available connector if injected not found by type ID
                        const first = connectors[0];
                        if(first) connect({ connector: first })
                    }
                }}
                disabled={status === 'pending' || !connectors.length}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {status === 'pending' ? <Loader2 className="animate-spin" size={18} /> : <Wallet size={18} />}
                {status === 'pending' ? "Connecting..." : "Connect Wallet"}
            </button>
            {error && <div className="text-red-500 text-xs mt-1 absolute top-16 right-0 bg-dark-card p-2 rounded border border-red-500/50">{error.message}</div>}
        </div>
    )
}
