import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Terminal,
  ChevronRight,
  Users,
  CalendarDays,
  FolderGit2,
  Folder,
  FileText,
  Image,
  Settings,
  Mail,
  Music,
  Chrome,
  MessageCircle,
  Camera,
  Map,
  Calculator,
  AppWindow,
  Code,
  Compass,
  HardDrive,
  StickyNote,
  Clock,
  CalendarRange,
  Podcast,
  BookOpen,
} from 'lucide-react';

const TERMINAL_LINES = [
  '> initializing tech_club...',
  '> loading { innovation, code, community }',
  '> compiling dreams into deployments...',
  '> status: ready to build the future',
];

const TYPING_SPEED = 40;
const LINE_PAUSE = 400;

const DESKTOP_ICONS = [
  { icon: <HardDrive size={28} />, label: 'Macintosh HD', color: '#a1a1aa' },
  { icon: <Folder size={28} />, label: 'Projects', color: '#3b82f6' },
  { icon: <Code size={28} />, label: 'VS Code', color: '#22a6f2' },
  { icon: <FileText size={28} />, label: 'README.md', color: '#a1a1aa' },
];

const DOCK_ITEMS = [
  { icon: <Compass size={18} />, label: 'Finder', bg: 'linear-gradient(135deg, #1e90ff, #00bfff)' },
  { icon: <AppWindow size={18} />, label: 'Launchpad', bg: 'linear-gradient(135deg, #1a1a2e, #2d2d44)' },
  { icon: <StickyNote size={18} />, label: 'Notes', bg: 'linear-gradient(135deg, #f9a825, #fdd835)' },
  { icon: <Clock size={18} />, label: 'Clock', bg: 'linear-gradient(135deg, #111, #333)' },
  { icon: <CalendarRange size={18} />, label: 'Calendar', bg: 'linear-gradient(135deg, #e53935, #ef5350)' },
  { icon: <Podcast size={18} />, label: 'Podcasts', bg: 'linear-gradient(135deg, #7c4dff, #b388ff)' },
  { icon: <BookOpen size={18} />, label: 'Books', bg: 'linear-gradient(135deg, #f57c00, #ffb74d)' },
  { icon: <Chrome size={18} />, label: 'Chrome', bg: 'linear-gradient(135deg, #ea4335, #fbbc05, #34a853, #4285f4)' },
  { icon: <Mail size={18} />, label: 'Mail', bg: 'linear-gradient(135deg, #1e90ff, #4fc3f7)' },
  { icon: <Map size={18} />, label: 'Maps', bg: 'linear-gradient(135deg, #34a853, #81c784)' },
  { icon: <Image size={18} />, label: 'Photos', bg: 'linear-gradient(135deg, #e040fb, #ff6090, #ff8a65, #ffd54f)' },
  { icon: <MessageCircle size={18} />, label: 'Messages', bg: 'linear-gradient(135deg, #43a047, #66bb6a)' },
  { icon: <Music size={18} />, label: 'Music', bg: 'linear-gradient(135deg, #e91e63, #f44336)' },
  { icon: <Terminal size={18} />, label: 'Terminal', bg: 'linear-gradient(135deg, #1a1a1a, #333)' },
  { icon: <Code size={18} />, label: 'VS Code', bg: 'linear-gradient(135deg, #0078d4, #2196f3)' },
  { icon: <Camera size={18} />, label: 'FaceTime', bg: 'linear-gradient(135deg, #43a047, #81c784)' },
  { icon: <Settings size={18} />, label: 'Settings', bg: 'linear-gradient(135deg, #546e7a, #90a4ae)' },
  { icon: <Calculator size={18} />, label: 'Calculator', bg: 'linear-gradient(135deg, #333, #555)' },
];

interface HeroProps {
  introComplete?: boolean;
}

const Hero: React.FC<HeroProps> = ({ introComplete = true }) => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    if (!introComplete) return;
    if (currentLine >= TERMINAL_LINES.length) return;

    const line = TERMINAL_LINES[currentLine];

    if (currentChar < line.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines((prev) => {
          const updated = [...prev];
          updated[currentLine] = line.slice(0, currentChar + 1);
          return updated;
        });
        setCurrentChar((c) => c + 1);
      }, TYPING_SPEED);
      return () => clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      setCurrentLine((l) => l + 1);
      setCurrentChar(0);
      setDisplayedLines((prev) => [...prev, '']);
    }, LINE_PAUSE);
    return () => clearTimeout(timeout);
  }, [currentLine, currentChar, introComplete]);

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  const typingDone = currentLine >= TERMINAL_LINES.length;

  return (
    <section className="relative bg-black text-white overflow-hidden pt-16">
      <div
        className="transition-all duration-1000 ease-out"
        style={{
          opacity: introComplete ? 1 : 0,
          transform: introComplete ? 'translateY(0)' : 'translateY(30px)',
        }}
      >
        {/* MacBook top bezel with notch */}
        <div className="relative bg-[#1a1a1a] border-b border-white/[0.06] h-8 flex items-end justify-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-44 h-6 bg-[#0d0d0d] rounded-b-2xl flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#1a2a1a] border border-white/[0.05]" />
            <div className="w-1 h-1 rounded-full bg-[#2a2a3a]" />
          </div>
        </div>

        {/* macOS menu bar */}
        <div className="flex items-center justify-between px-5 py-1.5 bg-white/[0.03] border-b border-white/[0.06] text-[10px] font-medium text-gray-500">
          <div className="flex items-center gap-4">
            <svg viewBox="0 0 16 16" className="w-3.5 h-3.5 fill-gray-400">
              <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516.024.034 1.52.087 2.475-1.258.955-1.345.762-2.391.728-2.43zm3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422.212-2.189 1.675-2.789 1.698-2.854.023-.065-.597-.79-1.254-1.157a3.692 3.692 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56.244.729.625 1.924 1.273 2.796.576.984 1.34 1.667 1.659 1.899.319.232 1.219.386 1.843.067.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758.347-.79.505-1.217.473-1.282z" />
            </svg>
            <span className="font-semibold text-gray-400">Terminal</span>
            <span>File</span>
            <span>Edit</span>
            <span>View</span>
            <span>Window</span>
            <span>Help</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Wi-Fi</span>
            <span>100%</span>
            <span>Tue 8:26 PM</span>
          </div>
        </div>

        {/* Screen / Desktop area */}
        <div
          className="relative flex flex-col items-center justify-start px-6 pt-10 pb-20"
          style={{
            background: 'linear-gradient(160deg, #0c0c1d 0%, #111118 35%, #0a0f1a 70%, #0d0916 100%)',
          }}
        >
          {/* Earth wallpaper — bottom left */}
          <div className="absolute -bottom-16 -left-10 w-[450px] md:w-[550px] pointer-events-none" style={{ mixBlendMode: 'lighten' }}>
            <img
              src="/earth.png"
              alt=""
              className="w-full h-auto"
            />
          </div>

          {/* Ambient glow from earth */}
          <div className="absolute -bottom-10 -left-10 w-[300px] h-[300px] rounded-full bg-blue-600/10 blur-[100px] pointer-events-none" />

          {/* Desktop icons — top right */}
          <div className="absolute top-4 right-5 flex flex-col gap-4 z-10">
            {DESKTOP_ICONS.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1 cursor-default w-16">
                <div className="text-gray-400" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <span className="text-[9px] text-gray-400 text-center leading-tight font-medium drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {/* Tagline pill */}
          <div className="relative z-10 flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
            <Terminal size={14} className="text-green-400" />
            <span className="text-xs font-mono tracking-wider text-gray-400">
              // welcome to the lab
            </span>
          </div>

          {/* Club name */}
          <h1 className="relative z-10 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-center leading-none mb-4">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              theByteLab
            </span>
          </h1>
          <p className="relative z-10 text-gray-500 text-sm md:text-base max-w-md text-center mb-14 font-mono">
            Where curiosity meets code.
          </p>

          {/* Terminal window */}
          <div className="relative z-10 w-full max-w-2xl rounded-lg overflow-hidden border border-white/10 shadow-[0_8px_60px_-12px_rgba(99,102,241,0.3)]">
            <div className="bg-[#2a2a2e] border-b border-white/[0.06] px-3 py-2 flex items-center gap-2.5">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-[10px] font-mono text-gray-500 flex-1 text-center -ml-10">
                tech-club — zsh — 80x24
              </span>
            </div>
            <div className="bg-[#1e1e22] px-5 py-5 font-mono text-sm leading-relaxed min-h-[170px]">
              {displayedLines.map((line, i) => (
                <div key={i} className="flex">
                  <span
                    className={
                      line.startsWith('> status')
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }
                  >
                    {line}
                  </span>
                  {i === currentLine && !typingDone && (
                    <span
                      className={`ml-0.5 inline-block w-2 h-4 translate-y-[3px] bg-green-400 ${
                        showCursor ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  )}
                </div>
              ))}
              {typingDone && (
                <div className="flex mt-1">
                  <span className="text-green-400">{'> '}</span>
                  <span
                    className={`inline-block w-2 h-4 translate-y-[3px] bg-green-400 ${
                      showCursor ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/join"
            className="relative z-10 mt-10 group inline-flex items-center gap-3 bg-white text-black pl-6 pr-4 py-3 rounded-full font-mono text-sm font-bold hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-lg shadow-white/5"
          >
            <span>$ join --now</span>
            <div className="bg-indigo-600 text-white rounded-full p-1.5 group-hover:bg-white group-hover:text-indigo-600 transition-colors">
              <ChevronRight size={16} />
            </div>
          </Link>

          {/* Stats row */}
          <div className="relative z-10 mt-14 flex flex-wrap justify-center gap-10 md:gap-16">
            {[
              { icon: <Users size={18} />, value: '120+', label: 'Members' },
              { icon: <CalendarDays size={18} />, value: '50+', label: 'Events' },
              { icon: <FolderGit2 size={18} />, value: '10+', label: 'Projects' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 text-gray-400">
                <div className="bg-white/5 border border-white/10 rounded-lg p-2.5">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-white text-xl font-black">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dock */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 z-20 flex items-end gap-1 bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-2xl px-2.5 py-1.5">
            {DOCK_ITEMS.map((item) => (
              <div key={item.label} className="group/dock relative flex flex-col items-center">
                <div className="absolute -top-8 bg-gray-800/90 text-white text-[9px] px-2 py-0.5 rounded-md opacity-0 group-hover/dock:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
                <div
                  className="w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center text-white transition-transform hover:scale-125 hover:-translate-y-2 cursor-default"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MacBook hinge */}
        <div className="bg-[#2a2a2c] h-3 border-t border-white/[0.06]" />
        <div className="flex justify-center bg-black">
          <div className="w-1/4 h-1.5 bg-[#3a3a3c] rounded-b-lg" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
