'use client'

import { ConnectWallet } from "./ConnectWallet";
import Link from "next/link";
import { LayoutDashboard } from "lucide-react";

export function Navbar() {
    return (
        <nav className="glass-nav border-b border-dark-border/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                                <LayoutDashboard className="text-primary" size={24} />
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                DAO Governance
                            </span>
                        </Link>
                    </div>

                    <ConnectWallet />
                </div>
            </div>
        </nav>
    );
}
