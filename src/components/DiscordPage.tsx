import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Hash, Users, MessageCircle, Zap, Brain, Code, BookOpen, Volume2 } from 'lucide-react';

const DiscordIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

interface Channel {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  borderColor: string;
  bgGlow: string;
  memberCount: string;
  topics: string[];
  inviteLink: string;
}

const CHANNELS: Channel[] = [
  {
    id: 'cp',
    name: 'competitive-programming',
    description: 'Where algorithms meet adrenaline',
    longDescription: 'Discuss contest strategies, share editorial breakdowns, grind Codeforces/LeetCode together, and celebrate those sweet AC moments. Whether you\'re rated 800 or 2000 — there\'s a seat for you.',
    icon: <Zap size={24} />,
    color: 'text-orange-400',
    gradient: 'from-orange-500/20 to-amber-500/10',
    borderColor: 'border-orange-500/20 hover:border-orange-500/40',
    bgGlow: 'bg-orange-500/10',
    memberCount: '45+',
    topics: ['Codeforces', 'LeetCode', 'Editorials', 'Contest Strategy', 'DSA Doubts'],
    inviteLink: '#',
  },
  {
    id: 'ml',
    name: 'machine-learning',
    description: 'Train models. Train your brain.',
    longDescription: 'From linear regression to transformers — ask questions, share papers, debug your PyTorch nightmares, and explore the bleeding edge of AI. No question is too basic here.',
    icon: <Brain size={24} />,
    color: 'text-purple-400',
    gradient: 'from-purple-500/20 to-violet-500/10',
    borderColor: 'border-purple-500/20 hover:border-purple-500/40',
    bgGlow: 'bg-purple-500/10',
    memberCount: '38+',
    topics: ['Deep Learning', 'NLP', 'Computer Vision', 'Kaggle', 'Research Papers'],
    inviteLink: '#',
  },
  {
    id: 'dev',
    name: 'development',
    description: 'Ship it. Break it. Ship it again.',
    longDescription: 'Full-stack, frontend, backend, mobile, DevOps — if you build things, this is home. Get code reviews, find project partners, share your latest deploy, and argue about tabs vs spaces.',
    icon: <Code size={24} />,
    color: 'text-blue-400',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    borderColor: 'border-blue-500/20 hover:border-blue-500/40',
    bgGlow: 'bg-blue-500/10',
    memberCount: '52+',
    topics: ['React', 'Backend', 'DevOps', 'Open Source', 'Code Reviews'],
    inviteLink: '#',
  },
  {
    id: 'research',
    name: 'research',
    description: 'Curiosity doesn\'t kill. It publishes.',
    longDescription: 'For the ones who read papers for fun. Discuss ongoing research, find co-authors, break down complex ideas, and navigate the world of academic publishing and innovation.',
    icon: <BookOpen size={24} />,
    color: 'text-emerald-400',
    gradient: 'from-emerald-500/20 to-green-500/10',
    borderColor: 'border-emerald-500/20 hover:border-emerald-500/40',
    bgGlow: 'bg-emerald-500/10',
    memberCount: '30+',
    topics: ['Paper Reading', 'Writing', 'Conferences', 'Innovation', 'Collaboration'],
    inviteLink: '#',
  },
];

const DiscordPage: React.FC = () => {
  const [hoveredChannel, setHoveredChannel] = useState<string | null>(null);

  return (
    <section className="min-h-screen bg-black text-white pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#5865F2]/10 border border-[#5865F2]/20 rounded-full px-5 py-2 mb-6">
            <DiscordIcon className="w-4 h-4 text-[#5865F2]" />
            <span className="text-xs font-mono tracking-wider text-[#5865F2]">// discord channels</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              Find Your Channel
            </span>
          </h1>
          <p className="text-gray-500 font-mono text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Every track has a home. Pick the channels that match your vibe, 
            jump in, and start building with people who get it.
          </p>

          {/* Quick stats */}
          <div className="flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Users size={16} className="text-[#5865F2]" />
              <span className="font-mono">120+ members</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Hash size={16} className="text-[#5865F2]" />
              <span className="font-mono">4 channels</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <MessageCircle size={16} className="text-[#5865F2]" />
              <span className="font-mono">always active</span>
            </div>
          </div>
        </div>

        {/* Main server invite */}
        <div className="mb-14">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="group block w-full rounded-2xl border border-[#5865F2]/20 bg-gradient-to-r from-[#5865F2]/10 to-[#5865F2]/5 p-6 md:p-8 hover:border-[#5865F2]/50 transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-[#5865F2] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <DiscordIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-center md:text-left flex-1">
                <h3 className="text-xl font-black uppercase tracking-tight mb-1">theByteLab Server</h3>
                <p className="text-gray-500 text-sm font-mono">
                  Join the main server to get access to all channels, announcements, and community events.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-400 text-xs font-mono">online now</span>
                </div>
                <div className="bg-[#5865F2] text-white px-6 py-3 rounded-full font-bold text-sm uppercase tracking-widest group-hover:bg-white group-hover:text-[#5865F2] transition-colors flex items-center gap-2">
                  <span>Join Server</span>
                  <ExternalLink size={14} />
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Channels grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CHANNELS.map((channel) => (
            <a
              key={channel.id}
              href={channel.inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setHoveredChannel(channel.id)}
              onMouseLeave={() => setHoveredChannel(null)}
              className={`group relative rounded-2xl border ${channel.borderColor} bg-gradient-to-br ${channel.gradient} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden`}
            >
              {/* Glow effect */}
              <div className={`absolute -top-20 -right-20 w-40 h-40 ${channel.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="relative z-10">
                {/* Channel header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`${channel.color}`}>
                      {channel.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Hash size={14} className="text-gray-600" />
                        <h3 className="text-lg font-black uppercase tracking-tight">{channel.name}</h3>
                      </div>
                      <p className={`text-xs font-mono ${channel.color} opacity-80 mt-0.5`}>
                        {channel.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-400 text-sm leading-relaxed mb-5">
                  {channel.longDescription}
                </p>

                {/* Topics */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {channel.topics.map((topic) => (
                    <span
                      key={topic}
                      className="text-[10px] font-mono uppercase tracking-wider text-gray-500 bg-white/5 border border-white/5 rounded-full px-2.5 py-1"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 text-gray-500 text-xs font-mono">
                    <Users size={12} />
                    <span>{channel.memberCount} members</span>
                  </div>
                  <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${channel.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <span>Join</span>
                    <ExternalLink size={12} />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Voice channels section */}
        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <div className="flex items-center gap-3 mb-4">
            <Volume2 size={20} className="text-gray-500" />
            <h3 className="text-lg font-black uppercase tracking-tight">Voice Channels</h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-gray-600 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
              coming soon
            </span>
          </div>
          <p className="text-gray-500 text-sm font-mono max-w-2xl">
            Weekly live sessions, study rooms, mock interviews, and spontaneous debugging hangouts. 
            Drop in, turn on your mic, and learn out loud.
          </p>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="text-gray-600 font-mono text-xs mb-4 uppercase tracking-widest">
            Can't decide? Join the server — you get all channels.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={12} />
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DiscordPage;
