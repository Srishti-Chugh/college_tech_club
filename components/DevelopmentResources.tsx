
import React, { useEffect, useState } from 'react';
import { ExternalLink, BookOpen, Lightbulb, ArrowLeft, X, CheckCircle2, Terminal, Code2, Rocket, Layout } from 'lucide-react';
import { Link } from 'react-router-dom';

const DevelopmentResources: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [selectedStack, setSelectedStack] = useState<number | null>(null);

    const techStacks = [
        {
            name: "MERN Stack",
            description: "Build modern full-stack web applications using MongoDB, Express, React, and Node.js.",
            tags: ["Full Stack", "JavaScript", "NoSQL"],
            diagram: "React (Frontend) ↔ Express/Node.js (Backend) ↔ MongoDB (Database)",
            roadmap: [
                "Master JavaScript (ES6+), HTML, and CSS",
                "Learn React Basics: Components, Props, State",
                "Understand Node.js and Express server setup",
                "Dive into MongoDB and Mongoose modeling",
                "Build and Connect REST APIs",
                "Authentication with JWT and Frontend integration"
            ],
            tools: ["VS Code", "Postman", "MongoDB Atlas", "npm/yarn", "Chrome DevTools"],
            projects: [
                { name: "Task Manager", level: "Beginner" },
                { name: "Social Media API", level: "Intermediate" },
                { name: "E-commerce Platform", level: "Advanced" }
            ],
            resources: [
                { name: "MERN Stack Guide", url: "https://www.mongodb.com/mern-stack" },
                { name: "FullStackOpen", url: "https://fullstackopen.com/en/" }
            ]
        },
        {
            name: "Python",
            description: "High-level language for backend development, AI/ML, and data science using Django or Flask.",
            tags: ["Backend", "AI/ML", "Scalable"],
            diagram: "Django/Flask (Backend) ↔ PostgreSQL (Database) ↔ Jinja/React (View)",
            roadmap: [
                "Python Syntax and Core Concepts",
                "Data Structures and Algorithms in Python",
                "Web Frameworks: Flask for basics, Django for enterprise",
                "Database Integration (SQLAlchemy/Django ORM)",
                "API Development with Django Rest Framework (DRF)",
                "Deployment with Docker and Gunicorn"
            ],
            tools: ["PyCharm/VS Code", "Pipenv", "PostgreSQL", "Jupyter Notebooks", "Docker"],
            projects: [
                { name: "Blog Engine", level: "Beginner" },
                { name: "Real-time Chat App", level: "Intermediate" },
                { name: "ML Model Deployment API", level: "Advanced" }
            ],
            resources: [
                { name: "Django Documentation", url: "https://docs.djangoproject.com/" },
                { name: "FastAPI Guide", url: "https://fastapi.tiangolo.com/" }
            ]
        },
        {
            name: "Spring Boot",
            description: "Robust Java framework for building enterprise-level, production-grade applications.",
            tags: ["Enterprise", "Java", "Backend"],
            diagram: "Spring Boot (Services/API) ↔ Spring Data JPA ↔ MySQL/PostgreSQL",
            roadmap: [
                "Java Fundamentals and OOP",
                "Spring Core (Dependency Injection, IOC)",
                "Build RESTful APIs with Spring Web",
                "Data Persistence with Spring Data JPA",
                "Spring Security for Auth and Authorization",
                "Microservices with Spring Cloud"
            ],
            tools: ["IntelliJ IDEA", "Maven/Gradle", "MySQL Workbench", "Docker", "Eureka Server"],
            projects: [
                { name: "Inventory Management", level: "Beginner" },
                { name: "Banking API Service", level: "Intermediate" },
                { name: "Microservices Architecture", level: "Advanced" }
            ],
            resources: [
                { name: "Spring Guides", url: "https://spring.io/guides" },
                { name: "Baeldung Java/Spring", url: "https://www.baeldung.com/" }
            ]
        }
    ];

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
                    {/* Tech Stacks Section */}
                    <section className="mb-24">
                        <div className="flex items-center space-x-4 mb-10 border-b-4 border-black pb-4">
                            <Lightbulb className="text-yellow-400" size={32} />
                            <div>
                                <h2 className="text-4xl font-black uppercase tracking-tight">Tech Stacks You Can Choose</h2>
                                <p className="text-black/50 font-medium italic">Popular paths to start your development journey.</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {techStacks.map((stack, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedStack(idx)}
                                    className="bg-black text-white p-8 rounded-2xl shadow-xl hover:scale-[1.05] hover:shadow-yellow-400/20 transition-all duration-300 flex flex-col justify-between h-full text-left group"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-3xl font-black uppercase italic tracking-tighter text-yellow-400 group-hover:text-yellow-300 transition-colors">
                                                {stack.name}
                                            </h3>
                                            <Rocket size={24} className="text-white/20 group-hover:text-yellow-400 transition-colors" />
                                        </div>
                                        <p className="text-white/80 font-medium leading-relaxed mb-6">
                                            {stack.description}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {stack.tags.map((tag, tagIdx) => (
                                            <span key={tagIdx} className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="mt-8 text-yellow-400 font-bold text-sm uppercase tracking-widest flex items-center space-x-2">
                                        <span>Click to Explore</span>
                                        <div className="w-8 h-[2px] bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Expanded Tech Stack Detail Overlay */}
                    {selectedStack !== null && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
                            <div
                                className="absolute inset-0 bg-black/90 backdrop-blur-md"
                                onClick={() => setSelectedStack(null)}
                            ></div>
                            <div className="relative bg-white w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                                <button
                                    onClick={() => setSelectedStack(null)}
                                    className="absolute top-6 right-6 p-2 bg-black text-white rounded-full hover:bg-yellow-400 hover:text-black transition-colors z-10"
                                >
                                    <X size={24} />
                                </button>

                                <div className="p-8 md:p-12">
                                    <header className="mb-12 border-b-8 border-black pb-8">
                                        <h2 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-4">
                                            {techStacks[selectedStack].name}
                                        </h2>
                                        <div className="flex flex-wrap gap-3">
                                            {techStacks[selectedStack].tags.map((tag, idx) => (
                                                <span key={idx} className="bg-black text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </header>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        {/* Left Column: Diagram & Roadmap */}
                                        <div className="space-y-12">
                                            <section>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <Layout className="text-yellow-500" />
                                                    <h4 className="text-xl font-black uppercase tracking-tight">Stack Diagram</h4>
                                                </div>
                                                <div className="bg-neutral-100 p-6 rounded-2xl border-2 border-black font-bold text-center italic">
                                                    {techStacks[selectedStack].diagram}
                                                </div>
                                            </section>

                                            <section>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <CheckCircle2 className="text-yellow-500" />
                                                    <h4 className="text-xl font-black uppercase tracking-tight">Learning Roadmap</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    {techStacks[selectedStack].roadmap.map((step, idx) => (
                                                        <div key={idx} className="flex items-start space-x-4">
                                                            <span className="bg-black text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-1">
                                                                {idx + 1}
                                                            </span>
                                                            <p className="font-bold text-black/80">{step}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>

                                        {/* Right Column: Tools, Projects, Resources */}
                                        <div className="space-y-12">
                                            <section>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <Terminal className="text-yellow-500" />
                                                    <h4 className="text-xl font-black uppercase tracking-tight">Essential Tools</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-3">
                                                    {techStacks[selectedStack].tools.map((tool, idx) => (
                                                        <span key={idx} className="bg-yellow-400 px-4 py-2 rounded-xl font-black text-sm uppercase">
                                                            {tool}
                                                        </span>
                                                    ))}
                                                </div>
                                            </section>

                                            <section>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <Code2 className="text-yellow-500" />
                                                    <h4 className="text-xl font-black uppercase tracking-tight">Project Ideas</h4>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    {techStacks[selectedStack].projects.map((project, idx) => (
                                                        <div key={idx} className="bg-neutral-50 p-4 rounded-xl border border-black/10 flex justify-between items-center group hover:border-black transition-colors">
                                                            <span className="font-bold">{project.name}</span>
                                                            <span className="text-[10px] font-black uppercase tracking-widest bg-black/5 px-2 py-1 rounded">
                                                                {project.level}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>

                                            <section>
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <ExternalLink className="text-yellow-500" />
                                                    <h4 className="text-xl font-black uppercase tracking-tight">Best Resources</h4>
                                                </div>
                                                <div className="space-y-3">
                                                    {techStacks[selectedStack].resources.map((res, idx) => (
                                                        <a
                                                            key={idx}
                                                            href={res.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center justify-between p-4 bg-black text-white rounded-xl hover:bg-yellow-400 hover:text-black transition-all group"
                                                        >
                                                            <span className="font-black uppercase italic tracking-tighter">{res.name}</span>
                                                            <ExternalLink size={16} />
                                                        </a>
                                                    ))}
                                                </div>
                                            </section>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

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
