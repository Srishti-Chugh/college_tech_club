/// <reference types="vite/client" />
import React, { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type InputMode = "url" | "file";
type Stage = "idle" | "uploading" | "processing" | "done" | "error";

interface StageInfo {
  label: string;
  detail: string;
  icon: string;
}

const STAGES: StageInfo[] = [
  { label: "Parsing Blog", detail: "Tokenising content, extracting headings & code blocks…", icon: "◎" },
  { label: "Planning Repo", detail: "Designing production-ready file & folder structure…", icon: "⬡" },
  { label: "Analysing Deps", detail: "Inferring libraries, env configs & architectural patterns…", icon: "⬢" },
  { label: "Generating Code", detail: "LLM writing each file iteratively with context memory…", icon: "◈" },
  { label: "Packaging Zip", detail: "Bundling repository into a downloadable archive…", icon: "⬟" },
];

// ─── API helper ───────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_BLOG2CODE_API ?? "http://localhost:8000";

async function callAPI(mode: InputMode, value: string | File): Promise<Blob> {
  const fd = new FormData();
  if (mode === "url") fd.append("url", value as string);
  else fd.append("file", value as File);
  const res = await fetch(`${API_BASE}/generate`, { method: "POST", body: fd });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail ?? "Server error");
  }
  return res.blob();
}

// ─── Neural net background SVG ─────────────────────────────────────────────
const NeuralBg: React.FC = () => {
  const nodes = [
    // layer 1
    { x: 8, y: 20 }, { x: 8, y: 40 }, { x: 8, y: 60 }, { x: 8, y: 80 },
    // layer 2
    { x: 28, y: 15 }, { x: 28, y: 35 }, { x: 28, y: 55 }, { x: 28, y: 75 }, { x: 28, y: 90 },
    // layer 3
    { x: 50, y: 25 }, { x: 50, y: 50 }, { x: 50, y: 75 },
    // layer 4
    { x: 72, y: 15 }, { x: 72, y: 35 }, { x: 72, y: 55 }, { x: 72, y: 75 }, { x: 72, y: 90 },
    // layer 5
    { x: 92, y: 30 }, { x: 92, y: 50 }, { x: 92, y: 70 },
  ];

  // connect adjacent layers
  const layer1 = [0, 1, 2, 3], layer2 = [4, 5, 6, 7, 8], layer3 = [9, 10, 11];
  const layer4 = [12, 13, 14, 15, 16], layer5 = [17, 18, 19];

  const edges: [number, number][] = [];
  const connect = (la: number[], lb: number[]) => {
    la.forEach(a => lb.forEach(b => { if (Math.abs(nodes[a].y - nodes[b].y) < 45) edges.push([a, b]); }));
  };
  connect(layer1, layer2); connect(layer2, layer3);
  connect(layer3, layer4); connect(layer4, layer5);

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.06 }}>
      {edges.map(([a, b], i) => (
        <line key={i}
          x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#a78bfa" strokeWidth="0.15" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r="0.7"
          fill={i < 4 ? "#38bdf8" : i < 9 ? "#818cf8" : i < 12 ? "#a78bfa" : i < 17 ? "#818cf8" : "#38bdf8"} />
      ))}
    </svg>
  );
};

// ─── Floating data particles ───────────────────────────────────────────────
const PARTICLES = [
  { x: "12%", y: "18%", label: "∇loss", delay: "0s" },
  { x: "85%", y: "12%", label: "θ ← θ-α∇", delay: "1.2s" },
  { x: "6%", y: "72%", label: "sigmoid(x)", delay: "0.4s" },
  { x: "88%", y: "68%", label: "softmax", delay: "2s" },
  { x: "45%", y: "8%", label: "W·X+b", delay: "0.8s" },
  { x: "92%", y: "40%", label: "ReLU", delay: "1.6s" },
  { x: "3%", y: "45%", label: "epoch", delay: "3s" },
  { x: "60%", y: "88%", label: "dropout", delay: "1.4s" },
  { x: "25%", y: "92%", label: "embedding", delay: "2.4s" },
  { x: "75%", y: "85%", label: "attention", delay: "0.6s" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Blog2CodePage() {
  const [mode, setMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [stageIdx, setStageIdx] = useState(-1);
  const [error, setError] = useState("");
  const [zipBlob, setZipBlob] = useState<Blob | null>(null);
  const [repoName, setRepoName] = useState("generated-repo");
  const fileRef = useRef<HTMLInputElement>(null);
  const fakeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const runFakeProgress = useCallback((onDone: () => void) => {
    let i = 0;
    setStageIdx(0);
    const tick = () => {
      i++;
      if (i < STAGES.length) {
        setStageIdx(i);
        fakeTimerRef.current = setTimeout(tick, 3200);
      } else {
        onDone();
      }
    };
    fakeTimerRef.current = setTimeout(tick, 3200);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".md") || f.name.endsWith(".html"))) {
      setFile(f);
      setMode("file");
      setRepoName(f.name.replace(/\.[^.]+$/, ""));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setRepoName(f.name.replace(/\.[^.]+$/, "")); }
  };

  const handleSubmit = async () => {
    setError(""); setZipBlob(null);
    if (mode === "url" && !url.trim()) return;
    if (mode === "file" && !file) return;

    setStage("uploading");
    setStageIdx(0);

    let apiDone = false, progressDone = false;
    let resultBlob: Blob | null = null, apiError = "";

    const tryFinish = () => {
      if (apiDone && progressDone) {
        if (apiError) { setStage("error"); setError(apiError); setStageIdx(-1); }
        else { setZipBlob(resultBlob); setStage("done"); setStageIdx(STAGES.length - 1); }
      }
    };

    runFakeProgress(() => { progressDone = true; tryFinish(); });

    try {
      setStage("processing");
      resultBlob = await callAPI(mode, mode === "url" ? url : file!);
      apiDone = true; tryFinish();
    } catch (err: unknown) {
      if (fakeTimerRef.current) clearTimeout(fakeTimerRef.current);
      apiError = err instanceof Error ? err.message : "Unexpected error";
      apiDone = true; progressDone = true; tryFinish();
    }
  };

  const handleDownload = () => {
    if (!zipBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(zipBlob);
    a.download = `${repoName}.zip`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const reset = () => {
    if (fakeTimerRef.current) clearTimeout(fakeTimerRef.current);
    setStage("idle"); setStageIdx(-1); setError(""); setZipBlob(null);
    setUrl(""); setFile(null); setRepoName("generated-repo");
  };

  const isRunning = stage === "uploading" || stage === "processing";
  const canSubmit = !isRunning && (mode === "url" ? url.trim() !== "" : file !== null);

  return (
    <div className="ml-root">

      {/* ── ML Neural Background ── */}
      <div className="ml-bg" aria-hidden>
        <NeuralBg />
        {/* gradient mesh */}
        <div className="ml-mesh" />
        {/* floating particles */}
        {PARTICLES.map((p, i) => (
          <span key={i} className="ml-particle"
            style={{ left: p.x, top: p.y, animationDelay: p.delay }}>
            {p.label}
          </span>
        ))}
        {/* scan line */}
        <div className="ml-scanline" />
      </div>

      {/* ── Back ── */}
      <a href="/" className="ml-back">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Home
      </a>

      {/* ── Hero ── */}
      <header className="ml-header">
        <div className="ml-track-pill">
          <span className="ml-dot" />
          ML Track · Blog2Code
        </div>

        <h1 className="ml-title">
          <span className="ml-word-blog">Blog</span>
          <span className="ml-word-sep">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M6 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="ml-word-code">Code</span>
        </h1>

        <p className="ml-subtitle">
          Feed any ML/AI blog article into the pipeline.<br />
          Our LLM agent parses, architects and generates a<br />
          <span className="ml-hl">full working repo</span> — ready to clone and run.
        </p>

        {/* model pipeline display */}
        <div className="ml-pipeline-strip">
          {["Input", "Tokenise", "Plan", "Generate", "Output"].map((s, i, arr) => (
            <React.Fragment key={s}>
              <div className="ml-strip-node">{s}</div>
              {i < arr.length - 1 && <div className="ml-strip-edge" />}
            </React.Fragment>
          ))}
        </div>
      </header>

      {/* ── Main Card ── */}
      <main className="ml-card">
        {/* Card header accent */}
        <div className="ml-card-accent" />

        {stage === "idle" || stage === "error" ? (
          <>
            {/* Mode toggle */}
            <div className="ml-toggle" role="tablist">
              {(["url", "file"] as InputMode[]).map(m => (
                <button key={m} role="tab" aria-selected={mode === m}
                  className={`ml-tab ${mode === m ? "active" : ""}`}
                  onClick={() => setMode(m)}>
                  {m === "url"
                    ? <><span className="ml-tab-icon">🔗</span> Blog URL</>
                    : <><span className="ml-tab-icon">📄</span> Upload .md</>}
                </button>
              ))}
            </div>

            {/* Input */}
            {mode === "url" ? (
              <div className="ml-input-wrap">
                <span className="ml-input-prefix">url://</span>
                <input className="ml-input" type="url"
                  placeholder="towardsdatascience.com/your-article"
                  value={url} onChange={e => setUrl(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && canSubmit && handleSubmit()} />
              </div>
            ) : (
              <div className={`ml-drop ${file ? "filled" : ""}`}
                onDrop={handleDrop} onDragOver={e => e.preventDefault()}
                onClick={() => fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept=".md,.html"
                  style={{ display: "none" }} onChange={handleFileChange} />
                {file ? (
                  <div className="ml-drop-file">
                    <span className="ml-drop-file-icon">◈</span>
                    <div>
                      <div className="ml-drop-file-name">{file.name}</div>
                      <div className="ml-drop-file-meta">{(file.size / 1024).toFixed(1)} KB · ready to process</div>
                    </div>
                  </div>
                ) : (
                  <div className="ml-drop-empty">
                    <div className="ml-drop-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v12M7 8l5-5 5 5M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p>Drop your <code>.md</code> blog file here</p>
                    <p className="ml-drop-sub">or click to browse</p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="ml-error">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                {error}
              </div>
            )}

            <button className="ml-submit" disabled={!canSubmit} onClick={handleSubmit}>
              <span>Generate Repository</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>

        ) : stage === "done" ? (
          <div className="ml-done">
            <div className="ml-done-ring">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <path d="M8 19l8 8 14-16" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="ml-done-title">Repository Generated</h2>
            <p className="ml-done-sub">Your repo has been packaged as a <code>.zip</code> file and is ready for download.</p>
            <button className="ml-download" onClick={handleDownload}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v9M5 8l4 4 4-4M3 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Download {repoName}.zip
            </button>
            <button className="ml-retry" onClick={reset}>Convert another blog</button>
          </div>

        ) : (
          <div className="ml-processing">
            <div className="ml-proc-label">
              <span className="ml-proc-dot" />
              Processing pipeline
            </div>
            <div className="ml-steps">
              {STAGES.map((s, i) => {
                const status = i < stageIdx ? "done" : i === stageIdx ? "active" : "pending";
                return (
                  <div key={i} className={`ml-step ${status}`}>
                    <div className="ml-step-left">
                      <div className={`ml-step-node ${status}`}>
                        {status === "done"
                          ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
                          : status === "active"
                            ? <span className="ml-spin" />
                            : <span className="ml-step-num">{i + 1}</span>
                        }
                      </div>
                      {i < STAGES.length - 1 && <div className={`ml-step-line ${status === "done" ? "done" : ""}`} />}
                    </div>
                    <div className="ml-step-content">
                      <div className="ml-step-name">
                        <span className="ml-step-icon">{s.icon}</span>
                        {s.label}
                      </div>
                      {status === "active" && (
                        <div className="ml-step-detail">{s.detail}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="ml-proc-eta">Inference time: ~30–90 seconds depending on article length</p>
          </div>
        )}
      </main>

      {/* ── How it works ── */}
      {stage === "idle" && (
        <section className="ml-how">
          <div className="ml-how-header">
            <div className="ml-how-line" />
            <span>Architecture</span>
            <div className="ml-how-line" />
          </div>
          <div className="ml-how-grid">
            {[
              { icon: "◉", label: "01", title: "Parse", desc: "Tokenises the blog — extracts title, body, headings and inline code blocks" },
              { icon: "⬡", label: "02", title: "Plan", desc: "Designs production-ready folder structure based on detected tech stack" },
              { icon: "⬢", label: "03", title: "Analyse", desc: "Infers pip/npm dependencies, env vars and architectural patterns" },
              { icon: "◈", label: "04", title: "Generate", desc: "LLM writes every file with full context of the plan and prior files" },
            ].map(c => (
              <div className="ml-how-card" key={c.title}>
                <div className="ml-how-card-top">
                  <span className="ml-how-num">{c.label}</span>
                  <span className="ml-how-node">{c.icon}</span>
                </div>
                <div className="ml-how-card-title">{c.title}</div>
                <p className="ml-how-card-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <style>{CSS}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap');

  :root {
    --bg:       #03050e;
    --surface:  #080d1a;
    --card-bg:  #0b1120;
    --border:   rgba(120,140,255,0.12);
    --border-h: rgba(120,140,255,0.28);
    --violet:   #7c6fff;
    --sky:      #38bdf8;
    --emerald:  #34d399;
    --amber:    #fbbf24;
    --red:      #f87171;
    --muted:    rgba(148,163,184,0.6);
    --text:     rgba(226,232,240,0.92);
    --mono:     'IBM Plex Mono', monospace;
    --sans:     'IBM Plex Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .ml-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    display: flex; flex-direction: column; align-items: center;
    padding: 0 1.25rem 6rem;
    position: relative; overflow-x: hidden;
  }

  /* ── Background ── */
  .ml-bg {
    position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden;
  }
  .ml-mesh {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 20%, rgba(124,111,255,.1) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 75%, rgba(56,189,248,.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(52,211,153,.04) 0%, transparent 70%);
  }
  .ml-particle {
    position: absolute;
    font-family: var(--mono); font-size: .62rem; font-weight: 400;
    color: rgba(124,111,255,.35);
    animation: float-up 8s ease-in-out infinite alternate;
    white-space: nowrap; pointer-events: none;
  }
  @keyframes float-up {
    0%   { transform: translateY(0) translateX(0); opacity: .3; }
    50%  { opacity: .6; }
    100% { transform: translateY(-18px) translateX(6px); opacity: .2; }
  }
  .ml-scanline {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      rgba(0,0,0,.08) 3px,
      rgba(0,0,0,.08) 4px
    );
    pointer-events: none;
  }

  /* ── Back ── */
  .ml-back {
    position: relative; z-index: 2;
    align-self: flex-start; margin-top: 1.6rem;
    display: flex; align-items: center; gap: .4rem;
    font-family: var(--mono); font-size: .78rem;
    color: var(--muted); text-decoration: none;
    transition: color .2s;
  }
  .ml-back:hover { color: var(--text); }

  /* ── Header ── */
  .ml-header {
    position: relative; z-index: 2;
    text-align: center; margin-top: 3.5rem;
    max-width: 680px; width: 100%;
  }
  .ml-track-pill {
    display: inline-flex; align-items: center; gap: .45rem;
    font-family: var(--mono); font-size: .68rem; letter-spacing: .14em;
    text-transform: uppercase; color: var(--violet);
    background: rgba(124,111,255,.1); border: 1px solid rgba(124,111,255,.25);
    border-radius: 4px; padding: .28rem .9rem; margin-bottom: 1.6rem;
  }
  .ml-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--violet);
    box-shadow: 0 0 6px var(--violet);
    animation: pulse-dot 2s ease-in-out infinite;
  }
  @keyframes pulse-dot {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: .5; transform: scale(.75); }
  }

  .ml-title {
    font-family: var(--mono);
    font-size: clamp(2.8rem, 9vw, 5.5rem);
    font-weight: 600; line-height: 1; letter-spacing: -.03em;
    display: flex; align-items: center; justify-content: center;
    gap: .25em; flex-wrap: wrap;
  }
  .ml-word-blog { color: var(--sky); }
  .ml-word-sep {
    color: rgba(148,163,184,.35);
    display: flex; align-items: center;
    animation: sep-pulse 3s ease-in-out infinite;
  }
  @keyframes sep-pulse {
    0%,100% { color: rgba(148,163,184,.25); }
    50%      { color: rgba(124,111,255,.8); }
  }
  .ml-word-code { color: var(--emerald); }

  .ml-subtitle {
    margin-top: 1.25rem;
    color: var(--muted); font-size: .88rem; line-height: 1.85;
    font-family: var(--mono);
  }
  .ml-hl {
    color: var(--violet);
    border-bottom: 1px dashed rgba(124,111,255,.4);
    padding-bottom: 1px;
  }

  /* Pipeline strip */
  .ml-pipeline-strip {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-top: 1.75rem; flex-wrap: wrap; row-gap: .5rem;
  }
  .ml-strip-node {
    font-family: var(--mono); font-size: .68rem; font-weight: 500;
    color: rgba(148,163,184,.5); background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.07); border-radius: 4px;
    padding: .3rem .7rem; white-space: nowrap;
    transition: color .2s;
  }
  .ml-strip-edge {
    width: 24px; height: 1px;
    background: linear-gradient(90deg, rgba(124,111,255,.2), rgba(56,189,248,.2));
    flex-shrink: 0; position: relative;
  }
  .ml-strip-edge::after {
    content: ''; position: absolute; right: 0; top: -3px;
    border-left: 5px solid rgba(56,189,248,.3);
    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;
  }

  /* ── Card ── */
  .ml-card {
    position: relative; z-index: 2;
    width: 100%; max-width: 640px;
    margin-top: 2.5rem;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 2.25rem;
    box-shadow: 0 0 0 1px rgba(124,111,255,.04), 0 24px 60px rgba(0,0,0,.6);
    overflow: hidden;
  }
  .ml-card-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--violet), var(--sky), var(--emerald));
  }

  /* ── Toggle ── */
  .ml-toggle {
    display: flex; gap: 2px;
    background: rgba(0,0,0,.4);
    border: 1px solid var(--border);
    border-radius: 4px; padding: 2px;
    margin-bottom: 1.5rem;
  }
  .ml-tab {
    flex: 1; background: transparent; border: none;
    color: var(--muted); font-family: var(--mono); font-size: .82rem;
    font-weight: 400; padding: .6rem;
    border-radius: 3px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .45rem;
    transition: all .2s;
  }
  .ml-tab-icon { font-size: 1rem; }
  .ml-tab.active {
    background: rgba(124,111,255,.15);
    color: var(--violet);
    border: 1px solid rgba(124,111,255,.25);
  }
  .ml-tab:hover:not(.active) { color: var(--text); }

  /* ── URL input ── */
  .ml-input-wrap {
    display: flex; align-items: center;
    background: rgba(0,0,0,.4); border: 1px solid var(--border);
    border-radius: 4px; margin-bottom: 1.25rem;
    transition: border-color .2s;
  }
  .ml-input-wrap:focus-within { border-color: var(--violet); }
  .ml-input-prefix {
    font-family: var(--mono); font-size: .78rem; font-weight: 500;
    color: var(--violet); padding: 0 .85rem;
    border-right: 1px solid var(--border); white-space: nowrap;
    opacity: .7;
  }
  .ml-input {
    flex: 1; background: transparent; border: none;
    color: var(--text); font-family: var(--mono); font-size: .85rem;
    padding: .85rem .9rem; outline: none;
  }
  .ml-input::placeholder { color: rgba(148,163,184,.3); }

  /* ── Dropzone ── */
  .ml-drop {
    border: 1px dashed rgba(124,111,255,.25);
    border-radius: 4px; padding: 2.25rem 1.5rem;
    text-align: center; cursor: pointer;
    transition: all .2s; margin-bottom: 1.25rem;
    background: rgba(124,111,255,.02);
  }
  .ml-drop:hover, .ml-drop.filled {
    border-color: var(--violet);
    background: rgba(124,111,255,.06);
  }
  .ml-drop-empty { display: flex; flex-direction: column; align-items: center; gap: .6rem; }
  .ml-drop-icon { color: rgba(124,111,255,.5); }
  .ml-drop-empty p { color: var(--muted); font-family: var(--mono); font-size: .84rem; }
  .ml-drop-empty code { color: var(--violet); }
  .ml-drop-sub { font-size: .74rem; opacity: .65; }
  .ml-drop-file {
    display: flex; align-items: center; gap: .85rem;
    font-family: var(--mono);
  }
  .ml-drop-file-icon { font-size: 1.5rem; color: var(--violet); }
  .ml-drop-file-name { font-size: .9rem; font-weight: 500; color: var(--violet); }
  .ml-drop-file-meta { font-size: .74rem; color: var(--muted); margin-top: .2rem; }

  /* ── Error ── */
  .ml-error {
    display: flex; align-items: center; gap: .5rem;
    color: var(--red); font-family: var(--mono); font-size: .82rem;
    margin-bottom: 1rem; padding: .65rem .9rem;
    background: rgba(248,113,113,.07);
    border: 1px solid rgba(248,113,113,.2);
    border-radius: 4px;
  }

  /* ── Submit ── */
  .ml-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: .6rem;
    background: linear-gradient(135deg, var(--violet), #6366f1);
    color: #fff; font-family: var(--sans); font-size: .95rem; font-weight: 600;
    border: none; border-radius: 4px; padding: .9rem;
    cursor: pointer; transition: all .2s;
    letter-spacing: .02em;
  }
  .ml-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #9180ff, #818cf8);
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(124,111,255,.3);
  }
  .ml-submit:disabled { opacity: .3; cursor: not-allowed; }

  /* ── Processing ── */
  .ml-processing { display: flex; flex-direction: column; gap: 0; }
  .ml-proc-label {
    display: flex; align-items: center; gap: .6rem;
    font-family: var(--mono); font-size: .68rem; letter-spacing: .1em;
    text-transform: uppercase; color: var(--muted);
    margin-bottom: 1.5rem;
  }
  .ml-proc-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--violet);
    animation: pulse-dot 1.5s ease-in-out infinite;
  }

  .ml-steps { display: flex; flex-direction: column; }
  .ml-step {
    display: flex; gap: 1rem; opacity: .35; transition: opacity .35s;
  }
  .ml-step.active { opacity: 1; }
  .ml-step.done   { opacity: .6; }
  .ml-step-left   { display: flex; flex-direction: column; align-items: center; gap: 0; }
  .ml-step-node {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: rgba(0,0,0,.5); border: 1.5px solid rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: .75rem; color: var(--muted);
    transition: all .3s;
  }
  .ml-step-node.active {
    border-color: var(--violet); color: var(--violet);
    box-shadow: 0 0 12px rgba(124,111,255,.4);
  }
  .ml-step-node.done {
    border-color: var(--emerald); color: var(--emerald);
    background: rgba(52,211,153,.1);
  }
  .ml-step-num { font-size: .72rem; color: rgba(255,255,255,.25); }
  .ml-step-line {
    flex: 1; width: 1px; background: rgba(255,255,255,.08);
    min-height: 20px; margin: 3px 0;
    transition: background .4s;
  }
  .ml-step-line.done { background: rgba(52,211,153,.3); }
  .ml-step-content { padding-top: .3rem; padding-bottom: 1rem; }
  .ml-step-name {
    display: flex; align-items: center; gap: .45rem;
    font-size: .9rem; font-weight: 600; font-family: var(--sans);
  }
  .ml-step-icon { font-family: var(--mono); font-size: .8rem; color: var(--violet); opacity: .7; }
  .ml-step-detail {
    font-family: var(--mono); font-size: .76rem;
    color: var(--muted); margin-top: .3rem; line-height: 1.6;
  }

  /* Spinner */
  .ml-spin {
    display: inline-block; width: 12px; height: 12px;
    border: 1.5px solid rgba(124,111,255,.25);
    border-top-color: var(--violet); border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .ml-proc-eta {
    font-family: var(--mono); font-size: .74rem;
    color: rgba(148,163,184,.35); text-align: center;
    margin-top: .75rem;
  }

  /* ── Done ── */
  .ml-done {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1rem; padding: .75rem 0;
  }
  .ml-done-ring {
    width: 68px; height: 68px; border-radius: 50%;
    border: 2px solid var(--emerald);
    background: rgba(52,211,153,.08);
    display: flex; align-items: center; justify-content: center;
    color: var(--emerald);
    box-shadow: 0 0 24px rgba(52,211,153,.2), inset 0 0 20px rgba(52,211,153,.05);
    animation: pop-in .45s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes pop-in {
    from { transform: scale(.3); opacity: 0; }
    to   { transform: scale(1);  opacity: 1; }
  }
  .ml-done-title { font-size: 1.5rem; font-weight: 700; letter-spacing: -.02em; }
  .ml-done-sub { color: var(--muted); font-family: var(--mono); font-size: .82rem; line-height: 1.7; }
  .ml-done-sub code { color: var(--emerald); }

  .ml-download {
    display: flex; align-items: center; gap: .6rem;
    background: linear-gradient(135deg, rgba(52,211,153,.15), rgba(52,211,153,.08));
    color: var(--emerald); font-family: var(--sans); font-size: .95rem; font-weight: 600;
    border: 1px solid rgba(52,211,153,.35); border-radius: 4px;
    padding: .85rem 2rem; cursor: pointer; transition: all .2s;
  }
  .ml-download:hover {
    background: rgba(52,211,153,.18);
    box-shadow: 0 6px 24px rgba(52,211,153,.2);
    transform: translateY(-1px);
  }
  .ml-retry {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted); font-family: var(--mono); font-size: .82rem;
    border-radius: 4px; padding: .5rem 1.2rem; cursor: pointer; transition: all .2s;
  }
  .ml-retry:hover { color: var(--text); border-color: var(--border-h); }

  /* ── How it works ── */
  .ml-how {
    position: relative; z-index: 2;
    width: 100%; max-width: 640px; margin-top: 3rem;
  }
  .ml-how-header {
    display: flex; align-items: center; gap: .8rem;
    margin-bottom: 1.25rem;
    font-family: var(--mono); font-size: .66rem;
    letter-spacing: .14em; text-transform: uppercase;
    color: rgba(148,163,184,.35);
  }
  .ml-how-line { flex: 1; height: 1px; background: var(--border); }
  .ml-how-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: .75rem;
  }
  .ml-how-card {
    background: var(--card-bg); border: 1px solid var(--border);
    border-radius: 4px; padding: 1.1rem;
    display: flex; flex-direction: column; gap: .5rem;
    transition: border-color .2s;
    position: relative; overflow: hidden;
  }
  .ml-how-card:hover { border-color: rgba(124,111,255,.3); }
  .ml-how-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(124,111,255,.3), transparent);
    opacity: 0; transition: opacity .2s;
  }
  .ml-how-card:hover::before { opacity: 1; }
  .ml-how-card-top {
    display: flex; justify-content: space-between; align-items: center;
  }
  .ml-how-num { font-family: var(--mono); font-size: .64rem; color: rgba(124,111,255,.4); }
  .ml-how-node { font-family: var(--mono); font-size: 1.1rem; color: rgba(124,111,255,.5); }
  .ml-how-card-title { font-size: .92rem; font-weight: 700; letter-spacing: .02em; }
  .ml-how-card-desc { color: var(--muted); font-family: var(--mono); font-size: .75rem; line-height: 1.6; }

  @media (max-width: 520px) {
    .ml-card { padding: 1.5rem 1.1rem; border-radius: 4px; }
    .ml-how-grid { grid-template-columns: 1fr; }
    .ml-title { font-size: 2.6rem; }
    .ml-pipeline-strip { display: none; }
  }
`;