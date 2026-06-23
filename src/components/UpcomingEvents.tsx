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
      <div className="container mx-auto px-8 md:px-16 lg:px-28">

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((event, idx) => {
              const accent = TYPE_ACCENT[event.type] ?? TYPE_ACCENT['Contest'];
              const { day, month, weekday } = formatDate(event.date);
              const days = daysUntil(event.date);
              // Top row (0,1): text LEFT, image RIGHT — Bottom row (2,3): image LEFT, text RIGHT
              const imageRight = idx < 2;

              const textPanel = (
                <div className="flex flex-col justify-between p-8 bg-white group-hover:bg-[#fafafa] transition-colors" style={{ minHeight: 260 }}>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-3">
                      {event.type}
                    </p>
                    <h3 className="text-xl font-black uppercase leading-snug text-black mb-3 group-hover:text-indigo-600 transition-colors line-clamp-3">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-sm text-black/40 leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/30 flex items-center gap-1">
                        <Clock size={9} /> {event.time} · {weekday} {day} {month}
                      </span>
                      {days === 0 && <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">● Today</span>}
                      {days === 1 && <span className="text-[10px] font-black uppercase tracking-widest text-yellow-500">● Tomorrow</span>}
                      {days > 1 && days <= 7 && <span className="text-[10px] font-black uppercase tracking-widest text-black/40">● In {days} days</span>}
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); event.url && window.open(event.url, '_blank'); }}
                      className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{ background: accent.bg }}
                    >
                      <ArrowUpRight size={16} style={{ color: accent.text }} />
                    </button>
                  </div>
                </div>
              );

              const imagePanel = (
                <div className="relative overflow-hidden" style={{ minHeight: 260 }}>
                  <img
                    src={getImage(event)}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  {event.highlight && (
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full bg-yellow-400 text-black">
                        Featured
                      </span>
                    </div>
                  )}
                  <div className="absolute bottom-4 left-4">
                    <span
                      className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full"
                      style={{ background: accent.bg, color: accent.text }}
                    >
                      {event.tag || event.type}
                    </span>
                  </div>
                </div>
              );

              return (
                <div
                  key={event.id}
                  className="group grid grid-cols-2 cursor-pointer rounded-[24px] overflow-hidden border border-black/10 hover:border-black/20 hover:shadow-md transition-all duration-300"
                  onClick={() => event.url && window.open(event.url, '_blank')}
                >
                  {imageRight ? (
                    <>{textPanel}{imagePanel}</>
                  ) : (
                    <>{imagePanel}{textPanel}</>
                  )}
                </div>
              );
            })}
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