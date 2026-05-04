import React, { useState, useCallback, useMemo } from 'react';

// ─── Public types ──────────────────────────────────────────────────────────────
export interface MindMapNode {
    label: string;
    url?: string;
    children?: MindMapNode[];
}

interface MindMapProps {
    nodes: MindMapNode[];   // top-level branch nodes
    rootLabel?: string;
}

// ─── Colour ramps — tuned for dark modal background ───────────────────────────
// Each ramp: [branchFill, branchText, leafFill, leafText, line]
const RAMPS: [string, string, string, string, string][] = [
    ['#4c6ef5', '#fff', 'rgba(76,110,245,0.22)', 'rgba(180,196,255,0.9)', '#4c6ef5'],  // indigo
    ['#20c997', '#04342c', 'rgba(32,201,151,0.20)', 'rgba(160,235,210,0.9)', '#20c997'],  // teal
    ['#cc5de8', '#fff', 'rgba(204,93,232,0.20)', 'rgba(220,170,240,0.9)', '#cc5de8'],  // purple
    ['#ff922b', '#2e1400', 'rgba(255,146,43,0.20)', 'rgba(255,200,150,0.9)', '#ff922b'],  // orange
    ['#51cf66', '#0a2e0f', 'rgba(81,207,102,0.20)', 'rgba(160,230,170,0.9)', '#51cf66'],  // green
    ['#ff6b6b', '#fff', 'rgba(255,107,107,0.20)', 'rgba(255,180,180,0.9)', '#ff6b6b'],  // red
];

// ─── Layout constants (px in viewBox space) ────────────────────────────────────
const VW = 900;   // viewBox width
const VH_BASE = 560;   // base viewBox height (will grow)
const CX = VW / 2;

const ROOT_RX = 26;    // root pill border-radius
const ROOT_W = 190;
const ROOT_H = 48;

const L1_W = 138;   // branch node pill width
const L1_H = 38;
const L1_RX = 19;

const L2_W = 118;   // leaf node pill width
const L2_H = 30;
const L2_RX = 15;

// Horizontal reach from centre → L1 centre (right side)
const REACH_L1 = 215;
// Horizontal reach from L1 centre → L2 centre
const REACH_L2 = 180;

// Min vertical gap between L1 branch centres
const L1_MIN_GAP = 100;
// Vertical gap between consecutive leaf centres within a branch
const L2_GAP = 38;

// ─── Organic cubic bezier between two points ────────────────────────────────────
function curve(x1: number, y1: number, x2: number, y2: number): string {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

// ─── Measure how much vertical space a branch occupies ────────────────────────
function branchSpan(b: MindMapNode, isOpen: boolean): number {
    const leafCount = isOpen && b.children ? b.children.length : 0;
    if (leafCount <= 1) return L1_MIN_GAP;
    return Math.max(L1_MIN_GAP, leafCount * L2_GAP);
}

// ─── Pill component ────────────────────────────────────────────────────────────
interface PillProps {
    cx: number; cy: number; w: number; h: number; rx: number;
    label: string; fill: string; textFill: string;
    hasChildren: boolean; isOpen: boolean;
    url?: string;
    onClick: () => void;
}

const Pill: React.FC<PillProps> = ({
    cx, cy, w, h, rx, label, fill, textFill,
    hasChildren, isOpen, url, onClick,
}) => {
    const [hov, setHov] = useState(false);
    const interactive = hasChildren || !!url;
    // Truncate label to fit pill
    const short = label.length > 17 ? label.slice(0, 16) + '…' : label;

    return (
        <g
            onClick={interactive ? onClick : undefined}
            onMouseEnter={() => interactive && setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
            <rect
                x={cx - w / 2} y={cy - h / 2}
                width={w} height={h} rx={rx}
                fill={fill}
                opacity={hov ? 0.82 : 1}
                stroke={hov ? 'rgba(0,0,0,0.18)' : 'none'}
                strokeWidth={1.5}
            />
            {/* Small collapse indicator */}
            {hasChildren && (
                <circle
                    cx={cx + w / 2 - 10} cy={cy}
                    r={3.5}
                    fill={isOpen ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)'}
                />
            )}
            {/* External link dot for leaf URLs */}
            {!hasChildren && url && (
                <circle cx={cx + w / 2 - 9} cy={cy} r={2.5} fill="rgba(255,255,255,0.45)" />
            )}
            <text
                x={cx - (hasChildren || url ? 4 : 0)} y={cy}
                textAnchor="middle" dominantBaseline="central"
                fill={textFill} fontSize={12.5} fontWeight={500}
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
    // Which branch indices are collapsed
    const [collapsed, setCollapsed] = useState<Set<number>>(new Set());

    const toggle = useCallback((idx: number) => {
        setCollapsed(prev => {
            const next = new Set(prev);
            next.has(idx) ? next.delete(idx) : next.add(idx);
            return next;
        });
    }, []);

    const expandAll = () => setCollapsed(new Set());
    const collapseAll = () => setCollapsed(new Set(nodes.map((_, i) => i)));

    // ── Layout: split branches left / right ─────────────────────────────────────
    const half = Math.ceil(nodes.length / 2);
    const rBranches = nodes.slice(0, half);
    const lBranches = nodes.slice(half);

    // Compute total height for a list of branches
    const totalSpan = (branches: MindMapNode[], startIdx: number) =>
        branches.reduce((s, b, i) => s + branchSpan(b, !collapsed.has(startIdx + i)), 0);

    const rSpan = totalSpan(rBranches, 0);
    const lSpan = totalSpan(lBranches, half);
    const sideH = Math.max(rSpan, lSpan, 300);
    const VH = Math.max(VH_BASE, sideH + 160);
    const CY = VH / 2;

    // ── Render one side ──────────────────────────────────────────────────────────
    type El = React.ReactElement;
    type Rendered = { lines: El[]; pills: El[] };

    const renderSide = (
        branches: MindMapNode[],
        side: 'L' | 'R',
        startIdx: number,
    ): Rendered => {
        const lines: El[] = [];
        const pills: El[] = [];
        const totalH = totalSpan(branches, startIdx);
        let curY = CY - totalH / 2;

        branches.forEach((b, bi) => {
            const idx = startIdx + bi;
            const isOpen = !collapsed.has(idx);
            const span = branchSpan(b, isOpen);
            const bcy = curY + span / 2;
            curY += span;

            const [bFill, bText, lFill, lText, lineClr] = RAMPS[idx % RAMPS.length];

            // L1 position
            const l1cx = side === 'R' ? CX + REACH_L1 : CX - REACH_L1;

            // Root edge → L1 edge
            const rootEdgeX = side === 'R' ? CX + ROOT_W / 2 : CX - ROOT_W / 2;
            const l1EdgeX = side === 'R' ? l1cx - L1_W / 2 : l1cx + L1_W / 2;

            lines.push(
                <path key={`rl1-${idx}`}
                    d={curve(rootEdgeX, CY, l1EdgeX, bcy)}
                    fill="none" stroke={lineClr} strokeWidth={2} opacity={0.7} />
            );

            pills.push(
                <Pill key={`l1-${idx}`}
                    cx={l1cx} cy={bcy} w={L1_W} h={L1_H} rx={L1_RX}
                    label={b.label} fill={bFill} textFill={bText}
                    hasChildren={!!b.children?.length} isOpen={isOpen}
                    url={b.url}
                    onClick={() => b.children?.length ? toggle(idx) : b.url && window.open(b.url, '_blank', 'noopener')}
                />
            );

            // Leaves
            if (isOpen && b.children?.length) {
                const leafCount = b.children.length;
                const leafTotalH = leafCount * L2_GAP;
                const leafStartY = bcy - leafTotalH / 2 + L2_GAP / 2;

                b.children.forEach((leaf, li) => {
                    const lcy = leafStartY + li * L2_GAP;
                    const l2cx = side === 'R' ? l1cx + REACH_L2 : l1cx - REACH_L2;
                    const l1OutX = side === 'R' ? l1cx + L1_W / 2 : l1cx - L1_W / 2;
                    const l2InX = side === 'R' ? l2cx - L2_W / 2 : l2cx + L2_W / 2;

                    lines.push(
                        <path key={`l2line-${idx}-${li}`}
                            d={curve(l1OutX, bcy, l2InX, lcy)}
                            fill="none" stroke={lineClr} strokeWidth={1.4} opacity={0.5} />
                    );

                    pills.push(
                        <Pill key={`l2-${idx}-${li}`}
                            cx={l2cx} cy={lcy} w={L2_W} h={L2_H} rx={L2_RX}
                            label={leaf.label} fill={lFill} textFill={lText}
                            hasChildren={false} isOpen={false}
                            url={leaf.url}
                            onClick={() => leaf.url && window.open(leaf.url, '_blank', 'noopener')}
                        />
                    );
                });
            }
        });

        return { lines, pills };
    };

    const right = renderSide(rBranches, 'R', 0);
    const left = renderSide(lBranches, 'L', half);

    // ── Root label shortened ────────────────────────────────────────────────────
    const rootShort = rootLabel.length > 15 ? rootLabel.slice(0, 14) + '…' : rootLabel;

    // ── Root circle label font size based on length ─────────────────────────────
    const rootFontSize = rootLabel.length > 10 ? 13 : 14.5;

    return (
        <div style={{ width: '100%' }}>
            {/* Controls */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, justifyContent: 'flex-end' }}>
                <button className="dev-mm-ctrl-btn" onClick={expandAll}>Expand all</button>
                <button className="dev-mm-ctrl-btn" onClick={collapseAll}>Collapse all</button>
            </div>

            {/* Hint */}
            <p style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: '0.6rem',
            }}>
                Click a branch to collapse · Click a leaf to open the resource
            </p>

            {/* Scrollable SVG */}
            <div style={{ overflowX: 'auto', borderRadius: 14 }}>
                <svg
                    viewBox={`0 0 ${VW} ${VH}`}
                    width={VW} height={VH}
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ display: 'block', minWidth: VW, borderRadius: 12 }}
                >
                    {/* Soft dot grid — matches reference */}
                    <defs>
                        <pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
                            <circle cx="14" cy="14" r="0.9" fill="rgba(255,255,255,0.06)" />
                        </pattern>
                    </defs>
                    <rect width={VW} height={VH} fill="url(#dotgrid)" rx={12} />

                    {/* Lines first */}
                    {right.lines}
                    {left.lines}

                    {/* Root node */}
                    <g>
                        <rect
                            x={CX - ROOT_W / 2} y={CY - ROOT_H / 2}
                            width={ROOT_W} height={ROOT_H} rx={ROOT_RX}
                            fill="rgba(255,255,255,0.10)"
                            stroke="rgba(250,204,21,0.5)"
                            strokeWidth={1.5}
                        />
                        <text
                            x={CX} y={CY}
                            textAnchor="middle" dominantBaseline="central"
                            fill="#facc15" fontSize={rootFontSize} fontWeight={600}
                            fontFamily="'Outfit', system-ui, sans-serif"
                            style={{ userSelect: 'none' }}
                        >
                            {rootShort}
                        </text>
                    </g>

                    {/* Pills on top */}
                    {right.pills}
                    {left.pills}
                </svg>
            </div>
        </div>
    );
};

export default MindMap;