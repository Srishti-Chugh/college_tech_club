/// <reference types="vite/client" />
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type HType = 'minheap' | 'maxheap' | 'pq';
type NS = 'idle' | 'inserted' | 'deleted' | 'highlighted' | 'searched';
interface Log { msg: string; type: 'success' | 'error' | 'info' | 'highlight' }
interface P { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; topic: string; url: string; acceptance: string; }

const PROBS: P[] = [
    { title: 'Kth Largest Element in a Stream', difficulty: 'Easy', topic: 'Min Heap', url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', acceptance: '56.4%' },
    { title: 'Last Stone Weight', difficulty: 'Easy', topic: 'Max Heap', url: 'https://leetcode.com/problems/last-stone-weight/', acceptance: '64.5%' },
    { title: 'Relative Ranks', difficulty: 'Easy', topic: 'Heap', url: 'https://leetcode.com/problems/relative-ranks/', acceptance: '60.1%' },
    { title: 'Minimum Cost to Connect Sticks', difficulty: 'Easy', topic: 'Min Heap', url: 'https://leetcode.com/problems/minimum-cost-to-connect-sticks/', acceptance: '66.7%' },
    { title: 'Kth Largest Element in an Array', difficulty: 'Medium', topic: 'Min Heap / QuickSelect', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', acceptance: '66.2%' },
    { title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'Heap + HashMap', url: 'https://leetcode.com/problems/top-k-frequent-elements/', acceptance: '64.8%' },
    { title: 'K Closest Points to Origin', difficulty: 'Medium', topic: 'Max Heap / QuickSelect', url: 'https://leetcode.com/problems/k-closest-points-to-origin/', acceptance: '65.4%' },
    { title: 'Task Scheduler', difficulty: 'Medium', topic: 'Max Heap + Greedy', url: 'https://leetcode.com/problems/task-scheduler/', acceptance: '58.9%' },
    { title: 'Reorganize String', difficulty: 'Medium', topic: 'Max Heap', url: 'https://leetcode.com/problems/reorganize-string/', acceptance: '54.7%' },
    { title: 'Design Twitter', difficulty: 'Medium', topic: 'Heap + Design', url: 'https://leetcode.com/problems/design-twitter/', acceptance: '37.1%' },
    { title: 'Seat Reservation Manager', difficulty: 'Medium', topic: 'Min Heap', url: 'https://leetcode.com/problems/seat-reservation-manager/', acceptance: '68.2%' },
    { title: 'Process Tasks Using Servers', difficulty: 'Medium', topic: 'Min Heap', url: 'https://leetcode.com/problems/process-tasks-using-servers/', acceptance: '44.3%' },
    { title: 'Meeting Rooms II', difficulty: 'Medium', topic: 'Min Heap', url: 'https://leetcode.com/problems/meeting-rooms-ii/', acceptance: '50.7%' },
    { title: 'Find Median from Data Stream', difficulty: 'Hard', topic: 'Two Heaps', url: 'https://leetcode.com/problems/find-median-from-data-stream/', acceptance: '51.4%' },
    { title: 'Merge k Sorted Lists', difficulty: 'Hard', topic: 'Min Heap', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', acceptance: '51.4%' },
    { title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Monotonic Deque / Heap', url: 'https://leetcode.com/problems/sliding-window-maximum/', acceptance: '46.5%' },
    { title: 'IPO', difficulty: 'Hard', topic: 'Two Heaps', url: 'https://leetcode.com/problems/ipo/', acceptance: '46.3%' },
    { title: 'Trapping Rain Water II', difficulty: 'Hard', topic: 'Min Heap + BFS', url: 'https://leetcode.com/problems/trapping-rain-water-ii/', acceptance: '45.8%' },
    { title: 'Smallest Range Covering Elements', difficulty: 'Hard', topic: 'Min Heap', url: 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/', acceptance: '60.2%' },
];

const META: Record<HType, { label: string; color: string; desc: string; cx: [string, string][]; icon: string }> = {
    minheap: { label: 'Min Heap', color: '#22c55e', desc: 'Complete binary tree where every parent ≤ its children. Root = minimum element. Implemented as array. O(log n) insert and extract.', cx: [['O(log n)', 'Insert'], ['O(1)', 'Get Min'], ['O(log n)', 'Extract Min'], ['O(n)', 'Build Heap']], icon: '🔻' },
    maxheap: { label: 'Max Heap', color: '#f97316', desc: 'Complete binary tree where every parent ≥ its children. Root = maximum element. Same array representation, reversed comparator.', cx: [['O(log n)', 'Insert'], ['O(1)', 'Get Max'], ['O(log n)', 'Extract Max'], ['O(n)', 'Heapify']], icon: '🔺' },
    pq: { label: 'Priority Queue', color: '#c084fc', desc: 'Abstract data type — heap under the hood. Each element has a priority. Highest priority served first. Used in Dijkstra, A*, scheduling.', cx: [['O(log n)', 'Enqueue'], ['O(1)', 'Peek'], ['O(log n)', 'Dequeue'], ['O(n log n)', 'Sort']], icon: '⭐' },
};

// ── Heap logic ─────────────────────────────────────────────────────────────────
const parent = (i: number) => Math.floor((i - 1) / 2);
const left = (i: number) => 2 * i + 1;
const right = (i: number) => 2 * i + 2;

function heapInsert(arr: number[], val: number, isMin: boolean): number[] {
    const h = [...arr, val]; let i = h.length - 1;
    while (i > 0) { const p = parent(i); if (isMin ? h[p] <= h[i] : h[p] >= h[i]) break;[h[p], h[i]] = [h[i], h[p]]; i = p; }
    return h;
}
function heapExtract(arr: number[], isMin: boolean): [number[], number | null] {
    if (!arr.length) return [[], null];
    const top = arr[0]; const h = [...arr]; h[0] = h[h.length - 1]; h.pop();
    let i = 0;
    while (true) {
        let best = i; const l = left(i), r = right(i);
        if (l < h.length && (isMin ? h[l] < h[best] : h[l] > h[best])) best = l;
        if (r < h.length && (isMin ? h[r] < h[best] : h[r] > h[best])) best = r;
        if (best === i) break;[h[i], h[best]] = [h[best], h[i]]; i = best;
    }
    return [h, top];
}

// ── SVG Heap Visualizer ────────────────────────────────────────────────────────
interface HVizProps { heap: number[]; highlight: Set<number>; color: string; extractIdx?: number }
const HeapViz: React.FC<HVizProps> = ({ heap, highlight, color, extractIdx }) => {
    if (!heap.length) return <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'monospace', color: 'rgba(255,255,255,.2)', fontSize: 13 }}>Heap is empty</div>;
    const NR = 24, VGAP = 70, HGAP = 180;
    interface Layout { idx: number; x: number; y: number }
    const layouts: Layout[] = [];
    function assign(i: number, depth: number, lo: number, hi: number) {
        if (i >= heap.length) return;
        const x = (lo + hi) / 2, y = depth * VGAP + NR + 12;
        layouts.push({ idx: i, x, y });
        assign(left(i), depth + 1, lo, (lo + hi) / 2);
        assign(right(i), depth + 1, (lo + hi) / 2, hi);
    }
    const w = Math.max(400, heap.length * 60);
    assign(0, 0, 0, w);
    const maxY = layouts.reduce((m, l) => Math.max(m, l.y), 0);
    const svgH = maxY + NR + 20;
    return (
        <svg width="100%" viewBox={`0 0 ${w} ${svgH}`} style={{ overflow: 'visible' }}>
            {layouts.map(({ idx, x, y }) => {
                const pi = parent(idx);
                if (idx === 0) return null;
                const par = layouts.find(l => l.idx === pi);
                return par ? <line key={`e${idx}`} x1={par.x} y1={par.y} x2={x} y2={y} stroke="rgba(255,255,255,.12)" strokeWidth={1.5} /> : null;
            })}
            {layouts.map(({ idx, x, y }) => {
                const isH = highlight.has(idx), isE = extractIdx === idx;
                const fill = isE ? '#4a0f0f' : isH ? `${color}28` : '#141824';
                const stroke = isE ? '#ef4444' : isH ? color : 'rgba(255,255,255,.15)';
                return (<g key={idx} style={{ transition: 'all .35s cubic-bezier(.34,1.56,.64,1)' }}>
                    <circle cx={x} cy={y} r={NR} fill={fill} stroke={stroke} strokeWidth={2} style={{ filter: isH ? `drop-shadow(0 0 8px ${stroke})` : 'none', transition: 'all .35s' }} />
                    <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="central" fill={isH ? '#fff' : 'rgba(255,255,255,.85)'} fontSize={heap[idx] > 99 ? 11 : 13} fontFamily="monospace" fontWeight="700">{heap[idx]}</text>
                    <text x={x} y={y + NR + 13} textAnchor="middle" fill="rgba(255,255,255,.2)" fontSize={9} fontFamily="monospace">[{idx}]</text>
                    {idx === 0 && <text x={x} y={y - NR - 6} textAnchor="middle" fill={color} fontSize={9} fontFamily="monospace" fontWeight="600">ROOT (min)</text>}
                </g>);
            })}
        </svg>
    );
};

// ── Array representation bar ───────────────────────────────────────────────────
const ArrayRepr: React.FC<{ heap: number[]; color: string }> = ({ heap, color }) => (
    <div style={{ marginTop: '1rem' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '.66rem', color: 'rgba(255,255,255,.28)', marginBottom: '.4rem' }}>ARRAY REPRESENTATION (index = position in heap)</div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {heap.map((v, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                    <div style={{ width: 46, height: 42, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i === 0 ? `${color}22` : 'rgba(255,255,255,.04)', border: `1px solid ${i === 0 ? color : 'rgba(255,255,255,.1)'}`, fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: i === 0 ? color : 'rgba(255,255,255,.8)' }}>{v}</div>
                    <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,.2)' }}>[{i}]</span>
                </div>
            ))}
        </div>
    </div>
);

const HeapsPage: React.FC = () => {
    const navigate = useNavigate();
    const [hType, setHType] = useState<HType>('minheap');
    const [heap, setHeap] = useState<number[]>(() => { let h: number[] = [];[10, 20, 15, 40, 35, 30, 50].forEach(v => { h = heapInsert(h, v, true); }); return h; });
    const [highlight, setHighlight] = useState<Set<number>>(new Set());
    const [inputVal, setInputVal] = useState('');
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [log, setLog] = useState<Log[]>([{ msg: 'Min Heap ready with [10,15,20,30,35,40,50].', type: 'info' }]);
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const logRef = useRef<HTMLDivElement>(null);
    const meta = META[hType];
    const isMin = hType !== 'maxheap';

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);
    useEffect(() => {
        let h: number[] = [];
        const vals = hType === 'maxheap' ? [50, 40, 30, 20, 35, 15, 10] : [10, 20, 15, 40, 35, 30, 50];
        vals.forEach(v => { h = heapInsert(h, v, hType !== 'maxheap'); });
        setHeap(h); setHighlight(new Set());
        setLog([{ msg: `${meta.label} ready. ${meta.desc}`, type: 'info' }]);
        setActiveOp(null); setInputVal('');
    }, [hType]);

    const addLog = (msg: string, type: Log['type'] = 'info') => setLog(p => [...p.slice(-29), { msg, type }]);

    const insert = () => {
        const v = Number(inputVal); if (inputVal === '' || isNaN(v)) return addLog('Enter a valid number.', 'error');
        const before = heap.length; const newH = heapInsert(heap, v, isMin);
        const insertedIdx = newH.indexOf(v);
        setHeap(newH); setHighlight(new Set([insertedIdx]));
        setTimeout(() => setHighlight(new Set()), 1000);
        addLog(`Inserted ${v} at index [${insertedIdx}]. Bubble-up restored heap property. O(log n).`, 'success'); setInputVal('');
    };

    const extract = () => {
        if (!heap.length) return addLog('Heap is empty!', 'error');
        const top = heap[0];
        setHighlight(new Set([0]));
        setTimeout(() => {
            const [newH] = heapExtract(heap, isMin);
            setHeap(newH); setHighlight(new Set());
            addLog(`Extracted ${isMin ? 'min' : 'max'} = ${top}. Replaced root with last, sifted down. O(log n).`, 'success');
        }, 700);
    };

    const peek = () => {
        if (!heap.length) return addLog('Heap empty!', 'error');
        setHighlight(new Set([0]));
        setTimeout(() => setHighlight(new Set()), 900);
        addLog(`${isMin ? 'Minimum' : 'Maximum'} = ${heap[0]}. Always at root [index 0]. O(1).`, 'success');
    };

    const heapify = () => {
        const arr = [...heap].sort(() => Math.random() - .5);
        let h: number[] = []; arr.forEach(v => { h = heapInsert(h, v, isMin); });
        setHeap(h); setHighlight(new Set(h.map((_, i) => i)));
        setTimeout(() => setHighlight(new Set()), 1200);
        addLog(`Heapified array [${arr.join(',')}]. O(n) using bottom-up heapify (faster than n insertions).`, 'highlight');
    };

    const handleReset = () => { let h: number[] = [];[10, 20, 15, 40, 35, 30, 50].forEach(v => { h = heapInsert(h, v, isMin); }); setHeap(h); setHighlight(new Set()); setLog([{ msg: `${meta.label} reset.`, type: 'info' }]); };

    const filtered = PROBS.filter(p => filter === 'All' || p.difficulty === filter);
    const counts = { Easy: PROBS.filter(p => p.difficulty === 'Easy').length, Medium: PROBS.filter(p => p.difficulty === 'Medium').length, Hard: PROBS.filter(p => p.difficulty === 'Hard').length };
    const C = meta.color;

    const Chip = ({ l }: { l: string }) => <span style={{ fontSize: '.64rem', padding: '.15rem .5rem', borderRadius: 100, border: `1px solid ${C}35`, color: C, background: `${C}18`, letterSpacing: '.04em', flexShrink: 0 }}>{l}</span>;
    const Chev = ({ open }: { open: boolean }) => <svg style={{ color: 'rgba(255,255,255,.25)', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

    return (
        <div className="hp-root">
            <div className="hp-bg" aria-hidden><div className="hp-orb hp-o1" style={{ background: C }} /><div className="hp-orb hp-o2" /><div className="hp-grid" /></div>
            <button className="hp-back" onClick={() => navigate('/resources/cp-roadmap')}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>DSA Roadmap</button>
            <header className="hp-hdr">
                <div className="hp-badge" style={{ color: C, background: `${C}18`, borderColor: `${C}40` }}>Data Structures · Heaps / Priority Queues</div>
                <h1 className="hp-title" style={{ backgroundImage: `linear-gradient(135deg,#fff 30%,${C})` }}>{meta.icon} Heaps &amp; Priority Queues</h1>
                <p className="hp-sub">{meta.desc}</p>
                <div className="hp-stats">{meta.cx.map(([c, l]) => <div className="hp-stat" key={l}><span style={{ color: C, fontSize: '.95rem', fontWeight: 600 }}>{c}</span><span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.32)' }}>{l}</span></div>)}</div>
            </header>

            <section className="pg-wrap">
                <div className="hp-toggle">{(Object.entries(META) as [HType, typeof meta][]).map(([k, m]) => (
                    <button key={k} onClick={() => setHType(k)} className={`hp-tb${hType === k ? ' active' : ''}`} style={hType === k ? { borderColor: m.color, color: m.color, background: `${m.color}15` } : {}}>{m.icon} {m.label}</button>
                ))}</div>
                <div className="pg-hdr">
                    <h2 className="pg-title">Interactive Playground <span className="pg-chip" style={{ color: C, background: `${C}18`, borderColor: `${C}35` }}>{meta.label}</span></h2>
                    <button className="pg-reset" onClick={handleReset}>Reset</button>
                </div>

                <div className="pg-viz" style={{ flexDirection: 'column', alignItems: 'center', gap: '1rem', overflowX: 'auto' }}>
                    <HeapViz heap={heap} highlight={highlight} color={C} />
                    <ArrayRepr heap={heap} color={C} />
                </div>

                <div className="pg-ops">
                    {[
                        { id: 'ins', icon: '＋', name: 'Insert', badge: 'O(log n)', body: <><div className="pg-row"><input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && insert()} /><button className="pg-btn" style={{ background: C, color: '#000' }} onClick={insert}>Insert</button></div><p className="pg-hint">Appends to end of array, then bubbles up (swap with parent while heap property violated). At most O(log n) swaps.</p></> },
                        { id: 'ext', icon: '↑', name: `Extract ${isMin ? 'Min' : 'Max'}`, badge: 'O(log n)', body: <><div className="pg-row"><button className="pg-btn" style={{ background: '#ef4444', color: '#fff', flex: 1 }} onClick={extract}>Extract {isMin ? 'Minimum' : 'Maximum'}</button><button className="pg-btn" style={{ background: 'rgba(255,255,255,.08)', color: C, border: `1px solid ${C}40` }} onClick={peek}>Peek Root</button></div><p className="pg-hint">Replace root with last element, remove last, then sift down (swap with smaller/larger child). O(log n).</p></> },
                        { id: 'heapify', icon: '⚡', name: 'Heapify Array', badge: 'O(n)', body: <><div className="pg-row"><button className="pg-btn" style={{ background: C, color: '#000', flex: 1 }} onClick={heapify}>Heapify Current Elements</button></div><p className="pg-hint">Bottom-up heapify is O(n) — better than n individual inserts O(n log n). Start from last non-leaf, sift down each.</p></> },
                    ].map(op => {
                        const open = activeOp === op.id; return (
                            <div key={op.id} className={`pg-card${open ? ' open' : ''}`} onClick={() => setActiveOp(open ? null : op.id)}>
                                <div className="pg-ch"><span className="pg-ci">{op.icon}</span><span className="pg-cn">{op.name}</span><Chip l={op.badge} /><Chev open={open} /></div>
                                {open && <div className="pg-cb2" onClick={e => e.stopPropagation()}>{op.body}</div>}
                            </div>
                        );
                    })}
                    <div className="pg-card" style={{ cursor: 'default' }}>
                        <div className="pg-ch"><span className="pg-ci">📐</span><span className="pg-cn">Array Index Relations</span></div>
                        <div className="pg-cb2" style={{ cursor: 'default' }} onClick={e => e.stopPropagation()}>
                            <p className="pg-hint">For node at index i:<br />• Parent: floor((i−1)/2)<br />• Left child: 2i+1<br />• Right child: 2i+2<br />• Last non-leaf: floor(n/2)−1<br /><br />Min heap invariant: heap[parent] ≤ heap[child] for all nodes.<br />Heap sort: build max heap, repeatedly extract max → O(n log n) in-place sort.</p>
                        </div>
                    </div>
                </div>

                <div className="pg-log" ref={logRef}>
                    <span className="pg-ll">Operation Log</span>
                    {log.map((e, i) => <div key={i} className={`pg-le ${e.type}`}><span className="pg-la">›</span>{e.msg}</div>)}
                </div>
            </section>

            <section className="pt-wrap">
                <div className="pt-hdr"><div><h2 className="pt-title">Practice Problems</h2><p className="pt-sub">{PROBS.length} curated Heap problems</p></div>
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
.hp-root{min-height:100vh;background:#07080f;color:rgba(255,255,255,.92);font-family:'Courier New',monospace;display:flex;flex-direction:column;align-items:center;padding:0 1rem 6rem;position:relative;overflow-x:hidden}
.hp-bg{position:fixed;inset:0;pointer-events:none;z-index:0}
.hp-orb{position:absolute;border-radius:50%;filter:blur(130px);opacity:.09;transition:background .8s}
.hp-o1{width:700px;height:700px;top:-280px;left:-200px}
.hp-o2{width:500px;height:500px;background:#818cf8;bottom:-100px;right:-160px}
.hp-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px);background-size:50px 50px}
.hp-back{position:relative;z-index:2;align-self:flex-start;margin-top:1.6rem;display:flex;align-items:center;gap:.4rem;background:none;border:none;cursor:pointer;color:rgba(255,255,255,.3);font-family:inherit;font-size:.8rem;transition:color .2s}
.hp-back:hover{color:rgba(255,255,255,.65)}
.hp-hdr{position:relative;z-index:2;text-align:center;margin-top:2.5rem;max-width:740px;width:100%}
.hp-badge{display:inline-block;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;border:1px solid;border-radius:100px;padding:.27rem .85rem;margin-bottom:1rem;transition:all .4s}
.hp-title{font-family:'Unbounded',sans-serif;font-size:clamp(1.9rem,6vw,3.8rem);font-weight:800;letter-spacing:-.04em;line-height:.95;background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;transition:background-image .4s;margin-bottom:.9rem}
.hp-sub{color:rgba(255,255,255,.38);font-size:.8rem;line-height:1.7;max-width:560px;margin-inline:auto}
.hp-stats{display:flex;justify-content:center;gap:.75rem;flex-wrap:wrap;margin-top:1.4rem}
.hp-stat{display:flex;flex-direction:column;align-items:center;gap:.18rem;background:rgba(255,255,255,.035);border:1px solid rgba(255,255,255,.07);border-radius:12px;padding:.6rem 1rem}
.pg-wrap{position:relative;z-index:2;width:100%;max-width:900px;margin-top:2.5rem;background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:1.75rem}
.hp-toggle{display:flex;gap:.4rem;flex-wrap:wrap;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.06);border-radius:14px;padding:.38rem;margin-bottom:1.4rem}
.hp-tb{flex:1;min-width:110px;background:transparent;border:1px solid transparent;border-radius:10px;color:rgba(255,255,255,.35);font-family:inherit;font-size:.74rem;padding:.5rem .4rem;cursor:pointer;transition:all .22s;text-align:center}
.hp-tb:hover{color:rgba(255,255,255,.65)}.hp-tb.active{font-weight:700}
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
.pg-hint{font-size:.72rem;color:rgba(255,255,255,.28);line-height:1.75}
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
@media(max-width:600px){.hp-tb{min-width:80px;font-size:.68rem}.pt-tbl th:nth-child(4),.pt-tbl td:nth-child(4),.pt-tbl th:nth-child(5),.pt-tbl td:nth-child(5){display:none}}
`;
export default HeapsPage;