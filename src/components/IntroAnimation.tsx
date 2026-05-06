import React, { useState, useEffect } from 'react';

interface IntroAnimationProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'splash' | 'animate' | 'done'>('splash');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('animate'), 1600);
    const t2 = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, 3200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (phase === 'done') return null;

  const animating = phase === 'animate';

  return (
    <div
      className="fixed inset-0 z-[200]"
      style={{
        backgroundColor: animating ? 'transparent' : '#000',
        transition: 'background-color 1s ease-out 0.4s',
        pointerEvents: animating ? 'none' : 'auto',
      }}
    >
      {/* Logo icon — shrinks and flies to navbar */}
      <div
        style={{
          position: 'fixed',
          top: animating ? '30px' : '45%',
          left: '50%',
          width: 280,
          height: 280,
          transform: animating
            ? 'translate(-50%, -50%) scale(0.1)'
            : 'translate(-50%, -50%)',
          transition:
            'top 1.3s cubic-bezier(0.4, 0, 0.2, 1), transform 1.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <svg
          viewBox="0 0 64 64"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible"
        >
          <defs>
            <linearGradient
              id="introGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#818cf8" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>

          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="14"
            fill="url(#introGrad)"
          />

          {/* Beaker neck */}
          <rect x="23" y="10" width="3" height="16" rx="1.5" fill="white" opacity="0.75" />
          <rect x="38" y="10" width="3" height="16" rx="1.5" fill="white" opacity="0.75" />

          {/* Fume particles */}
          <g>
            <circle className="if if-1" cx="28" cy="10" r="2.2" fill="white" opacity="0" />
            <circle className="if if-2" cx="32" cy="8"  r="1.8" fill="white" opacity="0" />
            <circle className="if if-3" cx="36" cy="10" r="2.5" fill="white" opacity="0" />
            <circle className="if if-4" cx="30" cy="11" r="1.5" fill="white" opacity="0" />
            <circle className="if if-5" cx="34" cy="9"  r="2.0" fill="white" opacity="0" />
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

          {/* Liquid bubbles */}
          <circle cx="27" cy="42" r="1.5" fill="white" opacity="0.25" />
          <circle cx="35" cy="39" r="1" fill="white" opacity="0.2" />
          <circle cx="31" cy="44" r="0.8" fill="white" opacity="0.15" />
        </svg>
      </div>

      {/* "theByteLab" text below logo */}
      <div
        className="fixed left-1/2 font-black text-5xl md:text-6xl tracking-tighter text-white"
        style={{
          top: 'calc(45% + 160px)',
          transform: 'translateX(-50%)',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.4s ease-out',
        }}
      >
        theByteLab
      </div>

      {/* Tagline */}
      <div
        className="fixed left-1/2 font-mono text-sm text-gray-500"
        style={{
          top: 'calc(45% + 220px)',
          transform: 'translateX(-50%)',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
        }}
      >
        Where curiosity meets code.
      </div>

      <style>{`
        .if {
          transform-box: fill-box;
          transform-origin: center;
        }
        .if-1 { animation: ifR1 2.4s infinite ease-out; }
        .if-2 { animation: ifR2 2.8s infinite ease-out 0.5s; }
        .if-3 { animation: ifR3 2.2s infinite ease-out 1.0s; }
        .if-4 { animation: ifR4 3.0s infinite ease-out 0.3s; }
        .if-5 { animation: ifR5 2.6s infinite ease-out 0.8s; }

        @keyframes ifR1 {
          0%   { opacity: 0; transform: translate(0, 0) scale(1); }
          15%  { opacity: 0.6; }
          50%  { opacity: 0.35; transform: translate(-4px, -16px) scale(1.5); }
          100% { opacity: 0; transform: translate(-7px, -30px) scale(0.5); }
        }
        @keyframes ifR2 {
          0%   { opacity: 0; transform: translate(0, 0) scale(1); }
          15%  { opacity: 0.55; }
          50%  { opacity: 0.3; transform: translate(3px, -18px) scale(1.4); }
          100% { opacity: 0; transform: translate(5px, -32px) scale(0.4); }
        }
        @keyframes ifR3 {
          0%   { opacity: 0; transform: translate(0, 0) scale(1); }
          15%  { opacity: 0.6; }
          50%  { opacity: 0.35; transform: translate(4px, -14px) scale(1.6); }
          100% { opacity: 0; transform: translate(2px, -28px) scale(0.3); }
        }
        @keyframes ifR4 {
          0%   { opacity: 0; transform: translate(0, 0) scale(1); }
          15%  { opacity: 0.5; }
          50%  { opacity: 0.25; transform: translate(-3px, -20px) scale(1.3); }
          100% { opacity: 0; transform: translate(-5px, -34px) scale(0.4); }
        }
        @keyframes ifR5 {
          0%   { opacity: 0; transform: translate(0, 0) scale(1); }
          15%  { opacity: 0.55; }
          50%  { opacity: 0.3; transform: translate(2px, -17px) scale(1.4); }
          100% { opacity: 0; transform: translate(-3px, -31px) scale(0.5); }
        }
      `}</style>
    </div>
  );
};

export default IntroAnimation;
