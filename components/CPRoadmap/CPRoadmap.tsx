/// <reference types="vite/client" />
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Topic {
    id: string;
    title: string;
    tag: 'required' | 'recommended' | 'optional';
    description: string;
    resources: { label: string; url: string }[];
}

interface Section {
    id: string;
    heading: string;
    color: string;
    topics: Topic[];
}

const ROADMAP: Section[] = [
    {
        id: 's1',
        heading: 'Algorithmic Complexity',
        color: '#f97316',
        topics: [
            {
                id: 't1', title: 'Big O Notation', tag: 'required',
                description: 'Big O notation describes the upper bound of an algorithm\'s time or space complexity. It tells you how the runtime grows relative to input size. Key complexities: O(1) constant, O(log n) logarithmic, O(n) linear, O(n log n), O(n²) quadratic, O(2ⁿ) exponential.',
                resources: [
                    { label: 'Big O Cheat Sheet', url: 'https://www.bigocheatsheet.com/' },
                    { label: 'CS50 Lecture on Complexity', url: 'https://cs50.harvard.edu/' },
                ],
            },
            {
                id: 't2', title: 'Time Complexity', tag: 'required',
                description: 'Time complexity measures how the runtime of an algorithm scales with input size. Analyze best, average, and worst case. Practice counting operations and identifying dominant terms.',
                resources: [
                    { label: 'GeeksForGeeks – Time Complexity', url: 'https://www.geeksforgeeks.org/time-complexity-and-space-complexity/' },
                ],
            },
            {
                id: 't3', title: 'Space Complexity', tag: 'required',
                description: 'Space complexity measures the memory an algorithm uses relative to input. Includes auxiliary space (extra space used) and input space. Stack space from recursion counts too.',
                resources: [
                    { label: 'GeeksForGeeks – Space Complexity', url: 'https://www.geeksforgeeks.org/g-fact-86/' },
                ],
            },
        ],
    },
    {
        id: 's2',
        heading: 'Data Structures',
        color: '#3b82f6',
        topics: [
            {
                id: 't4', title: 'Arrays', tag: 'required',
                description: 'Arrays store elements in contiguous memory. O(1) access by index, O(n) insertion/deletion. Master: two pointers, sliding window, prefix sums, kadane\'s algorithm.',
                resources: [
                    { label: 'Array problems – LeetCode', url: 'https://leetcode.com/tag/array/' },
                ],
            },
            {
                id: 't5', title: 'Linked Lists', tag: 'required',
                description: 'Nodes connected via pointers. Singly, doubly, circular variants. O(1) insert/delete at head, O(n) search. Key patterns: fast/slow pointer, reverse a list, detect cycles (Floyd\'s algorithm).',
                resources: [
                    { label: 'Visualgo – Linked List', url: 'https://visualgo.net/en/list' },
                ],
            },
            {
                id: 't6', title: 'Stacks & Queues', tag: 'required',
                description: 'Stack: LIFO – used in DFS, balanced parentheses, monotonic stack problems. Queue: FIFO – used in BFS, sliding window maximum. Deque supports both ends.',
                resources: [
                    { label: 'LeetCode Stack Problems', url: 'https://leetcode.com/tag/stack/' },
                ],
            },
            {
                id: 't7', title: 'Hash Tables', tag: 'required',
                description: 'Key-value store with O(1) average lookup, insert, delete. Collision handling: chaining vs open addressing. Essential for frequency counting, anagram detection, two-sum variants.',
                resources: [
                    { label: 'Hash Table – CS Dojo', url: 'https://www.youtube.com/watch?v=sfWyugl4JWA' },
                ],
            },
            {
                id: 't8', title: 'Trees', tag: 'required',
                description: 'Hierarchical structure with root, parent, child nodes. Binary Trees, BST (O(log n) ops), AVL, Red-Black. Traversals: inorder, preorder, postorder, level-order. Key: recursion mindset.',
                resources: [
                    { label: 'Visualgo – BST', url: 'https://visualgo.net/en/bst' },
                    { label: 'LeetCode Tree Problems', url: 'https://leetcode.com/tag/tree/' },
                ],
            },
            {
                id: 't9', title: 'Heaps / Priority Queues', tag: 'required',
                description: 'Complete binary tree. Min-heap: parent ≤ children. O(log n) insert/extract-min. Used in Dijkstra, Prim\'s, top-K problems, merge K sorted lists.',
                resources: [
                    { label: 'Heap – Visualgo', url: 'https://visualgo.net/en/heap' },
                ],
            },
            {
                id: 't10', title: 'Graphs', tag: 'required',
                description: 'Vertices + edges. Directed/undirected, weighted/unweighted. Representations: adjacency matrix, adjacency list. Traversals: BFS (shortest path unweighted), DFS (cycle detection, topological sort).',
                resources: [
                    { label: 'Graph Algorithms – William Fiset', url: 'https://www.youtube.com/playlist?list=PLDV1Zeh2NRsDGO4--qE8yH72HFL1Km93P' },
                ],
            },
            {
                id: 't11', title: 'Tries', tag: 'recommended',
                description: 'Prefix tree for string storage. O(m) insert/search where m = word length. Used in autocomplete, spell check, IP routing. Space-efficient with compressed tries.',
                resources: [
                    { label: 'Trie – NeetCode', url: 'https://neetcode.io/' },
                ],
            },
            {
                id: 't12', title: 'Segment Trees', tag: 'recommended',
                description: 'Tree for range queries and updates in O(log n). Supports range sum, range minimum/maximum. Lazy propagation enables O(log n) range updates.',
                resources: [
                    { label: 'Segment Tree – CP-Algorithms', url: 'https://cp-algorithms.com/data_structures/segment_tree.html' },
                ],
            },
            {
                id: 't13', title: 'Fenwick Tree (BIT)', tag: 'recommended',
                description: 'Binary Indexed Tree for prefix sums with O(log n) update and query. Simpler to implement than segment tree for point update/prefix query tasks.',
                resources: [
                    { label: 'BIT – CP-Algorithms', url: 'https://cp-algorithms.com/data_structures/fenwick.html' },
                ],
            },
            {
                id: 't14', title: 'Disjoint Sets (Union-Find)', tag: 'recommended',
                description: 'Tracks a partition of elements into disjoint sets. Near O(1) amortized with path compression + union by rank. Essential for Kruskal\'s MST and cycle detection.',
                resources: [
                    { label: 'Union-Find – Visualgo', url: 'https://visualgo.net/en/ufds' },
                ],
            },
        ],
    },
    {
        id: 's3',
        heading: 'Algorithms',
        color: '#10b981',
        topics: [
            {
                id: 't15', title: 'Sorting Algorithms', tag: 'required',
                description: 'Bubble O(n²), Selection O(n²), Insertion O(n²) – simple but slow. Merge Sort O(n log n) – stable, divide & conquer. Quick Sort O(n log n) avg – in-place. Heap Sort O(n log n). Counting/Radix O(n+k) for integers.',
                resources: [
                    { label: 'Sorting – Visualgo', url: 'https://visualgo.net/en/sorting' },
                ],
            },
            {
                id: 't16', title: 'Binary Search', tag: 'required',
                description: 'O(log n) search on sorted data. Template: lo=0, hi=n-1, mid=(lo+hi)//2. Beyond searching: binary search on answer (min max problems), rotated arrays, first/last occurrence.',
                resources: [
                    { label: 'Binary Search Patterns', url: 'https://leetcode.com/tag/binary-search/' },
                ],
            },
            {
                id: 't17', title: 'Two Pointers', tag: 'required',
                description: 'Use two indices moving through an array/string to reduce O(n²) → O(n). Patterns: opposite ends (two-sum sorted), same direction (remove duplicates), fast/slow (cycle detection).',
                resources: [
                    { label: 'Two Pointers – LeetCode', url: 'https://leetcode.com/tag/two-pointers/' },
                ],
            },
            {
                id: 't18', title: 'Sliding Window', tag: 'required',
                description: 'Maintain a window over a sequence. Fixed window for subarray of size k. Variable window (expand/shrink) for longest substring without repeat, minimum window substring.',
                resources: [
                    { label: 'Sliding Window – NeetCode', url: 'https://neetcode.io/' },
                ],
            },
            {
                id: 't19', title: 'Recursion & Backtracking', tag: 'required',
                description: 'Recursion: function calls itself with smaller input. Backtracking: explore all possibilities, undo choices that don\'t lead to solution. Used in permutations, combinations, N-Queens, Sudoku solver.',
                resources: [
                    { label: 'Backtracking Patterns', url: 'https://leetcode.com/tag/backtracking/' },
                ],
            },
            {
                id: 't20', title: 'Dynamic Programming', tag: 'required',
                description: 'Break problem into overlapping subproblems. Top-down (memoization) vs bottom-up (tabulation). Key patterns: 0/1 knapsack, LCS, LIS, coin change, matrix chain, interval DP, digit DP.',
                resources: [
                    { label: 'DP Patterns – LeetCode Discuss', url: 'https://leetcode.com/discuss/general-discussion/458695/dynamic-programming-patterns' },
                    { label: 'Atcoder DP Contest', url: 'https://atcoder.jp/contests/dp' },
                ],
            },
            {
                id: 't21', title: 'Greedy Algorithms', tag: 'required',
                description: 'Make locally optimal choice at each step hoping to reach global optimum. Prove with exchange argument or matroid theory. Classic: activity selection, Huffman coding, fractional knapsack, interval scheduling.',
                resources: [
                    { label: 'Greedy – CP-Algorithms', url: 'https://cp-algorithms.com/' },
                ],
            },
            {
                id: 't22', title: 'Graph Algorithms', tag: 'required',
                description: 'BFS/DFS fundamentals. Shortest path: Dijkstra (non-negative weights), Bellman-Ford (negative weights), Floyd-Warshall (all pairs). MST: Kruskal\'s, Prim\'s. Topological sort: Kahn\'s BFS, DFS.',
                resources: [
                    { label: 'Graph – CP-Algorithms', url: 'https://cp-algorithms.com/graph/' },
                ],
            },
            {
                id: 't23', title: 'Divide & Conquer', tag: 'required',
                description: 'Split problem into subproblems, solve recursively, combine. Examples: merge sort, quick sort, binary search, closest pair of points, Strassen\'s matrix multiplication, fast Fourier transform.',
                resources: [
                    { label: 'D&C – CLRS Chapter 4', url: 'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms/' },
                ],
            },
            {
                id: 't24', title: 'Bit Manipulation', tag: 'recommended',
                description: 'XOR tricks (find missing number, single number), bit masking for subsets, power of two checks, counting set bits (Brian Kernighan), left/right shifts. Crucial for competitive programming speed.',
                resources: [
                    { label: 'Bit Tricks – CP-Algorithms', url: 'https://cp-algorithms.com/algebra/bit-manipulation.html' },
                ],
            },
            {
                id: 't25', title: 'String Algorithms', tag: 'recommended',
                description: 'KMP for pattern matching O(n+m). Rabin-Karp rolling hash. Z-algorithm. Manacher\'s for longest palindrome. Suffix arrays + LCP for advanced string queries. Trie for prefix problems.',
                resources: [
                    { label: 'String – CP-Algorithms', url: 'https://cp-algorithms.com/string/' },
                ],
            },
            {
                id: 't26', title: 'Mathematical Algorithms', tag: 'recommended',
                description: 'Sieve of Eratosthenes for primes. Modular arithmetic, fast exponentiation. GCD/LCM (Euclidean algorithm). Combinatorics: nCr with Pascal\'s triangle. Number theory for cryptography problems.',
                resources: [
                    { label: 'Math – CP-Algorithms', url: 'https://cp-algorithms.com/algebra/' },
                ],
            },
            {
                id: 't27', title: 'Randomized Algorithms', tag: 'optional',
                description: 'Use randomness to improve average performance. Randomized quicksort, treap, skip list. Monte Carlo (probability of correct answer) vs Las Vegas (always correct, variable time).',
                resources: [
                    { label: 'Randomized Algorithms – MIT OCW', url: 'https://ocw.mit.edu/courses/6-856j-randomized-algorithms-fall-2002/' },
                ],
            },
        ],
    },
    {
        id: 's4',
        heading: 'Advanced Topics',
        color: '#a855f7',
        topics: [
            {
                id: 't28', title: 'Advanced Graph Theory', tag: 'recommended',
                description: 'Strongly connected components (Tarjan\'s, Kosaraju\'s). Bridges and articulation points. Bipartite matching (Hopcroft-Karp). Max flow (Ford-Fulkerson, Dinic\'s). Euler path/circuit.',
                resources: [
                    { label: 'Graph – William Fiset YouTube', url: 'https://www.youtube.com/c/WilliamFiset-videos' },
                ],
            },
            {
                id: 't29', title: 'Advanced DP', tag: 'recommended',
                description: 'Bitmask DP for subset enumeration. DP on trees. Profile DP. Convex hull trick for optimizing DP transitions. Divide & conquer DP optimization. SOS (Sum over Subsets) DP.',
                resources: [
                    { label: 'Advanced DP – Codeforces EDU', url: 'https://codeforces.com/edu/courses' },
                ],
            },
            {
                id: 't30', title: 'Computational Geometry', tag: 'optional',
                description: 'Convex hull (Graham scan, Jarvis march). Line intersection. Closest pair of points. Point in polygon. Sweep line algorithm. Voronoi diagrams.',
                resources: [
                    { label: 'Geometry – CP-Algorithms', url: 'https://cp-algorithms.com/geometry/' },
                ],
            },
            {
                id: 't31', title: 'Game Theory', tag: 'optional',
                description: 'Grundy values / Sprague-Grundy theorem. Nim game variants. Minimax algorithm with alpha-beta pruning. Used in competitive programming combinatorial game problems.',
                resources: [
                    { label: 'Game Theory – CP-Algorithms', url: 'https://cp-algorithms.com/game_theory/' },
                ],
            },
        ],
    },
    {
        id: 's5',
        heading: 'Practice & Resources',
        color: '#ec4899',
        topics: [
            {
                id: 't32', title: 'LeetCode', tag: 'required',
                description: 'The go-to platform for interview prep. Start with the NeetCode 150 or Blind 75. Focus on patterns, not memorizing solutions. Target: Easy → Medium → Hard progression.',
                resources: [
                    { label: 'LeetCode', url: 'https://leetcode.com' },
                    { label: 'NeetCode 150', url: 'https://neetcode.io/practice' },
                ],
            },
            {
                id: 't33', title: 'Codeforces', tag: 'recommended',
                description: 'Best platform for competitive programming. Participate in Div. 2 contests regularly. Upsolve problems after each contest. Track your rating and aim for Specialist → Expert → Candidate Master.',
                resources: [
                    { label: 'Codeforces', url: 'https://codeforces.com' },
                ],
            },
            {
                id: 't34', title: 'USACO / ICPC', tag: 'optional',
                description: 'USACO: premier high school olympiad with Bronze/Silver/Gold/Platinum levels. ICPC: team-based university competition. Both require strong fundamentals + advanced techniques.',
                resources: [
                    { label: 'USACO Guide', url: 'https://usaco.guide/' },
                    { label: 'ICPC', url: 'https://icpc.global/' },
                ],
            },
        ],
    },
];

// ─── Tag colors ───────────────────────────────────────────────────────────────
const TAG_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    required: { bg: 'rgba(249,115,22,0.15)', color: '#fb923c', label: 'Required' },
    recommended: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', label: 'Recommended' },
    optional: { bg: 'rgba(168,85,247,0.15)', color: '#c084fc', label: 'Optional' },
};

// ─── Topic → Route map (extend as you build more topic pages) ─────────────────
const TOPIC_ROUTES: Record<string, string> = {
    'Arrays': '/dsa/arrays',
    'Trees': '/dsa/trees',
    'Linked Lists': '/dsa/linked-lists',
    'Stacks & Queues': '/dsa/stacks-queues',
    'Hash Tables': '/dsa/hash-tables',
    'Heaps / Priority Queues': '/dsa/heaps',
    'Graphs': '/dsa/graphs',
};

// ─── Component ────────────────────────────────────────────────────────────────
const CPRoadmap: React.FC = () => {
    const navigate = useNavigate();
    const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
    const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());

    const toggleComplete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setCompletedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const totalTopics = ROADMAP.reduce((acc, s) => acc + s.topics.length, 0);
    const progress = Math.round((completedIds.size / totalTopics) * 100);

    return (
        <div style={styles.root}>
            {/* ambient bg */}
            <div style={styles.bgWrap} aria-hidden>
                <div style={{ ...styles.orb, ...styles.orb1 }} />
                <div style={{ ...styles.orb, ...styles.orb2 }} />
                <div style={styles.gridOverlay} />
            </div>

            {/* back */}
            <button onClick={() => navigate('/')} style={styles.backBtn}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                Back
            </button>

            {/* header */}
            <header style={styles.header}>
                <div style={styles.badge}>Competitive Programming · DSA Roadmap</div>
                <h1 style={styles.title}>
                    Data Structures<br />
                    <span style={styles.titleAccent}>&amp; Algorithms</span>
                </h1>
                <p style={styles.subtitle}>
                    A complete, structured path from fundamentals to competitive programming mastery.<br />
                    Click any topic to explore resources and mark your progress.
                </p>

                {/* progress bar */}
                <div style={styles.progressWrap}>
                    <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: `${progress}%` }} />
                    </div>
                    <span style={styles.progressLabel}>{completedIds.size} / {totalTopics} topics completed</span>
                </div>

                {/* legend */}
                <div style={styles.legend}>
                    {Object.entries(TAG_STYLE).map(([key, val]) => (
                        <span key={key} style={{ ...styles.legendItem, background: val.bg, color: val.color }}>
                            {val.label}
                        </span>
                    ))}
                </div>
            </header>

            {/* roadmap sections */}
            <main style={styles.main}>
                {ROADMAP.map((section, si) => (
                    <section key={section.id} style={styles.section}>
                        {/* connector line from previous */}
                        {si > 0 && (
                            <div style={styles.connector}>
                                <div style={{ ...styles.connectorLine, borderColor: section.color }} />
                                <div style={{ ...styles.connectorArrow, borderTopColor: section.color }} />
                            </div>
                        )}

                        {/* section heading */}
                        <div style={{ ...styles.sectionHeading, borderColor: section.color }}>
                            <div style={{ ...styles.sectionDot, background: section.color }} />
                            <h2 style={{ ...styles.sectionTitle, color: section.color }}>{section.heading}</h2>
                        </div>

                        {/* topics grid */}
                        <div style={styles.topicsGrid}>
                            {section.topics.map((topic) => {
                                const done = completedIds.has(topic.id);
                                const tag = TAG_STYLE[topic.tag];
                                return (
                                    <div
                                        key={topic.id}
                                        onClick={() => TOPIC_ROUTES[topic.title] ? navigate(TOPIC_ROUTES[topic.title]) : setActiveTopic(topic)}
                                        style={{
                                            ...styles.topicCard,
                                            borderColor: done ? section.color : 'rgba(255,255,255,0.08)',
                                            background: done ? `${section.color}10` : 'rgba(255,255,255,0.03)',
                                        }}
                                    >
                                        <div style={styles.topicTop}>
                                            <span style={{ ...styles.topicTag, background: tag.bg, color: tag.color }}>
                                                {tag.label}
                                            </span>
                                            <button
                                                onClick={(e) => toggleComplete(topic.id, e)}
                                                title={done ? 'Mark incomplete' : 'Mark complete'}
                                                style={{
                                                    ...styles.checkBtn,
                                                    background: done ? section.color : 'transparent',
                                                    borderColor: done ? section.color : 'rgba(255,255,255,0.2)',
                                                }}
                                            >
                                                {done && (
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                                        <path d="M2 5L4 7L8 3" stroke="#000" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <h3 style={{ ...styles.topicTitle, color: done ? section.color : 'rgba(255,255,255,0.92)' }}>
                                            {topic.title}
                                        </h3>
                                        <span style={styles.topicArrow}>→</span>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </main>

            {/* ── Modal ── */}
            {activeTopic && (
                <div style={styles.modalOverlay} onClick={() => setActiveTopic(null)}>
                    <div style={styles.modal} onClick={e => e.stopPropagation()}>
                        <div style={styles.modalTop}>
                            <span style={{
                                ...styles.topicTag,
                                ...TAG_STYLE[activeTopic.tag],
                                background: TAG_STYLE[activeTopic.tag].bg,
                                fontSize: '.78rem',
                            }}>
                                {TAG_STYLE[activeTopic.tag].label}
                            </span>
                            <button onClick={() => setActiveTopic(null)} style={styles.closeBtn}>✕</button>
                        </div>
                        <h2 style={styles.modalTitle}>{activeTopic.title}</h2>
                        <p style={styles.modalDesc}>{activeTopic.description}</p>

                        {activeTopic.resources.length > 0 && (
                            <>
                                <h4 style={styles.modalResourcesHeading}>Resources</h4>
                                <div style={styles.modalResources}>
                                    {activeTopic.resources.map(r => (
                                        <a
                                            key={r.url}
                                            href={r.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={styles.resourceLink}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                                                <path d="M6 2H2a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V8M8 1h5m0 0v5m0-5L6 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            {r.label}
                                        </a>
                                    ))}
                                </div>
                            </>
                        )}

                        <button
                            onClick={(e) => { toggleComplete(activeTopic.id, e); setActiveTopic(null); }}
                            style={{
                                ...styles.modalDoneBtn,
                                background: completedIds.has(activeTopic.id) ? 'rgba(255,255,255,0.08)' : '#6cffb4',
                                color: completedIds.has(activeTopic.id) ? 'rgba(255,255,255,0.6)' : '#0d0d12',
                            }}
                        >
                            {completedIds.has(activeTopic.id) ? '✓ Completed — Mark Incomplete' : 'Mark as Completed'}
                        </button>
                    </div>
                </div>
            )}

            <style>{GLOBAL_CSS}</style>
        </div>
    );
};

// ─── Styles (JS objects) ──────────────────────────────────────────────────────
const styles: Record<string, React.CSSProperties> = {
    root: {
        minHeight: '100vh',
        background: '#0a0a0f',
        color: 'rgba(255,255,255,0.92)',
        fontFamily: "'DM Sans', sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 1.25rem 6rem',
        position: 'relative',
        overflowX: 'hidden',
    },
    bgWrap: {
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
    },
    orb: {
        position: 'absolute', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.12,
    },
    orb1: {
        width: 600, height: 600, background: '#3b82f6', top: -200, left: -200,
    },
    orb2: {
        width: 500, height: 500, background: '#10b981', bottom: -100, right: -100,
    },
    gridOverlay: {
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)',
        backgroundSize: '40px 40px',
    },
    backBtn: {
        position: 'relative', zIndex: 2,
        alignSelf: 'flex-start',
        display: 'flex', alignItems: 'center', gap: '.4rem',
        background: 'transparent', border: 'none',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '.85rem', cursor: 'pointer',
        marginTop: '1.75rem',
        transition: 'color .2s',
    },
    header: {
        position: 'relative', zIndex: 2,
        textAlign: 'center',
        marginTop: '3rem',
        maxWidth: 720,
        width: '100%',
    },
    badge: {
        display: 'inline-block',
        fontFamily: "'DM Mono', monospace",
        fontSize: '.72rem',
        letterSpacing: '.14em',
        textTransform: 'uppercase' as const,
        color: '#10b981',
        background: 'rgba(16,185,129,0.1)',
        border: '1px solid rgba(16,185,129,0.25)',
        borderRadius: 100,
        padding: '.3rem .9rem',
        marginBottom: '1.4rem',
    },
    title: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 'clamp(2.6rem,7vw,5rem)',
        fontWeight: 800,
        lineHeight: 1.05,
        letterSpacing: '-.03em',
        margin: 0,
    },
    titleAccent: { color: '#10b981' },
    subtitle: {
        marginTop: '1.1rem',
        color: 'rgba(255,255,255,0.45)',
        fontSize: '.95rem',
        lineHeight: 1.7,
        fontFamily: "'DM Mono', monospace",
    },
    progressWrap: {
        marginTop: '1.75rem',
        display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '.5rem',
    },
    progressBar: {
        width: '100%', maxWidth: 400, height: 6,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 100, overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #10b981, #6cffb4)',
        borderRadius: 100,
        transition: 'width .4s ease',
    },
    progressLabel: {
        fontFamily: "'DM Mono', monospace",
        fontSize: '.78rem',
        color: 'rgba(255,255,255,0.35)',
    },
    legend: {
        display: 'flex', justifyContent: 'center', gap: '.6rem',
        flexWrap: 'wrap' as const,
        marginTop: '1.25rem',
    },
    legendItem: {
        fontSize: '.75rem', fontFamily: "'DM Mono', monospace",
        padding: '.25rem .75rem', borderRadius: 100,
        letterSpacing: '.04em',
    },
    main: {
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 860,
        marginTop: '3.5rem',
        display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
        gap: 0,
    },
    section: {
        width: '100%',
        display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
    },
    connector: {
        display: 'flex', flexDirection: 'column' as const, alignItems: 'center',
        height: 48, marginBottom: 0,
    },
    connectorLine: {
        width: 0, height: 32,
        borderLeft: '2px dashed',
        opacity: 0.35,
    },
    connectorArrow: {
        width: 0, height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '8px solid',
        opacity: 0.5,
    },
    sectionHeading: {
        display: 'flex', alignItems: 'center', gap: '.75rem',
        borderLeft: '3px solid',
        paddingLeft: '1rem',
        marginBottom: '1.25rem',
        alignSelf: 'flex-start',
    },
    sectionDot: {
        width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
    },
    sectionTitle: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '1.3rem', fontWeight: 800,
        letterSpacing: '-.02em', margin: 0,
        textTransform: 'uppercase' as const,
    },
    topicsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '.75rem',
        width: '100%',
        marginBottom: '1rem',
    },
    topicCard: {
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: '1rem 1rem .85rem',
        cursor: 'pointer',
        transition: 'transform .15s, border-color .2s, background .2s',
        display: 'flex', flexDirection: 'column' as const, gap: '.5rem',
        position: 'relative' as const,
    },
    topicTop: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    },
    topicTag: {
        fontSize: '.68rem', fontFamily: "'DM Mono', monospace",
        letterSpacing: '.04em', padding: '.2rem .55rem', borderRadius: 100,
        textTransform: 'uppercase' as const,
    },
    checkBtn: {
        width: 20, height: 20, borderRadius: '50%',
        border: '1.5px solid',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all .2s',
    },
    topicTitle: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '.95rem', fontWeight: 700,
        lineHeight: 1.3, margin: 0,
        transition: 'color .2s',
    },
    topicArrow: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: '.85rem',
        marginTop: '.1rem',
    },
    // modal
    modalOverlay: {
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
    },
    modal: {
        background: '#13131e',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 20,
        padding: '2rem',
        maxWidth: 520, width: '100%',
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        animation: 'modalIn .2s cubic-bezier(.34,1.56,.64,1)',
    },
    modalTop: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginBottom: '1rem',
    },
    closeBtn: {
        background: 'rgba(255,255,255,0.06)', border: 'none',
        color: 'rgba(255,255,255,0.5)', borderRadius: '50%',
        width: 32, height: 32, cursor: 'pointer',
        fontFamily: 'monospace', fontSize: '.9rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    modalTitle: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '1.5rem', fontWeight: 800,
        letterSpacing: '-.02em', margin: '0 0 .75rem',
    },
    modalDesc: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: '.9rem', lineHeight: 1.75,
        fontFamily: "'DM Mono', monospace",
        margin: '0 0 1.25rem',
    },
    modalResourcesHeading: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '.8rem', fontWeight: 700,
        textTransform: 'uppercase' as const,
        letterSpacing: '.1em',
        color: 'rgba(255,255,255,0.35)',
        margin: '0 0 .6rem',
    },
    modalResources: {
        display: 'flex', flexDirection: 'column' as const, gap: '.45rem',
        marginBottom: '1.5rem',
    },
    resourceLink: {
        display: 'flex', alignItems: 'center', gap: '.5rem',
        color: '#60a5fa',
        fontFamily: "'DM Mono', monospace",
        fontSize: '.83rem',
        textDecoration: 'none',
        padding: '.45rem .75rem',
        background: 'rgba(59,130,246,0.08)',
        borderRadius: 8,
        border: '1px solid rgba(59,130,246,0.15)',
        transition: 'background .2s',
    },
    modalDoneBtn: {
        width: '100%',
        fontFamily: "'DM Sans', sans-serif",
        fontWeight: 700, fontSize: '.95rem',
        border: 'none', borderRadius: 12,
        padding: '.8rem',
        cursor: 'pointer',
        transition: 'all .2s',
    },
};

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800&family=DM+Mono:wght@400;500&display=swap');

  @keyframes modalIn {
    from { transform: scale(0.92); opacity: 0; }
    to   { transform: scale(1);    opacity: 1; }
  }

  /* topic card hover */
  [data-topic]:hover { transform: translateY(-2px); }

  /* back button hover */
  button[style*="Back"]:hover { color: rgba(255,255,255,0.8) !important; }
`;

export default CPRoadmap;
