/// <reference types="vite/client" />
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './shared.css';

// ─── Types ─────────────────────────────────────────────────────────────────
interface ArrayCell {
    id: number;
    value: number | null;
    state: 'idle' | 'inserted' | 'deleted' | 'searched' | 'highlighted';
}

interface Problem {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topic: string;
    url: string;
    acceptance: string;
}

// ─── Problems Data ──────────────────────────────────────────────────────────
const PROBLEMS: Problem[] = [
    // Easy
    { title: 'Two Sum', difficulty: 'Easy', topic: 'Hash Map', url: 'https://leetcode.com/problems/two-sum/', acceptance: '52.3%' },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', topic: 'Sliding Window', url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', acceptance: '54.1%' },
    { title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Hash Set', url: 'https://leetcode.com/problems/contains-duplicate/', acceptance: '61.4%' },
    { title: 'Maximum Subarray', difficulty: 'Easy', topic: "Kadane's", url: 'https://leetcode.com/problems/maximum-subarray/', acceptance: '50.7%' },
    { title: 'Move Zeroes', difficulty: 'Easy', topic: 'Two Pointers', url: 'https://leetcode.com/problems/move-zeroes/', acceptance: '61.9%' },
    { title: 'Plus One', difficulty: 'Easy', topic: 'Math', url: 'https://leetcode.com/problems/plus-one/', acceptance: '44.2%' },
    { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', topic: 'Two Pointers', url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/', acceptance: '53.8%' },
    { title: 'Merge Sorted Array', difficulty: 'Easy', topic: 'Two Pointers', url: 'https://leetcode.com/problems/merge-sorted-array/', acceptance: '47.9%' },
    { title: 'Single Number', difficulty: 'Easy', topic: 'Bit Manipulation', url: 'https://leetcode.com/problems/single-number/', acceptance: '72.5%' },
    { title: 'Pascal\'s Triangle', difficulty: 'Easy', topic: 'DP', url: 'https://leetcode.com/problems/pascals-triangle/', acceptance: '71.3%' },
    { title: 'Intersection of Two Arrays II', difficulty: 'Easy', topic: 'Hash Map', url: 'https://leetcode.com/problems/intersection-of-two-arrays-ii/', acceptance: '56.2%' },
    { title: 'Majority Element', difficulty: 'Easy', topic: "Boyer-Moore", url: 'https://leetcode.com/problems/majority-element/', acceptance: '64.7%' },
    // Medium
    { title: 'Product of Array Except Self', difficulty: 'Medium', topic: 'Prefix Sum', url: 'https://leetcode.com/problems/product-of-array-except-self/', acceptance: '65.2%' },
    { title: '3Sum', difficulty: 'Medium', topic: 'Two Pointers', url: 'https://leetcode.com/problems/3sum/', acceptance: '34.1%' },
    { title: 'Container With Most Water', difficulty: 'Medium', topic: 'Two Pointers', url: 'https://leetcode.com/problems/container-with-most-water/', acceptance: '54.8%' },
    { title: 'Subarray Sum Equals K', difficulty: 'Medium', topic: 'Prefix Sum', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', acceptance: '44.5%' },
    { title: 'Rotate Array', difficulty: 'Medium', topic: 'Math', url: 'https://leetcode.com/problems/rotate-array/', acceptance: '40.2%' },
    { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', acceptance: '49.7%' },
    { title: 'Spiral Matrix', difficulty: 'Medium', topic: 'Simulation', url: 'https://leetcode.com/problems/spiral-matrix/', acceptance: '47.8%' },
    { title: 'Jump Game', difficulty: 'Medium', topic: 'Greedy', url: 'https://leetcode.com/problems/jump-game/', acceptance: '38.6%' },
    { title: 'Merge Intervals', difficulty: 'Medium', topic: 'Sorting', url: 'https://leetcode.com/problems/merge-intervals/', acceptance: '46.3%' },
    { title: 'Set Matrix Zeroes', difficulty: 'Medium', topic: 'Matrix', url: 'https://leetcode.com/problems/set-matrix-zeroes/', acceptance: '52.1%' },
    { title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Hash Set', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', acceptance: '47.2%' },
    { title: 'Sort Colors', difficulty: 'Medium', topic: 'Dutch National Flag', url: 'https://leetcode.com/problems/sort-colors/', acceptance: '61.4%' },
    { title: 'Maximum Product Subarray', difficulty: 'Medium', topic: 'DP', url: 'https://leetcode.com/problems/maximum-product-subarray/', acceptance: '34.8%' },
    { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', acceptance: '39.5%' },
    // Hard
    { title: 'Trapping Rain Water', difficulty: 'Hard', topic: 'Two Pointers', url: 'https://leetcode.com/problems/trapping-rain-water/', acceptance: '60.9%' },
    { title: 'First Missing Positive', difficulty: 'Hard', topic: 'Index Hashing', url: 'https://leetcode.com/problems/first-missing-positive/', acceptance: '38.2%' },
    { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', topic: 'Binary Search', url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/', acceptance: '37.4%' },
    { title: 'Sliding Window Maximum', difficulty: 'Hard', topic: 'Monotonic Deque', url: 'https://leetcode.com/problems/sliding-window-maximum/', acceptance: '46.5%' },
    { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', topic: 'Monotonic Stack', url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/', acceptance: '44.1%' },
    { title: 'Jump Game II', difficulty: 'Hard', topic: 'Greedy', url: 'https://leetcode.com/problems/jump-game-ii/', acceptance: '40.3%' },
    { title: 'Maximum Gap', difficulty: 'Hard', topic: 'Bucket Sort', url: 'https://leetcode.com/problems/maximum-gap/', acceptance: '42.8%' },
    { title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', topic: 'Merge Sort', url: 'https://leetcode.com/problems/count-of-smaller-numbers-after-self/', acceptance: '42.0%' },
];

const ARRAY_SIZE = 10;
const initCells = (): ArrayCell[] =>
    Array.from({ length: ARRAY_SIZE }, (_, i) => ({
        id: i,
        value: i < 5 ? [12, 7, 3, 25, 9][i] : null,
        state: 'idle',
    }));

// ─── Log entry ─────────────────────────────────────────────────────────────
interface LogEntry { msg: string; type: 'success' | 'error' | 'info' }

// ─── Main Component ─────────────────────────────────────────────────────────
const ArraysPage: React.FC = () => {
    const navigate = useNavigate();
    const [cells, setCells] = useState<ArrayCell[]>(initCells());
    const [inputVal, setInputVal] = useState('');
    const [inputIdx, setInputIdx] = useState('');
    const [searchVal, setSearchVal] = useState('');
    const [log, setLog] = useState<LogEntry[]>([{ msg: 'Array initialised with [12, 7, 3, 25, 9, _, _, _, _, _]', type: 'info' }]);
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const logRef = useRef<HTMLDivElement>(null);

    // auto-scroll log
    useEffect(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
    }, [log]);

    const addLog = (msg: string, type: LogEntry['type'] = 'info') =>
        setLog(prev => [...prev.slice(-19), { msg, type }]);

    const resetStates = (c: ArrayCell[]) =>
        c.map(cell => ({ ...cell, state: 'idle' as const }));

    const flash = (updater: (c: ArrayCell[]) => ArrayCell[], delay = 900) => {
        setCells(prev => updater(resetStates([...prev])));
        setTimeout(() => setCells(prev => resetStates([...prev])), delay);
    };

    // ── Operations ──────────────────────────────────────────────────────────
    const handleInsertEnd = () => {
        const v = Number(inputVal);
        if (inputVal === '' || isNaN(v)) return addLog('Enter a valid number.', 'error');
        const emptyIdx = cells.findIndex(c => c.value === null);
        if (emptyIdx === -1) return addLog('Array is full! (size 10)', 'error');
        flash(c => c.map((cell, i) => i === emptyIdx ? { ...cell, value: v, state: 'inserted' } : cell));
        addLog(`Inserted ${v} at index ${emptyIdx}. O(1) amortized.`, 'success');
        setInputVal('');
    };

    const handleInsertAt = () => {
        const v = Number(inputVal), idx = Number(inputIdx);
        if (inputVal === '' || isNaN(v)) return addLog('Enter a valid value.', 'error');
        if (inputIdx === '' || isNaN(idx) || idx < 0 || idx >= ARRAY_SIZE) return addLog(`Index must be 0–${ARRAY_SIZE - 1}.`, 'error');
        const emptyIdx = cells.findIndex(c => c.value === null);
        if (emptyIdx === -1) return addLog('Array is full!', 'error');
        if (idx > emptyIdx) return addLog(`Index ${idx} is beyond current last element (${emptyIdx - 1}).`, 'error');
        flash(c => {
            const nc = [...c];
            for (let i = emptyIdx; i > idx; i--) nc[i] = { ...nc[i], value: nc[i - 1].value, state: 'highlighted' };
            nc[idx] = { ...nc[idx], value: v, state: 'inserted' };
            return nc;
        });
        addLog(`Inserted ${v} at index ${idx}. Shifted elements right. O(n).`, 'success');
        setInputVal(''); setInputIdx('');
    };

    const handleDeleteEnd = () => {
        const lastFilled = [...cells].reverse().findIndex(c => c.value !== null);
        if (lastFilled === -1) return addLog('Array is empty!', 'error');
        const realIdx = ARRAY_SIZE - 1 - lastFilled;
        const val = cells[realIdx].value;
        flash(c => c.map((cell, i) => i === realIdx ? { ...cell, value: null, state: 'deleted' } : cell));
        addLog(`Deleted ${val} from index ${realIdx}. O(1).`, 'success');
    };

    const handleDeleteAt = () => {
        const idx = Number(inputIdx);
        if (inputIdx === '' || isNaN(idx) || idx < 0 || idx >= ARRAY_SIZE) return addLog(`Index must be 0–${ARRAY_SIZE - 1}.`, 'error');
        if (cells[idx].value === null) return addLog(`Index ${idx} is already empty.`, 'error');
        const val = cells[idx].value;
        flash(c => {
            const nc = [...c];
            const lastFilled = nc.reduce((acc, cell, i) => cell.value !== null ? i : acc, -1);
            nc[idx] = { ...nc[idx], state: 'deleted' };
            for (let i = idx; i < lastFilled; i++) nc[i] = { ...nc[i], value: nc[i + 1].value, state: 'highlighted' };
            nc[lastFilled] = { ...nc[lastFilled], value: null };
            return nc;
        });
        addLog(`Deleted ${val} at index ${idx}. Shifted elements left. O(n).`, 'success');
        setInputIdx('');
    };

    const handleSearch = () => {
        const v = Number(searchVal);
        if (searchVal === '' || isNaN(v)) return addLog('Enter a value to search.', 'error');
        const idx = cells.findIndex(c => c.value === v);
        if (idx === -1) {
            addLog(`${v} not found. Linear search O(n) — checked all elements.`, 'error');
        } else {
            flash(c => c.map((cell, i) => ({ ...cell, state: i === idx ? 'searched' : i < idx ? 'highlighted' : 'idle' })));
            addLog(`Found ${v} at index ${idx} after ${idx + 1} comparison(s). O(n).`, 'success');
        }
        setSearchVal('');
    };

    const handleReset = () => {
        setCells(initCells());
        setLog([{ msg: 'Array reset to [12, 7, 3, 25, 9, _, _, _, _, _]', type: 'info' }]);
    };

    const cellColor = (state: ArrayCell['state']) => {
        switch (state) {
            case 'inserted': return { bg: '#22c55e', border: '#16a34a', text: '#000' };
            case 'deleted': return { bg: '#ef4444', border: '#b91c1c', text: '#fff' };
            case 'searched': return { bg: '#f59e0b', border: '#d97706', text: '#000' };
            case 'highlighted': return { bg: '#3b82f6', border: '#1d4ed8', text: '#fff' };
            default: return { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.15)', text: 'rgba(255,255,255,0.9)' };
        }
    };

    const filtered = PROBLEMS.filter(p => filter === 'All' || p.difficulty === filter);
    const counts = { Easy: PROBLEMS.filter(p => p.difficulty === 'Easy').length, Medium: PROBLEMS.filter(p => p.difficulty === 'Medium').length, Hard: PROBLEMS.filter(p => p.difficulty === 'Hard').length };

    return (
        <div className="ap-root">
            {/* ── BG ─────────────────────────────────────────────────────── */}
            <div className="ap-bg" aria-hidden>
                <div className="ap-orb ap-orb1" /><div className="ap-orb ap-orb2" />
                <div className="ap-grid" />
            </div>

            {/* ── Back ───────────────────────────────────────────────────── */}
            <button className="ap-back" onClick={() => navigate('/resources/cp-roadmap')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                DSA Roadmap
            </button>

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <header className="ap-header">
                <div className="ap-badge">Data Structures · Arrays</div>
                <h1 className="ap-title">Arrays</h1>
                <p className="ap-subtitle">
                    Contiguous memory blocks. O(1) access · O(n) insert/delete · Foundation of all data structures.
                </p>
                <div className="ap-stats">
                    {[['O(1)', 'Access by index'], ['O(n)', 'Insert / Delete'], ['O(n)', 'Search'], ['O(1)*', 'Append (amortized)']].map(([c, l]) => (
                        <div className="ap-stat" key={l}><span className="ap-stat-code">{c}</span><span className="ap-stat-label">{l}</span></div>
                    ))}
                </div>
            </header>

            {/* ══════════════════════════════════════════════════════════════
          PLAYGROUND
      ══════════════════════════════════════════════════════════════ */}
            <section className="pg-wrap">
                <div className="pg-header">
                    <h2 className="pg-title">Interactive Playground</h2>
                    <button className="pg-reset" onClick={handleReset}>Reset</button>
                </div>

                {/* Array Visualiser */}
                <div className="pg-array-wrap">
                    <div className="pg-array">
                        {cells.map((cell, i) => {
                            const c = cellColor(cell.state);
                            return (
                                <div className="pg-cell-col" key={cell.id}>
                                    <div
                                        className="pg-cell"
                                        style={{ background: c.bg, borderColor: c.border, color: c.text }}
                                    >
                                        {cell.value !== null ? cell.value : <span className="pg-empty">_</span>}
                                    </div>
                                    <span className="pg-index">{i}</span>
                                </div>
                            );
                        })}
                    </div>
                    {/* Legend */}
                    <div className="pg-legend">
                        {[['#22c55e', 'Inserted'], ['#ef4444', 'Deleted'], ['#f59e0b', 'Found'], ['#3b82f6', 'Shifted']].map(([c, l]) => (
                            <span className="pg-leg-item" key={l}>
                                <span className="pg-leg-dot" style={{ background: c }} />{l}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Operations */}
                <div className="pg-ops">

                    {/* Insert */}
                    <div className={`pg-op-card ${activeOp === 'insert' ? 'active' : ''}`} onClick={() => setActiveOp(activeOp === 'insert' ? null : 'insert')}>
                        <div className="pg-op-head">
                            <span className="pg-op-icon">＋</span>
                            <span className="pg-op-name">Insert</span>
                            <span className="pg-op-badge">O(1) / O(n)</span>
                            <svg className={`pg-chevron ${activeOp === 'insert' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'insert' && (
                            <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleInsertEnd()} />
                                    <button className="pg-btn green" onClick={handleInsertEnd}>Append</button>
                                </div>
                                <div className="pg-row">
                                    <input className="pg-inp" placeholder="Value" value={inputVal} onChange={e => setInputVal(e.target.value)} />
                                    <input className="pg-inp sm" placeholder="Index" value={inputIdx} onChange={e => setInputIdx(e.target.value)} />
                                    <button className="pg-btn blue" onClick={handleInsertAt}>At Index</button>
                                </div>
                                <p className="pg-hint">Append: O(1) amortized · Insert at index: O(n) due to shifting</p>
                            </div>
                        )}
                    </div>

                    {/* Delete */}
                    <div className={`pg-op-card ${activeOp === 'delete' ? 'active' : ''}`} onClick={() => setActiveOp(activeOp === 'delete' ? null : 'delete')}>
                        <div className="pg-op-head">
                            <span className="pg-op-icon">－</span>
                            <span className="pg-op-name">Delete</span>
                            <span className="pg-op-badge">O(1) / O(n)</span>
                            <svg className={`pg-chevron ${activeOp === 'delete' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'delete' && (
                            <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <button className="pg-btn red" style={{ flex: 1 }} onClick={handleDeleteEnd}>Delete Last Element</button>
                                </div>
                                <div className="pg-row">
                                    <input className="pg-inp sm" placeholder="Index" value={inputIdx} onChange={e => setInputIdx(e.target.value)} />
                                    <button className="pg-btn red" onClick={handleDeleteAt}>Delete at Index</button>
                                </div>
                                <p className="pg-hint">Delete last: O(1) · Delete at index: O(n) due to shifting</p>
                            </div>
                        )}
                    </div>

                    {/* Search */}
                    <div className={`pg-op-card ${activeOp === 'search' ? 'active' : ''}`} onClick={() => setActiveOp(activeOp === 'search' ? null : 'search')}>
                        <div className="pg-op-head">
                            <span className="pg-op-icon">🔍</span>
                            <span className="pg-op-name">Search</span>
                            <span className="pg-op-badge">O(n)</span>
                            <svg className={`pg-chevron ${activeOp === 'search' ? 'open' : ''}`} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                        </div>
                        {activeOp === 'search' && (
                            <div className="pg-op-body" onClick={e => e.stopPropagation()}>
                                <div className="pg-row">
                                    <input className="pg-inp" placeholder="Value to find" value={searchVal} onChange={e => setSearchVal(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                                    <button className="pg-btn amber" onClick={handleSearch}>Linear Search</button>
                                </div>
                                <p className="pg-hint">Scans left to right until element is found. O(n) worst case.</p>
                            </div>
                        )}
                    </div>

                </div>

                {/* Log */}
                <div className="pg-log" ref={logRef}>
                    <span className="pg-log-label">Operation Log</span>
                    {log.map((entry, i) => (
                        <div key={i} className={`pg-log-entry ${entry.type}`}>
                            <span className="pg-log-arrow">›</span> {entry.msg}
                        </div>
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════
          PROBLEMS TABLE
      ══════════════════════════════════════════════════════════════ */}
            <section className="pt-wrap">
                <div className="pt-header">
                    <div>
                        <h2 className="pt-title">Practice Problems</h2>
                        <p className="pt-sub">{PROBLEMS.length} curated Array problems on LeetCode</p>
                    </div>
                    <div className="pt-counts">
                        <span className="pt-count easy">{counts.Easy} Easy</span>
                        <span className="pt-count medium">{counts.Medium} Medium</span>
                        <span className="pt-count hard">{counts.Hard} Hard</span>
                    </div>
                </div>

                {/* Filter tabs */}
                <div className="pt-filters">
                    {(['All', 'Easy', 'Medium', 'Hard'] as const).map(f => (
                        <button key={f} className={`pt-filter ${filter === f ? 'active ' + f.toLowerCase() : ''}`} onClick={() => setFilter(f)}>
                            {f} {f !== 'All' && <span className="pt-filter-count">{counts[f as keyof typeof counts]}</span>}
                        </button>
                    ))}
                </div>

                {/* Table */}
                <div className="pt-table-wrap">
                    <table className="pt-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Problem</th>
                                <th>Difficulty</th>
                                <th>Pattern / Topic</th>
                                <th>Acceptance</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((p, i) => (
                                <tr key={p.title} className="pt-row">
                                    <td className="pt-num">{i + 1}</td>
                                    <td className="pt-name">{p.title}</td>
                                    <td>
                                        <span className={`pt-diff ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span>
                                    </td>
                                    <td className="pt-topic">{p.topic}</td>
                                    <td className="pt-acc">{p.acceptance}</td>
                                    <td>
                                        <a href={p.url} target="_blank" rel="noopener noreferrer" className="pt-solve">
                                            Solve →
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
};

export default ArraysPage;
