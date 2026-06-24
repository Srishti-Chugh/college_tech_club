import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, BookOpen, ExternalLink, Rocket, Globe, Coffee, Cpu } from 'lucide-react';
import StackModal from './StackModal';
import { TECH_STACKS } from './stackData';
import './dev.css';

// Stack icons map
const STACK_ICONS: Record<string, React.ReactNode> = {
    'MERN Stack': <Globe size={32} style={{ color: '#4ade80' }} />,
    'Python': <Cpu size={32} style={{ color: '#60a5fa' }} />,
    'Spring Boot': <Coffee size={32} style={{ color: '#fb923c' }} />,
};

// ─── Resource sections data ───────────────────────────────────────────────────
const GETTING_STARTED = [
    { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/", description: "Comprehensive interactive coding lessons and certifications.", favicon: "https://www.freecodecamp.org/icons/icon-96x96.png", color: "#0a0a23" },
    { name: "MDN Web Docs", url: "https://developer.mozilla.org/", description: "The definitive documentation for web technologies.", favicon: "https://developer.mozilla.org/favicon-48x48.png", color: "#1d1d1d" },
    { name: "JavaScript.info", url: "https://javascript.info/", description: "Deep dive into JavaScript with modern tutorials.", favicon: "https://javascript.info/img/favicon/favicon.png", color: "#f7df1e" },
    { name: "Codecademy", url: "https://www.codecademy.com/", description: "Interactive platform for learning various programming languages.", favicon: "https://www.codecademy.com/favicon.ico", color: "#1f4056" },
];

const IDEAS_INSPIRATION = [
    { name: "Frontend Mentor", url: "https://www.frontendmentor.io/", description: "Improve your front-end skills by building real projects.", favicon: "https://www.frontendmentor.io/static/images/favicon-32x32.png", color: "#3e54a3" },
    { name: "Dribbble", url: "https://dribbble.com/tags/development", description: "Discover stunning UI/UX designs to replicate or learn from.", favicon: "https://cdn.dribbble.com/assets/favicon-b38525134603b9513174ec887944bde1a869eb6cd414f4d640ee48ab2a15a26b.ico", color: "#ea4c89" },
    { name: "Awwwards", url: "https://www.awwwards.com/", description: "Showcasing the talent and effort of the world's best web designers.", favicon: "https://www.awwwards.com/apple-touch-icon.png", color: "#111" },
    { name: "Build Your Own X", url: "https://github.com/codecrafters-io/build-your-own-x", description: "Step-by-step guides to building complex systems from scratch.", favicon: "https://github.githubassets.com/favicons/favicon.png", color: "#24292f" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
const DevelopmentResources: React.FC = () => {
    useEffect(() => { window.scrollTo(0, 0); }, []);

    const [selectedStack, setSelectedStack] = useState<number | null>(null);

    return (
        <div className="dev-root">

            {/* ── Header — white magazine ── */}
            <header className="dev-header">
                <Link to="/" className="dev-back dev-back-corner">
                    <ArrowLeft size={14} />
                    Back to Home
                </Link>
                <div className="dev-header-inner">
                    <div className="dev-hero-badge">Development Track</div>
                    <h1 className="dev-h1">
                        Dev <span className="dev-h1-accent">Hub</span>
                    </h1>
                    <p className="dev-header-tagline">
                        Tech stacks, starter links, and inspiration — all in one place.
                    </p>
                    <p className="dev-header-sub">
                        Curated resources for modern development. Whether you're writing your first line of code or looking for advanced inspiration, we've got you covered.
                    </p>
                    {/* Stats row */}
                    <div className="dev-hero-stats">
                        <div className="dev-hero-stat">
                            <span className="dev-hero-stat-num">3</span>
                            <span className="dev-hero-stat-label">Tech Stacks</span>
                        </div>
                        <div className="dev-hero-stat-divider" />
                        <div className="dev-hero-stat">
                            <span className="dev-hero-stat-num">8+</span>
                            <span className="dev-hero-stat-label">Curated Resources</span>
                        </div>
                        <div className="dev-hero-stat-divider" />
                        <div className="dev-hero-stat">
                            <span className="dev-hero-stat-num">∞</span>
                            <span className="dev-hero-stat-label">Project Ideas</span>
                        </div>
                    </div>
                    {/* Tech pill row */}
                    <div className="dev-hero-pills">
                        {['React', 'Node.js', 'Python', 'Django', 'Spring Boot', 'MongoDB', 'Docker', 'TypeScript'].map(t => (
                            <span key={t} className="dev-hero-pill">{t}</span>
                        ))}
                    </div>
                </div>
            </header>

            {/* ── Main — dark tech ── */}
            <main className="dev-main">
                <div className="dev-main-inner">

                    {/* ── Tech Stacks section ── */}
                    <section className="dev-stacks-section">
                        <div className="dev-section-hdr">
                            <Rocket size={28} style={{ color: '#a78bfa', flexShrink: 0 }} />
                            <div className="dev-section-hdr-text">
                                <h2 style={{ color: '#a78bfa' }}>Tech Stacks You Can Choose</h2>
                                <p>Popular paths to start your development journey.</p>
                            </div>
                        </div>

                        <div className="dev-stacks-grid">
                            {TECH_STACKS.map((stack, idx) => (
                                <button
                                    key={idx}
                                    className="dev-stack-card"
                                    onClick={() => setSelectedStack(idx)}
                                >
                                    <div>
                                        <div className="dev-stack-icon-wrap">
                                            {STACK_ICONS[stack.name] ?? <Rocket size={32} style={{ color: '#facc15' }} />}
                                        </div>
                                        <div className="dev-stack-card-top">
                                            <span className="dev-stack-name">{stack.name}</span>
                                        </div>
                                        <p className="dev-stack-desc">{stack.description}</p>
                                        <div className="dev-stack-tags">
                                            {stack.tags.map(tag => (
                                                <span key={tag} className="dev-stack-tag">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="dev-stack-cta">
                                        <span>Click to Explore</span>
                                        <div className="dev-stack-cta-line" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* ── Resources section ── */}
                    <section className="dev-resources-section">
                        <div className="dev-section-hdr">
                            <BookOpen size={28} style={{ color: '#facc15', flexShrink: 0 }} />
                            <div className="dev-section-hdr-text">
                                <h2>Resources</h2>
                                <p>Handpicked links for learning and creative fuel.</p>
                            </div>
                        </div>

                        {/* Sub-section: Getting Started */}
                        <div className="dev-res-sub-label">
                            <span className="dev-res-sub-dot" style={{ background: '#60a5fa' }} />
                            <h3 className="dev-res-sub-heading">Getting Started</h3>
                            <span className="dev-res-sub-desc">Essential resources for those just beginning their development journey.</span>
                        </div>
                        <div className="dev-res-grid-8" style={{ marginBottom: '2.5rem' }}>
                            {GETTING_STARTED.map((res, rIdx) => (
                                <a key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                                    className="dev-res-card-v2"
                                    style={{ '--card-accent': res.color } as React.CSSProperties}
                                >
                                    <div className="dev-res-card-v2-top">
                                        <img src={res.favicon} alt={res.name} className="dev-res-favicon"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                        <div className="dev-res-card-icon"><ExternalLink size={13} /></div>
                                    </div>
                                    <span className="dev-res-card-name">{res.name}</span>
                                    <p className="dev-res-card-desc">{res.description}</p>
                                </a>
                            ))}
                        </div>

                        {/* Sub-section: Ideas & Inspiration */}
                        <div className="dev-res-sub-label">
                            <span className="dev-res-sub-dot" style={{ background: '#f472b6' }} />
                            <h3 className="dev-res-sub-heading">Ideas &amp; Inspiration</h3>
                            <span className="dev-res-sub-desc">Find your next big project idea and get inspired by world-class designs.</span>
                        </div>
                        <div className="dev-res-grid-8">
                            {IDEAS_INSPIRATION.map((res, rIdx) => (
                                <a key={rIdx} href={res.url} target="_blank" rel="noopener noreferrer"
                                    className="dev-res-card-v2"
                                    style={{ '--card-accent': res.color } as React.CSSProperties}
                                >
                                    <div className="dev-res-card-v2-top">
                                        <img src={res.favicon} alt={res.name} className="dev-res-favicon"
                                            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                        <div className="dev-res-card-icon"><ExternalLink size={13} /></div>
                                    </div>
                                    <span className="dev-res-card-name">{res.name}</span>
                                    <p className="dev-res-card-desc">{res.description}</p>
                                </a>
                            ))}
                        </div>
                    </section>

                </div>
            </main>

            {/* ── System Design — Coming Soon ── */}
            <section className="dev-sysdesign">
                <div className="dev-sysdesign-inner">
                    <div className="dev-sysdesign-badge">Coming Soon</div>
                    <h2 className="dev-sysdesign-h2">
                        System Design <span className="dev-sysdesign-accent">Blueprints</span>
                    </h2>
                    <p className="dev-sysdesign-desc">
                        Deep-dive, interactive flowcharts of how the world's top companies actually build their systems — Netflix's CDN, Uber's dispatch engine, Twitter's fan-out, and more. Step through each architecture layer, zoom into components, and understand the tradeoffs engineers made at scale.
                    </p>
                    <div className="dev-sysdesign-companies">
                        {['Netflix', 'Uber', 'Twitter / X', 'WhatsApp', 'YouTube', 'Amazon', 'Airbnb', 'Spotify'].map(c => (
                            <span key={c} className="dev-sysdesign-company">{c}</span>
                        ))}
                    </div>
                    <div className="dev-sysdesign-cta">
                        <div className="dev-sysdesign-cta-dot" />
                        <span>Interactive playground-style walkthroughs — in progress</span>
                    </div>
                </div>
            </section>

            {/* ── Stack modal ── */}
            {selectedStack !== null && (
                <StackModal
                    stack={TECH_STACKS[selectedStack]}
                    onClose={() => setSelectedStack(null)}
                />
            )}

        </div>
    );
};

export default DevelopmentResources;