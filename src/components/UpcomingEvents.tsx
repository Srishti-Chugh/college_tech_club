import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  url: string;
  tag: string;
  highlight: boolean;
  image?: string;          // ← optional: add in events.json to override fallback
  description: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return {
    day: d.getDate().toString().padStart(2, '0'),
    month: d.toLocaleString('en', { month: 'short' }).toUpperCase(),
    weekday: d.toLocaleString('en', { weekday: 'short' }).toUpperCase(),
    full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
  };
}

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr); target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

// Fallback images used ONLY when no "image" field is set in events.json
const FALLBACK_IMAGES: Record<string, string> = {
  'Contest': 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'Hackathon': 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
  'Society Event': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80',
  'Deadline': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
};

function getImage(event: Event): string {
  return event.image || FALLBACK_IMAGES[event.type] || FALLBACK_IMAGES['Contest'];
}

// Accent colours per type
const TYPE_ACCENT: Record<string, { bg: string; text: string }> = {
  'Contest': { bg: '#4f46e5', text: '#fff' },
  'Hackathon': { bg: '#facc15', text: '#000' },
  'Society Event': { bg: '#fff', text: '#000' },
  'Deadline': { bg: '#000', text: '#facc15' },
};

const UpcomingEvents: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    fetch('/events.json')
      .then(r => r.json())
      .then((data: Event[]) => {
        const upcoming = data
          .filter(e => daysUntil(e.date) >= 0)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 4);
        setEvents(upcoming);
      })
      .catch(() => setEvents([]));
  }, []);

  const [hero, ...rest] = events;

  return (
    <section className="py-20 bg-[#f8f8f8]">
      <div className="container mx-auto px-6">

        {/* Section header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/30 mb-2">
              — Contests · Hackathons · Events
            </p>
            <h2 className="text-4xl font-black uppercase">On Our Radar</h2>
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {events.length === 0 ? (
          <p className="text-black/30 text-center italic py-12 font-medium">
            No upcoming events right now — check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

            {/* ── HERO CARD ── */}
            {hero && (() => {
              const accent = TYPE_ACCENT[hero.type] ?? TYPE_ACCENT['Contest'];
              const { day, month, weekday } = formatDate(hero.date);
              const days = daysUntil(hero.date);

              return (
                <div
                  className="lg:col-span-5 relative rounded-[32px] overflow-hidden cursor-pointer group"
                  style={{ minHeight: 520 }}
                  onClick={() => hero.url && window.open(hero.url, '_blank')}
                >
                  <img
                    src={getImage(hero)}
                    alt={hero.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

                  {/* Top row */}
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                      style={{ background: accent.bg, color: accent.text }}
                    >
                      {hero.type}
                    </span>
                    <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Clock size={10} className="text-white/70" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
                        {weekday} · {day} {month}
                      </span>
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    {days === 0 && <span className="inline-block text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-3">● Today</span>}
                    {days === 1 && <span className="inline-block text-[10px] font-black uppercase tracking-widest text-yellow-400 mb-3">● Tomorrow</span>}
                    {days > 1 && days <= 7 && <span className="inline-block text-[10px] font-black uppercase tracking-widest text-white/50 mb-3">● In {days} days</span>}

                    <div className="flex items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-widest text-white/50">
                      <span className="px-2 py-0.5 rounded" style={{ background: accent.bg, color: accent.text, fontSize: '9px' }}>
                        {hero.tag}
                      </span>
                      <span>{hero.time}</span>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-black uppercase leading-tight text-white mb-5 group-hover:text-yellow-400 transition-colors duration-300">
                      {hero.title}
                    </h3>

                    {hero.url && (
                      <button className="bg-white text-black px-5 py-2.5 rounded-full flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:bg-yellow-400 transition-colors">
                        Register Now
                        <div className="bg-black rounded-full p-1">
                          <ArrowUpRight size={12} className="text-white" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── RIGHT COLUMN — 3 stacked ── */}
            <div className="lg:col-span-7 grid grid-cols-1 gap-5">
              {rest.map(event => {
                const accent = TYPE_ACCENT[event.type] ?? TYPE_ACCENT['Contest'];
                const { day, month, weekday } = formatDate(event.date);
                const days = daysUntil(event.date);

                return (
                  <div
                    key={event.id}
                    className="grid grid-cols-12 gap-0 rounded-[24px] overflow-hidden cursor-pointer group hover:-translate-y-0.5 transition-transform duration-300 bg-white shadow-sm"
                    style={{ borderLeft: event.highlight ? '3px solid #facc15' : '3px solid transparent' }}
                    onClick={() => event.url && window.open(event.url, '_blank')}
                  >
                    {/* Image */}
                    <div className="col-span-4 relative overflow-hidden" style={{ minHeight: 148 }}>
                      <img
                        src={getImage(event)}
                        alt={event.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="text-sm font-black uppercase tracking-widest text-center px-2 leading-tight text-white">
                          {event.type}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="col-span-8 flex flex-col justify-between p-5">
                      <div>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span
                            className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                            style={{ background: accent.bg, color: accent.text }}
                          >
                            {event.type}
                          </span>
                          <span className="text-[10px] text-black/30 font-black uppercase tracking-widest flex items-center gap-1">
                            <Clock size={9} /> {event.time}
                          </span>
                          <span className="text-[10px] text-black/25 font-black uppercase tracking-widest">
                            {day} {month}
                          </span>
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-tight leading-snug text-black group-hover:text-indigo-600 transition-colors mb-2 line-clamp-3">
                          {event.title}
                        </h3>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                          <span className="text-black/70 group-hover:text-black">View</span>
                          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
                            <ArrowUpRight size={11} />
                          </div>
                        </button>
                        <div className="text-right">
                          {days === 0 && <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Today</span>}
                          {days === 1 && <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">Tomorrow</span>}
                          {days > 1 && days <= 7 && <span className="text-[10px] font-black uppercase tracking-widest text-black/40">in {days} days</span>}
                          {days > 7 && <span className="text-[10px] font-black uppercase tracking-widest text-black/25">{weekday} · {day} {month}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* View All */}
        <div className="mt-10 text-center">
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 bg-black text-white text-xs font-black uppercase tracking-widest px-8 py-4 rounded-full hover:bg-yellow-400 hover:text-black transition-all duration-300 group"
          >
            View All Events &amp; Contests
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default UpcomingEvents;