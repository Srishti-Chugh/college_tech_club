import React from 'react';
import { X, Terminal, Code2, ExternalLink, Map } from 'lucide-react';
import MindMap from './MindMap';
import type { TechStack } from './stackData';

interface Props {
    stack: TechStack;
    onClose: () => void;
}

const StackModal: React.FC<Props> = ({ stack, onClose }) => {
    return (
        <div
            className="dev-modal-backdrop"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="dev-modal" role="dialog" aria-modal aria-label={stack.name}>
                {/* Top accent gradient rendered via CSS ::before */}

                <button className="dev-modal-close" onClick={onClose} aria-label="Close">
                    <X size={16} />
                </button>

                <div className="dev-modal-inner">

                    {/* Header */}
                    <header className="dev-modal-header">
                        <h2 className="dev-modal-title">{stack.name}</h2>
                        <div className="dev-modal-tags">
                            {stack.tags.map(tag => (
                                <span key={tag} className="dev-modal-tag">{tag}</span>
                            ))}
                        </div>
                    </header>

                    {/* ── Mind Map ── */}
                    <div className="dev-modal-sub-label" style={{ marginTop: 0 }}>
                        <Map size={16} style={{ color: '#facc15' }} />
                        <h4>Learning Mind Map</h4>
                    </div>
                    <p style={{ fontSize: '.78rem', color: 'rgba(255,255,255,.35)', marginBottom: '1.25rem', fontFamily: "'Fira Code', monospace" }}>
                        Click any leaf node to open the resource. Use arrows to expand / collapse sections.
                    </p>
                    <MindMap nodes={stack.mindmap} />

                    {/* ── Tools ── */}
                    <div className="dev-modal-sub-label">
                        <Terminal size={16} style={{ color: '#facc15' }} />
                        <h4>Essential Tools</h4>
                    </div>
                    <div className="dev-tools-wrap">
                        {stack.tools.map(tool => (
                            <span key={tool} className="dev-tool-pill">{tool}</span>
                        ))}
                    </div>

                    {/* ── Projects ── */}
                    <div className="dev-modal-sub-label">
                        <Code2 size={16} style={{ color: '#facc15' }} />
                        <h4>Project Ideas</h4>
                    </div>
                    <div className="dev-projects-list">
                        {stack.projects.map(p => (
                            <div key={p.name} className="dev-project-row">
                                <span className="dev-project-name">{p.name}</span>
                                <span className="dev-project-level">{p.level}</span>
                            </div>
                        ))}
                    </div>

                    {/* ── Resources ── */}
                    <div className="dev-modal-sub-label">
                        <ExternalLink size={16} style={{ color: '#facc15' }} />
                        <h4>Best Resources</h4>
                    </div>
                    <div className="dev-resources-list">
                        {stack.resources.map(res => (
                            <a
                                key={res.name}
                                href={res.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dev-resource-link"
                            >
                                <span className="dev-resource-name">{res.name}</span>
                                <ExternalLink size={14} />
                            </a>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default StackModal;