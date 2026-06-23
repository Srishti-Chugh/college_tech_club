import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageSquareText, Flame, Users } from 'lucide-react';

const HypeWallRibbon: React.FC = () => {
  return (
    <section className="py-20 bg-[#f4f4f3] border-t border-black/[0.06]">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">

          {/* Eyebrow — matches homepage section label style */}
          <p className="text-xs font-black uppercase tracking-widest text-black/30 mb-2">
            — Community
          </p>

          {/* Heading — matches "On Our Radar" / "Our Tracks" sizing */}
          <h2 className="text-5xl md:text-6xl font-black uppercase mb-6">Hype Wall</h2>

          {/* Description — wider, more conversational */}
          <p className="text-black/50 text-base md:text-lg font-medium leading-relaxed max-w-3xl mx-auto mb-10">
            Cracked a hard problem, landed an internship, finally shipped that side
            project — don't keep it to yourself. Share it here, cheer someone else on,
            and stick around — someone in this club has been waiting to hear exactly this.
          </p>

          {/* Three micro-features */}
          <div className="flex items-center justify-center gap-8 mb-10 flex-wrap">
            {[
              { icon: <Flame size={14} />, label: 'Wins & milestones' },
              { icon: <MessageSquareText size={14} />, label: 'Cheer & comment' },
              { icon: <Users size={14} />, label: 'Member-only' },
            ].map(f => (
              <div key={f.label} className="flex items-center gap-2 text-black/35">
                <span className="text-black/40">{f.icon}</span>
                <span className="text-[11px] font-black uppercase tracking-widest">{f.label}</span>
              </div>
            ))}
          </div>

          {/* CTA — matches homepage black pill button pattern */}
          <Link
            to="/wins"
            className="group inline-flex items-center gap-3 bg-black text-white pl-7 pr-4 py-3.5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-yellow-400 hover:text-black transition-all duration-300"
          >
            <span>Visit the Hype Wall</span>
            <div className="bg-yellow-400 text-black rounded-full p-1.5 group-hover:bg-black group-hover:text-white transition-colors">
              <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>

          {/* Sub-note */}
          <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-black/25">
            Sign in to post · Free for all members
          </p>

        </div>
      </div>
    </section>
  );
};

export default HypeWallRibbon;