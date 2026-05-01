/// <reference types="vite/client" />
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './shared.css';

type HTType = 'chaining' | 'open' | 'set' | 'map';
type NS = 'idle' | 'inserted' | 'deleted' | 'highlighted' | 'searched' | 'collision';
interface Log { msg: string; type: 'success' | 'error' | 'info' | 'highlight' }
interface P { title: string; difficulty: 'Easy' | 'Medium' | 'Hard'; topic: string; url: string; acceptance: string; }

let _id = 0; const uid = () => ++_id;

const PROBS: P[] = [
    { title: 'Two Sum', difficulty: 'Easy', topic: 'HashMap', url: 'https://leetcode.com/problems/two-sum/', acceptance: '52.3%' },
    { title: 'Contains Duplicate', difficulty: 'Easy', topic: 'HashSet', url: 'https://leetcode.com/problems/contains-duplicate/', acceptance: '61.4%' },
    { title: 'Valid Anagram', difficulty: 'Easy', topic: 'Frequency Map', url: 'https://leetcode.com/problems/valid-anagram/', acceptance: '64.7%' },
    { title: 'Ransom Note', difficulty: 'Easy', topic: 'Frequency Map', url: 'https://leetcode.com/problems/ransom-note/', acceptance: '58.9%' },
    { title: 'Isomorphic Strings', difficulty: 'Easy', topic: 'HashMap', url: 'https://leetcode.com/problems/isomorphic-strings/', acceptance: '43.2%' },
    { title: 'Word Pattern', difficulty: 'Easy', topic: 'HashMap', url: 'https://leetcode.com/problems/word-pattern/', acceptance: '41.5%' },
    { title: 'Happy Number', difficulty: 'Easy', topic: 'HashSet + Math', url: 'https://leetcode.com/problems/happy-number/', acceptance: '55.8%' },
    { title: 'Missing Number', difficulty: 'Easy', topic: 'HashSet', url: 'https://leetcode.com/problems/missing-number/', acceptance: '63.2%' },
    { title: 'Majority Element', difficulty: 'Easy', topic: 'HashMap', url: 'https://leetcode.com/problems/majority-element/', acceptance: '64.7%' },
    { title: 'Intersection of Two Arrays', difficulty: 'Easy', topic: 'HashSet', url: 'https://leetcode.com/problems/intersection-of-two-arrays/', acceptance: '73.2%' },
    { title: 'Group Anagrams', difficulty: 'Medium', topic: 'HashMap + Sort key', url: 'https://leetcode.com/problems/group-anagrams/', acceptance: '68.2%' },
    { title: 'Top K Frequent Elements', difficulty: 'Medium', topic: 'HashMap + Heap', url: 'https://leetcode.com/problems/top-k-frequent-elements/', acceptance: '64.8%' },
    { title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'HashSet', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', acceptance: '47.2%' },
    { title: 'Subarray Sum Equals K', difficulty: 'Medium', topic: 'Prefix Sum + Map', url: 'https://leetcode.com/problems/subarray-sum-equals-k/', acceptance: '44.5%' },
    { title: '4Sum II', difficulty: 'Medium', topic: 'HashMap', url: 'https://leetcode.com/problems/4sum-ii/', acceptance: '57.4%' },
    { title: 'LRU Cache', difficulty: 'Medium', topic: 'HashMap + Doubly LL', url: 'https://leetcode.com/problems/lru-cache/', acceptance: '42.1%' },
    { title: 'Design HashMap', difficulty: 'Medium', topic: 'Hash Design', url: 'https://leetcode.com/problems/design-hashmap/', acceptance: '65.3%' },
    { title: 'Contiguous Array', difficulty: 'Medium', topic: 'Prefix Sum Map', url: 'https://leetcode.com/problems/contiguous-array/', acceptance: '47.9%' },
    { title: 'Unique Length-3 Palindromic Subsequences', difficulty: 'Medium', topic: 'HashSet', url: 'https://leetcode.com/problems/unique-length-3-palindromic-subsequences/', acceptance: '51.4%' },
    { title: 'First Missing Positive', difficulty: 'Hard', topic: 'Index as Hash', url: 'https://leetcode.com/problems/first-missing-positive/', acceptance: '38.2%' },
    { title: 'All O(1) Data Structure', difficulty: 'Hard', topic: 'HashMap + DLL', url: 'https://leetcode.com/problems/all-oone-data-structure/', acceptance: '37.9%' },
    { title: 'Longest Duplicate Substring', difficulty: 'Hard', topic: 'Rolling Hash', url: 'https://leetcode.com/problems/longest-duplicate-substring/', acceptance: '31.2%' },
];

const TABLE_SIZE = 8;
const hashFn = (k: number) => ((k % TABLE_SIZE) + TABLE_SIZE) % TABLE_SIZE;

interface ChainCell { key: number; state: NS }
interface OACell { key: number | null; state: NS; deleted?: boolean }

const META: Record<HTType, { label: string; color: string; desc: string; cx: [string, string][]; icon: string }> = {
    chaining: { label: 'Chaining', color: '#f97316', desc: 'Each bucket holds a linked list of entries. Handles unlimited collisions gracefully. Load factor can exceed 1.', cx: [['O(1)*', 'Insert'], ['O(1)*', 'Lookup'], ['O(n)', 'Worst case'], ['O(n)', 'Space']], icon: '⛓️' },
    open: { label: 'Open Addressing', color: '#22c55e', desc: 'All entries stored in the array itself. On collision, probe to the next slot (linear probing shown). Load factor must stay < 1.', cx: [['O(1)*', 'Insert'], ['O(1)*', 'Lookup'], ['O(n)', 'Worst case'], ['O(n)', 'Cluster']], icon: '🔓' },
    set: { label: 'Hash Set', color: '#60a5fa', desc: 'Stores unique keys only — no values. Built on a hash table. O(1) add, remove, contains. Used for deduplication and membership tests.', cx: [['O(1)*', 'Add'], ['O(1)*', 'Contains'], ['O(1)*', 'Remove'], ['O(n)', 'Iteration']], icon: '🎯' },
    map: { label: 'Hash Map', color: '#c084fc', desc: 'Key → Value store. Each key hashes to a bucket and maps to a value. Core of frequency counting, memoization, and grouping problems.', cx: [['O(1)*', 'Put'], ['O(1)*', 'Get'], ['O(1)*', 'Delete'], ['O(n)', 'Iteration']], icon: '🗺️' },
};

const StacksQueuesPage: React.FC = () => { return <div />; }; // placeholder — not used

const HashTablePage: React.FC = () => {
    const navigate = useNavigate();
    const [htType, setHtType] = useState<HTType>('chaining');
    const [chainTable, setChainTable] = useState<ChainCell[][]>(() => Array.from({ length: TABLE_SIZE }, () => []));
    const [oaTable, setOaTable] = useState<OACell[]>(() => Array.from({ length: TABLE_SIZE }, () => ({ key: null, state: 'idle' })));
    const [setStore, setSetStore] = useState<Set<number>>(new Set([5, 12, 7, 20, 3]));
    const [mapStore, setMapStore] = useState<Map<string, string>>(new Map([['name', 'Alice'], ['age', '30'], ['city', 'Delhi']]));
    const [kInput, setKInput] = useState('');
    const [vInput, setVInput] = useState('');
    const [activeOp, setActiveOp] = useState<string | null>(null);
    const [log, setLog] = useState<Log[]>([{ msg: 'Chaining hash table ready. Table size = 8. Hash = key % 8.', type: 'info' }]);
    const [filter, setFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');
    const logRef = useRef<HTMLDivElement>(null);
    const meta = META[htType];

    useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [log]);
    useEffect(() => {
        setChainTable(Array.from({ length: TABLE_SIZE }, () => []));
        setOaTable(Array.from({ length: TABLE_SIZE }, () => ({ key: null, state: 'idle' as NS })));
        setLog([{ msg: `${meta.label} ready. ${meta.desc}`, type: 'info' }]);
        setActiveOp(null); setKInput(''); setVInput('');
    }, [htType]);

    const addLog = (msg: string, type: Log['type'] = 'info') => setLog(p => [...p.slice(-29), { msg, type }]);
    const resetOA = (t: OACell[]) => t.map(c => ({ ...c, state: 'idle' as NS }));

    // Chaining ops
    const chainInsert = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a valid key (number).', 'error');
        const idx = hashFn(k);
        setChainTable(t => {
            const nt = [...t.map(b => [...b])];
            if (nt[idx].some(c => c.key === k)) { addLog(`Key ${k} already at bucket ${idx}.`, 'info'); return nt; }
            nt[idx] = [...nt[idx].map(c => ({ ...c, state: 'idle' as NS })), { key: k, state: 'inserted' }]; return nt;
        });
        setTimeout(() => setChainTable(t => t.map(b => b.map(c => ({ ...c, state: 'idle' as NS })))), 900);
        addLog(`Inserted key ${k} → bucket ${idx} (hash(${k}) = ${k}%${TABLE_SIZE} = ${idx}). O(1) avg.`, 'success'); setKInput('');
    };
    const chainSearch = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a key.', 'error');
        const idx = hashFn(k); const bucket = chainTable[idx]; const found = bucket.some(c => c.key === k);
        setChainTable(t => { const nt = [...t.map(b => [...b])]; nt[idx] = nt[idx].map(c => ({ ...c, state: c.key === k ? 'searched' : 'highlighted' })); return nt; });
        setTimeout(() => setChainTable(t => t.map(b => b.map(c => ({ ...c, state: 'idle' as NS })))), 1100);
        addLog(found ? `Found key ${k} in bucket ${idx}.` : `Key ${k} not found in bucket ${idx}.`, found ? 'success' : 'error'); setKInput('');
    };
    const chainDelete = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a key.', 'error');
        const idx = hashFn(k);
        setChainTable(t => { const nt = [...t.map(b => [...b])]; nt[idx] = nt[idx].map(c => c.key === k ? { ...c, state: 'deleted' } : c); return nt; });
        setTimeout(() => setChainTable(t => { const nt = [...t.map(b => [...b])]; nt[idx] = nt[idx].filter(c => c.key !== k); return nt; }), 700);
        addLog(`Deleted key ${k} from bucket ${idx}.`, 'success'); setKInput('');
    };

    // Open Addressing
    const oaInsert = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a key.', 'error');
        let idx = hashFn(k); let probes = 0;
        const t = [...oaTable.map(c => ({ ...c, state: 'idle' as NS }))];
        while (t[idx].key !== null && !t[idx].deleted && t[idx].key !== k && probes < TABLE_SIZE) { idx = (idx + 1) % TABLE_SIZE; probes++; }
        if (probes === TABLE_SIZE) return addLog('Table full!', 'error');
        const originalIdx = hashFn(k); t[idx] = { key: k, state: 'inserted' };
        if (probes > 0) addLog(`Collision at ${originalIdx}! Probed ${probes} slot(s) → inserted at [${idx}]. Linear probing.`, 'highlight');
        else addLog(`Inserted key ${k} at slot [${idx}]. O(1).`, 'success');
        setOaTable(t); setTimeout(() => setOaTable(p => resetOA(p)), 900); setKInput('');
    };
    const oaSearch = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a key.', 'error');
        let idx = hashFn(k); let probes = 0;
        const t = [...oaTable.map(c => ({ ...c, state: 'idle' as NS }))];
        while (t[idx].key !== null && probes < TABLE_SIZE) {
            t[idx] = { ...t[idx], state: t[idx].key === k ? 'searched' : 'highlighted' };
            if (t[idx].key === k) break; idx = (idx + 1) % TABLE_SIZE; probes++;
        }
        const found = oaTable.some(c => c.key === k);
        setOaTable(t); setTimeout(() => setOaTable(p => resetOA(p)), 1100);
        addLog(found ? `Found key ${k} after ${probes + 1} probe(s).` : `Key ${k} not found after ${probes + 1} probe(s).`, found ? 'success' : 'error'); setKInput('');
    };
    const oaDelete = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a key.', 'error');
        let idx = hashFn(k); let probes = 0;
        while (oaTable[idx].key !== null && oaTable[idx].key !== k && probes < TABLE_SIZE) { idx = (idx + 1) % TABLE_SIZE; probes++; }
        if (oaTable[idx].key === k) {
            setOaTable(t => { const nt = [...t.map(c => ({ ...c }))]; nt[idx] = { key: null, state: 'deleted', deleted: true }; return nt; });
            setTimeout(() => setOaTable(p => resetOA(p)), 900);
            addLog(`Deleted key ${k} from slot [${idx}]. Marked as tombstone.`, 'success');
        } else addLog(`Key ${k} not found.`, 'error');
        setKInput('');
    };

    // Set/Map ops
    const setAdd = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a number.', 'error');
        if (setStore.has(k)) return addLog(`${k} already in set. Sets enforce uniqueness.`, 'info');
        setSetStore(s => new Set([...s, k])); addLog(`Added ${k} to set. O(1).`, 'success'); setKInput('');
    };
    const setCheck = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a number.', 'error');
        addLog(setStore.has(k) ? `${k} IS in the set. O(1) lookup.` : `${k} is NOT in the set. O(1) lookup.`, setStore.has(k) ? 'success' : 'error'); setKInput('');
    };
    const setRemove = () => {
        const k = Number(kInput); if (kInput === '' || isNaN(k)) return addLog('Enter a number.', 'error');
        if (!setStore.has(k)) return addLog(`${k} not in set.`, 'error');
        setSetStore(s => { const ns = new Set(s); ns.delete(k); return ns; }); addLog(`Removed ${k}. O(1).`, 'success'); setKInput('');
    };
    const mapPut = () => {
        if (!kInput.trim()) return addLog('Enter a key.', 'error');
        const existed = mapStore.has(kInput);
        setMapStore(m => new Map([...m, [kInput, vInput]]));
        addLog(existed ? `Updated "${kInput}" → "${vInput}". O(1).` : `Inserted "${kInput}" → "${vInput}". O(1).`, 'success');
        setKInput(''); setVInput('');
    };
    const mapGet = () => {
        if (!kInput.trim()) return addLog('Enter a key.', 'error');
        const v = mapStore.get(kInput);
        addLog(v !== undefined ? `"${kInput}" → "${v}". O(1).` : `"${kInput}" not found. O(1).`, v !== undefined ? 'success' : 'error'); setKInput('');
    };
    const mapDelete = () => {
        if (!kInput.trim()) return addLog('Enter a key.', 'error');
        if (!mapStore.has(kInput)) return addLog(`"${kInput}" not in map.`, 'error');
        setMapStore(m => { const nm = new Map(m); nm.delete(kInput); return nm; }); addLog(`Deleted "${kInput}". O(1).`, 'success'); setKInput('');
    };

    const handleReset = () => {
        setChainTable(Array.from({ length: TABLE_SIZE }, () => []));
        setOaTable(Array.from({ length: TABLE_SIZE }, () => ({ key: null, state: 'idle' as NS })));
        setSetStore(new Set([5, 12, 7, 20, 3]));
        setMapStore(new Map([['name', 'Alice'], ['age', '30'], ['city', 'Delhi']]));
        setLog([{ msg: `${meta.label} reset.`, type: 'info' }]);
    };

    const filtered = PROBS.filter(p => filter === 'All' || p.difficulty === filter);
    const counts = { Easy: PROBS.filter(p => p.difficulty === 'Easy').length, Medium: PROBS.filter(p => p.difficulty === 'Medium').length, Hard: PROBS.filter(p => p.difficulty === 'Hard').length };
    const C = meta.color;

    const Chip = ({ l }: { l: string }) => <span style={{ fontSize: '.64rem', padding: '.15rem .5rem', borderRadius: 100, border: `1px solid ${C}35`, color: C, background: `${C}18`, letterSpacing: '.04em', flexShrink: 0 }}>{l}</span>;
    const Chev = ({ open }: { open: boolean }) => <svg style={{ color: 'rgba(255,255,255,.25)', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0 }} width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;

    const NS_C: Record<NS, { f: string; s: string }> = { idle: { f: '#141824', s: 'rgba(255,255,255,.13)' }, inserted: { f: '#14451f', s: '#22c55e' }, deleted: { f: '#4a0f0f', s: '#ef4444' }, highlighted: { f: '#1a1f40', s: '#60a5fa' }, searched: { f: '#44310a', s: '#f59e0b' }, collision: { f: '#2a1040', s: '#c084fc' } };

    return (
        <div className="ht-root">
            <div className="ht-bg" aria-hidden><div className="ht-orb ht-o1" style={{ background: C }} /><div className="ht-orb ht-o2" /><div className="ht-grid" /></div>
            <button className="ht-back" onClick={() => navigate('/resources/cp-roadmap')}><svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>DSA Roadmap</button>
            <header className="ht-hdr">
                <div className="ht-badge" style={{ color: C, background: `${C}18`, borderColor: `${C}40` }}>Data Structures · Hash Tables</div>
                <h1 className="ht-title" style={{ backgroundImage: `linear-gradient(135deg,#fff 30%,${C})` }}>{meta.icon} Hash Tables</h1>
                <p className="ht-sub">{meta.desc}</p>
                <div className="ht-stats">{meta.cx.map(([c, l]) => <div className="ht-stat" key={l}><span style={{ color: C, fontSize: '.95rem', fontWeight: 600 }}>{c}</span><span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.32)' }}>{l}</span></div>)}</div>
            </header>

            <section className="pg-wrap">
                <div className="ht-toggle">{(Object.entries(META) as [HTType, typeof meta][]).map(([k, m]) => (
                    <button key={k} onClick={() => setHtType(k)} className={`ht-tb${htType === k ? ' active' : ''}`} style={htType === k ? { borderColor: m.color, color: m.color, background: `${m.color}15` } : {}}>{m.icon} {m.label}</button>
                ))}</div>
                <div className="pg-hdr">
                    <h2 className="pg-title">Interactive Playground <span className="pg-chip" style={{ color: C, background: `${C}18`, borderColor: `${C}35` }}>{meta.label}</span></h2>
                    <button className="pg-reset" onClick={handleReset}>Reset</button>
                </div>

                {/* Visualizer */}
                <div className="ht-viz">
                    {(htType === 'chaining' || htType === 'open') && (
                        <div className="ht-table">
                            <div className="ht-th-row">
                                <div className="ht-th-idx">Bucket</div>
                                <div className="ht-th-content">Contents</div>
                                <div className="ht-th-hash">hash(k)={'{'}k%{TABLE_SIZE}{'}'}</div>
                            </div>
                            {htType === 'chaining' && chainTable.map((bucket, i) => (
                                <div key={i} className="ht-tr">
                                    <div className="ht-td-idx" style={{ color: C }}>[{i}]</div>
                                    <div className="ht-td-chain">
                                        {bucket.length === 0 && <span className="ht-empty">∅ empty</span>}
                                        {bucket.map((c, j) => (
                                            <React.Fragment key={c.key}>
                                                <div className="ht-node" style={{ background: NS_C[c.state].f, borderColor: NS_C[c.state].s, boxShadow: c.state !== 'idle' ? `0 0 8px ${NS_C[c.state].s}` : 'none', transition: 'all .35s' }}>{c.key}</div>
                                                {j < bucket.length - 1 && <span className="ht-arr">→</span>}
                                            </React.Fragment>
                                        ))}
                                        {bucket.length > 0 && <span className="ht-null">→ null</span>}
                                    </div>
                                    <div className="ht-td-hash" style={{ color: 'rgba(255,255,255,.2)', fontSize: '.72rem' }}>{bucket.map(c => `${c.key}→[${hashFn(c.key)}]`).join(', ')}</div>
                                </div>
                            ))}
                            {htType === 'open' && oaTable.map((cell, i) => (
                                <div key={i} className="ht-tr">
                                    <div className="ht-td-idx" style={{ color: C }}>[{i}]</div>
                                    <div className="ht-td-chain">
                                        {cell.key === null && !cell.deleted && <span className="ht-empty">∅ empty</span>}
                                        {cell.deleted && <span className="ht-tomb">✝ tombstone</span>}
                                        {cell.key !== null && <div className="ht-node" style={{ background: NS_C[cell.state].f, borderColor: NS_C[cell.state].s, boxShadow: cell.state !== 'idle' ? `0 0 8px ${NS_C[cell.state].s}` : 'none', transition: 'all .35s' }}>{cell.key}</div>}
                                    </div>
                                    <div className="ht-td-hash" style={{ color: 'rgba(255,255,255,.2)', fontSize: '.72rem' }}>{cell.key !== null ? `hash=${hashFn(cell.key)} → probe=${(i - hashFn(cell.key) + TABLE_SIZE) % TABLE_SIZE}` : ''}</div>
                                </div>
                            ))}
                        </div>
                    )}
                    {htType === 'set' && (
                        <div className="ht-set-viz">
                            <div style={{ fontFamily: 'monospace', fontSize: '.7rem', color: 'rgba(255,255,255,.3)', marginBottom: '.6rem' }}>HASH SET ({setStore.size} elements)</div>
                            <div className="ht-set-items">
                                {[...setStore].map(v => <div key={v} className="ht-set-item" style={{ borderColor: `${C}40`, color: C }}>{v}</div>)}
                                {!setStore.size && <span style={{ color: 'rgba(255,255,255,.2)', fontSize: '.85rem', fontFamily: 'monospace' }}>empty set</span>}
                            </div>
                            <div style={{ marginTop: '.8rem', fontFamily: 'monospace', fontSize: '.72rem', color: 'rgba(255,255,255,.28)' }}>
                                Internal: each value → hash → bucket · No duplicates · No order guarantee
                            </div>
                        </div>
                    )}
                    {htType === 'map' && (
                        <div className="ht-map-viz">
                            <div style={{ fontFamily: 'monospace', fontSize: '.7rem', color: 'rgba(255,255,255,.3)', marginBottom: '.6rem' }}>HASH MAP ({mapStore.size} entries)</div>
                            <div className="ht-map-table">
                                <div className="ht-map-hdr"><span>Key</span><span>→</span><span>Value</span><span>Bucket #</span></div>
                                {[...mapStore.entries()].map(([k, v]) => (
                                    <div key={k} className="ht-map-row">
                                        <span className="ht-mk" style={{ color: C }}>"{k}"</span>
                                        <span style={{ color: 'rgba(255,255,255,.3)' }}>→</span>
                                        <span className="ht-mv">"{v}"</span>
                                        <span className="ht-mb" style={{ color: 'rgba(255,255,255,.25)' }}>[{hashFn(k.charCodeAt(0))}]</span>
                                    </div>
                                ))}
                                {!mapStore.size && <div style={{ color: 'rgba(255,255,255,.2)', fontSize: '.85rem', fontFamily: 'monospace', padding: '.5rem' }}>empty map</div>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="pg-ops">
                    {(htType === 'chaining' || htType === 'open') && <>
                        {[
                            { id: 'ins', icon: '＋', name: 'Insert', badge: 'O(1) avg', fn: htType === 'chaining' ? chainInsert : oaInsert, btnLabel: 'Insert', btnColor: C, hint: htType === 'chaining' ? 'hash(key) % 8 gives bucket index. Collisions handled by appending to chain.' : 'hash(key) % 8 gives slot. On collision, probe (idx+1)%8 until empty. Tombstones mark deleted slots.' },
                            { id: 'srch', icon: '🔍', name: 'Search', badge: 'O(1) avg', fn: htType === 'chaining' ? chainSearch : oaSearch, btnLabel: 'Search', btnColor: '#f59e0b', hint: 'Compute hash → go to bucket → scan chain (chaining) or probe linearly (open addressing).' },
                            { id: 'del', icon: '－', name: 'Delete', badge: 'O(1) avg', fn: htType === 'chaining' ? chainDelete : oaDelete, btnLabel: 'Delete', btnColor: '#ef4444', hint: htType === 'chaining' ? 'Remove node from chain. O(1) avg.' : 'Mark slot as tombstone so probing chains are not broken.' },
                        ].map(op => {
                            const open = activeOp === op.id; return (
                                <div key={op.id} className={`pg-card${open ? ' open' : ''}`} onClick={() => setActiveOp(open ? null : op.id)}>
                                    <div className="pg-ch"><span className="pg-ci">{op.icon}</span><span className="pg-cn">{op.name}</span><Chip l={op.badge} /><Chev open={open} /></div>
                                    {open && <div className="pg-cb2" onClick={e => e.stopPropagation()}>
                                        <div className="pg-row"><input className="pg-inp" placeholder="Key (number)" value={kInput} onChange={e => setKInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && op.fn()} /><button className="pg-btn" style={{ background: op.btnColor, color: '#000' }} onClick={op.fn}>{op.btnLabel}</button></div>
                                        <p className="pg-hint">{op.hint}</p>
                                    </div>}
                                </div>
                            );
                        })}
                    </>}
                    {htType === 'set' && <>
                        <div className={`pg-card${activeOp === 'sadd' ? ' open' : ''}`} onClick={() => setActiveOp(activeOp === 'sadd' ? null : 'sadd')}>
                            <div className="pg-ch"><span className="pg-ci">＋</span><span className="pg-cn">Add</span><Chip l="O(1)" /><Chev open={activeOp === 'sadd'} /></div>
                            {activeOp === 'sadd' && <div className="pg-cb2" onClick={e => e.stopPropagation()}><div className="pg-row"><input className="pg-inp" placeholder="Value (number)" value={kInput} onChange={e => setKInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && setAdd()} /><button className="pg-btn" style={{ background: C, color: '#000' }} onClick={setAdd}>Add</button></div><p className="pg-hint">Set rejects duplicates silently. O(1) avg. Used for: visited nodes in graph traversal, deduplication.</p></div>}
                        </div>
                        <div className={`pg-card${activeOp === 'schk' ? ' open' : ''}`} onClick={() => setActiveOp(activeOp === 'schk' ? null : 'schk')}>
                            <div className="pg-ch"><span className="pg-ci">🔍</span><span className="pg-cn">Contains</span><Chip l="O(1)" /><Chev open={activeOp === 'schk'} /></div>
                            {activeOp === 'schk' && <div className="pg-cb2" onClick={e => e.stopPropagation()}><div className="pg-row"><input className="pg-inp" placeholder="Value to check" value={kInput} onChange={e => setKInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && setCheck()} /><button className="pg-btn" style={{ background: '#f59e0b', color: '#000' }} onClick={setCheck}>Check</button></div><p className="pg-hint">O(1) membership test. Much faster than O(n) array search. Key use: two-sum, cycle detection.</p></div>}
                        </div>
                        <div className={`pg-card${activeOp === 'sdel' ? ' open' : ''}`} onClick={() => setActiveOp(activeOp === 'sdel' ? null : 'sdel')}>
                            <div className="pg-ch"><span className="pg-ci">－</span><span className="pg-cn">Remove</span><Chip l="O(1)" /><Chev open={activeOp === 'sdel'} /></div>
                            {activeOp === 'sdel' && <div className="pg-cb2" onClick={e => e.stopPropagation()}><div className="pg-row"><input className="pg-inp" placeholder="Value to remove" value={kInput} onChange={e => setKInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && setRemove()} /><button className="pg-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={setRemove}>Remove</button></div><p className="pg-hint">O(1) deletion. No shifting needed unlike arrays.</p></div>}
                        </div>
                    </>}
                    {htType === 'map' && <>
                        <div className={`pg-card${activeOp === 'mput' ? ' open' : ''}`} onClick={() => setActiveOp(activeOp === 'mput' ? null : 'mput')}>
                            <div className="pg-ch"><span className="pg-ci">＋</span><span className="pg-cn">Put</span><Chip l="O(1)" /><Chev open={activeOp === 'mput'} /></div>
                            {activeOp === 'mput' && <div className="pg-cb2" onClick={e => e.stopPropagation()}><div className="pg-row"><input className="pg-inp" placeholder='Key (string)' value={kInput} onChange={e => setKInput(e.target.value)} /><input className="pg-inp" placeholder='Value (string)' value={vInput} onChange={e => setVInput(e.target.value)} /><button className="pg-btn" style={{ background: C, color: '#000' }} onClick={mapPut}>Put</button></div><p className="pg-hint">If key exists, overwrites value. Used for: frequency counting (freq[ch]++), memoization, grouping anagrams.</p></div>}
                        </div>
                        <div className={`pg-card${activeOp === 'mget' ? ' open' : ''}`} onClick={() => setActiveOp(activeOp === 'mget' ? null : 'mget')}>
                            <div className="pg-ch"><span className="pg-ci">🔍</span><span className="pg-cn">Get</span><Chip l="O(1)" /><Chev open={activeOp === 'mget'} /></div>
                            {activeOp === 'mget' && <div className="pg-cb2" onClick={e => e.stopPropagation()}><div className="pg-row"><input className="pg-inp" placeholder='Key' value={kInput} onChange={e => setKInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && mapGet()} /><button className="pg-btn" style={{ background: '#f59e0b', color: '#000' }} onClick={mapGet}>Get</button></div><p className="pg-hint">O(1) average lookup. Returns undefined if key absent. Classic pattern: map.get(key) ?? defaultValue.</p></div>}
                        </div>
                        <div className={`pg-card${activeOp === 'mdel' ? ' open' : ''}`} onClick={() => setActiveOp(activeOp === 'mdel' ? null : 'mdel')}>
                            <div className="pg-ch"><span className="pg-ci">－</span><span className="pg-cn">Delete</span><Chip l="O(1)" /><Chev open={activeOp === 'mdel'} /></div>
                            {activeOp === 'mdel' && <div className="pg-cb2" onClick={e => e.stopPropagation()}><div className="pg-row"><input className="pg-inp" placeholder='Key to delete' value={kInput} onChange={e => setKInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && mapDelete()} /><button className="pg-btn" style={{ background: '#ef4444', color: '#fff' }} onClick={mapDelete}>Delete</button></div><p className="pg-hint">Remove key-value pair. O(1). Used in LRU Cache to remove evicted entries.</p></div>}
                        </div>
                    </>}
                </div>

                <div className="pg-log" ref={logRef}>
                    <span className="pg-ll">Operation Log</span>
                    {log.map((e, i) => <div key={i} className={`pg-le ${e.type}`}><span className="pg-la">›</span>{e.msg}</div>)}
                </div>
            </section>

            <section className="pt-wrap">
                <div className="pt-hdr"><div><h2 className="pt-title">Practice Problems</h2><p className="pt-sub">{PROBS.length} curated Hash Table problems</p></div>
                    <div className="pt-counts"><span className="ptc easy">{counts.Easy} Easy</span><span className="ptc medium">{counts.Medium} Medium</span><span className="ptc hard">{counts.Hard} Hard</span></div></div>
                <div className="pt-filters">{(['All', 'Easy', 'Medium', 'Hard'] as const).map(f => <button key={f} className={`pt-f${filter === f ? ' active ' + f.toLowerCase() : ''}`} onClick={() => setFilter(f)}>{f}{f !== 'All' && <span className="pt-fc">{counts[f as keyof typeof counts]}</span>}</button>)}</div>
                <div className="pt-tw"><table className="pt-tbl">
                    <thead><tr><th>#</th><th>Problem</th><th>Difficulty</th><th>Pattern</th><th>Acceptance</th><th></th></tr></thead>
                    <tbody>{filtered.map((p, i) => <tr key={p.title} className="pt-row"><td className="pt-num">{i + 1}</td><td className="pt-name">{p.title}</td><td><span className={`pt-diff ${p.difficulty.toLowerCase()}`}>{p.difficulty}</span></td><td className="pt-topic">{p.topic}</td><td className="pt-acc">{p.acceptance}</td><td><a href={p.url} target="_blank" rel="noopener noreferrer" className="pt-solve">Solve →</a></td></tr>)}</tbody>
                </table></div>
            </section>
        </div>
    );
};

export default HashTablePage;