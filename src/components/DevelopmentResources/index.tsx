import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lightbulb, BookOpen, ExternalLink, Rocket } from 'lucide-react';
import StackModal from './StackModal';
import { TECH_STACKS } from './stackData';
import './dev.css';

// ─── Resource sections data ───────────────────────────────────────────────────
const SECTIONS = [
    {
        title: "Getting Started",
        description: "Essential resources for those just beginning their development journey.",
        icon: <BookOpen size={28} style={{ color: '#facc15' }} />,
        resources: [
            { name: "FreeCodeCamp", url: "https://www.freecodecamp.org/", description: "Comprehensive interactive coding lessons and certifications." },
            { name: "MDN Web Docs", url: "https://developer.mozilla.org/", description: "The definitive documentation for web technologies." },
            { name: "JavaScript.info", url: "https://javascript.info/", description: "Deep dive into JavaScript with modern tutorials." },
            { name: "Codecademy", url: "https://www.codecademy.com/", description: "Interactive platform for learning various programming languages." },
        ],
    },
    {
        title: "Ideas & Inspiration",
        description: "Find your next big project idea and get inspired by world-class designs.",
        icon: <Lightbulb size={28} style={{ color: '#facc15' }} />,
        resources: [
            { name: "Frontend Mentor", url: "https://www.frontendmentor.io/", description: "Improve your front-end skills by building real projects." },
            { name: "Dribbble (Development)", url: "https://dribbble.com/tags/development", description: "Discover stunning UI/UX designs to replicate or learn from." },
            { name: "Awwwards", url: "https://www.awwwards.com/", description: "Showcasing the talent and effort of the world's best web designers." },
            { name: "Build Your Own X", url: "https://github.com/codecrafters-io/build-your-own-x", description: "Step-by-step guides to building complex systems from scratch." },
        ],
    },
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
                    <div className="dev-hero-badge">Development</div>
                    <h1 className="dev-h1">
                        Dev <span className="dev-h1-accent">Hub</span>
                    </h1>
                    <p className="dev-header-tagline">
                        Tech stacks, starter links, and inspiration — all in one place.
                    </p>
                    <p className="dev-header-sub">
                        Curated resources for modern development. Whether you're writing your first line of code or looking for advanced inspiration, we've got you covered.
                    </p>
                </div>
            </header>

            {/* ── Main — dark tech ── */}
            <main className="dev-main">
                <div className="dev-main-inner">

                    {/* ── Tech Stacks section ── */}
                    <section style={{ marginBottom: '5rem' }}>
                        <div className="dev-section-hdr">
                            <Lightbulb size={28} style={{ color: '#facc15', flexShrink: 0 }} />
                            <div className="dev-section-hdr-text">
                                <h2>Tech Stacks You Can Choose</h2>
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
                                        <div className="dev-stack-card-top">
                                            <span className="dev-stack-name">{stack.name}</span>
                                            <Rocket size={20} style={{ color: 'rgba(255,255,255,.18)', flexShrink: 0 }} />
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

                    {/* ── Resource sections ── */}
                    {SECTIONS.map((section, idx) => (
                        <section key={idx} className="dev-resources-section">
                            <div className="dev-section-hdr">
                                {section.icon}
                                <div className="dev-section-hdr-text">
                                    <h2>{section.title}</h2>
                                    <p>{section.description}</p>
                                </div>
                            </div>

                            <div className="dev-res-grid">
                                {section.resources.map((res, rIdx) => (
                                    <a
                                        key={rIdx}
                                        href={res.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="dev-res-card"
                                    >
                                        <div className="dev-res-card-top">
                                            <span className="dev-res-card-name">{res.name}</span>
                                            <div className="dev-res-card-icon">
                                                <ExternalLink size={14} />
                                            </div>
                                        </div>
                                        <p className="dev-res-card-desc">{res.description}</p>
                                    </a>
                                ))}
                            </div>
                        </section>
                    ))}

                </div>
            </main>

            {/* ── CTA banner ── */}
            <section className="dev-cta">
                <div className="dev-cta-inner">
                    <h2>Have a great resource?</h2>
                    <p>Share it with the community and help fellow developers grow.</p>
                    <button className="dev-cta-btn">Suggest a Link</button>
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