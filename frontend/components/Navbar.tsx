'use client'

import { ConnectWallet } from "./ConnectWallet";
import Link from "next/link";
import { LayoutDashboard, BarChart3, Landmark, Vote } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
    const pathname = usePathname();

    const navItems = [
        { label: 'Dashboard', href: '/', icon: LayoutDashboard },
        { label: 'Governance', href: '#governance', icon: Vote },
        { label: 'Treasury', href: '#treasury', icon: Landmark },
        { label: 'Analytics', href: '#analytics', icon: BarChart3 },
    ];

    return (
        <nav className="glass-nav border-b border-white/5 backdrop-blur-2xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center gap-12">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                                <LayoutDashboard className="text-white" size={20} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
                                    DAO Governance
                                </span>
                                <span className="text-[10px] text-text-muted font-medium tracking-widest uppercase">Protocol v2.0</span>
                            </div>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.label} 
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                                        pathname === item.href 
                                        ? 'bg-white/10 text-white shadow-inner' 
                                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <item.icon size={16} className={pathname === item.href ? 'text-primary' : 'text-text-muted'} />
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden lg:flex flex-col items-end mr-2">
                             <span className="text-xs text-text-muted font-medium">Network</span>
                             <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-xs font-bold text-green-500">App Live</span>
                             </div>
                        </div>
                        <ConnectWallet />
                    </div>
                </div>
            </div>
        </nav>
    );
}
