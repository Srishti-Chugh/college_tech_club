/// <reference types="vite/client" />
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type SQType = 'stack' | 'queue' | 'deque' | 'monotonic';
type NS = 'idle' | 'inserted' | 'deleted' | 'highlighted' | 'searched';
interface SQNode { id: number; value: number; state: NS; }
interface Log { msg: string; type: 'success' | 'error' | 'info' | 'highlight' }
interface P { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; topic: string; url: string; acceptance: string; }

let _id = 0; const uid = () => ++_id;
const defaultNodes = (): SQNode[] => [3, 15, 8, 27, 11].map(v => ({ id: uid(), value: v, state: 'idle' }));

const PROBS: P[] = [
    { title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack', url: 'https://leetcode.com/problems/valid-parentheses/', acceptance: '40.8%' },
    { title: 'Min Stack', difficulty: 'Easy', topic: 'Stack Design', url: 'https://leetcode.com/problems/min-stack/', acceptance: '55.1%' },
    { title: 'Implement Queue using Stacks', difficulty: 'Easy', topic: 'Stack', url: 'https://leetcode.com/problems/implement-queue-using-stacks/', acceptance: '63.4%' },
    { title: 'Implement Stack using Queues', difficulty: 'Easy', topic: 'Queue', url: 'https://leetcode.com/problems/implement-stack-using-queues/', acceptance: '57.2%' },
    { title: 'Baseball Game', difficulty: 'Easy', topic: 'Stack', url: 'https://leetcode.com/problems/baseball-game/', acceptance: '74.5%' },
    { title: 'Backspace String Compare', difficulty: 'Easy', topic: 'Stack', url: 'https://leetcode.com/problems/backspace-string-compare/', acceptance: '48.6%' },
    { title: 'Number of Recent Calls', difficulty: 'Easy', topic: 'Queue', url: 'https://leetcode.com/problems/number-of-recent-calls/', acceptance: '74.3%' },
    { title: 'Moving Average from Data Stream', difficulty: 'Easy', topic: 'Sliding Window Queue', url: 'https://leetcode.com/problems/moving-average-from-data-stream/', acceptance: '79.1%' },
    { title: 'Daily Temperatures', difficulty: 'Medium', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/daily-temperatures/', acceptance: '67.2%' },
    { title: 'Next Greater Element I', difficulty: 'Medium', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/next-greater-element-i/', acceptance: '71.3%' },
    { title: 'Next Greater Element II', difficulty: 'Medium', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/next-greater-element-ii/', acceptance: '62.8%' },
    { title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', topic: 'Stack', url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', acceptance: '47.5%' },
    { title: 'Decode String', difficulty: 'Medium', topic: 'Stack', url: 'https://leetcode.com/problems/decode-string/', acceptance: '57.9%' },
    { title: 'Asteroid Collision', difficulty: 'Medium', topic: 'Stack', url: 'https://leetcode.com/problems/asteroid-collision/', acceptance: '44.3%' },
    { title: 'Remove K Digits', difficulty: 'Medium', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/remove-k-digits/', acceptance: '31.8%' },
    { title: 'Online Stock Span', difficulty: 'Medium', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/online-stock-span/', acceptance: '64.5%' },
    { title: 'Design Circular Queue', difficulty: 'Medium', topic: 'Queue Design', url: 'https://leetcode.com/problems/design-circular-queue/', acceptance: '52.3%' },
    { title: 'Design Circular Deque', difficulty: 'Medium', topic: 'Deque Design', url: 'https://leetcode.com/problems/design-circular-deque/', acceptance: '58.7%' },
    { title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Monotonic Deque', url: 'https://leetcode.com/problems/sliding-window-maximum/', acceptance: '46.5%' },
    { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', acceptance: '44.1%' },
    { title: 'Maximal Rectangle', difficulty: 'Hard', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/maximal-rectangle/', acceptance: '45.2%' },
    { title: 'Basic Calculator', difficulty: 'Hard', topic: 'Stack', url: 'https://leetcode.com/problems/basic-calculator/', acceptance: '42.1%' },
    { title: 'Maximum Frequency Stack', difficulty: 'Hard', topic: 'Stack Design', url: 'https://leetcode.com/problems/maximum-frequency-stack/', acceptance: '67.3%' },
];

const META: Record<SQType, { label: string; color: string; desc: string; cx: [string, string][]; icon: string }> = {
    stack: { label: 'Stack', color: '#f97316', desc: 'LIFO — Last In, First Out. Push/pop from top only. Used in DFS, call stack, undo operations, balanced parentheses.', cx: [['O(1)', 'Push'], ['O(1)', 'Pop'], ['O(1)', 'Peek'], ['O(n)', 'Search']], icon: '📚' },
    queue: { label: 'Queue', color: '#22c55e', desc: 'FIFO — First In, First Out. Enqueue at rear, dequeue from front. Used in BFS, task scheduling, print spoolers.', cx: [['O(1)', 'Enqueue'], ['O(1)', 'Dequeue'], ['O(1)', 'Peek'], ['O(n)', 'Search']], icon: '🚶' },
    deque: { label: 'Deque', color: '#60a5fa', desc: 'Double-Ended Queue. Insert and delete from both ends in O(1). Generalises both stack and queue. Used in sliding window max.', cx: [['O(1)', 'Push Front/Back'], ['O(1)', 'Pop Front/Back'], ['O(1)', 'Peek'], ['O(n)', 'Search']], icon: '↔️' },
    monotonic: { label: 'Monotonic Stack', color: '#c084fc', desc: 'Stack maintaining increasing or decreasing order. Enables O(n) solutions for next greater/smaller element, histogram area.', cx: [['O(n)', 'Build'], ['O(1)', 'Amort. Push'], ['O(n)', 'Next Greater'], ['O(n)', 'Histogram']], icon: '📈' },
};

// ── Vertical Stack Viz ─────────────────────────────────────────────────────────
const StackViz: React.FC<{ nodes: SQNode[]; color: string }> = ({ nodes, color }) => {
    const W = 74, H = 46, G = 5, svgH = Math.max(nodes.length * (H + G) + 70, 160);
    const C: Record<NS, { f: string; s: string }> = { idle: { f: '#141824', s: 'rgba(255,255,255,.13)' }, inserted: { f: '#14451f', s: '#22c55e' }, deleted: { f: '#4a0f0f', s: '#ef4444' }, highlighted: { f: '#1a1f40', s: color }, searched: { f: '#44310a', s: '#f59e0b' } };
    return (
        <svg width={W + 90} height={svgH} style={{ overflow: 'visible' }}>
            <rect x={2} y={svgH - 16} width={W + 4} height={5} rx={3} fill="rgba(255,255,255,.1)" />
            <text x={W + 18} y={svgH - 10} fill="rgba(255,255,255,.2)" fontSize={9} fontFamily="monospace">base</text>
            {[...nodes].reverse().map((n, i) => {
                const y = svgH - 21 - (i + 1) * (H + G); const c = C[n.state];
                return (<g key={n.id} style={{ transition: 'all .35s cubic-bezier(.34,1.56,.64,1)' }}>
                    <rect x={2} y={y} width={W} height={H} rx={9} fill={c.f} stroke={c.s} strokeWidth={2} style={{ filter: n.state !== 'idle' ? `drop-shadow(0 0 8px ${c.s})` : 'none', transition: 'all .35s' }} />
                    <text x={2 + W / 2} y={y + H / 2 + 1} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,.88)" fontSize={14} fontFamily="monospace" fontWeight="700">{n.value}</text>
                    {i === nodes.length - 1 && <text x={W + 18} y={y + H / 2 + 4} fill={color} fontSize={9} fontFamily="monospace" fontWeight="600">← TOP</text>}
                </g>);
            })}
            {!nodes.length && <text x={W / 2 + 2} y={svgH / 2} textAnchor="middle" fill="rgba(255,255,255,.18)" fontSize={12} fontFamily="monospace">empty</text>}
        </svg>
    );
};

// ── Horizontal Queue/Deque Viz ─────────────────────────────────────────────────
const QueueViz: React.FC<{ nodes: SQNode[]; color: string; isDeque?: boolean }> = ({ nodes, color, isDeque }) => {
    const BW = 64, BH = 48, G = 44; const totalW = nodes.length * (BW + G) + 120;
    const C: Record<NS, { f: string; s: string }> = { idle: { f: '#141824', s: 'rgba(255,255,255,.13)' }, inserted: { f: '#14451f', s: '#22c55e' }, deleted: { f: '#4a0f0f', s: '#ef4444' }, highlighted: { f: '#1a1f40', s: color }, searched: { f: '#44310a', s: '#f59e0b' } };
    const cy = 46;
    return (
        <svg width="100%" viewBox={`0 0 ${Math.max(totalW, 380)} 130`} style={{ overflow: 'visible', minWidth: Math.min(totalW, 820) }}>
            <defs>
                <marker id="qaf" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill={color} opacity=".75" /></marker>
                <marker id="qab" markerWidth="7" markerHeight="7" refX="2" refY="3" orient="auto"><path d="M7,0 L7,6 L0,3 z" fill="rgba(255,255,255,.3)" opacity=".75" /></marker>
            </defs>
            {nodes.map((_, i) => { if (i === nodes.length - 1) return null; const x1 = 58 + i * (BW + G) + BW + 4, x2 = 58 + (i + 1) * (BW + G) - 4; return <line key={i} x1={x1} y1={cy + BH / 2} x2={x2} y2={cy + BH / 2} stroke={color} strokeWidth={1.5} opacity={.55} markerEnd="url(#qaf)" />; })}
            {isDeque && nodes.map((_, i) => { if (i === 0) return null; const x1 = 58 + i * (BW + G) - 4, x2 = 58 + (i - 1) * (BW + G) + BW + 4; return <line key={`b${i}`} x1={x1} y1={cy + BH / 2 + 14} x2={x2} y2={cy + BH / 2 + 14} stroke="rgba(255,255,255,.25)" strokeWidth={1.2} strokeDasharray="3 3" opacity={.6} markerEnd="url(#qab)" />; })}
            {nodes.map((n, i) => {
                const x = 58 + i * (BW + G); const c = C[n.state]; return (
                    <g key={n.id} style={{ transition: 'all .35s cubic-bezier(.34,1.56,.64,1)' }}>
                        <rect x={x} y={cy} width={BW} height={BH} rx={10} fill={c.f} stroke={c.s} strokeWidth={2} style={{ filter: n.state !== 'idle' ? `drop-shadow(0 0 8px ${c.s})` : 'none', transition: 'all .35s' }} />
                        <text x={x + BW / 2} y={cy + BH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,.88)" fontSize={14} fontFamily="monospace" fontWeight="700">{n.value}</text>
                        {i === 0 && <text x={x + BW / 2} y={cy - 10} textAnchor="middle" fill={color} fontSize={9} fontFamily="monospace" fontWeight="600">{isDeque ? 'FRONT' : 'FRONT'}</text>}
                        {i === nodes.length - 1 && i > 0 && <text x={x + BW / 2} y={cy - 10} textAnchor="middle" fill="rgba(255,255,255,.35)" fontSize={9} fontFamily="monospace">REAR</text>}
                    </g>
                );
            })}
            {!nodes.length && <text x="190" y="65" textAnchor="middle" fill="rgba(255,255,255,.18)" fontSize={13} fontFamily="monospace">empty</text>}
        </svg>
    );
};

// ── Monotonic Viz ──────────────────────────────────────────────────────────────
const MonoViz: React.FC<{ stack: SQNode[]; input: number[]; color: string }> = ({ stack, input, color }) => {
    const BW = 50, BH = 42, G = 6, stkH = Math.max(stack.length * (BH + G) + 70, 160);
    return (
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div>
                <div style={{ fontFamily: 'monospace', fontSize: '.66rem', color: 'rgba(255,255,255,.3)', marginBottom: '.4rem' }}>INPUT ARRAY</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {input.map((v, i) => {
                        const inStk = stack.some(n => n.value === v); return (
                            <div key={i} style={{ width: BW, height: BH, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: inStk ? `${color}20` : 'rgba(255,255,255,.04)', border: `1px solid ${inStk ? color : 'rgba(255,255,255,.1)'}`, fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: inStk ? color : 'rgba(255,255,255,.6)', transition: 'all .3s' }}>{v}</div>
                        );
                    })}
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    {input.map((_, i) => <div key={i} style={{ width: BW, textAlign: 'center', fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,.2)' }}>[{i}]</div>)}
                </div>
            </div>
            <div>
                <div style={{ fontFamily: 'monospace', fontSize: '.66rem', color: 'rgba(255,255,255,.3)', marginBottom: '.4rem' }}>MONOTONIC STACK (increasing)</div>
                <svg width={BW + 70} height={stkH} style={{ overflow: 'visible' }}>
                    <rect x={2} y={stkH - 14} width={BW + 4} height={5} rx={2} fill="rgba(255,255,255,.1)" />
                    {[...stack].reverse().map((n, i) => {
                        const y = stkH - 19 - (i + 1) * (BH + G); return (
                            <g key={n.id} style={{ transition: 'all .35s cubic-bezier(.34,1.56,.64,1)' }}>
                                <rect x={2} y={y} width={BW} height={BH} rx={7} fill={n.state === 'inserted' ? `${color}22` : '#141824'} stroke={n.state === 'inserted' ? color : 'rgba(255,255,255,.14)'} strokeWidth={2} style={{ filter: n.state === 'inserted' ? `drop-shadow(0 0 8px ${color})` : 'none', transition: 'all .35s' }} />
                                <text x={2 + BW / 2} y={y + BH / 2 + 1} textAnchor="middle" dominantBaseline="central" fill="rgba(255,255,255,.88)" fontSize={13} fontFamily="monospace" fontWeight="700">{n.value}</text>
                                {i === stack.length - 1 && <text x={BW + 16} y={y + BH / 2 + 4} fill={color} fontSize={9} fontFamily="monospace">TOP</text>}
                            </g>
                        );
                    })}
                    {!stack.length && <text x={BW / 2 + 2} y={stkH / 2} textAnchor="middle" fill="rgba(255,255,255,.18)" fontSize={11} fontFamily="monospace">empty</text>}
                </svg>
            </div>
        </div>
    );
};

// ── Main ───────────────────────────────────────────────────────────────────────
const StacksQueuesPage: React.FC = () => {
    const navigate = useNavigate();
    const [sqType, setSqType] = useState<SQType>('stack');
    const [nodes, setNodes] = useState<SQNode[]>(defaultNodes);
    const [monoInput] = useState<number[]>([2, 1, 5, 3, 6, 4]);
    const [monoStack, setMonoStack] = useState<SQNode[]>([]);
    const [inputVal, setInputVal] = useState('');
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [log, setLog] = useState<Log[]>([{ msg: 'Stack loaded with [3,15,8,27,11]. Top = 11.', type: 'info' }]);
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const logRef = useRef<HTMLDivElement>(null);
    const meta = META[sqType];

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);
    useEffect(() => { setNodes(defaultNodes()); setMonoStack([]); setLog([{ msg: `${meta.label} ready. ${meta.desc}`, type: 'info' }]); setActiveOp(null); setInputVal(''); }, [sqType]);

    const addLog = (msg: string, type: Log['type'] = 'info') => setLog(p => [...p.slice(-29), { msg, type }]);
    const rst = (ns: SQNode[]) => ns.map(n => ({ ...n, state: 'idle' as NS }));
    const flash = (u: (p: SQNode[]) => SQNode[], d = 900) => { setNodes(p => u([...p])); setTimeout(() => setNodes(p => rst([...p])), d); };

    const push = () => { const v = Number(inputVal); if (inputVal === '' || isNaN(v)) return addLog('Enter a valid number.', 'error'); setNodes(p => [...rst(p), { id: uid(), value: v, state: 'inserted' }]); setTimeout(() => setNodes(p => rst(p)), 900); addLog(`Pushed ${v}. New top = ${v}. O(1).`, 'success'); setInputVal(''); };
    const pop = () => { if (!nodes.length) return addLog('Stack underflow!', 'error'); const t = nodes[nodes.length - 1].value; flash(p => { const ns = rst([...p]); ns[ns.length - 1] = { ...ns[ns.length - 1], state: 'deleted' }; return ns; }, 700); setTimeout(() => setNodes(p => rst(p.slice(0, -1))), 700); addLog(`Popped ${t}. O(1).`, 'success'); };
    const peek = () => { if (!nodes.length) return addLog('Stack is empty!', 'error'); const t = nodes[nodes.length - 1].value; flash(p => { const ns = rst([...p]); ns[ns.length - 1] = { ...ns[ns.length - 1], state: 'highlighted' }; return ns; }); addLog(`Peek: top = ${t}. O(1).`, 'success'); };
    const enqueue = () => { const v = Number(inputVal); if (inputVal === '' || isNaN(v)) return addLog('Enter a number.', 'error'); setNodes(p => [...rst(p), { id: uid(), value: v, state: 'inserted' }]); setTimeout(() => setNodes(p => rst(p)), 900); addLog(`Enqueued ${v} at rear. O(1).`, 'success'); setInputVal(''); };
    const dequeue = () => { if (!nodes.length) return addLog('Queue is empty!', 'error'); const f = nodes[0].value; flash(p => { const ns = rst([...p]); ns[0] = { ...ns[0], state: 'deleted' }; return ns; }, 700); setTimeout(() => setNodes(p => rst(p.slice(1))), 700); addLog(`Dequeued ${f} from front. O(1).`, 'success'); };
    const pushFront = () => { const v = Number(inputVal); if (inputVal === '' || isNaN(v)) return addLog('Enter a number.', 'error'); setNodes(p => [{ id: uid(), value: v, state: 'inserted' }, ...rst(p)]); setTimeout(() => setNodes(p => rst(p)), 900); addLog(`Push front: ${v}. O(1).`, 'success'); setInputVal(''); };
    const pushBack = () => { const v = Number(inputVal); if (inputVal === '' || isNaN(v)) return addLog('Enter a number.', 'error'); setNodes(p => [...rst(p), { id: uid(), value: v, state: 'inserted' }]); setTimeout(() => setNodes(p => rst(p)), 900); addLog(`Push back: ${v}. O(1).`, 'success'); setInputVal(''); };
    const popFront = () => { if (!nodes.length) return addLog('Deque empty!', 'error'); const v = nodes[0].value; flash(p => { const ns = rst([...p]); ns[0] = { ...ns[0], state: 'deleted' }; return ns; }, 700); setTimeout(() => setNodes(p => rst(p.slice(1))), 700); addLog(`Pop front: ${v}. O(1).`, 'success'); };
    const popBack = () => { if (!nodes.length) return addLog('Deque empty!', 'error'); const v = nodes[nodes.length - 1].value; flash(p => { const ns = rst([...p]); ns[ns.length - 1] = { ...ns[ns.length - 1], state: 'deleted' }; return ns; }, 700); setTimeout(() => setNodes(p => rst(p.slice(0, -1))), 700); addLog(`Pop back: ${v}. O(1).`, 'success'); };

    const monoStep = () => {
        const proc = monoStack.length === 0 ? 0 : monoInput.indexOf(monoStack[monoStack.length - 1].value) + 1;
        const nextIdx = monoInput.findIndex((_, i) => i >= proc && !monoStack.some(n => n.value === monoInput[i]));
        const realNext = monoInput.findIndex((v, i) => { const alreadyIn = monoStack.some(n => n.value === v && monoInput.lastIndexOf(v) === i); return !alreadyIn && i >= monoStack.length; });
        const idx = monoStack.length;
        if (idx >= monoInput.length) return addLog('All elements processed! Press Reset to start over.', 'info');
        const v = monoInput[idx]; let ns = [...monoStack]; const popped: number[] = [];
        while (ns.length && ns[ns.length - 1].value > v) { popped.push(ns[ns.length - 1].value); ns = ns.slice(0, -1); }
        ns = [...ns.map(n => ({ ...n, state: 'idle' as NS })), { id: uid(), value: v, state: 'inserted' }];
        setMonoStack(ns); setTimeout(() => setMonoStack(p => p.map(n => ({ ...n, state: 'idle' }))), 900);
        if (popped.length) addLog(`v=${v}: popped [${popped.join(',')}] (> ${v}). Stack: [${ns.map(n => n.value).join(',')}]`, 'highlight');
        else addLog(`v=${v}: nothing popped. Stack: [${ns.map(n => n.value).join(',')}]`, 'success');
    };

    const handleReset = () => { setNodes(defaultNodes()); setMonoStack([]); setLog([{ msg: `${meta.label} reset.`, type: 'info' }]); };
    const filtered = PROBS.filter(p => filter === 'All' || p.difficulty === filter);
    const counts = { Easy: PROBS.filter(p => p.difficulty === 'Easy').length, Medium: PROBS.filter(p => p.difficulty === 'Medium').length, Hard: PROBS.filter(p => p.difficulty === 'Hard').length };

    const Chip = ({ c, l }: { c: string; l: string }) => <span style={{ fontSize: '.64rem', padding: '.15rem .5rem', borderRadius: 100, border: `1px solid ${c}35`, color: c, background: `${c}18`, letterSpacing: '.04em', flexShrink: 0 }}>{l}</span>;
    const Chev = ({ open }: { open: boolean }) => <svg style={{ color: 'rgba(255,255,255,.25)', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
    const OpCard = ({ id, icon, name, badge, children }: { id: string; icon: string; name: string; badge: string; children: React.ReactNode }) => {
        const open = activeOp === id;
        return (<div className={`pg-card${open ? ' open' : ''}`} onClick={() => setActiveOp(open ? null : id)}>
            <div className="pg-ch"><span className="pg-ci">{icon}</span><span className="pg-cn">{name}</span><Chip c={meta.color} l={badge} /><Chev open={open} /></div>
            {open && <div className="pg-cb2" onClick={e => e.stopPropagation()}>{children}</div>}
        </div>);
    };

    return (
        <div className="sq-root">
            <div className="sq-bg" aria-hidden><div className="sq-orb sq-o1" style={{ background: meta.color }} /><div className="sq-orb sq-o2" /><div className="sq-grid" /></div>
            <button className="sq-back" onClick={() => navigate('/resources/cp-roadmap')}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>DSA Roadmap</button>
            <header className="sq-header">
                <div className="sq-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}40` }}>Data Structures · Stacks &amp; Queues</div>
                <h1 className="sq-title" style={{ backgroundImage: `linear-gradient(135deg,#fff 30%,${meta.color})` }}>{meta.icon} Stacks &amp; Queues</h1>
                <p className="sq-sub">{meta.desc}</p>
                <div className="sq-stats">{meta.cx.map(([c, l]) => <div className="sq-stat" key={l}><span className="sq-sc" style={{ color: meta.color }}>{c}</span><span className="sq-sl">{l}</span></div>)}</div>
            </header>

            <section className="pg-wrap">
                <div className="sq-toggle">{(Object.entries(META) as [SQType, typeof meta][]).map(([k, m]) => (
                    <button key={k} onClick={() => setSqType(k)} className={`sq-tb${sqType === k ? ' active' : ''}`} style={sqType === k ? { borderColor: m.color, color: m.color, background: `${m.color}15` } : {}}>{m.icon} {m.label}</button>
                ))}</div>
                <div className="pg-hdr">
                    <h2 className="pg-title">Interactive Playground <span className="pg-chip" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}35` }}>{meta.label}</span></h2>
                    <button className="pg-reset" onClick={handleReset}>Reset</button>
                </div>
                <div className="pg-viz" style={{ minHeight: sqType === 'stack' ? 260 : 130, justifyContent: sqType === 'stack' ? 'center' : 'flex-start' }}>
                    {sqType === 'stack' && <StackViz nodes={nodes} color={meta.color} />}
                    {sqType === 'queue' && <QueueViz nodes={nodes} color={meta.color} />}
                    {sqType === 'deque' && <QueueViz nodes={nodes} color={meta.color} isDeque />}
                    {sqType === 'monotonic' && <MonoViz stack={monoStack} input={monoInput} color={meta.color} />}
                </div>

                <div className="pg-ops">
                    {sqType === 'stack' && <>
                        <OpCard id="push" icon="＋" name="Push" badge="O(1)">
                            <div className="pg-row"><input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && push()} /><button className="pg-btn" style={{ background: meta.color, color: '#000' }} onClick={push}>Push onto Stack</button></div>
                            <p className="pg-hint">Places value on top. LIFO — the last pushed is first popped. O(1).</p>
                        </OpCard>
                        <OpCard id="pop" icon="－" name="Pop / Peek" badge="O(1)">
                            <div className="pg-row"><button className="pg-btn" style={{ background: '#ef4444', color: '#fff', flex: 1 }} onClick={pop}>Pop (remove top)</button><button className="pg-btn" style={{ background: 'rgba(255,255,255,.08)', color: meta.color, border: `1px solid ${meta.color}40` }} onClick={peek}>Peek (view top)</button></div>
                            <p className="pg-hint">Pop removes and returns top element. Peek reads it without removal. Both O(1). Use case: undo history, DFS.</p>
                        </OpCard>
                    </>}
                    {sqType === 'queue' && <>
                        <OpCard id="enq" icon="＋" name="Enqueue" badge="O(1)">
                            <div className="pg-row"><input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && enqueue()} /><button className="pg-btn" style={{ background: meta.color, color: '#000' }} onClick={enqueue}>Enqueue at Rear</button></div>
                            <p className="pg-hint">Adds to rear. FIFO — first added is first served. Core of BFS traversal. O(1).</p>
                        </OpCard>
                        <OpCard id="deq" icon="－" name="Dequeue" badge="O(1)">
                            <div className="pg-row"><button className="pg-btn" style={{ background: '#ef4444', color: '#fff', flex: 1 }} onClick={dequeue}>Dequeue from Front</button></div>
                            <p className="pg-hint">Removes and returns front element. O(1). Used in level-order tree traversal, shortest path BFS.</p>
                        </OpCard>
                    </>}
                    {sqType === 'deque' && <>
                        <OpCard id="dpush" icon="＋" name="Push (both ends)" badge="O(1)">
                            <div className="pg-row"><input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} /><button className="pg-btn" style={{ background: meta.color, color: '#000' }} onClick={pushFront}>Push Front</button><button className="pg-btn" style={{ background: `${meta.color}88`, color: '#000' }} onClick={pushBack}>Push Back</button></div>
                            <p className="pg-hint">Both ends O(1). Acts as stack (push/pop same end) or queue (push one, pop other).</p>
                        </OpCard>
                        <OpCard id="dpop" icon="－" name="Pop (both ends)" badge="O(1)">
                            <div className="pg-row"><button className="pg-btn" style={{ background: '#ef4444', color: '#fff', flex: 1 }} onClick={popFront}>Pop Front</button><button className="pg-btn" style={{ background: '#b91c1c', color: '#fff', flex: 1 }} onClick={popBack}>Pop Back</button></div>
                            <p className="pg-hint">Classic use: sliding window maximum — keep indices in decreasing deque, pop front if out of window, pop back if smaller than current.</p>
                        </OpCard>
                    </>}
                    {sqType === 'monotonic' && (
                        <OpCard id="mono" icon="📈" name="Build Increasing Monotonic Stack" badge="O(n)">
                            <div className="pg-row">
                                <button className="pg-btn" style={{ background: meta.color, color: '#000', flex: 1 }} onClick={monoStep}>Step → Process Next Element ({monoStack.length}/{monoInput.length})</button>
                                <button className="pg-btn" style={{ background: 'rgba(255,255,255,.07)', color: 'rgba(255,255,255,.5)', border: '1px solid rgba(255,255,255,.15)' }} onClick={() => { setMonoStack([]); addLog('Monotonic stack reset.', 'info'); }}>Reset</button>
                            </div>
                            <p className="pg-hint">For each element: pop all larger elements (they can never be "next smaller"). Then push. Each element pushed/popped once → O(n) amortized. Highlighted = just pushed element.</p>
                        </OpCard>
                    )}
                </div>

                <div className="pg-log" ref={logRef}>
                    <span className="pg-ll">Operation Log</span>
                    {log.map((e, i) => <div key={i} className={`pg-le ${e.type}`}><span className="pg-la">›</span>{e.msg}</div>)}
                </div>
            </section>

            <section className="pt-wrap">
                <div className="pt-hdr"><div><h2 className="pt-title">Practice Problems</h2><p className="pt-sub">{PROBS.length} curated Stack &amp; Queue problems</p></div>
                    <div className="pt-counts"><span className="ptc easy">{counts.Easy} Easy</span><span className="ptc medium">{counts.Medium} Medium</span><span className="ptc hard">{counts.Hard} Hard</span></div></div>
                <div className="pt-filters">{(['All', 'Easy', 'Medium', 'Hard'] as const).map(f => <button key={f} className={`pt-f${filter === f ? ' active ' + f.toLowerCase() : ''}`} onClick={() => setFilter(f)}>{f}{f !== 'All' && <span className="pt-fc">{counts[f as keyof typeof counts]}</span>}</button>)}</div>
                <div className="pt-tw"><table className="pt-tbl">
                    <thead><tr><th>#</th><th>Problem</th><th>Difficulty</th><th>Pattern</th><th>Acceptance</th><th></th></tr></thead>
                    <tbody>{filtered.map((p, i) => <tr key={p.title} className="pt-row"><td className="pt-num">{i + 1}</td><td className="pt-name">{p.title}</td><td><span className={`pt-diff ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span></td><td className="pt-topic">{p.topic}</td><td className="pt-acc">{p.acceptance}</td><td><a href={p.url} target="_blank" rel="noopener noreferrer" className="pt-solve">Solve →</a></td></tr>)}</tbody>
                </table></div>
            </section>
            <style>{CSS}</style>
        </div>
    );
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.sq-root{min-height:100vh;background:#07080f;color:rgba(255,255,255,.92);font-family:'Courier New',monospace;display:flex;flex-direction:column;align-items:center;padding:0 1rem 6rem;position:relative;overflow-x:hidden}
.sq-bg{position:fixed;inset:0;pointer-events:none;z-index:0}
.sq-orb{position:absolute;border-radius:50%;filter:blur(130px);opacity:.09;transition:background .8s}
.sq-o1{width:700px;height:700px;top:-280px;left:-200px}
.sq-o2{width:500px;height:500px;background:#818cf8;bottom:-100px;right:-160px}
.sq-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px);background-size:50px 50px}
.sq-back{position:relative;z-index:2;align-self:flex-start;margin-top:1.6rem;display:flex;align-items:center;gap:.4rem;background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);font-family:inherit;font-size:.8rem;transition:color .2s}
.sq-back:hover{color:rgba(255,255,255,.65)}
.sq-header{position:relative;z-index:2;text-align:center;margin-top:2.5rem;max-width:740px;width:100%}
.sq-badge{display:inline-block;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;border:1px solid;border-radius:100px;padding:.27rem .85rem;margin-bottom:1rem;transition:all .4s}
.sq-title{font-family:'Unbounded',sans-serif;font-size:clamp(1.9rem,6vw,3.8rem);font-weight:800;letter-spacing:-.04em;line-height:.95;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;transition:background-image .4s;margin-bottom:.9rem}
.sq-sub{color:rgba(255,255,255,.38);font-size:.8rem;line-height:1.7;max-width:560px;margin-inline:auto}
.sq-stats{display:flex;justify-content:center;gap:.75rem;flex-wrap:wrap;margin-top:1.4rem}
.sq-stat{display:flex;flex-direction:column;align-items:center;gap:.18rem;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:.6rem 1rem}
.sq-sc{font-size:.95rem;font-weight:600;transition:color .3s}.sq-sl{font-size:.65rem;color:rgba(255,255,255,.32)}
.pg-wrap{position:relative;z-index:2;width:100%;max-width:900px;margin-top:2.5rem;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:1.75rem}
.sq-toggle{display:flex;gap:.4rem;flex-wrap:wrap;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:.38rem;margin-bottom:1.4rem}
.sq-tb{flex:1;min-width:110px;background:transparent;border:1px solid transparent;border-radius:10px;color:rgba(255,255,255,.35);font-family:inherit;font-size:.74rem;padding:.5rem .4rem;cursor:pointer;transition:all .22s;text-align:center}
.sq-tb:hover{color:rgba(255,255,255,.65)}.sq-tb.active{font-weight:700}
.pg-hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;gap:.5rem;flex-wrap:wrap}
.pg-title{font-size:1rem;font-weight:600;display:flex;align-items:center;gap:.6rem;flex-wrap:wrap}
.pg-chip{font-size:.67rem;padding:.2rem .65rem;border-radius:100px;border:1px solid;letter-spacing:.04em;transition:all .3s}
.pg-reset{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.38);font-family:inherit;font-size:.75rem;border-radius:8px;padding:.33rem .8rem;cursor:pointer;transition:all .2s}
.pg-reset:hover{color:#fff;border-color:rgba(255,255,255,.2)}
.pg-viz{background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:1rem .75rem;min-height:120px;overflow-x:auto;margin-bottom:1.2rem;display:flex;align-items:center}
.pg-ops{display:flex;flex-direction:column;gap:.5rem}
.pg-card{border:1px solid rgba(255,255,255,.07);border-radius:13px;overflow:hidden;cursor:pointer;transition:border-color .2s}
.pg-card.open{border-color:rgba(255,255,255,.15)}
.pg-ch{display:flex;align-items:center;gap:.65rem;padding:.78rem 1rem;background:rgba(255,255,255,.025)}
.pg-ci{font-size:.9rem;width:18px;text-align:center;flex-shrink:0}.pg-cn{font-weight:600;font-size:.88rem;flex:1}
.pg-cb2{padding:.85rem 1rem 1rem;display:flex;flex-direction:column;gap:.5rem;background:rgba(0,0,0,.22);border-top:1px solid rgba(255,255,255,.05)}
.pg-row{display:flex;gap:.42rem;align-items:center;flex-wrap:wrap}
.pg-inp{flex:1;min-width:80px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#fff;font-family:inherit;font-size:.84rem;border-radius:9px;padding:.48rem .72rem;outline:none;transition:border-color .2s}
.pg-inp:focus{border-color:rgba(255,255,255,.28)}.pg-inp::placeholder{color:rgba(255,255,255,.2)}
.pg-btn{border:none;border-radius:9px;cursor:pointer;font-family:inherit;font-weight:600;font-size:.8rem;padding:.48rem .9rem;transition:opacity .15s,transform .1s;white-space:nowrap}
.pg-btn:hover{opacity:.82;transform:translateY(-1px)}
.pg-hint{font-size:.72rem;color:rgba(255,255,255,.28);line-height:1.65}
.pg-log{margin-top:1.2rem;background:rgba(0,0,0,.38);border:1px solid rgba(255,255,255,.055);border-radius:11px;padding:.7rem .9rem;max-height:150px;overflow-y:auto;display:flex;flex-direction:column;gap:.25rem}
.pg-ll{font-size:.6rem;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.2);margin-bottom:.25rem}
.pg-le{font-size:.74rem;display:flex;gap:.4rem;align-items:flex-start;color:rgba(255,255,255,.38);line-height:1.55}
.pg-le.success{color:#4ade80}.pg-le.error{color:#f87171}.pg-le.highlight{color:#a78bfa}.pg-le.info{color:rgba(255,255,255,.36)}
.pg-la{opacity:.4;flex-shrink:0}
.pt-wrap{position:relative;z-index:2;width:100%;max-width:900px;margin-top:3rem}
.pt-hdr{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.1rem}
.pt-title{font-family:'Unbounded',sans-serif;font-size:1.1rem;font-weight:700;letter-spacing:-.02em}
.pt-sub{font-size:.74rem;color:rgba(255,255,255,.3);margin-top:.22rem}
.pt-counts{display:flex;gap:.4rem;flex-wrap:wrap;align-items:center}
.ptc{font-size:.71rem;padding:.22rem .65rem;border-radius:100px;border:1px solid}
.ptc.easy{color:#4ade80;background:rgba(74,222,128,.1);border-color:rgba(74,222,128,.25)}
.ptc.medium{color:#fb923c;background:rgba(251,146,60,.1);border-color:rgba(251,146,60,.25)}
.ptc.hard{color:#f87171;background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.25)}
.pt-filters{display:flex;gap:.38rem;margin-bottom:.85rem;flex-wrap:wrap}
.pt-f{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.42);font-family:inherit;font-size:.76rem;border-radius:9px;padding:.36rem .82rem;cursor:pointer;display:flex;align-items:center;gap:.35rem;transition:all .18s}
.pt-f:hover{color:#fff;border-color:rgba(255,255,255,.2)}
.pt-f.active{color:#fff;border-color:rgba(255,255,255,.26);background:rgba(255,255,255,.08)}
.pt-f.active.easy{color:#4ade80;border-color:rgba(74,222,128,.38);background:rgba(74,222,128,.08)}
.pt-f.active.medium{color:#fb923c;border-color:rgba(251,146,60,.38);background:rgba(251,146,60,.08)}
.pt-f.active.hard{color:#f87171;border-color:rgba(248,113,113,.38);background:rgba(248,113,113,.08)}
.pt-fc{background:rgba(255,255,255,.1);border-radius:100px;font-size:.63rem;padding:.03rem .38rem}
.pt-tw{border:1px solid rgba(255,255,255,.07);border-radius:16px;overflow:hidden}
.pt-tbl{width:100%;border-collapse:collapse}
.pt-tbl thead tr{background:rgba(255,255,255,.032);border-bottom:1px solid rgba(255,255,255,.07)}
.pt-tbl th{text-align:left;padding:.68rem 1rem;font-size:.66rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.26)}
.pt-row{border-bottom:1px solid rgba(255,255,255,.042);transition:background .14s}
.pt-row:last-child{border-bottom:none}.pt-row:hover{background:rgba(255,255,255,.025)}
.pt-tbl td{padding:.72rem 1rem;font-size:.83rem}
.pt-num{color:rgba(255,255,255,.2);font-size:.72rem;width:36px}
.pt-name{font-weight:500;color:rgba(255,255,255,.83)}
.pt-topic{color:rgba(255,255,255,.33);font-size:.73rem}.pt-acc{color:rgba(255,255,255,.3);font-size:.73rem}
.pt-diff{font-size:.68rem;font-weight:700;padding:.18rem .58rem;border-radius:100px;letter-spacing:.04em}
.pt-diff.easy{color:#4ade80;background:rgba(74,222,128,.12)}
.pt-diff.medium{color:#fb923c;background:rgba(251,146,60,.12)}
.pt-diff.hard{color:#f87171;background:rgba(248,113,113,.12)}
.pt-solve{color:#60a5fa;font-size:.76rem;text-decoration:none;white-space:nowrap;transition:color .14s}
.pt-solve:hover{color:#93c5fd}
@media(max-width:600px){.sq-tb{min-width:80px;font-size:.68rem}.pt-tbl th:nth-child(4),.pt-tbl td:nth-child(4),.pt-tbl th:nth-child(5),.pt-tbl td:nth-child(5){display:none}}
`;
export default StacksQueuesPage;