'use client'

import { OverviewCards } from "../components/OverviewCards";
import { ProposalList } from "../components/ProposalList";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tight">
            <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-text-secondary mt-2 text-lg">Manage your DAO's future, democratically.</p>
        </div>

        <button className="btn-primary flex items-center gap-2 group">
          <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
            <Plus size={18} />
          </div>
          Create Proposal
        </button>
      </div>

      {/* Overview Stats */}
      <OverviewCards />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Proposals */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-text-primary">Recent Proposals</h2>
            <div className="flex gap-2">
              <button className="text-sm px-3 py-1 rounded-lg bg-dark-secondary text-text-primary border border-dark-border">All</button>
              <button className="text-sm px-3 py-1 rounded-lg text-text-muted hover:text-text-primary">Active</button>
            </div>
          </div>

          <ProposalList />
        </div>

        {/* Right Column: Info/Sidebar */}
        <div className="space-y-6">
          {/* Quadratic Voting Info Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500/20 to-green-500/20 border border-sky-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" />
              </svg>
            </div>
            <h3 className="font-bold text-lg text-white mb-2 relative z-10">Quadratic Voting Enabled</h3>
            <p className="text-sm text-blue-100 mb-4 relative z-10">
              Express your preference intensity. The cost of votes increases quadratically.
            </p>
            <div className="inline-block px-3 py-1 rounded-lg bg-dark-bg/50 border border-white/10 text-xs font-mono text-white relative z-10">
              Cost = Votes²
            </div>
          </div>

          {/* Quick Actions / Resources? */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg text-text-primary mb-4">Resources</h3>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-dark-border" />
                Governance Guidelines
              </li>
              <li className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-dark-border" />
                Documentation
              </li>
              <li className="flex items-center gap-2 hover:text-primary cursor-pointer transition-colors">
                <div className="w-1.5 h-1.5 rounded-full bg-dark-border" />
                Forum Discussions
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
