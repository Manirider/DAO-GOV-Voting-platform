'use client'

import { OverviewCards } from "../components/OverviewCards";
import { ProposalList } from "../components/ProposalList";
import { Plus, ArrowRight, BookOpen, MessageSquare, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero / Header Section - Redesigned for Impact */}
      <div className="relative min-h-[60vh] flex flex-col items-center justify-center text-center gap-8 mb-20">
         {/* Background Glows */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-primary/20 via-purple-500/20 to-green-400/20 rounded-full blur-[100px] -z-10 animate-pulse" />
         
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
            <span className="text-sm font-medium text-green-400 tracking-wide uppercase">Live on Sepolia</span>
         </div>

         <div className="space-y-4 max-w-4xl z-10">
           <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 tracking-tighter leading-[1.1] drop-shadow-2xl">
             Decentralized <br />
             <span className="text-gradient">Governance</span>
           </h1>
           <p className="text-text-secondary text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed font-light">
             Shape the protocol's future with <span className="text-white font-semibold">Quadratic Voting</span>. Your voice matters, amplified by math.
           </p>
         </div>

         <div className="flex items-center gap-4 z-10 mt-4">
            <button className="btn-primary flex items-center gap-3 group px-8 py-4 text-lg">
              <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-180 transition-transform duration-700">
                 <Plus size={20} />
              </div>
              <span className="tracking-wide">Create Proposal</span>
            </button>
            <button className="px-8 py-4 rounded-xl bg-dark-card border border-white/10 hover:bg-white/5 text-text-primary font-bold transition-all hover:scale-105 flex items-center gap-2">
               <BookOpen size={20} className="text-text-muted" />
               Learn More
            </button>
         </div>
      </div>

      {/* Overview Stats */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
            Network Overview 
            <span className="text-xs font-normal text-text-muted bg-dark-card border border-dark-border px-2 py-0.5 rounded-full">Live Updates</span>
          </h2>
        </div>
        <OverviewCards />
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Proposals (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold text-text-primary">Recent Proposals</h2>
            <div className="flex gap-2 p-1 bg-dark-card/50 rounded-xl border border-white/5 backdrop-blur-sm">
              <button className="text-sm font-medium px-4 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all shadow-[0_0_10px_rgba(14,165,233,0.1)]">All</button>
              <button className="text-sm font-medium px-4 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">Active</button>
              <button className="text-sm font-medium px-4 py-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">Executed</button>
            </div>
          </div>

          <ProposalList />
        </div>

        {/* Right Column: Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quadratic Voting Info Card - Enhanced */}
          <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-sky-500/10 via-dark-card to-green-500/10 border border-sky-500/20 shadow-2xl overflow-hidden hover:shadow-sky-500/10 transition-all duration-500">
             <div className="absolute inset-0 bg-noise opacity-20 mix-blend-overlay"></div>
             <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-colors duration-700"></div>
             
             <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-gradient-to-br from-sky-500 to-green-500 rounded-lg shadow-lg">
                    <Shield className="text-white" size={20} />
                  </div>
                  <h3 className="font-bold text-xl text-text-primary">Quadratic Voting</h3>
                </div>
                
                <p className="text-text-secondary leading-relaxed mb-6">
                  This DAO uses <strong>Quadratic Voting</strong> to prevent whale dominance. Your voting power decreases broadly as you allocate more tokens to a single choice.
                </p>
                
                <div className="bg-dark-bg/60 rounded-xl p-4 border border-white/5 backdrop-blur-md">
                   <div className="flex justify-between items-center text-sm mb-2">
                     <span className="text-text-muted">1 Vote</span>
                     <span className="text-text-primary font-mono">1 Token</span>
                   </div>
                   <div className="flex justify-between items-center text-sm mb-2">
                     <span className="text-text-muted">2 Votes</span>
                     <span className="text-text-primary font-mono">4 Tokens</span>
                   </div>
                   <div className="flex justify-between items-center text-sm">
                     <span className="text-text-muted">10 Votes</span>
                     <span className="text-text-primary font-mono">100 Tokens</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Resources & Links */}
          <div className="glass-card p-6">
            <h3 className="font-bold text-lg text-text-primary mb-6 flex items-center gap-2">
              <BookOpen size={18} className="text-primary" />
              Resources
            </h3>
            <ul className="space-y-1">
              {[
                { label: 'Governance Guidelines', icon: Shield },
                { label: 'Technical Documentation', icon: BookOpen },
                { label: 'Forum Discussions', icon: MessageSquare }
              ].map((item, idx) => (
                <li key={idx}>
                  <a href="#" className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 group transition-colors cursor-pointer">
                    <span className="flex items-center gap-3 text-text-secondary group-hover:text-text-primary transition-colors">
                      <item.icon size={16} className="text-text-muted group-hover:text-primary transition-colors" />
                      {item.label}
                    </span>
                    <ArrowRight size={14} className="text-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
