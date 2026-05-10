import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageCircle } from 'lucide-react';

const WinsHomeRibbon: React.FC = () => {
  return (
    <div
      className="relative z-10 border-y border-white/[0.08] text-white shadow-[0_12px_48px_-28px_rgba(99,102,241,0.35)]"
      style={{
        background: 'linear-gradient(180deg, #0a0a0f 0%, #111118 55%, #0c0c12 100%)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.35]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 120% at 50% -40%, rgba(99,102,241,0.18), transparent 55%)',
        }}
      />
      <div className="relative container mx-auto px-6 py-3.5 md:py-4 flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-6">
        <div className="flex items-start sm:items-center gap-3 text-center sm:text-left">
          <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-xl bg-white/[0.06] items-center justify-center border border-white/10">
            <MessageCircle size={18} className="text-emerald-400/90" aria-hidden />
          </div>
          <div>
            <p className="font-mono text-[11px] text-emerald-400/85 mb-1 tracking-tight">
              {'// community.small-wins'}
            </p>
            <p className="text-sm md:text-base font-semibold text-white/90 leading-snug">
              Share a quick milestone on the site{' '}
              <span className="font-normal text-white/45">— signed in only</span>
            </p>
          </div>
        </div>
        <Link
          to="/wins"
          className="shrink-0 group inline-flex items-center gap-3 bg-white text-black pl-6 pr-4 py-2.5 rounded-full font-mono text-xs font-bold uppercase tracking-wide hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-lg shadow-black/30"
        >
          <span>$ wins --open</span>
          <div className="bg-indigo-600 text-white rounded-full p-1.5 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
            <ChevronRight size={14} />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default WinsHomeRibbon;
