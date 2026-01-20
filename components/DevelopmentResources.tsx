
import React, { useEffect } from 'react';
import { ExternalLink, BookOpen, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const DevelopmentResources: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const sections = [
        {
            title: "Getting Started",
            description: "Essential resources for those just beginning their development journey.",
            icon: <BookOpen className="text-yellow-400" size={32} />,
            resources: [
                {
                    name: "FreeCodeCamp",
                    url: "https://www.freecodecamp.org/",
                    description: "Comprehensive interactive coding lessons and certifications."
                },
                {
                    name: "MDN Web Docs",
                    url: "https://developer.mozilla.org/",
                    description: "The definitive documentation for web technologies."
                },
                {
                    name: "JavaScript.info",
                    url: "https://javascript.info/",
                    description: "Deep dive into the JavaScript language with modern tutorials."
                },
                {
                    name: "Codecademy",
                    url: "https://www.codecademy.com/",
                    description: "Interactive platform for learning various programming languages."
                }
            ]
        },
        {
            title: "Ideas & Inspiration",
            description: "Find your next big project idea and get inspired by world-class designs.",
            icon: <Lightbulb className="text-yellow-400" size={32} />,
            resources: [
                {
                    name: "Frontend Mentor",
                    url: "https://www.frontendmentor.io/",
                    description: "Improve your front-end skills by building real projects."
                },
                {
                    name: "Dribbble (Development)",
                    url: "https://dribbble.com/tags/development",
                    description: "Discover stunning UI/UX designs to replicate or learn from."
                },
                {
                    name: "Awwwards",
                    url: "https://www.awwwards.com/",
                    description: "Showcasing the talent and effort of the world's best web designers."
                },
                {
                    name: "Build Your Own X",
                    url: "https://github.com/codecrafters-io/build-your-own-x",
                    description: "Step-by-step guides to building complex systems from scratch."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <header className="bg-black text-white pt-32 pb-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <Link
                        to="/"
                        className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-yellow-400 transition-colors mb-8"
                    >
                        <ArrowLeft size={16} />
                        <span>Back to Home</span>
                    </Link>
                    <h1 className="text-6xl md:text-8xl font-black uppercase leading-none mb-6">
                        Dev <span className="text-white/20 outline-text">Hub</span>
                    </h1>
                    <p className="text-xl text-white/60 max-w-2xl font-medium">
                        Curated resources for modern development. Whether you're writing your first line of code or looking for advanced inspiration, we've got you covered.
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="py-20 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 gap-24">
                        {sections.map((section, idx) => (
                            <section key={idx}>
                                <div className="flex items-center space-x-4 mb-10 border-b-4 border-black pb-4">
                                    {section.icon}
                                    <div>
                                        <h2 className="text-4xl font-black uppercase tracking-tight">{section.title}</h2>
                                        <p className="text-black/50 font-medium italic">{section.description}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {section.resources.map((resource, resIdx) => (
                                        <a
                                            key={resIdx}
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group bg-neutral-50 p-8 rounded-2xl border-2 border-transparent hover:border-black transition-all duration-300 shadow-sm"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <h3 className="text-2xl font-bold group-hover:text-yellow-500 transition-colors uppercase italic tracking-tighter">
                                                    {resource.name}
                                                </h3>
                                                <div className="bg-black text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <ExternalLink size={16} />
                                                </div>
                                            </div>
                                            <p className="text-black/70 font-medium leading-relaxed">
                                                {resource.description}
                                            </p>
                                        </a>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                </div>
            </main>

            {/* Suggestion CTA */}
            <section className="bg-yellow-400 py-16 px-6 text-center">
                <div className="container mx-auto max-w-3xl">
                    <h2 className="text-3xl font-black uppercase mb-4">Have a great resource?</h2>
                    <p className="text-black font-bold mb-8">Share it with the community and help fellow developers grow.</p>
                    <button className="bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-transform">
                        Suggest a Link
                    </button>
                </div>
            </section>
        </div>
    );
};

export default DevelopmentResources;
