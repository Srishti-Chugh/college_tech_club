import React, { useRef } from 'react';

interface ByteLabLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  darkBg?: boolean;
}

const sizeConfig = {
  sm: { icon: 28, text: 'text-lg', gap: 'gap-1.5' },
  md: { icon: 36, text: 'text-xl', gap: 'gap-2' },
  lg: { icon: 56, text: 'text-3xl', gap: 'gap-3' },
};

const ByteLabLogo: React.FC<ByteLabLogoProps> = ({
  size = 'md',
  showText = true,
  darkBg = true,
}) => {
  const cfg = sizeConfig[size];
  const uid = useRef(`bl-${Math.random().toString(36).slice(2, 8)}`).current;

  return (
    <div className={`flex items-center ${cfg.gap}`}>
      <div className="relative" style={{ width: cfg.icon, height: cfg.icon }}>
        <svg
          viewBox="0 0 64 64"
          width={cfg.icon}
          height={cfg.icon}
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={`grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          <rect x="2" y="2" width="60" height="60" rx="14" fill={`url(#grad-${uid})`} />

          {/* Beaker neck — two vertical lines touching the braces */}
          <rect x="23" y="10" width="3" height="16" rx="1.5" fill="white" opacity="0.75" />
          <rect x="38" y="10" width="3" height="16" rx="1.5" fill="white" opacity="0.75" />

          {/* Fume particles rising from the neck */}
          <g className="bl-fume-group">
            <circle className="bl-fume bl-fume-1" cx="28" cy="10" r="2.2" fill="white" opacity="0" />
            <circle className="bl-fume bl-fume-2" cx="32" cy="8" r="1.8" fill="white" opacity="0" />
            <circle className="bl-fume bl-fume-3" cx="36" cy="10" r="2.5" fill="white" opacity="0" />
            <circle className="bl-fume bl-fume-4" cx="30" cy="11" r="1.5" fill="white" opacity="0" />
            <circle className="bl-fume bl-fume-5" cx="34" cy="9" r="2.0" fill="white" opacity="0" />
          </g>

          {/* {_} beaker body */}
          <text
            x="32"
            y="44"
            textAnchor="middle"
            fontFamily="'JetBrains Mono', 'Fira Code', 'SF Mono', monospace"
            fontWeight="900"
            fontSize="26"
            fill="white"
            letterSpacing="-1"
          >
            {'{_}'}
          </text>

          {/* Liquid bubble accents */}
          <circle cx="27" cy="42" r="1.5" fill="white" opacity="0.25" />
          <circle cx="35" cy="39" r="1" fill="white" opacity="0.2" />
          <circle cx="31" cy="44" r="0.8" fill="white" opacity="0.15" />
        </svg>

        <style>{`
          .bl-fume {
            transform-box: fill-box;
            transform-origin: center;
          }
          .bl-fume-1 { animation: blFume1 2.4s infinite ease-out; }
          .bl-fume-2 { animation: blFume2 2.8s infinite ease-out 0.5s; }
          .bl-fume-3 { animation: blFume3 2.2s infinite ease-out 1.0s; }
          .bl-fume-4 { animation: blFume4 3.0s infinite ease-out 0.3s; }
          .bl-fume-5 { animation: blFume5 2.6s infinite ease-out 0.8s; }

          @keyframes blFume1 {
            0%   { opacity: 0; transform: translate(0, 0) scale(1); }
            15%  { opacity: 0.5; }
            50%  { opacity: 0.3; transform: translate(-3px, -14px) scale(1.4); }
            100% { opacity: 0; transform: translate(-5px, -26px) scale(0.5); }
          }
          @keyframes blFume2 {
            0%   { opacity: 0; transform: translate(0, 0) scale(1); }
            15%  { opacity: 0.45; }
            50%  { opacity: 0.25; transform: translate(2px, -16px) scale(1.3); }
            100% { opacity: 0; transform: translate(4px, -28px) scale(0.4); }
          }
          @keyframes blFume3 {
            0%   { opacity: 0; transform: translate(0, 0) scale(1); }
            15%  { opacity: 0.55; }
            50%  { opacity: 0.3; transform: translate(3px, -12px) scale(1.5); }
            100% { opacity: 0; transform: translate(1px, -24px) scale(0.3); }
          }
          @keyframes blFume4 {
            0%   { opacity: 0; transform: translate(0, 0) scale(1); }
            15%  { opacity: 0.4; }
            50%  { opacity: 0.2; transform: translate(-2px, -18px) scale(1.2); }
            100% { opacity: 0; transform: translate(-4px, -30px) scale(0.4); }
          }
          @keyframes blFume5 {
            0%   { opacity: 0; transform: translate(0, 0) scale(1); }
            15%  { opacity: 0.5; }
            50%  { opacity: 0.25; transform: translate(1px, -15px) scale(1.3); }
            100% { opacity: 0; transform: translate(-2px, -27px) scale(0.5); }
          }
        `}</style>
      </div>

      {showText && (
        <span
          className={`font-black ${cfg.text} tracking-tighter ${
            darkBg ? 'text-white' : 'text-black'
          }`}
        >
          theByteLab
        </span>
      )}
    </div>
  );
};

export default ByteLabLogo;
