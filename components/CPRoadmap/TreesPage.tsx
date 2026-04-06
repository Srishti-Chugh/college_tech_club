/// <reference types="vite/client" />
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Tree Types ───────────────────────────────────────────────────────────────
type TreeType = 'binary' | 'bst' | 'avl' | 'nary';

interface TreeNode {
    id: number;
    value: number;
    left: TreeNode | null;
    right: TreeNode | null;
    children?: TreeNode[];      // for N-ary
    height?: number;            // for AVL
    state: 'idle' | 'inserted' | 'deleted' | 'searched' | 'highlighted' | 'traversed';
    x?: number;
    y?: number;
}

interface LogEntry { msg: string; type: 'success' | 'error' | 'info' | 'traverse' }

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
    { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', topic: 'DFS/BFS', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', acceptance: '75.1%' },
    { title: 'Invert Binary Tree', difficulty: 'Easy', topic: 'DFS', url: 'https://leetcode.com/problems/invert-binary-tree/', acceptance: '78.2%' },
    { title: 'Symmetric Tree', difficulty: 'Easy', topic: 'DFS/BFS', url: 'https://leetcode.com/problems/symmetric-tree/', acceptance: '56.4%' },
    { title: 'Path Sum', difficulty: 'Easy', topic: 'DFS', url: 'https://leetcode.com/problems/path-sum/', acceptance: '50.3%' },
    { title: 'Same Tree', difficulty: 'Easy', topic: 'DFS', url: 'https://leetcode.com/problems/same-tree/', acceptance: '59.7%' },
    { title: 'Balanced Binary Tree', difficulty: 'Easy', topic: 'DFS', url: 'https://leetcode.com/problems/balanced-binary-tree/', acceptance: '50.8%' },
    { title: 'Minimum Depth of Binary Tree', difficulty: 'Easy', topic: 'BFS', url: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/', acceptance: '45.2%' },
    { title: 'Count Complete Tree Nodes', difficulty: 'Easy', topic: 'Binary Search', url: 'https://leetcode.com/problems/count-complete-tree-nodes/', acceptance: '62.9%' },
    { title: 'Subtree of Another Tree', difficulty: 'Easy', topic: 'DFS', url: 'https://leetcode.com/problems/subtree-of-another-tree/', acceptance: '47.4%' },
    { title: 'Range Sum of BST', difficulty: 'Easy', topic: 'BST', url: 'https://leetcode.com/problems/range-sum-of-bst/', acceptance: '85.7%' },
    { title: 'Search in a BST', difficulty: 'Easy', topic: 'BST', url: 'https://leetcode.com/problems/search-in-a-binary-search-tree/', acceptance: '78.3%' },
    { title: 'Merge Two Binary Trees', difficulty: 'Easy', topic: 'DFS', url: 'https://leetcode.com/problems/merge-two-binary-trees/', acceptance: '78.9%' },
    // Medium
    { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', topic: 'BFS', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', acceptance: '66.7%' },
    { title: 'Binary Tree Zigzag Level Order', difficulty: 'Medium', topic: 'BFS', url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/', acceptance: '57.3%' },
    { title: 'Construct Binary Tree from Preorder', difficulty: 'Medium', topic: 'Divide & Conquer', url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', acceptance: '63.5%' },
    { title: 'Populating Next Right Pointers', difficulty: 'Medium', topic: 'BFS', url: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/', acceptance: '62.1%' },
    { title: 'Path Sum II', difficulty: 'Medium', topic: 'Backtracking', url: 'https://leetcode.com/problems/path-sum-ii/', acceptance: '58.6%' },
    { title: 'Binary Tree Right Side View', difficulty: 'Medium', topic: 'BFS', url: 'https://leetcode.com/problems/binary-tree-right-side-view/', acceptance: '63.9%' },
    { title: 'Lowest Common Ancestor of BST', difficulty: 'Medium', topic: 'BST', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', acceptance: '63.4%' },
    { title: 'Kth Smallest Element in BST', difficulty: 'Medium', topic: 'BST + Inorder', url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', acceptance: '71.8%' },
    { title: 'Validate Binary Search Tree', difficulty: 'Medium', topic: 'BST', url: 'https://leetcode.com/problems/validate-binary-search-tree/', acceptance: '32.8%' },
    { title: 'Flatten Binary Tree to Linked List', difficulty: 'Medium', topic: 'DFS', url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/', acceptance: '63.7%' },
    { title: 'Unique Binary Search Trees', difficulty: 'Medium', topic: 'DP + Catalan', url: 'https://leetcode.com/problems/unique-binary-search-trees/', acceptance: '60.3%' },
    { title: 'Sum Root to Leaf Numbers', difficulty: 'Medium', topic: 'DFS', url: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/', acceptance: '59.1%' },
    { title: 'Convert Sorted Array to BST', difficulty: 'Medium', topic: 'BST', url: 'https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/', acceptance: '72.4%' },
    { title: 'Delete Node in BST', difficulty: 'Medium', topic: 'BST', url: 'https://leetcode.com/problems/delete-node-in-a-bst/', acceptance: '51.2%' },
    // Hard
    { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', topic: 'DFS', url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', acceptance: '39.8%' },
    { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', topic: 'BFS/DFS', url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', acceptance: '56.7%' },
    { title: 'Lowest Common Ancestor (General)', difficulty: 'Hard', topic: 'DFS', url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/', acceptance: '61.1%' },
    { title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', topic: 'BST / Merge Sort', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/', acceptance: '42.1%' },
    { title: 'Recover Binary Search Tree', difficulty: 'Hard', topic: 'BST + Morris', url: 'https://leetcode.com/problems/recover-binary-search-tree/', acceptance: '52.9%' },
    { title: 'Word Ladder II', difficulty: 'Hard', topic: 'BFS + Backtrack', url: 'https://leetcode.com/problems/word-ladder-ii/', acceptance: '26.3%' },
];

// ─── Tree helpers ─────────────────────────────────────────────────────────────
let nodeIdCounter = 100;
const newId = () => ++nodeIdCounter;

const nodeHeight = (n: TreeNode | null): number =>
    n ? 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right)) : 0;

const balanceFactor = (n: TreeNode | null): number =>
    n ? nodeHeight(n.left) - nodeHeight(n.right) : 0;

// BST insert
function bstInsert(root: TreeNode | null, val: number): TreeNode {
    if (!root) return { id: newId(), value: val, left: null, right: null, state: 'inserted' };
    if (val < root.value) return { ...root, left: bstInsert(root.left, val) };
    if (val > root.value) return { ...root, right: bstInsert(root.right, val) };
    return root;
}

// BST delete
function bstMinNode(n: TreeNode): TreeNode {
    let cur = n;
    while (cur.left) cur = cur.left;
    return cur;
}
function bstDelete(root: TreeNode | null, val: number): TreeNode | null {
    if (!root) return null;
    if (val < root.value) return { ...root, left: bstDelete(root.left, val) };
    if (val > root.value) return { ...root, right: bstDelete(root.right, val) };
    if (!root.left) return root.right;
    if (!root.right) return root.left;
    const succ = bstMinNode(root.right);
    return { ...root, value: succ.value, right: bstDelete(root.right, succ.value) };
}

// BST search — returns path of values visited
function bstSearchPath(root: TreeNode | null, val: number, path: number[] = []): number[] {
    if (!root) return path;
    path.push(root.value);
    if (val === root.value) return path;
    if (val < root.value) return bstSearchPath(root.left, val, path);
    return bstSearchPath(root.right, val, path);
}

// Color nodes by value set
function colorNodes(root: TreeNode | null, targets: Set<number>, state: TreeNode['state']): TreeNode | null {
    if (!root) return null;
    return {
        ...root,
        state: targets.has(root.value) ? state : 'idle',
        left: colorNodes(root.left, targets, state),
        right: colorNodes(root.right, targets, state),
    };
}

// Reset all states
function resetStates(root: TreeNode | null): TreeNode | null {
    if (!root) return null;
    return { ...root, state: 'idle', left: resetStates(root.left), right: resetStates(root.right) };
}

// AVL rotations
function avlRotateRight(y: TreeNode): TreeNode {
    const x = y.left!;
    const T2 = x.right;
    const newY = { ...y, left: T2, height: 1 + Math.max(nodeHeight(T2), nodeHeight(y.right)) };
    return { ...x, right: newY, height: 1 + Math.max(nodeHeight(x.left), nodeHeight(newY)) };
}
function avlRotateLeft(x: TreeNode): TreeNode {
    const y = x.right!;
    const T2 = y.left;
    const newX = { ...x, right: T2, height: 1 + Math.max(nodeHeight(x.left), nodeHeight(T2)) };
    return { ...y, left: newX, height: 1 + Math.max(nodeHeight(newX), nodeHeight(y.right)) };
}
function avlInsert(root: TreeNode | null, val: number): TreeNode {
    if (!root) return { id: newId(), value: val, left: null, right: null, height: 1, state: 'inserted' };
    let node: TreeNode;
    if (val < root.value) node = { ...root, left: avlInsert(root.left, val) };
    else if (val > root.value) node = { ...root, right: avlInsert(root.right, val) };
    else return root;

    node = { ...node, height: 1 + Math.max(nodeHeight(node.left), nodeHeight(node.right)) };
    const bf = balanceFactor(node);

    if (bf > 1 && val < node.left!.value) return avlRotateRight(node);
    if (bf < -1 && val > node.right!.value) return avlRotateLeft(node);
    if (bf > 1 && val > node.left!.value) { node = { ...node, left: avlRotateLeft(node.left!) }; return avlRotateRight(node); }
    if (bf < -1 && val < node.right!.value) { node = { ...node, right: avlRotateRight(node.right!) }; return avlRotateLeft(node); }
    return node;
}

// Inorder traversal — returns values in order
function inorder(root: TreeNode | null, result: number[] = []): number[] {
    if (!root) return result;
    inorder(root.left, result);
    result.push(root.value);
    inorder(root.right, result);
    return result;
}
function preorder(root: TreeNode | null, result: number[] = []): number[] {
    if (!root) return result;
    result.push(root.value);
    preorder(root.left, result);
    preorder(root.right, result);
    return result;
}
function postorder(root: TreeNode | null, result: number[] = []): number[] {
    if (!root) return result;
    postorder(root.left, result);
    postorder(root.right, result);
    result.push(root.value);
    return result;
}
function levelorder(root: TreeNode | null): number[] {
    if (!root) return [];
    const q = [root], result: number[] = [];
    while (q.length) {
        const n = q.shift()!;
        result.push(n.value);
        if (n.left) q.push(n.left);
        if (n.right) q.push(n.right);
    }
    return result;
}

// Binary tree insert (level-order fill)
function btInsert(root: TreeNode | null, val: number): TreeNode {
    const newNode: TreeNode = { id: newId(), value: val, left: null, right: null, state: 'inserted' };
    if (!root) return newNode;
    const q = [root];
    while (q.length) {
        const n = q.shift()!;
        if (!n.left) { n.left = newNode; return root; }
        q.push(n.left);
        if (!n.right) { n.right = newNode; return root; }
        q.push(n.right);
    }
    return root;
}

// ─── Layout calculation ───────────────────────────────────────────────────────
interface LayoutNode { node: TreeNode; x: number; y: number; }

function layoutTree(root: TreeNode | null, svgW: number): LayoutNode[] {
    if (!root) return [];
    const layouts: LayoutNode[] = [];
    const NODE_R = 26;
    const V_GAP = 72;

    function assign(n: TreeNode | null, depth: number, left: number, right: number): void {
        if (!n) return;
        const cx = (left + right) / 2;
        const cy = depth * V_GAP + NODE_R + 16;
        layouts.push({ node: n, x: cx, y: cy });
        assign(n.left, depth + 1, left, cx);
        assign(n.right, depth + 1, cx, right);
    }
    assign(root, 0, 0, svgW);
    return layouts;
}

function findLayout(layouts: LayoutNode[], id: number): LayoutNode | undefined {
    return layouts.find(l => l.node.id === id);
}

// ─── Default trees ────────────────────────────────────────────────────────────
function buildDefaultBST(): TreeNode {
    let r = bstInsert(null, 50);
    [30, 70, 20, 40, 60, 80, 10, 35].forEach(v => { r = bstInsert(r, v); });
    return resetStates(r)!;
}
function buildDefaultBinary(): TreeNode {
    let r = btInsert(null, 1);
    [2, 3, 4, 5, 6, 7].forEach(v => { r = btInsert(r, v); });
    return resetStates(r)!;
}
function buildDefaultAVL(): TreeNode {
    let r = avlInsert(null, 30);
    [20, 40, 10, 25, 35, 50].forEach(v => { r = avlInsert(r, v); });
    return resetStates(r)!;
}

// N-ary helpers
interface NaryNode {
    id: number; value: number; children: NaryNode[];
    state: 'idle' | 'inserted' | 'searched' | 'highlighted' | 'traversed' | 'deleted';
}
function buildDefaultNary(): NaryNode {
    return {
        id: 1, value: 1, state: 'idle', children: [
            {
                id: 2, value: 2, state: 'idle', children: [
                    { id: 5, value: 5, state: 'idle', children: [] },
                    { id: 6, value: 6, state: 'idle', children: [] },
                ]
            },
            {
                id: 3, value: 3, state: 'idle', children: [
                    { id: 7, value: 7, state: 'idle', children: [] },
                ]
            },
            {
                id: 4, value: 4, state: 'idle', children: [
                    { id: 8, value: 8, state: 'idle', children: [] },
                    { id: 9, value: 9, state: 'idle', children: [] },
                    { id: 10, value: 10, state: 'idle', children: [] },
                ]
            },
        ],
    };
}

// ─── SVG Tree Renderer ────────────────────────────────────────────────────────
const NODE_R = 26;

const STATE_COLORS: Record<string, { fill: string; stroke: string; text: string }> = {
    idle: { fill: '#1e2030', stroke: 'rgba(255,255,255,0.15)', text: 'rgba(255,255,255,0.85)' },
    inserted: { fill: '#166534', stroke: '#22c55e', text: '#fff' },
    deleted: { fill: '#7f1d1d', stroke: '#ef4444', text: '#fff' },
    searched: { fill: '#78350f', stroke: '#f59e0b', text: '#fff' },
    highlighted: { fill: '#1e3a5f', stroke: '#60a5fa', text: '#fff' },
    traversed: { fill: '#312e81', stroke: '#818cf8', text: '#fff' },
};

interface SVGTreeProps {
    root: TreeNode | null;
    svgW: number;
}
const SVGTree: React.FC<SVGTreeProps> = ({ root, svgW }) => {
    const layouts = layoutTree(root, svgW);
    const maxDepth = layouts.reduce((m, l) => Math.max(m, l.y), 0);
    const svgH = maxDepth + NODE_R + 24;

    const renderEdges = (n: TreeNode | null): React.ReactNode => {
        if (!n) return null;
        const parent = findLayout(layouts, n.id);
        if (!parent) return null;
        return (
            <>
                {n.left && (() => {
                    const child = findLayout(layouts, n.left!.id);
                    return child ? <line key={`e-${n.id}-l`} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} /> : null;
                })()}
                {n.right && (() => {
                    const child = findLayout(layouts, n.right!.id);
                    return child ? <line key={`e-${n.id}-r`} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} /> : null;
                })()}
                {renderEdges(n.left)}
                {renderEdges(n.right)}
            </>
        );
    };

    return (
        <svg width="100%" viewBox={`0 0 ${svgW} ${Math.max(svgH, 200)}`} style={{ overflow: 'visible' }}>
            {renderEdges(root)}
            {layouts.map(({ node, x, y }) => {
                const c = STATE_COLORS[node.state] || STATE_COLORS.idle;
                return (
                    <g key={node.id} style={{ transition: 'all 0.4s' }}>
                        <circle cx={x} cy={y} r={NODE_R} fill={c.fill} stroke={c.stroke} strokeWidth={2}
                            style={{ filter: node.state !== 'idle' ? `drop-shadow(0 0 8px ${c.stroke})` : 'none', transition: 'all 0.35s' }} />
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                            fill={c.text} fontSize={node.value > 99 ? 11 : 13} fontFamily="'Fira Code',monospace" fontWeight="600">
                            {node.value}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
};

// N-ary SVG renderer
interface NarySVGProps { root: NaryNode; svgW: number }
interface NLayout { node: NaryNode; x: number; y: number }
function layoutNary(root: NaryNode, svgW: number): NLayout[] {
    const result: NLayout[] = [];
    const V_GAP = 80;
    function countLeaves(n: NaryNode): number {
        if (!n.children.length) return 1;
        return n.children.reduce((s, c) => s + countLeaves(c), 0);
    }
    function assign(n: NaryNode, depth: number, left: number, right: number) {
        const cx = (left + right) / 2;
        result.push({ node: n, x: cx, y: depth * V_GAP + NODE_R + 16 });
        if (!n.children.length) return;
        const total = countLeaves(n);
        let cur = left;
        for (const child of n.children) {
            const fraction = countLeaves(child) / total;
            assign(child, depth + 1, cur, cur + fraction * (right - left));
            cur += fraction * (right - left);
        }
    }
    assign(root, 0, 0, svgW);
    return result;
}

const NarySVGTree: React.FC<NarySVGProps> = ({ root, svgW }) => {
    const layouts = layoutNary(root, svgW);
    const maxY = layouts.reduce((m, l) => Math.max(m, l.y), 0);
    const svgH = maxY + NODE_R + 24;

    const findN = (id: number) => layouts.find(l => l.node.id === id);

    const renderNEdges = (n: NaryNode): React.ReactNode => {
        const par = findN(n.id);
        if (!par) return null;
        return n.children.map(child => {
            const ch = findN(child.id);
            return ch ? (
                <React.Fragment key={`ne-${n.id}-${child.id}`}>
                    <line x1={par.x} y1={par.y} x2={ch.x} y2={ch.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1.5} />
                    {renderNEdges(child)}
                </React.Fragment>
            ) : null;
        });
    };

    return (
        <svg width="100%" viewBox={`0 0 ${svgW} ${Math.max(svgH, 200)}`} style={{ overflow: 'visible' }}>
            {renderNEdges(root)}
            {layouts.map(({ node, x, y }) => {
                const c = STATE_COLORS[node.state] || STATE_COLORS.idle;
                return (
                    <g key={node.id}>
                        <circle cx={x} cy={y} r={NODE_R} fill={c.fill} stroke={c.stroke} strokeWidth={2}
                            style={{ filter: node.state !== 'idle' ? `drop-shadow(0 0 8px ${c.stroke})` : 'none', transition: 'all 0.35s' }} />
                        <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                            fill={c.text} fontSize={13} fontFamily="'Fira Code',monospace" fontWeight="600">{node.value}</text>
                    </g>
                );
            })}
        </svg>
    );
};

// ─── Tree type metadata ───────────────────────────────────────────────────────
const TREE_META: Record<TreeType, { label: string; color: string; desc: string; complexities: [string, string][] }> = {
    binary: { label: 'Binary Tree', color: '#f97316', desc: 'Each node has at most 2 children. No ordering constraint.', complexities: [['O(n)', 'Insert'], ['O(n)', 'Delete'], ['O(n)', 'Search'], ['O(n)', 'Traversal']] },
    bst: { label: 'BST', color: '#22c55e', desc: 'Left < Root < Right. Enables O(log n) ops on balanced trees.', complexities: [['O(log n)', 'Insert'], ['O(log n)', 'Delete'], ['O(log n)', 'Search'], ['O(n)', 'Inorder']] },
    avl: { label: 'AVL Tree', color: '#60a5fa', desc: 'Self-balancing BST. Height difference ≤ 1. Guarantees O(log n).', complexities: [['O(log n)', 'Insert'], ['O(log n)', 'Delete'], ['O(log n)', 'Search'], ['O(1)', 'Rotation']] },
    nary: { label: 'N-ary Tree', color: '#c084fc', desc: 'Each node can have any number of children.', complexities: [['O(n)', 'Insert'], ['O(n)', 'Search'], ['O(n)', 'Traversal'], ['O(h)', 'Height']] },
};

// ─── Main Component ───────────────────────────────────────────────────────────
const TreesPage: React.FC = () => {
    const navigate = useNavigate();
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const [svgW, setSvgW] = useState(700);

    const [treeType, setTreeType] = useState<TreeType>('bst');
    const [bstRoot, setBstRoot] = useState<TreeNode>(() => buildDefaultBST());
    const [binRoot, setBinRoot] = useState<TreeNode>(() => buildDefaultBinary());
    const [avlRoot, setAvlRoot] = useState<TreeNode>(() => buildDefaultAVL());
    const [naryRoot, setNaryRoot] = useState<NaryNode>(() => buildDefaultNary());

    const [inputVal, setInputVal] = useState('');
    const [searchVal, setSearchVal] = useState('');
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [log, setLog] = useState<LogEntry[]>([{ msg: 'Select a tree type above and interact with it!', type: 'info' }]);
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const logRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const obs = new ResizeObserver(entries => {
            const w = entries[0]?.contentRect.width;
            if (w) setSvgW(Math.min(w - 16, 860));
        });
        if (svgContainerRef.current) obs.observe(svgContainerRef.current);
        return () => obs.disconnect();
    }, []);

    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [log]);

    useEffect(() => {
        setLog([{ msg: `Switched to ${TREE_META[treeType].label}. ${TREE_META[treeType].desc}`, type: 'info' }]);
        setActiveOp(null);
        setInputVal(''); setSearchVal('');
    }, [treeType]);

    const addLog = (msg: string, type: LogEntry['type'] = 'info') =>
        setLog(prev => [...prev.slice(-24), { msg, type }]);

    // ── BST / AVL / Binary ops ─────────────────────────────────────────────────
    const flashThenReset = (setter: React.Dispatch<React.SetStateAction<TreeNode>>, updated: TreeNode, delay = 1000) => {
        setter(updated);
        setTimeout(() => setter(r => resetStates(r) as TreeNode), delay);
    };

    const handleInsert = () => {
        const v = Number(inputVal);
        if (!inputVal || isNaN(v)) return addLog('Enter a valid number.', 'error');
        if (treeType === 'bst') {
            const updated = bstInsert(bstRoot, v);
            flashThenReset(setBstRoot, updated as TreeNode);
            addLog(`Inserted ${v} into BST. O(log n) average.`, 'success');
        } else if (treeType === 'avl') {
            const updated = avlInsert(avlRoot, v);
            flashThenReset(setAvlRoot, updated as TreeNode);
            addLog(`Inserted ${v} into AVL. Auto-rebalanced. O(log n) guaranteed.`, 'success');
        } else if (treeType === 'binary') {
            const updated = btInsert(binRoot, v);
            flashThenReset(setBinRoot, updated as TreeNode);
            addLog(`Inserted ${v} via level-order fill. O(n).`, 'success');
        }
        setInputVal('');
    };

    const handleDelete = () => {
        const v = Number(inputVal);
        if (!inputVal || isNaN(v)) return addLog('Enter a value to delete.', 'error');
        if (treeType === 'bst') {
            const updated = bstDelete(bstRoot, v);
            if (!updated) { setBstRoot(buildDefaultBST()); addLog('Tree is now empty. Reset to default.', 'info'); }
            else { setBstRoot(resetStates(updated) as TreeNode); }
            addLog(`Deleted ${v} from BST. Replaced with inorder successor. O(log n).`, 'success');
        } else if (treeType === 'avl') {
            const updated = bstDelete(avlRoot, v);
            if (!updated) { setAvlRoot(buildDefaultAVL()); addLog('Tree empty. Reset.', 'info'); }
            else { setAvlRoot(resetStates(updated) as TreeNode); }
            addLog(`Deleted ${v} from AVL. O(log n).`, 'success');
        } else if (treeType === 'binary') {
            addLog('Binary tree: deletion requires finding deepest rightmost node as replacement. O(n).', 'info');
        }
        setInputVal('');
    };

    const handleSearch = () => {
        const v = Number(searchVal);
        if (!searchVal || isNaN(v)) return addLog('Enter a value to search.', 'error');
        if (treeType === 'bst' || treeType === 'avl') {
            const root = treeType === 'bst' ? bstRoot : avlRoot;
            const setter = treeType === 'bst' ? setBstRoot : setAvlRoot;
            const path = bstSearchPath(root, v);
            const found = path[path.length - 1] === v;
            const pathSet = new Set(path);
            const colored = colorNodes(root, pathSet, found ? 'searched' : 'highlighted');
            flashThenReset(setter, colored as TreeNode, 1400);
            addLog(found
                ? `Found ${v}! Visited ${path.length} node(s): [${path.join(' → ')}]. O(log n).`
                : `${v} not found. Searched ${path.length} node(s). O(log n).`,
                found ? 'success' : 'error');
        } else {
            addLog('Binary tree search: linear scan O(n).', 'info');
        }
        setSearchVal('');
    };

    const handleTraversal = (kind: string) => {
        const root = treeType === 'bst' ? bstRoot : treeType === 'avl' ? avlRoot : binRoot;
        const setter = treeType === 'bst' ? setBstRoot : treeType === 'avl' ? setAvlRoot : setBinRoot;
        let result: number[] = [];
        if (kind === 'inorder') result = inorder(root);
        if (kind === 'preorder') result = preorder(root);
        if (kind === 'postorder') result = postorder(root);
        if (kind === 'level') result = levelorder(root);
        const all = new Set(result);
        const colored = colorNodes(root, all, 'traversed');
        flashThenReset(setter, colored as TreeNode, 1800);
        addLog(`${kind.charAt(0).toUpperCase() + kind.slice(1)}: [${result.join(' → ')}]`, 'traverse');
    };

    const handleReset = () => {
        setBstRoot(buildDefaultBST());
        setBinRoot(buildDefaultBinary());
        setAvlRoot(buildDefaultAVL());
        setNaryRoot(buildDefaultNary());
        setLog([{ msg: 'All trees reset to defaults.', type: 'info' }]);
    };

    const currentRoot = treeType === 'bst' ? bstRoot : treeType === 'avl' ? avlRoot : binRoot;
    const meta = TREE_META[treeType];
    const filtered = PROBLEMS.filter(p => filter === 'All' || p.difficulty === filter);
    const counts = { Easy: PROBLEMS.filter(p => p.difficulty === 'Easy').length, Medium: PROBLEMS.filter(p => p.difficulty === 'Medium').length, Hard: PROBLEMS.filter(p => p.difficulty === 'Hard').length };

    return (
        <div className="tp-root">
            <div className="tp-bg" aria-hidden>
                <div className="tp-orb tp-orb1" style={{ background: meta.color }} />
                <div className="tp-orb tp-orb2" />
                <div className="tp-grid" />
            </div>

            {/* Back */}
            <button className="tp-back" onClick={() => navigate('/resources/cp-roadmap')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                DSA Roadmap
            </button>

            {/* Header */}
            <header className="tp-header">
                <div className="tp-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}40` }}>
                    Data Structures · Trees
                </div>
                <h1 className="tp-title" style={{ backgroundImage: `linear-gradient(135deg,#fff 30%,${meta.color})` }}>
                    Trees
                </h1>
                <p className="tp-subtitle">{meta.desc}</p>
                <div className="tp-stats">
                    {meta.complexities.map(([c, l]) => (
                        <div className="tp-stat" key={l}>
                            <span className="tp-stat-code" style={{ color: meta.color }}>{c}</span>
                            <span className="tp-stat-label">{l}</span>
                        </div>
                    ))}
                </div>
            </header>

            {/* ══ PLAYGROUND ══ */}
            <section className="pg-wrap">
                {/* Tree type toggle */}
                <div className="pg-toggle-row">
                    {(Object.entries(TREE_META) as [TreeType, typeof TREE_META[TreeType]][]).map(([key, m]) => (
                        <button
                            key={key}
                            onClick={() => setTreeType(key)}
                            className={`pg-toggle-btn ${treeType === key ? 'active' : ''}`}
                            style={treeType === key ? { borderColor: m.color, color: m.color, background: `${m.color}15` } : {}}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>

                <div className="pg-header-row">
                    <h2 className="pg-title">Interactive Playground <span className="pg-type-chip" style={{ background: `${meta.color}20`, color: meta.color, borderColor: `${meta.color}40` }}>{meta.label}</span></h2>
                    <button className="pg-reset" onClick={handleReset}>Reset All</button>
                </div>

                {/* SVG Canvas */}
                <div className="pg-canvas" ref={svgContainerRef}>
                    {treeType === 'nary'
                        ? <NarySVGTree root={naryRoot} svgW={svgW} />
                        : <SVGTree root={currentRoot} svgW={svgW} />
                    }
                </div>

                {/* Node state legend */}
                <div className="pg-legend">
                    {[['#22c55e', 'Inserted'], ['#ef4444', 'Deleted'], ['#f59e0b', 'Searched'], ['#60a5fa', 'Path / Highlighted'], ['#818cf8', 'Traversed']].map(([c, l]) => (
                        <span className="pg-leg" key={l}><span className="pg-leg-dot" style={{ background: c }} />{l}</span>
                    ))}
                </div>

                {/* Operations */}
                <div className="pg-ops">

                    {/* Insert */}
                    {treeType !== 'nary' && (
                        <div className={`pg-op-card ${activeOp === 'insert' ? 'active' : ''}`} onClick={() => setActiveOp(activeOp === 'insert' ? null : 'insert')}>
                            <div className="pg-op-head">
                                <span className="pg-op-icon">＋</span>
                                <span className="pg-op-name">Insert</span>
                                <span className="pg-op-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}35` }}>
                                    {treeType === 'binary' ? 'O(n)' : 'O(log n)'}
                                </span>
                                <svg className={`pg-chev ${activeOp === 'insert' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                            </div>
                            {activeOp === 'insert' && (
                                <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                    <div className="pg-row">
                                        <input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsert()} />
                                        <button className="pg-btn" style={{ background: meta.color, color: '#000' }} onClick={handleInsert}>Insert Node</button>
                                    </div>
                                    <p className="pg-hint">
                                        {treeType === 'bst' && 'Compares at each node: go left if smaller, right if larger.'}
                                        {treeType === 'avl' && 'Inserts like BST then rotates to maintain balance factor ≤ 1.'}
                                        {treeType === 'binary' && 'Level-order fill: inserts at first available position left-to-right.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Delete */}
                    {(treeType === 'bst' || treeType === 'avl') && (
                        <div className={`pg-op-card ${activeOp === 'delete' ? 'active' : ''}`} onClick={() => setActiveOp(activeOp === 'delete' ? null : 'delete')}>
                            <div className="pg-op-head">
                                <span className="pg-op-icon">－</span>
                                <span className="pg-op-name">Delete</span>
                                <span className="pg-op-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}35` }}>O(log n)</span>
                                <svg className={`pg-chev ${activeOp === 'delete' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                            </div>
                            {activeOp === 'delete' && (
                                <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                    <div className="pg-row">
                                        <input className="pg-inp" placeholder="Value to delete" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleDelete()} />
                                        <button className="pg-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={handleDelete}>Delete Node</button>
                                    </div>
                                    <p className="pg-hint">3 cases: leaf → remove; one child → replace; two children → swap with inorder successor.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Search */}
                    {treeType !== 'nary' && (
                        <div className={`pg-op-card ${activeOp === 'search' ? 'active' : ''}`} onClick={() => setActiveOp(activeOp === 'search' ? null : 'search')}>
                            <div className="pg-op-head">
                                <span className="pg-op-icon">🔍</span>
                                <span className="pg-op-name">Search</span>
                                <span className="pg-op-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}35` }}>
                                    {treeType === 'binary' ? 'O(n)' : 'O(log n)'}
                                </span>
                                <svg className={`pg-chev ${activeOp === 'search' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                            </div>
                            {activeOp === 'search' && (
                                <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                    <div className="pg-row">
                                        <input className="pg-inp" placeholder="Value to find" value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                                        <button className="pg-btn" style={{ background: '#f59e0b', color: '#000' }} onClick={handleSearch}>Search</button>
                                    </div>
                                    <p className="pg-hint">Blue = visited path nodes. Yellow = found node.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Traversals */}
                    {treeType !== 'nary' && (
                        <div className={`pg-op-card ${activeOp === 'traverse' ? 'active' : ''}`} onClick={() => setActiveOp(activeOp === 'traverse' ? null : 'traverse')}>
                            <div className="pg-op-head">
                                <span className="pg-op-icon">↺</span>
                                <span className="pg-op-name">Traversals</span>
                                <span className="pg-op-badge" style={{ color: meta.color, background: `${meta.color}18`, borderColor: `${meta.color}35` }}>O(n)</span>
                                <svg className={`pg-chev ${activeOp === 'traverse' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                            </div>
                            {activeOp === 'traverse' && (
                                <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                    <div className="pg-row" style={{ flexWrap: 'wrap' }}>
                                        {[['inorder', 'Inorder (L→Root→R)'], ['preorder', 'Preorder (Root→L→R)'], ['postorder', 'Postorder (L→R→Root)'], ['level', 'Level Order (BFS)']].map(([k, l]) => (
                                            <button key={k} className="pg-btn" style={{ background: '#818cf8', color: '#fff', flex: '1', minWidth: 120 }} onClick={() => handleTraversal(k)}>{l}</button>
                                        ))}
                                    </div>
                                    <p className="pg-hint">BST inorder always gives sorted output. Result shown in operation log below.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* AVL balance info */}
                    {treeType === 'avl' && (
                        <div className="pg-op-card" style={{ cursor: 'default' }}>
                            <div className="pg-op-head">
                                <span className="pg-op-icon">⚖</span>
                                <span className="pg-op-name">Balance Factor</span>
                                <span className="pg-op-badge" style={{ color: '#60a5fa', background: 'rgba(96,165,250,0.15)', borderColor: 'rgba(96,165,250,0.3)' }}>Auto</span>
                            </div>
                            <div className="pg-op-body" style={{ cursor: 'default' }} onClick={e => e.stopPropagation()}>
                                <p className="pg-hint">AVL property: |height(left) − height(right)| ≤ 1 for every node.<br />Rotations: LL → Right Rotate · RR → Left Rotate · LR → Left-Right · RL → Right-Left.<br />Current tree height: <strong style={{ color: '#60a5fa' }}>{nodeHeight(avlRoot)}</strong></p>
                            </div>
                        </div>
                    )}

                    {/* N-ary info */}
                    {treeType === 'nary' && (
                        <div className="pg-op-card" style={{ cursor: 'default' }}>
                            <div className="pg-op-head">
                                <span className="pg-op-icon">🌳</span>
                                <span className="pg-op-name">N-ary Tree Info</span>
                            </div>
                            <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                <p className="pg-hint">This N-ary tree (max 3 children per node) is shown for reference.<br />Used in: file systems, DOM tree, organisation charts, trie nodes.<br />Traversal: preorder/postorder same as binary — just iterate all children instead of left/right.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Log */}
                <div className="pg-log" ref={logRef}>
                    <span className="pg-log-label">Operation Log</span>
                    {log.map((e, i) => (
                        <div key={i} className={`pg-log-entry ${e.type}`}>
                            <span className="pg-log-arrow">›</span> {e.msg}
                        </div>
                    ))}
                </div>
            </section>

            {/* ══ PROBLEMS TABLE ══ */}
            <section className="pt-wrap">
                <div className="pt-header">
                    <div>
                        <h2 className="pt-title">Practice Problems</h2>
                        <p className="pt-sub">{PROBLEMS.length} curated Tree problems on LeetCode</p>
                    </div>
                    <div className="pt-counts">
                        <span className="pt-count easy">{counts.Easy} Easy</span>
                        <span className="pt-count medium">{counts.Medium} Medium</span>
                        <span className="pt-count hard">{counts.Hard} Hard</span>
                    </div>
                </div>
                <div className="pt-filters">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(f => (
                        <button key={f} className={`pt-filter ${filter === f ? 'active ' + f.toLowerCase() : ''}`} onClick={() => setFilter(f)}>
                            {f}{f !== 'All' && <span className="pt-filter-count">{counts[f as keyof typeof counts]}</span>}
                        </button>
                    ))}
                </div>
                <div className="pt-table-wrap">
                    <table className="pt-table">
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

            <style>{CSS}</style>
        </div>
    );
};

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Fira+Code:wght@400;500&display=swap');
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');

  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

  .tp-root{
    min-height:100vh;background:#090c14;color:rgba(255,255,255,.92);
    font-family:'Fira Code',monospace;
    display:flex;flex-direction:column;align-items:center;
    padding:0 1rem 6rem;position:relative;overflow-x:hidden;
  }
  .tp-bg{position:fixed;inset:0;pointer-events:none;z-index:0}
  .tp-orb{position:absolute;border-radius:50%;filter:blur(120px);opacity:.09;transition:background 1s}
  .tp-orb1{width:700px;height:700px;top:-250px;left:-200px}
  .tp-orb2{width:500px;height:500px;background:#a855f7;bottom:-100px;right:-150px}
  .tp-grid{
    position:absolute;inset:0;
    background-image:linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px);
    background-size:48px 48px;
  }

  .tp-back{
    position:relative;z-index:2;align-self:flex-start;margin-top:1.6rem;
    display:flex;align-items:center;gap:.4rem;
    background:none;border:none;cursor:pointer;
    color:rgba(255,255,255,.35);font-family:'Fira Code',monospace;font-size:.82rem;transition:color .2s;
  }
  .tp-back:hover{color:rgba(255,255,255,.7)}

  .tp-header{position:relative;z-index:2;text-align:center;margin-top:2.5rem;max-width:720px;width:100%}
  .tp-badge{
    display:inline-block;font-size:.68rem;letter-spacing:.14em;text-transform:uppercase;
    border:1px solid;border-radius:100px;padding:.28rem .85rem;margin-bottom:1rem;transition:all .4s;
  }
  .tp-title{
    font-size:clamp(3rem,9vw,5.5rem);font-weight:700;letter-spacing:-.04em;line-height:1;
    background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;
    transition:background-image .4s;
  }
  .tp-subtitle{margin-top:.85rem;color:rgba(255,255,255,.4);font-size:.82rem;line-height:1.7;transition:all .3s}
  .tp-stats{display:flex;justify-content:center;gap:.85rem;flex-wrap:wrap;margin-top:1.5rem}
  .tp-stat{
    display:flex;flex-direction:column;align-items:center;gap:.2rem;
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:.65rem 1.1rem;
  }
  .tp-stat-code{font-size:1rem;font-weight:600;transition:color .3s}
  .tp-stat-label{font-size:.68rem;color:rgba(255,255,255,.35)}

  /* PLAYGROUND */
  .pg-wrap{
    position:relative;z-index:2;width:100%;max-width:880px;margin-top:2.5rem;
    background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);border-radius:24px;padding:1.75rem;
  }
  .pg-toggle-row{
    display:flex;gap:.5rem;flex-wrap:wrap;
    background:rgba(0,0,0,.3);border:1px solid rgba(255,255,255,.07);border-radius:14px;padding:.4rem;
    margin-bottom:1.4rem;
  }
  .pg-toggle-btn{
    flex:1;min-width:100px;
    background:transparent;border:1px solid transparent;border-radius:10px;
    color:rgba(255,255,255,.38);font-family:'Fira Code',monospace;font-size:.8rem;
    padding:.55rem .5rem;cursor:pointer;transition:all .22s;white-space:nowrap;
  }
  .pg-toggle-btn:hover{color:rgba(255,255,255,.7)}
  .pg-toggle-btn.active{font-weight:600}

  .pg-header-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;gap:.5rem;flex-wrap:wrap}
  .pg-title{font-size:1.05rem;font-weight:600;display:flex;align-items:center;gap:.65rem;flex-wrap:wrap}
  .pg-type-chip{font-size:.7rem;padding:.22rem .7rem;border-radius:100px;border:1px solid;letter-spacing:.04em;transition:all .3s}
  .pg-reset{
    background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);
    color:rgba(255,255,255,.4);font-family:'Fira Code',monospace;font-size:.78rem;
    border-radius:8px;padding:.35rem .85rem;cursor:pointer;transition:all .2s;
  }
  .pg-reset:hover{color:#fff;border-color:rgba(255,255,255,.22)}

  .pg-canvas{
    background:rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.07);border-radius:16px;
    padding:1rem .5rem;min-height:220px;overflow:auto;margin-bottom:.85rem;
  }

  .pg-legend{display:flex;gap:.85rem;flex-wrap:wrap;justify-content:center;margin-bottom:1.25rem}
  .pg-leg{display:flex;align-items:center;gap:.35rem;font-size:.72rem;color:rgba(255,255,255,.38)}
  .pg-leg-dot{width:10px;height:10px;border-radius:3px;flex-shrink:0}

  .pg-ops{display:flex;flex-direction:column;gap:.55rem}
  .pg-op-card{border:1px solid rgba(255,255,255,.07);border-radius:13px;overflow:hidden;cursor:pointer;transition:border-color .2s}
  .pg-op-card.active{border-color:rgba(255,255,255,.16)}
  .pg-op-head{display:flex;align-items:center;gap:.7rem;padding:.8rem 1rem;background:rgba(255,255,255,.025)}
  .pg-op-icon{font-size:.95rem;width:18px;text-align:center}
  .pg-op-name{font-weight:600;font-size:.9rem;flex:1}
  .pg-op-badge{font-size:.68rem;padding:.18rem .55rem;border-radius:100px;border:1px solid;letter-spacing:.04em;transition:all .3s}
  .pg-chev{color:rgba(255,255,255,.28);transition:transform .2s;flex-shrink:0}
  .pg-chev.open{transform:rotate(180deg)}
  .pg-op-body{padding:.9rem 1rem 1rem;display:flex;flex-direction:column;gap:.55rem;background:rgba(0,0,0,.2);border-top:1px solid rgba(255,255,255,.05)}
  .pg-row{display:flex;gap:.45rem;align-items:center;flex-wrap:wrap}
  .pg-inp{
    flex:1;min-width:80px;
    background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);
    color:#fff;font-family:'Fira Code',monospace;font-size:.85rem;
    border-radius:9px;padding:.5rem .75rem;outline:none;transition:border-color .2s;
  }
  .pg-inp:focus{border-color:rgba(255,255,255,.28)}
  .pg-inp::placeholder{color:rgba(255,255,255,.2)}
  .pg-btn{
    border:none;border-radius:9px;cursor:pointer;
    font-family:'Fira Code',monospace;font-weight:500;font-size:.82rem;
    padding:.5rem .95rem;transition:opacity .15s;white-space:nowrap;
  }
  .pg-btn:hover{opacity:.85}
  .pg-hint{font-size:.74rem;color:rgba(255,255,255,.3);line-height:1.65}

  .pg-log{
    margin-top:1.25rem;background:rgba(0,0,0,.35);border:1px solid rgba(255,255,255,.06);
    border-radius:12px;padding:.75rem 1rem;max-height:140px;overflow-y:auto;
    display:flex;flex-direction:column;gap:.28rem;
  }
  .pg-log-label{font-size:.62rem;text-transform:uppercase;letter-spacing:.1em;color:rgba(255,255,255,.2);margin-bottom:.28rem}
  .pg-log-entry{font-size:.76rem;display:flex;gap:.45rem;align-items:flex-start;color:rgba(255,255,255,.42);line-height:1.5}
  .pg-log-entry.success{color:#4ade80}
  .pg-log-entry.error{color:#f87171}
  .pg-log-entry.traverse{color:#a5b4fc}
  .pg-log-entry.info{color:rgba(255,255,255,.38)}
  .pg-log-arrow{opacity:.45;flex-shrink:0}

  /* PROBLEMS */
  .pt-wrap{position:relative;z-index:2;width:100%;max-width:880px;margin-top:3rem}
  .pt-header{display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.2rem}
  .pt-title{font-size:1.3rem;font-weight:700;letter-spacing:-.02em;font-family:'Fira Code',monospace}
  .pt-sub{font-size:.78rem;color:rgba(255,255,255,.32);margin-top:.25rem}
  .pt-counts{display:flex;gap:.45rem;flex-wrap:wrap;align-items:center}
  .pt-count{font-size:.74rem;padding:.25rem .7rem;border-radius:100px;border:1px solid}
  .pt-count.easy{color:#4ade80;background:rgba(74,222,128,.1);border-color:rgba(74,222,128,.25)}
  .pt-count.medium{color:#fb923c;background:rgba(251,146,60,.1);border-color:rgba(251,146,60,.25)}
  .pt-count.hard{color:#f87171;background:rgba(248,113,113,.1);border-color:rgba(248,113,113,.25)}

  .pt-filters{display:flex;gap:.4rem;margin-bottom:.9rem;flex-wrap:wrap}
  .pt-filter{
    background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.09);
    color:rgba(255,255,255,.45);font-family:'Fira Code',monospace;font-size:.78rem;
    border-radius:9px;padding:.38rem .85rem;cursor:pointer;display:flex;align-items:center;gap:.38rem;transition:all .18s;
  }
  .pt-filter:hover{color:#fff;border-color:rgba(255,255,255,.22)}
  .pt-filter.active{color:#fff;border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.09)}
  .pt-filter.active.easy{color:#4ade80;border-color:rgba(74,222,128,.4);background:rgba(74,222,128,.09)}
  .pt-filter.active.medium{color:#fb923c;border-color:rgba(251,146,60,.4);background:rgba(251,146,60,.09)}
  .pt-filter.active.hard{color:#f87171;border-color:rgba(248,113,113,.4);background:rgba(248,113,113,.09)}
  .pt-filter-count{background:rgba(255,255,255,.1);border-radius:100px;font-size:.65rem;padding:.04rem .4rem}

  .pt-table-wrap{border:1px solid rgba(255,255,255,.07);border-radius:16px;overflow:hidden}
  .pt-table{width:100%;border-collapse:collapse}
  .pt-table thead tr{background:rgba(255,255,255,.035);border-bottom:1px solid rgba(255,255,255,.07)}
  .pt-table th{text-align:left;padding:.7rem 1rem;font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:rgba(255,255,255,.28)}
  .pt-row{border-bottom:1px solid rgba(255,255,255,.045);transition:background .14s}
  .pt-row:last-child{border-bottom:none}
  .pt-row:hover{background:rgba(255,255,255,.028)}
  .pt-table td{padding:.75rem 1rem;font-size:.84rem}
  .pt-num{color:rgba(255,255,255,.22);font-size:.75rem;width:38px}
  .pt-name{font-weight:500;color:rgba(255,255,255,.85)}
  .pt-topic{color:rgba(255,255,255,.35);font-size:.75rem}
  .pt-acc{color:rgba(255,255,255,.32);font-size:.75rem}
  .pt-diff{font-size:.7rem;font-weight:700;padding:.2rem .6rem;border-radius:100px;letter-spacing:.04em}
  .pt-diff.easy{color:#4ade80;background:rgba(74,222,128,.12)}
  .pt-diff.medium{color:#fb923c;background:rgba(251,146,60,.12)}
  .pt-diff.hard{color:#f87171;background:rgba(248,113,113,.12)}
  .pt-solve{color:#60a5fa;font-size:.77rem;text-decoration:none;white-space:nowrap;transition:color .14s}
  .pt-solve:hover{color:#93c5fd}

  @media(max-width:600px){
    .pg-toggle-btn{font-size:.72rem;padding:.45rem .35rem}
    .pt-table th:nth-child(4),.pt-table td:nth-child(4),
    .pt-table th:nth-child(5),.pt-table td:nth-child(5){display:none}
  }
`;

export default TreesPage;
