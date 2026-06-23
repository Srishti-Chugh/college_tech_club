import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';

const CATEGORIES: Category[] = [
  { id: '1', name: 'Competitive Programming', imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500' },
  { id: '2', name: 'Machine Learning', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?auto=format&fit=crop&q=80&w=500' },
  { id: '3', name: 'Development', imageUrl: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&q=80&w=500' },
  { id: '4', name: 'Research', imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=500' },
];

const OurTracks: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const total = CATEGORIES.length;

  const prev = () => setActive(i => (i - 1 + total) % total);
  const next = () => setActive(i => (i + 1) % total);

  const handleTrackClick = (name: string) => {
    if (name === 'Development') navigate('/resources/development');
    else if (name === 'Competitive Programming') navigate('/resources/cp-roadmap');
    else if (name === 'Machine Learning') navigate('/ml/blog2code');
  };

  // Returns position offset from active: -2, -1, 0, 1, 2
  const getOffset = (idx: number) => {
    let offset = idx - active;
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    return offset;
  };

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/30 mb-2">— Explore</p>
            <h2 className="text-4xl font-black uppercase">Our Tracks</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={prev}
              className="w-10 h-10 border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative flex items-center justify-center" style={{ height: 460 }}>
          {CATEGORIES.map((cat, idx) => {
            const offset = getOffset(idx);
            const isCenter = offset === 0;
            const isHidden = Math.abs(offset) > 1;

            // Position & style based on offset
            const translateX = offset * 80; // % shift per step
            const scale = isCenter ? 1 : 0.82;
            const zIndex = isCenter ? 10 : Math.abs(offset) === 1 ? 5 : 0;
            const opacity = isHidden ? 0 : 1;
            const blur = isCenter ? 0 : 1.5;

            return (
              <div
                key={cat.id}
                onClick={() => isCenter ? handleTrackClick(cat.name) : (offset < 0 ? prev() : next())}
                style={{
                  position: 'absolute',
                  width: isCenter ? '44%' : '40%',
                  height: isCenter ? 420 : 340,
                  transform: `translateX(${translateX}%) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: blur ? `blur(${blur}px)` : 'none',
                  transition: 'all 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  cursor: isCenter ? 'pointer' : 'pointer',
                }}
                className="rounded-3xl overflow-hidden shadow-2xl group"
              >
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient overlay — stronger on center */}
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{
                    background: isCenter
                      ? 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)'
                      : 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.4) 100%)',
                  }}
                />

                {/* Content — only fully visible on center */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-7 transition-all duration-300"
                  style={{ opacity: isCenter ? 1 : 0.4 }}
                >
                  {isCenter && (
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
                      Track
                    </p>
                  )}
                  <h3 className="text-white font-black uppercase leading-snug"
                    style={{ fontSize: isCenter ? '1.4rem' : '1rem' }}
                  >
                    {cat.name}
                  </h3>
                  {isCenter && (
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center">
                        <ArrowUpRight size={14} className="text-black" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/70">
                        Explore
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {CATEGORIES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: idx === active ? 24 : 6,
                height: 6,
                background: idx === active ? '#000' : '#00000025',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default OurTracks;