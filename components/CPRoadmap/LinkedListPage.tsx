/// <reference types="vite/client" />
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './shared.css';

// ─── Types ────────────────────────────────────────────────────────────────────
type LLType = 'singly' | 'doubly' | 'circular' | 'circular-doubly';

type NodeState = 'idle' | 'inserted' | 'deleted' | 'searched' | 'highlighted' | 'slow' | 'fast';

interface LLNode {
    id: number;
    value: number;
    state: NodeState;
}

interface LogEntry { msg: string; type: 'success' | 'error' | 'info' | 'highlight' }

// ─── Problems ─────────────────────────────────────────────────────────────────
interface Problem {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    url: string;
    acceptance: string;
}

const PROBLEMS: Problem[] = [
    // Easy
    { title: 'Reverse Linked List', difficulty: 'Easy', topic: 'Two Pointers', url: 'https://leetcode.com/problems/reverse-linked-list/', acceptance: '74.6%' },
    { title: 'Merge Two Sorted Lists', difficulty: 'Easy', topic: 'Two Pointers', url: 'https://leetcode.com/problems/merge-two-sorted-lists/', acceptance: '63.8%' },
    { title: 'Linked List Cycle', difficulty: 'Easy', topic: "Floyd's Cycle", url: 'https://leetcode.com/problems/linked-list-cycle/', acceptance: '50.3%' },
    { title: 'Palindrome Linked List', difficulty: 'Easy', topic: 'Fast/Slow Pointer', url: 'https://leetcode.com/problems/palindrome-linked-list/', acceptance: '52.4%' },
    { title: 'Remove Duplicates from Sorted List', difficulty: 'Easy', topic: 'Pointer', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/', acceptance: '51.7%' },
    { title: 'Intersection of Two Linked Lists', difficulty: 'Easy', topic: 'Two Pointers', url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/', acceptance: '57.9%' },
    { title: 'Middle of the Linked List', difficulty: 'Easy', topic: 'Fast/Slow Pointer', url: 'https://leetcode.com/problems/middle-of-the-linked-list/', acceptance: '77.1%' },
    { title: 'Convert Binary Number in LL to Integer', difficulty: 'Easy', topic: 'Bit Manipulation', url: 'https://leetcode.com/problems/convert-binary-number-in-a-linked-list-to-integer/', acceptance: '82.3%' },
    { title: 'Delete Node in a Linked List', difficulty: 'Easy', topic: 'Pointer', url: 'https://leetcode.com/problems/delete-node-in-a-linked-list/', acceptance: '77.8%' },
    { title: 'Remove Linked List Elements', difficulty: 'Easy', topic: 'Pointer', url: 'https://leetcode.com/problems/remove-linked-list-elements/', acceptance: '48.9%' },
    // Medium
    { title: 'Add Two Numbers', difficulty: 'Medium', topic: 'Simulation', url: 'https://leetcode.com/problems/add-two-numbers/', acceptance: '42.5%' },
    { title: 'Odd Even Linked List', difficulty: 'Medium', topic: 'Two Pointers', url: 'https://leetcode.com/problems/odd-even-linked-list/', acceptance: '60.4%' },
    { title: 'Linked List Cycle II', difficulty: 'Medium', topic: "Floyd's Cycle", url: 'https://leetcode.com/problems/linked-list-cycle-ii/', acceptance: '50.7%' },
    { title: 'Remove Nth Node From End', difficulty: 'Medium', topic: 'Two Pointers', url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', acceptance: '43.8%' },
    { title: 'Swap Nodes in Pairs', difficulty: 'Medium', topic: 'Recursion', url: 'https://leetcode.com/problems/swap-nodes-in-pairs/', acceptance: '64.2%' },
    { title: 'Reorder List', difficulty: 'Medium', topic: 'Fast/Slow + Reverse', url: 'https://leetcode.com/problems/reorder-list/', acceptance: '56.3%' },
    { title: 'LRU Cache', difficulty: 'Medium', topic: 'Doubly LL + HashMap', url: 'https://leetcode.com/problems/lru-cache/', acceptance: '42.1%' },
    { title: 'Rotate List', difficulty: 'Medium', topic: 'Two Pointers', url: 'https://leetcode.com/problems/rotate-list/', acceptance: '37.9%' },
    { title: 'Partition List', difficulty: 'Medium', topic: 'Two Pointers', url: 'https://leetcode.com/problems/partition-list/', acceptance: '54.6%' },
    { title: 'Sort List', difficulty: 'Medium', topic: 'Merge Sort on LL', url: 'https://leetcode.com/problems/sort-list/', acceptance: '55.8%' },
    { title: 'Copy List with Random Pointer', difficulty: 'Medium', topic: 'HashMap', url: 'https://leetcode.com/problems/copy-list-with-random-pointer/', acceptance: '55.1%' },
    { title: 'Design Linked List', difficulty: 'Medium', topic: 'Design', url: 'https://leetcode.com/problems/design-linked-list/', acceptance: '29.8%' },
    { title: 'Insert into a Sorted Circular LL', difficulty: 'Medium', topic: 'Circular LL', url: 'https://leetcode.com/problems/insert-into-a-sorted-circular-linked-list/', acceptance: '36.4%' },
    // Hard
    { title: 'Reverse Nodes in k-Group', difficulty: 'Hard', topic: 'Recursion', url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/', acceptance: '57.2%' },
    { title: 'Merge k Sorted Lists', difficulty: 'Hard', topic: 'Heap / Divide&Conquer', url: 'https://leetcode.com/problems/merge-k-sorted-lists/', acceptance: '51.4%' },
    { title: 'Reverse Linked List II', difficulty: 'Hard', topic: 'Two Pointers', url: 'https://leetcode.com/problems/reverse-linked-list-ii/', acceptance: '46.8%' },
    { title: 'All O(1) Data Structure', difficulty: 'Hard', topic: 'Doubly LL + HashMap', url: 'https://leetcode.com/problems/all-oone-data-structure/', acceptance: '37.9%' },
    { title: 'Design Skiplist', difficulty: 'Hard', topic: 'Skip List', url: 'https://leetcode.com/problems/design-skiplist/', acceptance: '65.1%' },
];

// ─── LL Type Metadata ─────────────────────────────────────────────────────────
const LL_META: Record<LLType, {
    label: string; color: string; desc: string;
    complexities: [string, string][];
    features: string[];
}> = {
    singly: {
        label: 'Singly Linked List', color: '#f97316',
        desc: 'Each node points to the next. Traversal is one-directional. Foundation of all linked lists.',
        complexities: [['O(1)', 'Insert Head'], ['O(n)', 'Insert Tail'], ['O(n)', 'Search'], ['O(1)', 'Delete Head']],
        features: ['One pointer (next)', 'Forward traversal only', 'Less memory than doubly', 'Used in stacks, queues'],
    },
    doubly: {
        label: 'Doubly Linked List', color: '#22c55e',
        desc: 'Each node has both next and prev pointers. Enables O(1) deletion with node reference.',
        complexities: [['O(1)', 'Insert Head/Tail'], ['O(n)', 'Search'], ['O(1)', 'Delete (with ref)'], ['O(n)', 'Traversal']],
        features: ['Two pointers (prev + next)', 'Bidirectional traversal', 'O(1) deletion with ref', 'Used in LRU Cache, Browser history'],
    },
    circular: {
        label: 'Circular Linked List', color: '#60a5fa',
        desc: 'Last node points back to head. No null terminator. Useful for round-robin scheduling.',
        complexities: [['O(1)', 'Insert Head'], ['O(n)', 'Insert at pos'], ['O(n)', 'Search'], ['O(1)', 'Traverse loop']],
        features: ['Tail → Head wrap-around', 'No null at end', 'Used in OS scheduling', 'Josephus problem'],
    },
    'circular-doubly': {
        label: 'Circular Doubly LL', color: '#c084fc',
        desc: 'Combines doubly and circular. Head.prev = Tail, Tail.next = Head. Used in advanced data structures.',
        complexities: [['O(1)', 'Insert Head/Tail'], ['O(1)', 'Delete (with ref)'], ['O(n)', 'Search'], ['O(n)', 'Traversal']],
        features: ['prev + next pointers', 'Full circular linkage', 'Used in Deque, Fibonacci Heap', 'O(1) insert/delete at ends'],
    },
};

// ─── Node ID counter ─────────────────────────────────────────────────────────
let _id = 0;
const uid = () => ++_id;

// ─── Default lists ────────────────────────────────────────────────────────────
const defaultList = (): LLNode[] =>
    [10, 25, 7, 42, 18].map(v => ({ id: uid(), value: v, state: 'idle' as NodeState }));

// ─── SVG Arrow Marker defs ────────────────────────────────────────────────────
const ARROW_FWD = 'url(#arrowFwd)';
const ARROW_BACK = 'url(#arrowBack)';
const ARROW_CIRC = 'url(#arrowCirc)';

// ─── Visualiser Component ─────────────────────────────────────────────────────
interface VisualizerProps {
    nodes: LLNode[];
    llType: LLType;
    color: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ nodes, llType, color }) => {
    const NODE_W = 64, NODE_H = 44, H_GAP = 52, V_OFFSET = 30;
    const isDouble = llType === 'doubly' || llType === 'circular-doubly';
    const isCircular = llType === 'circular' || llType === 'circular-doubly';
    const n = nodes.length;

    const NODE_COLORS: Record<NodeState, { fill: string; stroke: string; text: string }> = {
        idle: { fill: '#141824', stroke: 'rgba(255,255,255,0.14)', text: 'rgba(255,255,255,0.85)' },
        inserted: { fill: '#14451f', stroke: '#22c55e', text: '#fff' },
        deleted: { fill: '#4a0f0f', stroke: '#ef4444', text: '#fff' },
        searched: { fill: '#44310a', stroke: '#f59e0b', text: '#fff' },
        highlighted: { fill: '#0f2a48', stroke: color, text: '#fff' },
        slow: { fill: '#1a2f1a', stroke: '#4ade80', text: '#fff' },
        fast: { fill: '#2a1a40', stroke: '#a78bfa', text: '#fff' },
    };

    if (n === 0) return (
        <svg width="100%" viewBox="0 0 400 100">
            <text x="200" y="55" textAnchor="middle" fill="rgba(255,255,255,0.2)"
                fontFamily="'Geist Mono',monospace" fontSize="14">Empty list</text>
        </svg>
    );

    // Layout: each node at x = i * (NODE_W + H_GAP)
    const totalW = n * NODE_W + (n - 1) * H_GAP + 120; // extra for circular arc
    const svgH = isCircular && n > 1 ? 160 : isDouble ? 110 : 90;
    const startX = 24;
    const nodeY = isDouble ? 34 : 22;

    const cx = (i: number) => startX + i * (NODE_W + H_GAP) + NODE_W / 2;
    const nodeRight = (i: number) => startX + i * (NODE_W + H_GAP) + NODE_W;
    const nodeLeft = (i: number) => startX + i * (NODE_W + H_GAP);

    return (
        <svg width="100%" viewBox={`0 0 ${Math.max(totalW, 400)} ${svgH}`} style={{ overflow: 'visible', minWidth: Math.min(totalW, 800) }}>
            <defs>
                <marker id="arrowFwd" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill={color} opacity="0.8" />
                </marker>
                <marker id="arrowBack" markerWidth="8" markerHeight="8" refX="2" refY="3" orient="auto">
                    <path d="M8,0 L8,6 L0,3 z" fill="rgba(255,255,255,0.35)" opacity="0.8" />
                </marker>
                <marker id="arrowCirc" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L8,3 z" fill={color} opacity="0.6" />
                </marker>
            </defs>

            {/* Forward arrows (next pointers) */}
            {nodes.map((node, i) => {
                if (i === n - 1 && !isCircular) return null;
                const x1 = nodeRight(i);
                const x2 = isCircular && i === n - 1 ? nodeLeft(0) : nodeLeft(i + 1);
                const y = nodeY + NODE_H / 2;

                if (isCircular && i === n - 1 && n > 1) {
                    // Arc below
                    const arcY = svgH - 18;
                    return (
                        <g key={`fwd-${node.id}`}>
                            <path
                                d={`M ${nodeRight(n - 1) - 4} ${y + 4} Q ${(nodeRight(n - 1) + nodeLeft(0)) / 2} ${arcY} ${nodeLeft(0) + 4} ${y + 4}`}
                                fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="5 3" opacity={0.6}
                                markerEnd={ARROW_CIRC}
                            />
                            <text x={(nodeRight(n - 1) + nodeLeft(0)) / 2} y={arcY + 14}
                                textAnchor="middle" fill={color} fontSize={9} opacity={0.6}
                                fontFamily="'Geist Mono',monospace">tail → head</text>
                        </g>
                    );
                }

                return (
                    <line key={`fwd-${node.id}`}
                        x1={x1 + 2} y1={y} x2={x2 - 2} y2={y}
                        stroke={color} strokeWidth={1.6} opacity={0.75}
                        markerEnd={ARROW_FWD}
                    />
                );
            })}

            {/* Backward arrows (prev pointers for doubly) */}
            {isDouble && nodes.map((node, i) => {
                if (i === 0 && !isCircular) return null;
                const fromIdx = isCircular && i === 0 ? n - 1 : i;
                const toIdx = isCircular && i === 0 ? 0 : i - 1;
                if (isCircular && i !== 0) return null; // only draw head ← tail for circular-doubly

                const x1 = nodeLeft(fromIdx) + 4;
                const x2 = nodeRight(toIdx) - 4;
                const y = nodeY + NODE_H / 2 + 14;

                if (isCircular) {
                    const arcY2 = svgH - 34;
                    return (
                        <path key={`back-circ-${node.id}`}
                            d={`M ${nodeRight(n - 1) - 4} ${nodeY + NODE_H / 2 + 4} Q ${(nodeRight(n - 1) + nodeLeft(0)) / 2} ${arcY2} ${nodeLeft(0) + 4} ${nodeY + NODE_H / 2 + 4}`}
                            fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1.2} strokeDasharray="4 3"
                            markerEnd={ARROW_BACK}
                        />
                    );
                }

                return (
                    <line key={`back-${node.id}`}
                        x1={x1} y1={y} x2={x2} y2={y}
                        stroke="rgba(255,255,255,0.3)" strokeWidth={1.2} strokeDasharray="3 3"
                        markerEnd={ARROW_BACK}
                    />
                );
            })}

            {/* Backward regular doubly */}
            {isDouble && !isCircular && nodes.map((node, i) => {
                if (i === 0) return null;
                const x1 = nodeLeft(i) + 2;
                const x2 = nodeRight(i - 1) - 2;
                const y = nodeY + NODE_H / 2 + 13;
                return (
                    <line key={`back-${node.id}`}
                        x1={x1} y1={y} x2={x2} y2={y}
                        stroke="rgba(255,255,255,0.28)" strokeWidth={1.2} strokeDasharray="3 3"
                        markerEnd={ARROW_BACK}
                    />
                );
            })}

            {/* NULL at end */}
            {!isCircular && n > 0 && (() => {
                const nx = nodeRight(n - 1) + 10;
                const ny = nodeY + NODE_H / 2;
                return (
                    <g>
                        <line x1={nx} y1={ny} x2={nx + 36} y2={ny} stroke="rgba(255,255,255,0.18)" strokeWidth={1.2} />
                        <text x={nx + 40} y={ny + 4} fill="rgba(255,255,255,0.25)" fontSize={11}
                            fontFamily="'Geist Mono',monospace">null</text>
                    </g>
                );
            })()}

            {/* HEAD label */}
            <text x={cx(0)} y={nodeY - 8} textAnchor="middle" fill={color}
                fontSize={9} fontFamily="'Geist Mono',monospace" fontWeight="600">HEAD</text>

            {/* TAIL label */}
            {n > 1 && (
                <text x={cx(n - 1)} y={nodeY - 8} textAnchor="middle" fill="rgba(255,255,255,0.35)"
                    fontSize={9} fontFamily="'Geist Mono',monospace">TAIL</text>
            )}

            {/* Nodes */}
            {nodes.map((node, i) => {
                const c = NODE_COLORS[node.state] ?? NODE_COLORS.idle;
                const x = startX + i * (NODE_W + H_GAP);
                const y = nodeY;
                return (
                    <g key={node.id} style={{ transition: 'all 0.35s cubic-bezier(.34,1.56,.64,1)' }}>
                        {/* Node box */}
                        <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={10}
                            fill={c.fill} stroke={c.stroke} strokeWidth={2}
                            style={{ filter: node.state !== 'idle' ? `drop-shadow(0 0 8px ${c.stroke})` : 'none', transition: 'all 0.35s' }}
                        />
                        {/* Value */}
                        <text x={x + NODE_W / 2} y={y + NODE_H / 2 + 1} textAnchor="middle"
                            dominantBaseline="central" fill={c.text} fontSize={14}
                            fontFamily="'Geist Mono',monospace" fontWeight="700">{node.value}</text>
                        {/* Index below */}
                        <text x={x + NODE_W / 2} y={y + NODE_H + 11} textAnchor="middle"
                            fill="rgba(255,255,255,0.2)" fontSize={9} fontFamily="'Geist Mono',monospace">[{i}]</text>
                        {/* Pointer divider line */}
                        <line x1={x + NODE_W - 16} y1={y + 4} x2={x + NODE_W - 16} y2={y + NODE_H - 4}
                            stroke={c.stroke} strokeWidth={1} opacity={0.4} />
                        <text x={x + NODE_W - 8} y={y + NODE_H / 2 + 1} textAnchor="middle"
                            dominantBaseline="central" fill={c.stroke} fontSize={8}
                            fontFamily="'Geist Mono',monospace" opacity={0.7}>→</text>
                    </g>
                );
            })}
        </svg>
    );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const LinkedListPage: React.FC = () => {
    const navigate = useNavigate();

    const [llType, setLLType] = useState<LLType>('singly');
    const [nodes, setNodes] = useState<LLNode[]>(defaultList);
    const [inputVal, setInputVal] = useState('');
    const [inputIdx, setInputIdx] = useState('');
    const [searchVal, setSearchVal] = useState('');
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [log, setLog] = useState<LogEntry[]>([{ msg: 'Singly Linked List loaded with [10 → 25 → 7 → 42 → 18 → null]', type: 'info' }]);
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const logRef = useRef<HTMLDivElement>(null);
    const vizRef = useRef<HTMLDivElement>(null);

    const meta = LL_META[llType];

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [log]);

    const addLog = (msg: string, type: LogEntry['type'] = 'info') =>
        setLog(prev => [...prev.slice(-29), { msg, type }]);

    const resetStates = useCallback((ns: LLNode[]) =>
        ns.map(n => ({ ...n, state: 'idle' as NodeState })), []);

    const flash = (updater: (prev: LLNode[]) => LLNode[], delay = 950) => {
        setNodes(prev => updater([...prev]));
        setTimeout(() => setNodes(prev => resetStates([...prev])), delay);
    };

    // On type change - reset list
    useEffect(() => {
        setNodes(defaultList());
        setLog([{ msg: `${meta.label} loaded. ${meta.desc}`, type: 'info' }]);
        setActiveOp(null);
        setInputVal(''); setInputIdx(''); setSearchVal('');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [llType]);

    // ── Operations ──────────────────────────────────────────────────────────────
    const insertHead = () => {
        const v = Number(inputVal);
        if (inputVal === '' || isNaN(v)) return addLog('Enter a valid number.', 'error');
        setNodes(prev => [{ id: uid(), value: v, state: 'inserted' }, ...resetStates(prev)]);
        setTimeout(() => setNodes(p => resetStates(p)), 950);
        addLog(`Inserted ${v} at head. O(1) — just update head pointer.`, 'success');
        setInputVal('');
    };

    const insertTail = () => {
        const v = Number(inputVal);
        if (inputVal === '' || isNaN(v)) return addLog('Enter a valid number.', 'error');
        setNodes(prev => [...resetStates(prev), { id: uid(), value: v, state: 'inserted' }]);
        setTimeout(() => setNodes(p => resetStates(p)), 950);
        addLog(`Inserted ${v} at tail. O(n) — must traverse to end.`, 'success');
        setInputVal('');
    };

    const insertAt = () => {
        const v = Number(inputVal), idx = Number(inputIdx);
        if (inputVal === '' || isNaN(v)) return addLog('Enter a valid value.', 'error');
        if (inputIdx === '' || isNaN(idx) || idx < 0) return addLog('Enter a valid index ≥ 0.', 'error');
        setNodes(prev => {
            const ns = resetStates([...prev]);
            if (idx === 0) return [{ id: uid(), value: v, state: 'inserted' }, ...ns];
            if (idx >= ns.length) return [...ns, { id: uid(), value: v, state: 'inserted' }];
            const result = [...ns];
            result[idx - 1] = { ...result[idx - 1], state: 'highlighted' };
            result.splice(idx, 0, { id: uid(), value: v, state: 'inserted' });
            return result;
        });
        setTimeout(() => setNodes(p => resetStates(p)), 950);
        addLog(`Inserted ${v} at index ${idx}. O(n) traversal to position.`, 'success');
        setInputVal(''); setInputIdx('');
    };

    const deleteHead = () => {
        if (nodes.length === 0) return addLog('List is empty!', 'error');
        const val = nodes[0].value;
        setNodes(prev => {
            const ns = resetStates([...prev]);
            ns[0] = { ...ns[0], state: 'deleted' };
            return ns;
        });
        setTimeout(() => setNodes(p => resetStates(p.slice(1))), 700);
        addLog(`Deleted head (${val}). O(1) — move head pointer to next.`, 'success');
    };

    const deleteTail = () => {
        if (nodes.length === 0) return addLog('List is empty!', 'error');
        const val = nodes[nodes.length - 1].value;
        setNodes(prev => {
            const ns = resetStates([...prev]);
            ns[ns.length - 1] = { ...ns[ns.length - 1], state: 'deleted' };
            return ns;
        });
        setTimeout(() => setNodes(p => resetStates(p.slice(0, -1))), 700);
        addLog(`Deleted tail (${val}). O(n) — must traverse to second-last node.`, 'success');
    };

    const deleteAt = () => {
        const idx = Number(inputIdx);
        if (inputIdx === '' || isNaN(idx) || idx < 0) return addLog('Enter a valid index.', 'error');
        if (idx >= nodes.length) return addLog(`Index ${idx} out of bounds (size=${nodes.length}).`, 'error');
        const val = nodes[idx].value;
        setNodes(prev => {
            const ns = resetStates([...prev]);
            if (idx > 0) ns[idx - 1] = { ...ns[idx - 1], state: 'highlighted' };
            ns[idx] = { ...ns[idx], state: 'deleted' };
            return ns;
        });
        setTimeout(() => setNodes(p => { const ns = [...p]; ns.splice(idx, 1); return resetStates(ns); }), 700);
        addLog(`Deleted node at index ${idx} (value=${val}). O(n) traversal.`, 'success');
        setInputIdx('');
    };

    const search = () => {
        const v = Number(searchVal);
        if (searchVal === '' || isNaN(v)) return addLog('Enter a value to search.', 'error');
        const idx = nodes.findIndex(n => n.value === v);
        if (idx === -1) {
            flash(prev => prev.map((n, i) => ({ ...n, state: 'highlighted' })));
            addLog(`${v} not found. Traversed all ${nodes.length} nodes. O(n).`, 'error');
        } else {
            flash(prev => prev.map((n, i) => ({
                ...n, state: i < idx ? 'highlighted' : i === idx ? 'searched' : 'idle',
            })), 1400);
            addLog(`Found ${v} at index ${idx} after ${idx + 1} step(s). O(n).`, 'success');
        }
        setSearchVal('');
    };

    const reverseList = () => {
        if (nodes.length === 0) return addLog('List is empty!', 'error');
        setNodes(prev => {
            const ns = [...prev].reverse().map((n, i) => ({
                ...n, state: 'highlighted' as NodeState,
            }));
            return ns;
        });
        setTimeout(() => setNodes(p => resetStates(p)), 1200);
        addLog(`Reversed list using three-pointer technique. O(n) time, O(1) space.`, 'highlight');
    };

    const detectCycle = () => {
        if (nodes.length < 2) return addLog('Need at least 2 nodes to demo Floyd\'s algorithm.', 'error');
        // Animate slow (every 1) and fast (every 2) pointer
        let slow = 0, fast = 0, step = 0;
        const maxSteps = nodes.length * 2;
        const iv = setInterval(() => {
            step++;
            fast = Math.min(fast + 2, nodes.length - 1);
            slow = Math.min(slow + 1, nodes.length - 1);
            setNodes(prev => prev.map((n, i) => ({
                ...n,
                state: i === slow && i === fast ? 'searched' : i === slow ? 'slow' : i === fast ? 'fast' : 'idle',
            })));
            if (step >= maxSteps || fast >= nodes.length - 1) {
                clearInterval(iv);
                setTimeout(() => setNodes(p => resetStates(p)), 600);
                addLog('Floyd\'s cycle detection: slow pointer moves 1 step, fast moves 2. If they meet → cycle exists. O(n).', 'highlight');
            }
        }, 420);
    };

    const findMiddle = () => {
        if (nodes.length === 0) return addLog('List is empty!', 'error');
        let slow = 0, fast = 0, step = 0;
        const iv = setInterval(() => {
            fast = Math.min(fast + 2, nodes.length - 1);
            slow = Math.min(slow + 1, nodes.length - 1);
            step++;
            setNodes(prev => prev.map((n, i) => ({
                ...n, state: i === slow ? 'slow' : i === fast ? 'fast' : 'idle',
            })));
            if (fast >= nodes.length - 1) {
                clearInterval(iv);
                const midVal = nodes[slow].value;
                setTimeout(() => {
                    setNodes(prev => prev.map((n, i) => ({ ...n, state: i === slow ? 'searched' : 'idle' })));
                    setTimeout(() => setNodes(p => resetStates(p)), 900);
                }, 200);
                addLog(`Middle node found: value = ${midVal} (index ${slow}). Fast/slow pointer trick. O(n).`, 'success');
            }
        }, 400);
    };

    const handleReset = () => {
        setNodes(defaultList());
        setLog([{ msg: `${meta.label} reset to default [10 → 25 → 7 → 42 → 18].`, type: 'info' }]);
    };

    const filtered = PROBLEMS.filter(p => filter === 'All' || p.difficulty === filter);
    const counts = {
        Easy: PROBLEMS.filter(p => p.difficulty === 'Easy').length,
        Medium: PROBLEMS.filter(p => p.difficulty === 'Medium').length,
        Hard: PROBLEMS.filter(p => p.difficulty === 'Hard').length,
    };

    const opBadge = (label: string) => (
        <span className="ll-op-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}35` }}>{label}</span>
    );

    return (
        <div className="ll-root">
            {/* BG */}
            <div className="ll-bg" aria-hidden>
                <div className="ll-orb ll-orb1" style={{ background: meta.color }} />
                <div className="ll-orb ll-orb2" />
                <div className="ll-grid" />
            </div>

            {/* Back */}
            <button className="ll-back" onClick={() => navigate('/resources/cp-roadmap')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                DSA Roadmap
            </button>

            {/* Header */}
            <header className="ll-header">
                <div className="ll-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}40` }}>
                    Data Structures · Linked Lists
                </div>
                <h1 className="ll-title" style={{ backgroundImage: `linear-gradient(135deg, #fff 30%, ${meta.color})` }}>
                    Linked Lists
                </h1>
                <p className="ll-subtitle" style={{ transition: 'all 0.3s' }}>{meta.desc}</p>
                <div className="ll-stats">
                    {meta.complexities.map(([c, l]) => (
                        <div className="ll-stat" key={l}>
                            <span className="ll-stat-code" style={{ color: meta.color }}>{c}</span>
                            <span className="ll-stat-label">{l}</span>
                        </div>
                    ))}
                </div>
                {/* Features */}
                <div className="ll-features">
                    {meta.features.map(f => (
                        <span key={f} className="ll-feature" style={{ borderColor: `${meta.color}30`, color: 'rgba(255,255,255,0.5)' }}>
                            <span style={{ color: meta.color, marginRight: 5 }}>▸</span>{f}
                        </span>
                    ))}
                </div>
            </header>

            {/* ══ PLAYGROUND ══ */}
            <section className="pg-wrap">

                {/* Type toggle */}
                <div className="ll-toggle-row">
                    {(Object.entries(LL_META) as [LLType, typeof meta][]).map(([key, m]) => (
                        <button key={key}
                            onClick={() => setLLType(key)}
                            className={`ll-toggle-btn ${llType === key ? 'active' : ''}`}
                            style={llType === key ? { borderColor: m.color, color: m.color, background: `${m.color}15` } : {}}
                        >{m.label}</button>
                    ))}
                </div>

                {/* Header row */}
                <div className="pg-hdr">
                    <h2 className="pg-title">
                        Interactive Playground
                        <span className="pg-chip" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}35` }}>
                            {meta.label}
                        </span>
                    </h2>
                    <button className="pg-reset" onClick={handleReset}>Reset</button>
                </div>

                {/* Visualizer */}
                <div className="pg-viz" ref={vizRef} style={{ overflowX: 'auto' }}>
                    <Visualizer nodes={nodes} llType={llType} color={meta.color} />
                </div>

                {/* Legend */}
                <div className="pg-legend">
                    {[
                        [meta.color, 'Highlighted / Path'],
                        ['#22c55e', 'Inserted'],
                        ['#ef4444', 'Deleted'],
                        ['#f59e0b', 'Found'],
                        ['#4ade80', 'Slow Pointer'],
                        ['#a78bfa', 'Fast Pointer'],
                    ].map(([c, l]) => (
                        <span className="pg-leg" key={l}>
                            <span className="pg-leg-dot" style={{ background: c }} />{l}
                        </span>
                    ))}
                </div>

                {/* ── Operations ── */}
                <div className="pg-ops">

                    {/* Insert */}
                    <div className={`pg-card ${activeOp === 'insert' ? 'open' : ''}`} onClick={() => setActiveOp(activeOp === 'insert' ? null : 'insert')}>
                        <div className="pg-card-head">
                            <span className="pg-card-icon">＋</span>
                            <span className="pg-card-name">Insert</span>
                            {opBadge('O(1) / O(n)')}
                            <svg className={`pg-chev ${activeOp === 'insert' ? 'rot' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'insert' && (
                            <div className="pg-card-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} />
                                    <button className="pg-btn" style={{ background: meta.color, color: '#000' }} onClick={insertHead}>Insert at Head</button>
                                    <button className="pg-btn" style={{ background: `${meta.color}88`, color: '#000' }} onClick={insertTail}>Insert at Tail</button>
                                </div>
                                <div className="pg-row">
                                    <input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} />
                                    <input className="pg-inp sm" placeholder="Index" value={inputIdx} onChange={e => setInputIdx(e.target.value)} />
                                    <button className="pg-btn" style={{ background: '#3b82f6', color: '#fff' }} onClick={insertAt}>Insert at Index</button>
                                </div>
                                <p className="pg-hint">Head insert: O(1). Tail / middle: O(n) — traverse to position first.</p>
                            </div>
                        )}
                    </div>

                    {/* Delete */}
                    <div className={`pg-card ${activeOp === 'delete' ? 'open' : ''}`} onClick={() => setActiveOp(activeOp === 'delete' ? null : 'delete')}>
                        <div className="pg-card-head">
                            <span className="pg-card-icon">－</span>
                            <span className="pg-card-name">Delete</span>
                            {opBadge('O(1) / O(n)')}
                            <svg className={`pg-chev ${activeOp === 'delete' ? 'rot' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'delete' && (
                            <div className="pg-card-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <button className="pg-btn" style={{ background: '#ef4444', color: '#fff', flex: 1 }} onClick={deleteHead}>Delete Head — O(1)</button>
                                    <button className="pg-btn" style={{ background: '#b91c1c', color: '#fff', flex: 1 }} onClick={deleteTail}>Delete Tail — O(n)</button>
                                </div>
                                <div className="pg-row">
                                    <input className="pg-inp sm" placeholder="Index" value={inputIdx} onChange={e => setInputIdx(e.target.value)} />
                                    <button className="pg-btn" style={{ background: '#7f1d1d', color: '#fff' }} onClick={deleteAt}>Delete at Index — O(n)</button>
                                </div>
                                <p className="pg-hint">
                                    {llType === 'doubly' || llType === 'circular-doubly'
                                        ? 'Doubly LL: O(1) deletion if you hold the node reference (prev.next = node.next).'
                                        : 'Must traverse to the node before the target. O(n).'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div className={`pg-card ${activeOp === 'search' ? 'open' : ''}`} onClick={() => setActiveOp(activeOp === 'search' ? null : 'search')}>
                        <div className="pg-card-head">
                            <span className="pg-card-icon">🔍</span>
                            <span className="pg-card-name">Search</span>
                            {opBadge('O(n)')}
                            <svg className={`pg-chev ${activeOp === 'search' ? 'rot' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'search' && (
                            <div className="pg-card-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <input className="pg-inp" placeholder="Value to find" value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} />
                                    <button className="pg-btn" style={{ background: '#f59e0b', color: '#000' }} onClick={search}>Linear Search</button>
                                </div>
                                <p className="pg-hint">No random access — must traverse node-by-node from head. Blue = visited, Yellow = found.</p>
                            </div>
                        )}
                    </div>

                    {/* Reverse */}
                    <div className={`pg-card ${activeOp === 'reverse' ? 'open' : ''}`} onClick={() => setActiveOp(activeOp === 'reverse' ? null : 'reverse')}>
                        <div className="pg-card-head">
                            <span className="pg-card-icon">⇄</span>
                            <span className="pg-card-name">Reverse</span>
                            {opBadge('O(n) T · O(1) S')}
                            <svg className={`pg-chev ${activeOp === 'reverse' ? 'rot' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'reverse' && (
                            <div className="pg-card-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <button className="pg-btn" style={{ background: meta.color, color: '#000', flex: 1 }} onClick={reverseList}>Reverse List</button>
                                </div>
                                <p className="pg-hint">Three pointers: prev=null, curr=head, next=curr.next. Iteratively flip each node's next pointer. O(n), O(1) space.</p>
                            </div>
                        )}
                    </div>

                    {/* Floyd's cycle / Find middle */}
                    <div className={`pg-card ${activeOp === 'twoptr' ? 'open' : ''}`} onClick={() => setActiveOp(activeOp === 'twoptr' ? null : 'twoptr')}>
                        <div className="pg-card-head">
                            <span className="pg-card-icon">🐢🐇</span>
                            <span className="pg-card-name">Fast / Slow Pointer</span>
                            {opBadge('O(n)')}
                            <svg className={`pg-chev ${activeOp === 'twoptr' ? 'rot' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'twoptr' && (
                            <div className="pg-card-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <button className="pg-btn" style={{ background: '#4ade80', color: '#000', flex: 1 }} onClick={findMiddle}>🐢 Find Middle</button>
                                    <button className="pg-btn" style={{ background: '#a78bfa', color: '#000', flex: 1 }} onClick={detectCycle}>🐇 Cycle Detection</button>
                                </div>
                                <p className="pg-hint">
                                    <span style={{ color: '#4ade80' }}>🐢 Slow</span> moves 1 step · <span style={{ color: '#a78bfa' }}>🐇 Fast</span> moves 2 steps.<br />
                                    Middle: when fast reaches end, slow = mid. Cycle: if they meet → loop exists.
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Log */}
                <div className="pg-log" ref={logRef}>
                    <span className="pg-log-lbl">Operation Log</span>
                    {log.map((e, i) => (
                        <div key={i} className={`pg-log-e ${e.type}`}>
                            <span className="pg-log-arr">›</span>{e.msg}
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ PROBLEMS ══ */}
            <section className="pt-wrap">
                <div className="pt-hdr">
                    <div>
                        <h2 className="pt-title">Practice Problems</h2>
                        <p className="pt-sub">{PROBLEMS.length} curated Linked List problems on LeetCode</p>
                    </div>
                    <div className="pt-counts">
                        <span className="pt-cnt easy">{counts.Easy} Easy</span>
                        <span className="pt-cnt medium">{counts.Medium} Medium</span>
                        <span className="pt-cnt hard">{counts.Hard} Hard</span>
                    </div>
                </div>
                <div className="pt-filters">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(f => (
                        <button key={f} className={`pt-f ${filter === f ? 'active ' + f.toLowerCase() : ''}`} onClick={() => setFilter(f)}>
                            {f}{f !== 'All' && <span className="pt-fc">{counts[f as keyof typeof counts]}</span>}
                        </button>
                    ))}
                </div>
                <div className="pt-tbl-wrap">
                    <table className="pt-tbl">
                        <thead><tr><th>#</th><th>Problem</th><th>Difficulty</th><th>Pattern</th><th>Acceptance</th><th></th></tr></thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={p.title} className="pt-row">
                                    <td className="pt-num">{i + 1}</td>
                                    <td className="pt-name">{p.title}</td>
                                    <td><span className={`pt-diff ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span></td>
                                    <td className="pt-topic">{p.topic}</td>
                                    <td className="pt-acc">{p.acceptance}</td>
                                    <td><a href={p.url} target="_blank" rel="noopener noreferrer" className="pt-solve">Solve →</a></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
};

export default LinkedListPage;
