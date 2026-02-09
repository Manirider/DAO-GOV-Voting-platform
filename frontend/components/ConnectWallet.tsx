'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Loader2, LogOut, Wallet } from 'lucide-react'

export function ConnectWallet() {
    const { address, isConnected } = useAccount()
    const { connect, isPending } = useConnect()
    const { disconnect } = useDisconnect()

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
        <button
            data-testid="connect-wallet-button"
            onClick={() => connect({ connector: injected() })}
            disabled={isPending}
            className="btn-primary flex items-center gap-2"
        >
            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Wallet size={18} />}
            {isPending ? "Connecting..." : "Connect Wallet"}
        </button>
    )
}
