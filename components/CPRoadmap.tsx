
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CPRoadmap: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6">
            <div className="container mx-auto max-w-4xl">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-600 hover:text-black transition-colors mb-8 group"
                >
                    <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                    Back to Tracks
                </button>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-black uppercase mb-2">CP Roadmap</h1>
                    <p className="text-slate-500 mb-12">Curated path to mastering Data Structures and Algorithms.</p>

                    <div className="relative w-full h-[500px] bg-slate-50 rounded-2xl border border-slate-100 overflow-auto flex items-center justify-center">
                        <svg width="600" height="400" viewBox="0 0 600 400" className="drop-shadow-sm">
                            {/* Definitions for arrowheads */}
                            <defs>
                                <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="10"
                                    refY="3.5"
                                    orient="auto"
                                >
                                    <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                                </marker>
                            </defs>

                            {/* Connections (Arrows) */}
                            <line x1="300" y1="80" x2="180" y2="180" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />
                            <line x1="300" y1="80" x2="420" y2="180" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrowhead)" />

                            {/* DSA Node */}
                            <g transform="translate(200, 30)">
                                <rect width="200" height="60" rx="12" fill="#000" />
                                <text x="100" y="38" textAnchor="middle" fill="#fff" fontWeight="bold" fontSize="18" className="uppercase tracking-widest">DSA Master</text>
                            </g>

                            {/* Arrays Node */}
                            <g transform="translate(80, 180)">
                                <rect width="160" height="60" rx="12" fill="#fff" stroke="#000" strokeWidth="2" />
                                <text x="80" y="38" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="16">Arrays</text>
                            </g>

                            {/* Linked List Node */}
                            <g transform="translate(360, 180)">
                                <rect width="160" height="60" rx="12" fill="#fff" stroke="#000" strokeWidth="2" />
                                <text x="80" y="38" textAnchor="middle" fill="#000" fontWeight="bold" fontSize="16">Linked Lists</text>
                            </g>

                            {/* More coming soon... */}
                            <text x="300" y="350" textAnchor="middle" fill="#94a3b8" fontSize="14" fontStyle="italic">More data structures coming soon...</text>
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CPRoadmap;
