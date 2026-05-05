import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink, Calendar, Search, ChevronDown, ChevronUp, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Event {
    id: number;
    title: string;
    type: string;
    date: string;
    time: string;
    url: string;
    tag: string;
    highlight: boolean;
    image?: string;
    description: string;
}

type FilterType = 'All' | 'Contest' | 'Hackathon' | 'Society Event' | 'Deadline';

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

function groupByMonth(events: Event[]): [string, Event[]][] {
    const map: Record<string, Event[]> = {};
    events.forEach(e => {
        const key = new Date(e.date).toLocaleString('en', { month: 'long', year: 'numeric' });
        if (!map[key]) map[key] = [];
        map[key].push(e);
    });
    return Object.entries(map);
}

// Fallback images — used only when no "image" field in events.json
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

// ─── Event Card ───────────────────────────────────────────────────────────────
const EventCard: React.FC<{ event: Event; past?: boolean }> = ({ event, past = false }) => {
    const accent = TYPE_ACCENT[event.type] ?? TYPE_ACCENT['Contest'];
    const { day, month, weekday } = formatDate(event.date);
    const days = daysUntil(event.date);

    return (
        <div
            className={`rounded-2xl overflow-hidden shadow-sm cursor-pointer group transition-all duration-300 bg-white ${past ? '' : 'hover:-translate-y-1 hover:shadow-xl'}`}
            style={{ borderLeft: event.highlight ? '3px solid #facc15' : '3px solid transparent' }}
            onClick={() => !past && event.url && window.open(event.url, '_blank')}
        >
            {/* Image banner — same as UpcomingEvents cards */}
            <div className="relative h-40 overflow-hidden">
                <img
                    src={getImage(event)}
                    alt={event.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ${past ? '' : 'group-hover:scale-105'}`}
                    style={{ filter: past ? 'grayscale(60%) brightness(0.7)' : undefined }}
                />
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Type badge — top left over image */}
                <span
                    className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full"
                    style={{ background: accent.bg, color: accent.text }}
                >
                    {event.type}
                </span>

                {/* Date — top right over image */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Clock size={9} className="text-white/70" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/90">
                        {weekday} · {day} {month}
                    </span>
                </div>

                {/* Urgency — bottom left over image */}
                <div className="absolute bottom-3 left-3">
                    {!past && days === 0 && <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400">● Today</span>}
                    {!past && days === 1 && <span className="text-[9px] font-black uppercase tracking-widest text-yellow-400">● Tomorrow</span>}
                    {!past && days > 1 && days <= 7 && <span className="text-[9px] font-black uppercase tracking-widest text-white/60">● In {days} days</span>}
                    {past && <span className="text-[9px] font-black uppercase tracking-widest text-white/40">● Past</span>}
                </div>
            </div>

            {/* Card body */}
            <div className="p-5">
                {/* Tag dot row */}
                <div className="flex items-center gap-1.5 mb-2">
                    <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: accent.bg === '#fff' ? '#000' : accent.bg }}
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/30">{event.tag}</span>
                </div>

                {/* Title */}
                <h3 className={`text-sm font-black uppercase tracking-tight leading-snug mb-3 transition-colors line-clamp-2 ${past ? 'text-black/40' : 'text-black group-hover:text-indigo-600'}`}>
                    {event.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-black/40 leading-relaxed line-clamp-2 mb-4">
                    {event.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between pt-3 border-t border-black/06">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/25">{event.time}</span>

                    {!past && event.url && (
                        <div className="flex items-center gap-1.5 bg-black/05 px-3 py-1.5 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                            <ExternalLink size={10} className="text-black/30 group-hover:text-white transition-colors" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-black/30 group-hover:text-white transition-colors">Open</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
const EventsPage: React.FC = () => {
    const [allEvents, setAllEvents] = useState<Event[]>([]);
    const [filter, setFilter] = useState<FilterType>('All');
    const [search, setSearch] = useState('');
    const [showPast, setShowPast] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch('/events.json')
            .then(r => r.json())
            .then((data: Event[]) => {
                setAllEvents([...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const upcoming = allEvents.filter(e => daysUntil(e.date) >= 0);
    const past = allEvents.filter(e => daysUntil(e.date) < 0);

    const applyFilters = (list: Event[]) =>
        list.filter(e => {
            const matchType = filter === 'All' || e.type === filter;
            const matchSearch = !search ||
                e.title.toLowerCase().includes(search.toLowerCase()) ||
                e.tag.toLowerCase().includes(search.toLowerCase()) ||
                e.description.toLowerCase().includes(search.toLowerCase());
            return matchType && matchSearch;
        });

    const filtered = applyFilters(upcoming);
    const filteredPast = applyFilters(past);
    const grouped = groupByMonth(filtered);

    const counts: Record<FilterType, number> = {
        All: upcoming.length,
        Contest: upcoming.filter(e => e.type === 'Contest').length,
        Hackathon: upcoming.filter(e => e.type === 'Hackathon').length,
        'Society Event': upcoming.filter(e => e.type === 'Society Event').length,
        Deadline: upcoming.filter(e => e.type === 'Deadline').length,
    };

    return (
        <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* ── HERO ── */}
            <header className="bg-black text-white pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 hover:text-yellow-400 transition-colors mb-8"
                    >
                        <ArrowLeft size={14} /> Back to Home
                    </Link>

                    <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">
                        — Tech Club · {new Date().getFullYear()}
                    </p>

                    <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tight mb-6">
                        On Our{' '}
                        <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)', color: 'transparent' }}>
                            Radar
                        </span>
                    </h1>

                    <p className="text-lg text-white/50 max-w-xl font-medium leading-relaxed mb-10">
                        Contests, hackathons, society workshops and key deadlines — everything worth marking in your calendar, curated weekly.
                    </p>

                    <div className="flex gap-10 flex-wrap">
                        {[
                            { label: 'Upcoming', val: upcoming.length },
                            { label: 'Contests', val: counts.Contest },
                            { label: 'Hackathons', val: counts.Hackathon },
                            { label: 'Society Events', val: counts['Society Event'] },
                        ].map(s => (
                            <div key={s.label}>
                                <div className="text-3xl font-black text-yellow-400 leading-none">{s.val}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-white/30 mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── STICKY FILTER BAR ── */}
            <div className="sticky top-0 z-40 bg-white border-b-4 border-black">
                <div className="container mx-auto max-w-6xl px-6 py-3 flex items-center gap-3 flex-wrap">
                    <div className="flex gap-2 flex-wrap flex-1">
                        {(['All', 'Contest', 'Hackathon', 'Society Event', 'Deadline'] as FilterType[]).map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 transition-all
                  ${filter === f ? 'bg-black text-white border-black' : 'bg-white text-black/40 border-black/15 hover:border-black/40 hover:text-black'}`}
                            >
                                {f}
                                <span className={`text-[9px] px-1.5 py-px rounded-full ${filter === f ? 'bg-white/15 text-white' : 'bg-black/07 text-black/40'}`}>
                                    {counts[f]}
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/30" />
                        <input
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search…"
                            className="bg-neutral-100 rounded-full pl-8 pr-4 py-1.5 text-xs font-medium outline-none w-36 focus:w-48 transition-all focus:ring-2 focus:ring-black/10"
                        />
                    </div>
                </div>
            </div>

            {/* ── MAIN ── */}
            <main className="container mx-auto max-w-6xl px-6 py-14 pb-24">

                {loading && (
                    <div className="text-center py-20 text-black/30">
                        <div className="text-sm font-black uppercase tracking-widest">Loading events…</div>
                    </div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20">
                        <Calendar size={48} className="mx-auto mb-4 text-black/15" />
                        <p className="text-sm font-black uppercase tracking-widest text-black/30">No events found</p>
                        <p className="text-sm text-black/30 mt-1 italic font-medium">Try a different filter or search term.</p>
                    </div>
                )}

                {/* Grouped by month */}
                {grouped.map(([month, monthEvents]) => (
                    <div key={month} className="mb-14">
                        <div className="flex items-baseline justify-between border-b-4 border-black pb-3 mb-8">
                            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight leading-none">{month}</h2>
                            <span className="text-[10px] font-black uppercase tracking-widest text-black/25">
                                {monthEvents.length} event{monthEvents.length !== 1 ? 's' : ''}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {monthEvents.map(event => (
                                <EventCard key={event.id} event={event} />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Past events */}
                {past.length > 0 && (
                    <div className="mt-8 border-t-2 border-black/08 pt-8">
                        <button
                            onClick={() => setShowPast(!showPast)}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black/30 hover:text-black transition-colors mb-6"
                        >
                            {showPast ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            {showPast ? 'Hide' : 'Show'} Past Events ({filteredPast.length})
                        </button>

                        {showPast && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                                {filteredPast.map(event => (
                                    <EventCard key={event.id} event={event} past />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Manager note */}
                <div className="mt-16 p-6 bg-neutral-50 border-2 border-black/06 rounded-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/30 mb-1">Website Managers</p>
                    <p className="text-sm font-medium text-black/50 leading-relaxed">
                        To update events, edit{' '}
                        <code className="bg-black/06 px-1.5 py-0.5 rounded text-xs font-mono">public/events.json</code>.
                        Add an <code className="bg-black/06 px-1.5 py-0.5 rounded text-xs font-mono">"image"</code> field
                        with any image URL to set a custom cover photo. If omitted, a default image for that event type is used automatically.
                        No code changes needed — the site redeploys automatically.
                    </p>
                </div>
            </main>
        </div>
    );
};

export default EventsPage;