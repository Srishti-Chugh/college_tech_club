import React, { useState, useCallback } from 'react';

// ─── Public types ──────────────────────────────────────────────────────────────
export interface MindMapNode {
    label: string;
    url?: string;
    children?: MindMapNode[];
}

interface MindMapProps {
    nodes: MindMapNode[];
    rootLabel?: string;
}

// ─── Colour ramps [branchFill, branchText, leafFill, leafText, line] ──────────
const RAMPS: [string, string, string, string, string][] = [
    ['#4c6ef5', '#fff', 'rgba(76,110,245,0.22)', 'rgba(180,196,255,0.9)', '#4c6ef5'],
    ['#20c997', '#04342c', 'rgba(32,201,151,0.20)', 'rgba(160,235,210,0.9)', '#20c997'],
    ['#cc5de8', '#fff', 'rgba(204,93,232,0.20)', 'rgba(220,170,240,0.9)', '#cc5de8'],
    ['#ff922b', '#2e1400', 'rgba(255,146,43,0.20)', 'rgba(255,200,150,0.9)', '#ff922b'],
    ['#51cf66', '#0a2e0f', 'rgba(81,207,102,0.20)', 'rgba(160,230,170,0.9)', '#51cf66'],
    ['#ff6b6b', '#fff', 'rgba(255,107,107,0.20)', 'rgba(255,180,180,0.9)', '#ff6b6b'],
];

// ─── Layout constants ──────────────────────────────────────────────────────────
const REACH_L1 = 200;   // root-centre → L1-centre
const REACH_L2 = 175;   // L1-centre → L2-centre
const REACH_L3 = 160;   // L2-centre → L3-centre

const ROOT_W = 190; const ROOT_H = 48; const ROOT_RX = 26;
const L1_W = 130; const L1_H = 36; const L1_RX = 18;
const L2_W = 122; const L2_H = 30; const L2_RX = 15;
const L3_W = 112; const L3_H = 26; const L3_RX = 13;

// Total horizontal reach from centre to far edge of L3 pill
const HALF_W = REACH_L1 + REACH_L2 + REACH_L3 + L3_W / 2 + 24; // 24px padding
const VW = HALF_W * 2;  // symmetric left + right
const VH_BASE = 560;
const CX = VW / 2;

const L1_MIN_GAP = 22;  // minimum vertical padding around an L1 node
const L3_GAP = 32;      // vertical gap between sibling L3 leaf nodes

// ─── Bezier curve helper ───────────────────────────────────────────────────────
function curve(x1: number, y1: number, x2: number, y2: number) {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

// ─── Height calculation — fully recursive ─────────────────────────────────────
// Returns the pixel height that a node's subtree occupies when expanded.
function subtreeHeight(node: MindMapNode, depth: number, collapsedL1: Set<string>, collapsedL2: Set<string>): number {
    const key = node.label;
    if (!node.children?.length) return L3_GAP; // leaf

    if (depth === 1) {
        // L1 branch: check if collapsed
        if (collapsedL1.has(key)) return L1_MIN_GAP * 2;
        const childH = node.children.reduce((s, c) => s + subtreeHeight(c, 2, collapsedL1, collapsedL2), 0);
        return Math.max(L1_MIN_GAP * 2, childH);
    }
    if (depth === 2) {
        // L2 mid-node: check if collapsed
        if (collapsedL2.has(key)) return L3_GAP;
        const childH = node.children.length * L3_GAP;
        return Math.max(L3_GAP, childH);
    }
    return L3_GAP;
}

// ─── Pill component ────────────────────────────────────────────────────────────
interface PillProps {
    cx: number; cy: number; w: number; h: number; rx: number;
    label: string; fill: string; textFill: string;
    hasChildren: boolean; isOpen: boolean; url?: string;
    onClick: () => void;
}

const Pill: React.FC<PillProps> = ({ cx, cy, w, h, rx, label, fill, textFill, hasChildren, isOpen, url, onClick }) => {
    const [hov, setHov] = useState(false);
    const interactive = hasChildren || !!url;
    const maxChars = Math.floor(w / 7);
    const short = label.length > maxChars ? label.slice(0, maxChars - 1) + '…' : label;

    return (
        <g
            onClick={interactive ? onClick : undefined}
            onMouseEnter={() => interactive && setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
            <rect
                x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={rx}
                fill={fill}
                opacity={hov ? 0.78 : 1}
                stroke={hov ? (url ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.18)') : 'none'}
                strokeWidth={1.5}
            />
            {/* collapse dot for branch nodes */}
            {hasChildren && (
                <circle cx={cx + w / 2 - 9} cy={cy} r={3}
                    fill={isOpen ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.25)'} />
            )}
            {/* link dot for leaf nodes */}
            {!hasChildren && url && (
                <circle cx={cx + w / 2 - 8} cy={cy} r={2.5} fill="rgba(255,255,255,0.55)" />
            )}
            <text
                x={cx - (hasChildren || url ? 3 : 0)} y={cy}
                textAnchor="middle" dominantBaseline="central"
                fill={textFill} fontSize={11.5} fontWeight={500}
                fontFamily="system-ui, -apple-system, sans-serif"
                style={{ userSelect: 'none', pointerEvents: 'none' }}
            >
                {short}
            </text>
        </g>
    );
};

// ─── Main component ────────────────────────────────────────────────────────────
const MindMap: React.FC<MindMapProps> = ({ nodes, rootLabel = 'Stack' }) => {
    const [collapsedL1, setCollapsedL1] = useState<Set<string>>(new Set());
    const [collapsedL2, setCollapsedL2] = useState<Set<string>>(new Set());

    const toggleL1 = useCallback((label: string) => setCollapsedL1(prev => {
        const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n;
    }), []);

    const toggleL2 = useCallback((label: string) => setCollapsedL2(prev => {
        const n = new Set(prev); n.has(label) ? n.delete(label) : n.add(label); return n;
    }), []);

    const expandAll = () => { setCollapsedL1(new Set()); setCollapsedL2(new Set()); };
    const collapseAll = () => {
        setCollapsedL1(new Set(nodes.map(n => n.label)));
        setCollapsedL2(new Set(nodes.flatMap(n => n.children?.map(c => c.label) ?? [])));
    };

    // ── Layout: split L1 branches left / right ──────────────────────────────────
    const half = Math.ceil(nodes.length / 2);
    const rBranches = nodes.slice(0, half);
    const lBranches = nodes.slice(half);

    const sideSpan = (branches: MindMapNode[]) =>
        branches.reduce((s, b) => s + subtreeHeight(b, 1, collapsedL1, collapsedL2), 0);

    const rSpan = sideSpan(rBranches);
    const lSpan = sideSpan(lBranches);
    const VH = Math.max(VH_BASE, Math.max(rSpan, lSpan) + 120);
    const CY = VH / 2;

    // ── Render one side ──────────────────────────────────────────────────────────
    type El = React.ReactElement;

    const renderSide = (branches: MindMapNode[], side: 'L' | 'R', startColorIdx: number) => {
        const lines: El[] = [];
        const pills: El[] = [];

        const totalH = sideSpan(branches);
        let curY = CY - totalH / 2;

        branches.forEach((l1node, bi) => {
            const colorIdx = (startColorIdx + bi) % RAMPS.length;
            const [bFill, bText, lFill, lText, lineClr] = RAMPS[colorIdx];
            const l1H = subtreeHeight(l1node, 1, collapsedL1, collapsedL2);
            const l1cy = curY + l1H / 2;
            curY += l1H;

            const l1cx = side === 'R' ? CX + REACH_L1 : CX - REACH_L1;
            const rootEdgeX = side === 'R' ? CX + ROOT_W / 2 : CX - ROOT_W / 2;
            const l1EdgeX = side === 'R' ? l1cx - L1_W / 2 : l1cx + L1_W / 2;

            // root → L1 line
            lines.push(<path key={`r-l1-${bi}`} d={curve(rootEdgeX, CY, l1EdgeX, l1cy)}
                fill="none" stroke={lineClr} strokeWidth={2} opacity={0.65} />);

            const l1Open = !collapsedL1.has(l1node.label);
            pills.push(
                <Pill key={`l1-${bi}`} cx={l1cx} cy={l1cy} w={L1_W} h={L1_H} rx={L1_RX}
                    label={l1node.label} fill={bFill} textFill={bText}
                    hasChildren={!!l1node.children?.length} isOpen={l1Open} url={l1node.url}
                    onClick={() => l1node.children?.length ? toggleL1(l1node.label) : l1node.url && window.open(l1node.url, '_blank', 'noopener')}
                />
            );

            if (!l1Open || !l1node.children?.length) return;

            // ── L2 nodes ────────────────────────────────────────────────────────
            const l2TotalH = l1node.children.reduce((s, c) => s + subtreeHeight(c, 2, collapsedL1, collapsedL2), 0);
            let l2CurY = l1cy - l2TotalH / 2;

            l1node.children.forEach((l2node, l2i) => {
                const l2H = subtreeHeight(l2node, 2, collapsedL1, collapsedL2);
                const l2cy = l2CurY + l2H / 2;
                l2CurY += l2H;

                const l2cx = side === 'R' ? l1cx + REACH_L2 : l1cx - REACH_L2;
                const l1OutX = side === 'R' ? l1cx + L1_W / 2 : l1cx - L1_W / 2;
                const l2InX = side === 'R' ? l2cx - L2_W / 2 : l2cx + L2_W / 2;

                // L1 → L2 line
                lines.push(<path key={`l1-l2-${bi}-${l2i}`} d={curve(l1OutX, l1cy, l2InX, l2cy)}
                    fill="none" stroke={lineClr} strokeWidth={1.4} opacity={0.45} />);

                const l2HasChildren = !!l2node.children?.length;
                const l2Open = !collapsedL2.has(l2node.label);

                pills.push(
                    <Pill key={`l2-${bi}-${l2i}`} cx={l2cx} cy={l2cy} w={L2_W} h={L2_H} rx={L2_RX}
                        label={l2node.label} fill={lFill} textFill={lText}
                        hasChildren={l2HasChildren} isOpen={l2Open} url={l2node.url}
                        onClick={() => l2HasChildren ? toggleL2(l2node.label) : l2node.url && window.open(l2node.url, '_blank', 'noopener')}
                    />
                );

                if (!l2Open || !l2node.children?.length) return;

                // ── L3 leaf nodes ──────────────────────────────────────────────
                const l3Count = l2node.children.length;
                const l3TotalH = l3Count * L3_GAP;
                const l3StartY = l2cy - l3TotalH / 2 + L3_GAP / 2;

                l2node.children.forEach((l3node, l3i) => {
                    const l3cy = l3StartY + l3i * L3_GAP;
                    const l3cx = side === 'R' ? l2cx + REACH_L3 : l2cx - REACH_L3;
                    const l2OutX = side === 'R' ? l2cx + L2_W / 2 : l2cx - L2_W / 2;
                    const l3InX = side === 'R' ? l3cx - L3_W / 2 : l3cx + L3_W / 2;

                    // L2 → L3 line
                    lines.push(<path key={`l2-l3-${bi}-${l2i}-${l3i}`} d={curve(l2OutX, l2cy, l3InX, l3cy)}
                        fill="none" stroke={lineClr} strokeWidth={1} opacity={0.35} />);

                    // L3 leaf — always has a url, always clickable
                    pills.push(
                        <Pill key={`l3-${bi}-${l2i}-${l3i}`} cx={l3cx} cy={l3cy} w={L3_W} h={L3_H} rx={L3_RX}
                            label={l3node.label} fill={lFill} textFill={lText}
                            hasChildren={false} isOpen={false} url={l3node.url}
                            onClick={() => l3node.url && window.open(l3node.url, '_blank', 'noopener')}
                        />
                    );
                });
            });
        });

        return { lines, pills };
    };

    const right = renderSide(rBranches, 'R', 0);
    const left = renderSide(lBranches, 'L', half);

    const rootShort = rootLabel.length > 15 ? rootLabel.slice(0, 14) + '…' : rootLabel;

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'flex-end' }}>
                <button className="dev-mm-ctrl-btn" onClick={expandAll}>Expand all</button>
                <button className="dev-mm-ctrl-btn" onClick={collapseAll}>Collapse all</button>
            </div>
            <p style={{ fontFamily: "'Fira Code', monospace", fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.6rem' }}>
                Click a branch/mid-node to expand · Click a <span style={{ color: 'rgba(255,255,255,0.55)' }}>●leaf</span> to open the resource
            </p>
            <div style={{ overflowX: 'auto', borderRadius: 14, width: '100%' }}>
                <svg viewBox={`0 0 ${VW} ${VH}`} width={VW} height={VH}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'block', minWidth: VW, borderRadius: 12 }}
                >
                    <defs>
                        <pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                            <circle cx="14" cy="14" r="0.9" fill="rgba(255,255,255,0.06)" />
                        </pattern>
                    </defs>
                    <rect width={VW} height={VH} fill="url(#dotgrid)" rx={12} />

                    {right.lines}{left.lines}

                    {/* Root node */}
                    <g>
                        <rect x={CX - ROOT_W / 2} y={CY - ROOT_H / 2} width={ROOT_W} height={ROOT_H} rx={ROOT_RX}
                            fill="rgba(255,255,255,0.10)" stroke="rgba(250,204,21,0.5)" strokeWidth={1.5} />
                        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central"
                            fill="#facc15" fontSize={rootLabel.length > 10 ? 12 : 14} fontWeight={600}
                            fontFamily="'Outfit', system-ui, sans-serif" style={{ userSelect: 'none' }}>
                            {rootShort}
                        </text>
                    </g>

                    {right.pills}{left.pills}
                </svg>
            </div>
        </div>
    );
};

export default MindMap;