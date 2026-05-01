/// <reference types="vite/client" />
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './shared.css';

// ─── Types ─────────────────────────────────────────────────────────────────────
type GType = 'undirected' | 'directed' | 'weighted' | 'dag';
type NodeState = 'idle' | 'visited' | 'current' | 'path' | 'queued' | 'start';
interface LogEntry { msg: string; type: 'success' | 'error' | 'info' | 'step' }
interface Problem { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; topic: string; url: string; acceptance: string; }

// ─── Problems ──────────────────────────────────────────────────────────────────
const PROBLEMS: Problem[] = [
    // Easy
    { title: 'Find if Path Exists in Graph', difficulty: 'Easy', topic: 'BFS / DFS', url: 'https://leetcode.com/problems/find-if-path-exists-in-graph/', acceptance: '56.4%' },
    { title: 'Find the Town Judge', difficulty: 'Easy', topic: 'In-degree', url: 'https://leetcode.com/problems/find-the-town-judge/', acceptance: '49.5%' },
    { title: 'Flood Fill', difficulty: 'Easy', topic: 'DFS Grid', url: 'https://leetcode.com/problems/flood-fill/', acceptance: '62.7%' },
    { title: 'Island Perimeter', difficulty: 'Easy', topic: 'DFS Grid', url: 'https://leetcode.com/problems/island-perimeter/', acceptance: '70.2%' },
    // Medium
    { title: 'Number of Islands', difficulty: 'Medium', topic: 'BFS / DFS Grid', url: 'https://leetcode.com/problems/number-of-islands/', acceptance: '57.5%' },
    { title: 'Number of Provinces', difficulty: 'Medium', topic: 'DFS / Union-Find', url: 'https://leetcode.com/problems/number-of-provinces/', acceptance: '66.3%' },
    { title: 'Clone Graph', difficulty: 'Medium', topic: 'BFS + HashMap', url: 'https://leetcode.com/problems/clone-graph/', acceptance: '55.4%' },
    { title: 'Max Area of Island', difficulty: 'Medium', topic: 'DFS Grid', url: 'https://leetcode.com/problems/max-area-of-island/', acceptance: '71.6%' },
    { title: 'Rotting Oranges', difficulty: 'Medium', topic: 'Multi-source BFS', url: 'https://leetcode.com/problems/rotting-oranges/', acceptance: '52.7%' },
    { title: 'Course Schedule', difficulty: 'Medium', topic: 'Topological Sort', url: 'https://leetcode.com/problems/course-schedule/', acceptance: '46.2%' },
    { title: 'Course Schedule II', difficulty: 'Medium', topic: 'Topological Sort', url: 'https://leetcode.com/problems/course-schedule-ii/', acceptance: '47.8%' },
    { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', topic: 'Multi-source BFS', url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/', acceptance: '52.9%' },
    { title: 'Surrounded Regions', difficulty: 'Medium', topic: 'BFS from border', url: 'https://leetcode.com/problems/surrounded-regions/', acceptance: '38.7%' },
    { title: 'Graph Valid Tree', difficulty: 'Medium', topic: 'Union-Find / DFS', url: 'https://leetcode.com/problems/graph-valid-tree/', acceptance: '45.3%' },
    { title: 'Number of Connected Components', difficulty: 'Medium', topic: 'Union-Find / DFS', url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', acceptance: '62.4%' },
    { title: 'Redundant Connection', difficulty: 'Medium', topic: 'Union-Find', url: 'https://leetcode.com/problems/redundant-connection/', acceptance: '63.1%' },
    { title: 'Network Delay Time', difficulty: 'Medium', topic: "Dijkstra's", url: 'https://leetcode.com/problems/network-delay-time/', acceptance: '52.9%' },
    { title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', topic: 'Modified Dijkstra / BFS', url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', acceptance: '36.4%' },
    { title: 'Keys and Rooms', difficulty: 'Medium', topic: 'DFS', url: 'https://leetcode.com/problems/keys-and-rooms/', acceptance: '70.8%' },
    { title: 'Is Graph Bipartite?', difficulty: 'Medium', topic: 'BFS Coloring', url: 'https://leetcode.com/problems/is-graph-bipartite/', acceptance: '56.2%' },
    // Hard
    { title: 'Word Ladder', difficulty: 'Hard', topic: 'BFS', url: 'https://leetcode.com/problems/word-ladder/', acceptance: '37.8%' },
    { title: 'Alien Dictionary', difficulty: 'Hard', topic: 'Topological Sort', url: 'https://leetcode.com/problems/alien-dictionary/', acceptance: '33.2%' },
    { title: 'Reconstruct Itinerary', difficulty: 'Hard', topic: 'Eulerian Path / DFS', url: 'https://leetcode.com/problems/reconstruct-itinerary/', acceptance: '40.8%' },
    { title: 'Swim in Rising Water', difficulty: 'Hard', topic: "Dijkstra's / Binary Search", url: 'https://leetcode.com/problems/swim-in-rising-water/', acceptance: '59.2%' },
    { title: 'Find Critical Edges in MST', difficulty: 'Hard', topic: 'MST + Bridges', url: 'https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/', acceptance: '52.3%' },
    { title: 'Bus Routes', difficulty: 'Hard', topic: 'BFS on sets', url: 'https://leetcode.com/problems/bus-routes/', acceptance: '43.9%' },
    { title: 'Minimum Cost to Reach Destination', difficulty: 'Hard', topic: "Dijkstra's + DP", url: 'https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/', acceptance: '43.7%' },
];

// ─── Graph configs ─────────────────────────────────────────────────────────────
interface GraphConfig {
    label: string;
    color: string;
    accent: string;
    desc: string;
    icon: string;
    complexities: [string, string][];
    nodes: { id: number; x: number; y: number; label: string }[];
    edges: { a: number; b: number; w?: number; directed: boolean }[];
}

const GRAPHS: Record<GType, GraphConfig> = {
    undirected: {
        label: 'Undirected Graph', color: '#34d399', accent: '#10b981',
        desc: 'Edges have no direction — A↔B. Used for: social networks, road maps, cycle detection, connected components.',
        icon: '◈', complexities: [['O(V+E)', 'BFS/DFS'], ['O(V+E)', 'Space (adj list)'], ['O(V+E)', 'Connected Components'], ['O(α(V))', 'Union-Find']],
        nodes: [
            { id: 0, x: 200, y: 60, label: '0' },
            { id: 1, x: 80, y: 160, label: '1' },
            { id: 2, x: 320, y: 160, label: '2' },
            { id: 3, x: 80, y: 280, label: '3' },
            { id: 4, x: 200, y: 230, label: '4' },
            { id: 5, x: 340, y: 290, label: '5' },
            { id: 6, x: 440, y: 170, label: '6' },
        ],
        edges: [
            { a: 0, b: 1, directed: false }, { a: 0, b: 2, directed: false }, { a: 1, b: 3, directed: false },
            { a: 1, b: 4, directed: false }, { a: 2, b: 4, directed: false }, { a: 2, b: 6, directed: false },
            { a: 3, b: 4, directed: false }, { a: 4, b: 5, directed: false }, { a: 5, b: 6, directed: false },
        ],
    },
    directed: {
        label: 'Directed Graph', color: '#60a5fa', accent: '#3b82f6',
        desc: 'Edges have direction — A→B only. Used for: dependency graphs, web links, state machines, topological ordering.',
        icon: '→', complexities: [['O(V+E)', 'BFS/DFS'], ['O(V)', 'In/Out degree'], ['O(V+E)', 'Topological Sort'], ['O(V+E)', 'SCC (Tarjan)']],
        nodes: [
            { id: 0, x: 200, y: 50, label: '0' },
            { id: 1, x: 80, y: 160, label: '1' },
            { id: 2, x: 340, y: 155, label: '2' },
            { id: 3, x: 80, y: 285, label: '3' },
            { id: 4, x: 220, y: 230, label: '4' },
            { id: 5, x: 350, y: 290, label: '5' },
            { id: 6, x: 450, y: 165, label: '6' },
        ],
        edges: [
            { a: 0, b: 1, directed: true }, { a: 0, b: 2, directed: true }, { a: 1, b: 3, directed: true },
            { a: 1, b: 4, directed: true }, { a: 2, b: 4, directed: true }, { a: 2, b: 6, directed: true },
            { a: 4, b: 3, directed: true }, { a: 4, b: 5, directed: true }, { a: 6, b: 5, directed: true },
        ],
    },
    weighted: {
        label: 'Weighted Graph', color: '#fb923c', accent: '#f97316',
        desc: 'Edges carry costs/distances. Used for: shortest path (Dijkstra), MST (Kruskal/Prim), network routing.',
        icon: '⚖', complexities: [["O((V+E)logV)", "Dijkstra's"], ['O(VE)', 'Bellman-Ford'], ['O(E log E)', "Kruskal's MST"], ['O(E log V)', "Prim's MST"]],
        nodes: [
            { id: 0, x: 200, y: 55, label: 'A' },
            { id: 1, x: 75, y: 160, label: 'B' },
            { id: 2, x: 340, y: 150, label: 'C' },
            { id: 3, x: 75, y: 285, label: 'D' },
            { id: 4, x: 215, y: 225, label: 'E' },
            { id: 5, x: 355, y: 295, label: 'F' },
            { id: 6, x: 450, y: 165, label: 'G' },
        ],
        edges: [
            { a: 0, b: 1, w: 4, directed: false }, { a: 0, b: 2, w: 2, directed: false }, { a: 1, b: 3, w: 5, directed: false },
            { a: 1, b: 4, w: 1, directed: false }, { a: 2, b: 4, w: 3, directed: false }, { a: 2, b: 6, w: 7, directed: false },
            { a: 3, b: 4, w: 2, directed: false }, { a: 4, b: 5, w: 6, directed: false }, { a: 5, b: 6, w: 1, directed: false },
        ],
    },
    dag: {
        label: 'DAG (Directed Acyclic)', color: '#c084fc', accent: '#a855f7',
        desc: 'Directed graph with no cycles. Enables topological ordering. Used for: task scheduling, build systems, DP on graphs.',
        icon: '⬇', complexities: [['O(V+E)', 'Topological Sort'], ['O(V+E)', 'Longest Path'], ['O(V+E)', 'Critical Path'], ['O(V+E)', 'Kahn\'s BFS']],
        nodes: [
            { id: 0, x: 200, y: 45, label: '0' },
            { id: 1, x: 80, y: 145, label: '1' },
            { id: 2, x: 335, y: 145, label: '2' },
            { id: 3, x: 60, y: 265, label: '3' },
            { id: 4, x: 205, y: 230, label: '4' },
            { id: 5, x: 350, y: 275, label: '5' },
            { id: 6, x: 450, y: 155, label: '6' },
        ],
        edges: [
            { a: 0, b: 1, directed: true }, { a: 0, b: 2, directed: true }, { a: 1, b: 3, directed: true },
            { a: 1, b: 4, directed: true }, { a: 2, b: 4, directed: true }, { a: 2, b: 6, directed: true },
            { a: 3, b: 5, directed: true }, { a: 4, b: 5, directed: true }, { a: 6, b: 5, directed: true },
        ],
    },
};

// ─── Node color palette ────────────────────────────────────────────────────────
const NODE_PALETTE: Record<NodeState, { fill: string; stroke: string; glow: string; text: string }> = {
    idle: { fill: '#0f1420', stroke: 'rgba(255,255,255,0.18)', glow: 'none', text: 'rgba(255,255,255,0.75)' },
    start: { fill: '#1a2f3a', stroke: '#34d399', glow: '0 0 14px #34d399', text: '#34d399' },
    visited: { fill: '#0c2e18', stroke: '#4ade80', glow: '0 0 10px #4ade8066', text: '#4ade80' },
    current: { fill: '#3d2008', stroke: '#fb923c', glow: '0 0 18px #fb923c88', text: '#fb923c' },
    queued: { fill: '#1e1040', stroke: '#a78bfa', glow: '0 0 10px #a78bfa55', text: '#a78bfa' },
    path: { fill: '#082240', stroke: '#60a5fa', glow: '0 0 14px #60a5fa77', text: '#60a5fa' },
};

const sleep = (ms: number) => new Promise<void>(r => setTimeout(r, ms));

// ─── Main Component ────────────────────────────────────────────────────────────
const GraphsPage: React.FC = () => {
    const navigate = useNavigate();
    const svgRef = useRef<SVGSVGElement>(null);

    const [gType, setGType] = useState<GType>('undirected');
    const [nodeStates, setNodeStates] = useState<NodeState[]>(Array(7).fill('idle'));
    const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());
    const [pathEdges, setPathEdges] = useState<Set<string>>(new Set());
    const [running, setRunning] = useState(false);
    const [startNode, setStartNode] = useState('0');
    const [endNode, setEndNode] = useState('5');
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [log, setLog] = useState<LogEntry[]>([{ msg: 'Undirected graph ready — 7 nodes, 9 edges. Choose an algorithm below.', type: 'info' }]);
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const [distLabels, setDistLabels] = useState<(string | null)[]>(Array(7).fill(null));
    const logRef = useRef<HTMLDivElement>(null);
    const cancelRef = useRef(false);

    const cfg = GRAPHS[gType];
    const N = cfg.nodes.length;
    const C = cfg.color;

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);

    useEffect(() => {
        cancelRef.current = true;
        setTimeout(() => {
            cancelRef.current = false;
            setNodeStates(Array(N).fill('idle'));
            setActiveEdges(new Set());
            setPathEdges(new Set());
            setDistLabels(Array(N).fill(null));
            setRunning(false);
            setLog([{ msg: `${cfg.label} loaded — ${cfg.nodes.length} nodes, ${cfg.edges.length} edges. ${cfg.desc}`, type: 'info' }]);
            setActiveOp(null);
        }, 50);
    }, [gType]);

    const addLog = useCallback((msg: string, type: LogEntry['type'] = 'info') =>
        setLog(p => [...p.slice(-39), { msg, type }]), []);

    const buildAdj = useCallback(() => {
        const adj: Map<number, { to: number; w: number }[]> = new Map(cfg.nodes.map(n => [n.id, []]));
        for (const e of cfg.edges) {
            adj.get(e.a)!.push({ to: e.b, w: e.w ?? 1 });
            if (!e.directed) adj.get(e.b)!.push({ to: e.a, w: e.w ?? 1 });
        }
        return adj;
    }, [cfg]);

    const resetViz = () => {
        setNodeStates(Array(N).fill('idle'));
        setActiveEdges(new Set());
        setPathEdges(new Set());
        setDistLabels(Array(N).fill(null));
    };

    const edgeKey = (a: number, b: number) => `${Math.min(a, b)}-${Math.max(a, b)}`;
    const dirEdgeKey = (a: number, b: number) => `${a}-${b}`;

    // ── BFS ────────────────────────────────────────────────────────────────────
    const runBFS = async () => {
        if (running) return;
        const s = parseInt(startNode);
        if (isNaN(s) || s < 0 || s >= N) return addLog(`Start node must be 0–${N - 1}.`, 'error');
        cancelRef.current = false; setRunning(true); resetViz();
        const adj = buildAdj();
        const visited = new Set<number>([s]);
        const queue = [s]; const order: number[] = [];
        const ae = new Set<string>();

        setNodeStates(st => { const ns = [...st]; ns[s] = 'start'; return ns; });
        addLog(`BFS from node ${cfg.nodes[s].label}. Queue: [${cfg.nodes[s].label}]`, 'step');
        await sleep(500); if (cancelRef.current) return setRunning(false);

        while (queue.length) {
            if (cancelRef.current) break;
            const u = queue.shift()!; order.push(u);
            setNodeStates(st => { const ns = [...st]; ns[u] = 'current'; return ns; });
            const nbrs = adj.get(u)!.filter(x => !visited.has(x.to));
            addLog(`Dequeue ${cfg.nodes[u].label}. Unvisited neighbours: [${nbrs.map(x => cfg.nodes[x.to].label).join(', ') || '—'}]`, 'step');
            await sleep(550); if (cancelRef.current) break;

            for (const { to } of adj.get(u)!) {
                ae.add(cfg.edges.find(e => (e.a === u && e.b === to) || (e.b === u && e.a === to)) ? edgeKey(u, to) : dirEdgeKey(u, to));
                setActiveEdges(new Set(ae));
                if (!visited.has(to)) {
                    visited.add(to); queue.push(to);
                    setNodeStates(st => { const ns = [...st]; ns[to] = 'queued'; return ns; });
                    await sleep(300); if (cancelRef.current) break;
                }
            }
            setNodeStates(st => { const ns = [...st]; ns[u] = 'visited'; return ns; });
        }
        if (!cancelRef.current) {
            addLog(`BFS complete. Visit order: ${order.map(i => cfg.nodes[i].label).join(' → ')}. O(V+E).`, 'success');
        }
        setRunning(false);
    };

    // ── DFS ────────────────────────────────────────────────────────────────────
    const runDFS = async () => {
        if (running) return;
        const s = parseInt(startNode);
        if (isNaN(s) || s < 0 || s >= N) return addLog(`Start node must be 0–${N - 1}.`, 'error');
        cancelRef.current = false; setRunning(true); resetViz();
        const adj = buildAdj();
        const visited = new Set<number>(); const order: number[] = [];
        const ae = new Set<string>();

        setNodeStates(st => { const ns = [...st]; ns[s] = 'start'; return ns; });
        addLog(`DFS from node ${cfg.nodes[s].label}.`, 'step');
        await sleep(400); if (cancelRef.current) return setRunning(false);

        const dfs = async (u: number): Promise<void> => {
            if (cancelRef.current) return;
            visited.add(u); order.push(u);
            setNodeStates(st => { const ns = [...st]; ns[u] = 'current'; return ns; });
            const unexplored = adj.get(u)!.filter(x => !visited.has(x.to));
            addLog(`Visit ${cfg.nodes[u].label}. Explore: [${unexplored.map(x => cfg.nodes[x.to].label).join(', ') || '—'}]`, 'step');
            await sleep(600); if (cancelRef.current) return;
            setNodeStates(st => { const ns = [...st]; ns[u] = 'visited'; return ns; });

            for (const { to } of adj.get(u)!) {
                if (cancelRef.current) return;
                ae.add(edgeKey(u, to));
                setActiveEdges(new Set(ae));
                if (!visited.has(to)) await dfs(to);
            }
        };
        await dfs(s);
        if (!cancelRef.current) addLog(`DFS complete. Order: ${order.map(i => cfg.nodes[i].label).join(' → ')}. O(V+E).`, 'success');
        setRunning(false);
    };

    // ── Dijkstra ───────────────────────────────────────────────────────────────
    const runDijkstra = async () => {
        if (gType !== 'weighted') return addLog('Switch to Weighted graph for Dijkstra\'s algorithm.', 'error');
        if (running) return;
        const s = parseInt(startNode), t = parseInt(endNode);
        if (isNaN(s) || s < 0 || s >= N || isNaN(t) || t < 0 || t >= N) return addLog(`Nodes must be 0–${N - 1}.`, 'error');
        cancelRef.current = false; setRunning(true); resetViz();
        const adj = buildAdj();
        const dist = Array(N).fill(Infinity); dist[s] = 0;
        const prev = Array(N).fill(-1);
        const settled = new Set<number>();
        const ae = new Set<string>();

        setNodeStates(st => { const ns = [...st]; ns[s] = 'start'; return ns; });
        setDistLabels(Array(N).fill('∞').map((v, i) => i === s ? '0' : v));
        addLog(`Dijkstra from ${cfg.nodes[s].label} → ${cfg.nodes[t].label}. All distances = ∞ except source = 0.`, 'step');
        await sleep(600); if (cancelRef.current) return setRunning(false);

        for (let iter = 0; iter < N; iter++) {
            if (cancelRef.current) break;
            // Pick unsettled node with min dist
            let u = -1, best = Infinity;
            for (let i = 0; i < N; i++) { if (!settled.has(i) && dist[i] < best) { best = dist[i]; u = i; } }
            if (u === -1) break;
            settled.add(u);
            setNodeStates(st => { const ns = [...st]; ns[u] = 'current'; return ns; });
            addLog(`Process ${cfg.nodes[u].label} (dist=${dist[u]}). Relax neighbours...`, 'step');
            await sleep(550); if (cancelRef.current) break;

            for (const { to, w } of adj.get(u)!) {
                if (cancelRef.current) break;
                ae.add(edgeKey(u, to)); setActiveEdges(new Set(ae));
                if (dist[u] + w < dist[to]) {
                    dist[to] = dist[u] + w; prev[to] = u;
                    setDistLabels(dl => { const nd = [...dl]; nd[to] = String(dist[to]); return nd; });
                    setNodeStates(st => { const ns = [...st]; if (!settled.has(to)) ns[to] = 'queued'; return ns; });
                    addLog(`  Relax ${cfg.nodes[u].label}→${cfg.nodes[to].label}: dist[${cfg.nodes[to].label}] = ${dist[to]}`, 'step');
                    await sleep(350); if (cancelRef.current) break;
                }
            }
            setNodeStates(st => { const ns = [...st]; ns[u] = 'visited'; return ns; });
        }

        if (!cancelRef.current) {
            // Reconstruct path
            const pathSet = new Set<string>();
            let cur = t;
            while (cur !== -1 && prev[cur] !== -1) { pathSet.add(edgeKey(prev[cur], cur)); cur = prev[cur]; }
            setPathEdges(pathSet);
            if (dist[t] === Infinity) addLog(`No path from ${cfg.nodes[s].label} to ${cfg.nodes[t].label}.`, 'error');
            else addLog(`Shortest path ${cfg.nodes[s].label}→${cfg.nodes[t].label} = ${dist[t]}. Blue edges = shortest path tree. O((V+E)logV).`, 'success');
            setDistLabels(dist.map(d => d === Infinity ? '∞' : String(d)));
        }
        setRunning(false);
    };

    // ── Topological Sort (Kahn's) ──────────────────────────────────────────────
    const runTopoSort = async () => {
        if (gType !== 'dag') return addLog('Switch to DAG graph for topological sort.', 'error');
        if (running) return;
        cancelRef.current = false; setRunning(true); resetViz();
        const adj = buildAdj();
        const inDeg = Array(N).fill(0);
        for (const { to } of [...cfg.edges]) inDeg[to]++;

        const queue = cfg.nodes.map(n => n.id).filter(i => inDeg[i] === 0);
        const order: number[] = [];
        const ae = new Set<string>();

        addLog(`Kahn's BFS Topological Sort. In-degree 0 nodes: [${queue.map(i => cfg.nodes[i].label).join(', ')}]`, 'step');
        queue.forEach(i => setNodeStates(st => { const ns = [...st]; ns[i] = 'queued'; return ns; }));
        await sleep(600); if (cancelRef.current) return setRunning(false);

        while (queue.length) {
            if (cancelRef.current) break;
            const u = queue.shift()!; order.push(u);
            setNodeStates(st => { const ns = [...st]; ns[u] = 'current'; return ns; });
            addLog(`Process ${cfg.nodes[u].label} (topo pos ${order.length}). Reduce neighbour in-degrees.`, 'step');
            await sleep(600); if (cancelRef.current) break;

            for (const { to } of adj.get(u)!) {
                if (cancelRef.current) break;
                ae.add(dirEdgeKey(u, to)); setActiveEdges(new Set(ae));
                inDeg[to]--;
                if (inDeg[to] === 0) {
                    queue.push(to);
                    setNodeStates(st => { const ns = [...st]; ns[to] = 'queued'; return ns; });
                    await sleep(300); if (cancelRef.current) break;
                }
            }
            setNodeStates(st => { const ns = [...st]; ns[u] = 'visited'; return ns; });
        }
        if (!cancelRef.current) {
            if (order.length < N) addLog('Cycle detected! Not a valid DAG — topological sort impossible.', 'error');
            else addLog(`Topological order: ${order.map(i => cfg.nodes[i].label).join(' → ')}. O(V+E).`, 'success');
        }
        setRunning(false);
    };

    const stopAll = () => { cancelRef.current = true; setRunning(false); resetViz(); addLog('Algorithm stopped.', 'info'); };

    const filtered = PROBLEMS.filter(p => filter === 'All' || p.difficulty === filter);
    const counts = { Easy: PROBLEMS.filter(p => p.difficulty === 'Easy').length, Medium: PROBLEMS.filter(p => p.difficulty === 'Medium').length, Hard: PROBLEMS.filter(p => p.difficulty === 'Hard').length };

    // ── SVG render helpers ─────────────────────────────────────────────────────
    const SVG_W = 520, SVG_H = 350, NR = 24;

    const renderEdges = () => cfg.edges.map((e, ei) => {
        const na = cfg.nodes[e.a], nb = cfg.nodes[e.b];
        const dx = nb.x - na.x, dy = nb.y - na.y;
        const len = Math.sqrt(dx * dx + dy * dy);
        const ux = dx / len, uy = dy / len;
        const x1 = na.x + ux * (NR + 1), y1 = na.y + uy * (NR + 1);
        const x2 = nb.x - ux * (NR + (e.directed ? 10 : 2)), y2 = nb.y - uy * (NR + (e.directed ? 10 : 2));
        const ek = e.directed ? dirEdgeKey(e.a, e.b) : edgeKey(e.a, e.b);
        const isActive = activeEdges.has(ek);
        const isPath = pathEdges.has(edgeKey(e.a, e.b));
        const stroke = isPath ? '#60a5fa' : isActive ? C : 'rgba(255,255,255,0.1)';
        const sw = isPath ? 2.8 : isActive ? 2 : 1.2;
        const mx = (na.x + nb.x) / 2, my = (na.y + nb.y) / 2;
        // slight curve offset for directed to avoid overlap
        const cx = mx - uy * 8, cy2 = my + ux * 8;
        return (
            <g key={`e-${ei}`} style={{ transition: 'all 0.3s' }}>
                {e.directed
                    ? <path d={`M ${x1} ${y1} Q ${cx} ${cy2} ${x2} ${y2}`} fill="none" stroke={stroke} strokeWidth={sw} opacity={isActive || isPath ? 0.9 : 0.25} markerEnd={`url(#arr-${isPath ? 'path' : isActive ? 'active' : 'idle'})`} style={{ transition: 'all .3s' }} />
                    : <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={sw} opacity={isActive || isPath ? 0.9 : 0.22} style={{ transition: 'all .3s' }} />
                }
                {e.w !== undefined && (
                    <text x={mx + (e.directed ? -uy * 12 : 0)} y={my + (e.directed ? ux * 12 : -7)} textAnchor="middle"
                        fill={isActive ? C : 'rgba(255,255,255,0.45)'} fontSize={11} fontFamily="'Fira Code',monospace" fontWeight="600"
                        style={{ transition: 'fill .3s' }}>{e.w}</text>
                )}
            </g>
        );
    });

    const renderNodes = () => cfg.nodes.map(n => {
        const s = nodeStates[n.id];
        const p = NODE_PALETTE[s];
        const dist = distLabels[n.id];
        return (
            <g key={`n-${n.id}`} style={{ transition: 'all 0.35s cubic-bezier(.34,1.56,.64,1)' }}>
                {/* glow ring */}
                {s !== 'idle' && <circle cx={n.x} cy={n.y} r={NR + 6} fill="none" stroke={p.stroke} strokeWidth={1} opacity={0.25} style={{ transition: 'all .35s' }} />}
                <circle cx={n.x} cy={n.y} r={NR} fill={p.fill} stroke={p.stroke} strokeWidth={2}
                    style={{ filter: s !== 'idle' ? `drop-shadow(${p.glow})` : 'none', transition: 'all .35s' }} />
                <text x={n.x} y={n.y + 1} textAnchor="middle" dominantBaseline="central"
                    fill={p.text} fontSize={14} fontFamily="'Fira Code',monospace" fontWeight="700"
                    style={{ transition: 'fill .35s' }}>{n.label}</text>
                {/* distance label for Dijkstra */}
                {dist !== null && (
                    <text x={n.x} y={n.y + NR + 14} textAnchor="middle"
                        fill={dist === '0' ? cfg.color : dist === '∞' ? 'rgba(255,255,255,.25)' : '#60a5fa'}
                        fontSize={10} fontFamily="'Fira Code',monospace" fontWeight="600">{dist}</text>
                )}
            </g>
        );
    });

    // adjacency list text
    const adjListDisplay = useCallback(() => {
        const adj: Map<number, string[]> = new Map(cfg.nodes.map(n => [n.id, []]));
        for (const e of cfg.edges) {
            const wStr = e.w !== undefined ? `(${cfg.nodes[e.b].label},w=${e.w})` : cfg.nodes[e.b].label;
            adj.get(e.a)!.push(wStr);
            if (!e.directed) {
                const wStr2 = e.w !== undefined ? `(${cfg.nodes[e.a].label},w=${e.w})` : cfg.nodes[e.a].label;
                adj.get(e.b)!.push(wStr2);
            }
        }
        return adj;
    }, [cfg]);

    const isInputDisabled = gType === 'dag';

    return (
        <div className="gp-root">
            {/* Ambient BG */}
            <div className="gp-bg" aria-hidden>
                <div className="gp-orb gp-o1" style={{ background: C }} />
                <div className="gp-orb gp-o2" />
                <div className="gp-grid" />
            </div>

            {/* Back */}
            <button className="gp-back" onClick={() => navigate('/resources/cp-roadmap')}>
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                DSA Roadmap
            </button>

            {/* Hero Header */}
            <header className="gp-header">
                <div className="gp-badge" style={{ color: C, background: `${C}18`, borderColor: `${C}40` }}>
                    Data Structures · Graphs
                </div>
                <h1 className="gp-title" style={{ backgroundImage: `linear-gradient(135deg, #fff 25%, ${C})` }}>
                    Graphs
                </h1>
                <p className="gp-subtitle" style={{ transition: 'all .35s' }}>{cfg.desc}</p>
                <div className="gp-stats">
                    {cfg.complexities.map(([c, l]) => (
                        <div className="gp-stat" key={l}>
                            <span className="gp-stat-val" style={{ color: C }}>{c}</span>
                            <span className="gp-stat-lbl">{l}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* ═══════════════════════ PLAYGROUND ══════════════════════════ */}
            <section className="gp-playground">

                {/* Type Toggle */}
                <div className="gp-type-toggle">
                    {(Object.entries(GRAPHS) as [GType, GraphConfig][]).map(([k, g]) => (
                        <button key={k} onClick={() => !running && setGType(k)}
                            className={`gp-type-btn ${gType === k ? 'active' : ''}`}
                            disabled={running}
                            style={gType === k ? { borderColor: g.color, color: g.color, background: `${g.color}14` } : {}}>
                            <span className="gp-type-icon">{g.icon}</span>
                            <span>{g.label}</span>
                        </button>
                    ))}
                </div>

                {/* Playground header */}
                <div className="gp-pg-header">
                    <div className="gp-pg-title">
                        Interactive Playground
                        <span className="gp-chip" style={{ color: C, background: `${C}18`, borderColor: `${C}35` }}>{cfg.label}</span>
                    </div>
                    <button className="gp-reset-btn" onClick={stopAll} disabled={!running && nodeStates.every(s => s === 'idle')} style={{ opacity: running ? 1 : 0.5 }}>
                        {running ? '⏹ Stop' : '↺ Reset'}
                    </button>
                </div>

                {/* Two-column layout: SVG + controls */}
                <div className="gp-canvas-row">

                    {/* SVG Visualizer */}
                    <div className="gp-svg-wrap">
                        <svg ref={svgRef} viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="gp-svg">
                            <defs>
                                {(['idle', 'active', 'path'] as const).map(variant => {
                                    const col = variant === 'path' ? '#60a5fa' : variant === 'active' ? C : 'rgba(255,255,255,0.25)';
                                    return (
                                        <marker key={variant} id={`arr-${variant}`} markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
                                            <path d="M1,1 L1,7 L9,4 z" fill={col} opacity={variant === 'idle' ? 0.4 : 0.85} />
                                        </marker>
                                    );
                                })}
                            </defs>
                            {renderEdges()}
                            {renderNodes()}
                        </svg>

                        {/* Legend */}
                        <div className="gp-legend">
                            {([
                                ['#34d399', 'Source'],
                                ['#fb923c', 'Processing'],
                                ['#4ade80', 'Visited'],
                                ['#a78bfa', 'Queued'],
                                ['#60a5fa', 'Shortest Path'],
                            ] as [string, string][]).map(([col, lbl]) => (
                                <span key={lbl} className="gp-leg-item">
                                    <span className="gp-leg-dot" style={{ background: col }} />{lbl}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right panel: adjacency list + controls */}
                    <div className="gp-right-panel">
                        <div className="gp-adj-panel">
                            <div className="gp-adj-title">Adjacency List</div>
                            {[...adjListDisplay().entries()].map(([id, nbrs]) => (
                                <div key={id} className="gp-adj-row">
                                    <span className="gp-adj-node" style={{ color: C }}>{cfg.nodes[id].label}</span>
                                    <span className="gp-adj-arrow">→</span>
                                    <span className="gp-adj-nbrs">[{nbrs.join(', ') || '∅'}]</span>
                                </div>
                            ))}
                        </div>

                        {/* Node inputs */}
                        <div className="gp-inputs">
                            <div className="gp-input-row">
                                <label className="gp-input-label">Start</label>
                                <input className="gp-input" value={startNode} onChange={e => setStartNode(e.target.value)}
                                    disabled={running} placeholder={`0–${N - 1}`} />
                            </div>
                            {gType === 'weighted' && (
                                <div className="gp-input-row">
                                    <label className="gp-input-label">End</label>
                                    <input className="gp-input" value={endNode} onChange={e => setEndNode(e.target.value)}
                                        disabled={running} placeholder={`0–${N - 1}`} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Algorithm Cards */}
                <div className="gp-algo-grid">

                    {/* BFS */}
                    <div className="gp-algo-card" onClick={() => !running && setActiveOp(activeOp === 'bfs' ? null : 'bfs')}
                        style={activeOp === 'bfs' ? { borderColor: `${C}60`, background: `${C}08` } : {}}>
                        <div className="gp-algo-head">
                            <span className="gp-algo-icon">🌊</span>
                            <div>
                                <div className="gp-algo-name">BFS</div>
                                <div className="gp-algo-sub">Breadth First Search</div>
                            </div>
                            <span className="gp-algo-badge" style={{ color: C, background: `${C}18`, borderColor: `${C}35` }}>O(V+E)</span>
                        </div>
                        {activeOp === 'bfs' && (
                            <div className="gp-algo-body" onClick={e => e.stopPropagation()}>
                                <p className="gp-algo-desc">Uses a queue (FIFO). Explores all neighbours at current depth before going deeper. Guarantees shortest path on unweighted graphs. Core of: level-order traversal, 0-1 BFS, multi-source BFS.</p>
                                <button className="gp-run-btn" style={{ background: C, color: '#000' }} onClick={runBFS} disabled={running}>
                                    {running ? '⟳ Running...' : '▶ Run BFS'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* DFS */}
                    <div className="gp-algo-card" onClick={() => !running && setActiveOp(activeOp === 'dfs' ? null : 'dfs')}
                        style={activeOp === 'dfs' ? { borderColor: `${C}60`, background: `${C}08` } : {}}>
                        <div className="gp-algo-head">
                            <span className="gp-algo-icon">🌀</span>
                            <div>
                                <div className="gp-algo-name">DFS</div>
                                <div className="gp-algo-sub">Depth First Search</div>
                            </div>
                            <span className="gp-algo-badge" style={{ color: C, background: `${C}18`, borderColor: `${C}35` }}>O(V+E)</span>
                        </div>
                        {activeOp === 'dfs' && (
                            <div className="gp-algo-body" onClick={e => e.stopPropagation()}>
                                <p className="gp-algo-desc">Uses call stack (recursion). Goes as deep as possible before backtracking. Used for: cycle detection, topological sort, SCCs, path existence, flood fill.</p>
                                <button className="gp-run-btn" style={{ background: C, color: '#000' }} onClick={runDFS} disabled={running}>
                                    {running ? '⟳ Running...' : '▶ Run DFS'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Dijkstra */}
                    <div className="gp-algo-card" onClick={() => !running && setActiveOp(activeOp === 'dijk' ? null : 'dijk')}
                        style={activeOp === 'dijk' ? { borderColor: `${C}60`, background: `${C}08` } : {}}>
                        <div className="gp-algo-head">
                            <span className="gp-algo-icon">📍</span>
                            <div>
                                <div className="gp-algo-name">Dijkstra's</div>
                                <div className="gp-algo-sub">Shortest Path</div>
                            </div>
                            <span className="gp-algo-badge" style={{ color: C, background: `${C}18`, borderColor: `${C}35` }}>O((V+E)logV)</span>
                        </div>
                        {activeOp === 'dijk' && (
                            <div className="gp-algo-body" onClick={e => e.stopPropagation()}>
                                <p className="gp-algo-desc">Greedy: always process the closest unsettled node. Uses a min-heap. Requires non-negative weights. Blue edges show shortest path. Distance labels update live. Switch to <strong style={{ color: GRAPHS.weighted.color }}>Weighted</strong> graph type.</p>
                                <button className="gp-run-btn" style={{ background: GRAPHS.weighted.color, color: '#000' }} onClick={runDijkstra} disabled={running}>
                                    {running ? '⟳ Running...' : '▶ Run Dijkstra'}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Topological Sort */}
                    <div className="gp-algo-card" onClick={() => !running && setActiveOp(activeOp === 'topo' ? null : 'topo')}
                        style={activeOp === 'topo' ? { borderColor: `${C}60`, background: `${C}08` } : {}}>
                        <div className="gp-algo-head">
                            <span className="gp-algo-icon">⬇</span>
                            <div>
                                <div className="gp-algo-name">Topological Sort</div>
                                <div className="gp-algo-sub">Kahn's BFS Algorithm</div>
                            </div>
                            <span className="gp-algo-badge" style={{ color: C, background: `${C}18`, borderColor: `${C}35` }}>O(V+E)</span>
                        </div>
                        {activeOp === 'topo' && (
                            <div className="gp-algo-body" onClick={e => e.stopPropagation()}>
                                <p className="gp-algo-desc">Queue all nodes with in-degree 0. Process each: reduce neighbour in-degrees, add new zero-in-degree nodes. If output size &lt; V → cycle detected. Switch to <strong style={{ color: GRAPHS.dag.color }}>DAG</strong> type.</p>
                                <button className="gp-run-btn" style={{ background: GRAPHS.dag.color, color: '#000' }} onClick={runTopoSort} disabled={running}>
                                    {running ? '⟳ Running...' : '▶ Run Topo Sort'}
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                {/* Operation Log */}
                <div className="gp-log" ref={logRef}>
                    <span className="gp-log-label">Algorithm Log</span>
                    {log.map((e, i) => (
                        <div key={i} className={`gp-log-line ${e.type}`}>
                            <span className="gp-log-arrow">›</span>{e.msg}
                        </div>
                    ))}
                </div>

            </section>

            {/* ═══════════════════════ PROBLEMS ═══════════════════════════ */}
            <section className="pt-wrap">
                <div className="pt-hdr">
                    <div>
                        <h2 className="pt-title">Practice Problems</h2>
                        <p className="pt-sub">{PROBLEMS.length} curated Graph problems on LeetCode</p>
                    </div>
                    <div className="pt-counts">
                        <span className="ptc easy">{counts.Easy} Easy</span>
                        <span className="ptc medium">{counts.Medium} Medium</span>
                        <span className="ptc hard">{counts.Hard} Hard</span>
                    </div>
                </div>
                <div className="pt-filters">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(f => (
                        <button key={f} className={`pt-f ${filter === f ? 'active ' + f.toLowerCase() : ''}`} onClick={() => setFilter(f)}>
                            {f}{f !== 'All' && <span className="pt-fc">{counts[f as keyof typeof counts]}</span>}
                        </button>
                    ))}
                </div>
                <div className="pt-tw">
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

export default GraphsPage;