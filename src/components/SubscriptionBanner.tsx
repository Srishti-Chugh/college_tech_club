import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

const CHANNEL_PILLS = [
  { name: '#competitive-programming', color: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { name: '#machine-learning', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { name: '#development', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { name: '#research', color: 'bg-green-500/20 text-green-300 border-green-500/30' },
];

const SubscriptionBanner: React.FC = () => {
  const { user, loading } = useAuth();

  return (
    <section className="py-14">
      <div className="container mx-auto px-6">
        <div className="bg-[#5865F2] rounded-[50px] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">

          {/* Ambient floating circles */}
          <div className="absolute top-10 right-20 w-64 h-64 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-48 h-48 bg-indigo-900/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/[0.03] rounded-full blur-2xl pointer-events-none" />

          {/* Decorative grid pattern */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 md:w-3/5 mb-8 md:mb-0">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-4">
              <DiscordIcon className="w-4 h-4 text-white" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/80">Community Hub</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black uppercase leading-[0.95] text-white mb-3">
              Don't code alone.<br />
              <span className="text-white/60">Join the conversation.</span>
            </h2>

            <p className="text-white/70 text-sm max-w-lg mb-5 leading-relaxed">
              Four tracks. Four channels. One community. Jump into real-time 
              discussions, share resources, get help with bugs at 2 AM, and find 
              your people.
            </p>

            {/* Channel pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {CHANNEL_PILLS.map((ch) => (
                <span key={ch.name} className={`text-xs font-mono px-3 py-1.5 rounded-full border ${ch.color}`}>
                  {ch.name}
                </span>
              ))}
            </div>

            {loading ? (
              <span className="bg-white/80 text-[#5865F2]/60 w-fit px-6 py-3 rounded-full inline-flex items-center space-x-3 font-bold text-sm uppercase tracking-wide cursor-wait">
                <DiscordIcon className="w-5 h-5 shrink-0" />
                <span>Loading…</span>
              </span>
            ) : user ? (
              <Link
                to="/discord"
                className="bg-white text-[#5865F2] w-fit px-6 py-3 rounded-full flex items-center space-x-3 hover:scale-105 transition-transform group font-bold text-sm uppercase tracking-wide inline-flex"
              >
                <DiscordIcon className="w-5 h-5" />
                <span>Explore Channels</span>
                <div className="bg-[#5865F2] rounded-full p-1.5 text-white group-hover:rotate-45 transition-transform">
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            ) : (
              <Link
                to="/join"
                state={{ from: '/discord' }}
                className="bg-white text-[#5865F2] w-fit px-6 py-3 rounded-full flex items-center space-x-3 hover:scale-105 transition-transform group font-bold text-sm uppercase tracking-wide inline-flex"
              >
                <DiscordIcon className="w-5 h-5" />
                <span>Explore Channels</span>
                <div className="bg-[#5865F2] rounded-full p-1.5 text-white group-hover:rotate-45 transition-transform">
                  <ArrowUpRight size={16} />
                </div>
              </Link>
            )}

            <div className="border-t border-white/10 pt-4 mt-5">
              <span className="text-[10px] font-black uppercase block mb-1 text-white/50 tracking-widest">
                120+ members already inside
              </span>
              <p className="text-xs text-white/40 max-w-sm">
                Ask doubts, share wins, post memes, and build together — all in one place.
              </p>
            </div>
          </div>

          {/* Right side — Discord-style chat mockup */}
          <div className="relative z-10 md:w-1/3">
            <div className="bg-[#2f3136] rounded-2xl border border-white/10 overflow-hidden shadow-2xl shadow-black/30">
              {/* Chat header */}
              <div className="bg-[#36393f] px-4 py-3 border-b border-white/5 flex items-center gap-2">
                <span className="text-white/30 text-lg font-bold">#</span>
                <span className="text-white/80 text-sm font-semibold">general</span>
                <div className="ml-auto flex -space-x-1.5">
                  {['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'].map((bg, i) => (
                    <div key={i} className={`w-5 h-5 ${bg} rounded-full border-2 border-[#36393f]`} />
                  ))}
                  <div className="w-5 h-5 bg-white/10 rounded-full border-2 border-[#36393f] flex items-center justify-center text-[8px] text-white/50 font-bold">
                    +9
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div className="px-4 py-4 space-y-4">
                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-green-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white">A</div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-green-400 text-xs font-semibold">ananya</span>
                      <span className="text-white/20 text-[10px]">today</span>
                    </div>
                    <p className="text-white/70 text-xs mt-0.5">just solved my first graph problem!! 🎉</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-purple-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white">R</div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-purple-400 text-xs font-semibold">riya</span>
                      <span className="text-white/20 text-[10px]">today</span>
                    </div>
                    <p className="text-white/70 text-xs mt-0.5">anyone wanna collab on a react project?</p>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center text-[10px] font-bold text-white">S</div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-blue-400 text-xs font-semibold">sneha</span>
                      <span className="text-white/20 text-[10px]">today</span>
                    </div>
                    <p className="text-white/70 text-xs mt-0.5">shared my ML notes in #machine-learning 📚</p>
                  </div>
                </div>
              </div>

              {/* Chat input */}
              <div className="px-4 pb-3">
                <div className="bg-[#40444b] rounded-lg px-3 py-2 flex items-center">
                  <span className="text-white/20 text-xs">Message #general</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBanner;
