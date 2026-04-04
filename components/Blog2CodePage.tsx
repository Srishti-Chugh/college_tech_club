/// <reference types="vite/client" />
import React, { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type InputMode = "url" | "file";
type Stage = "idle" | "uploading" | "processing" | "done" | "error";

interface StageInfo {
    label: string;
    detail: string;
}

const STAGES: StageInfo[] = [
    { label: "Parsing Blog", detail: "Extracting content, headings & code snippets…" },
    { label: "Planning Repo", detail: "Designing production-ready file structure…" },
    { label: "Analysing Deps", detail: "Identifying libraries, env configs & patterns…" },
    { label: "Generating Code", detail: "Writing each file iteratively with the LLM…" },
    { label: "Packaging Zip", detail: "Bundling everything into a downloadable repo…" },
];

// ─── API helper ───────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_BLOG2CODE_API ?? "http://localhost:8000";

async function callAPI(mode: InputMode, value: string | File): Promise<Blob> {
    const fd = new FormData();
    if (mode === "url") {
        fd.append("url", value as string);
    } else {
        fd.append("file", value as File);
    }
    const res = await fetch(`${API_BASE}/generate`, { method: "POST", body: fd });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: "Unknown error" }));
        throw new Error(err.detail ?? "Server error");
    }
    return res.blob();
}

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

    // Fake progress ticker while waiting for backend
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
        if (f) {
            setFile(f);
            setRepoName(f.name.replace(/\.[^.]+$/, ""));
        }
    };

    const handleSubmit = async () => {
        setError("");
        setZipBlob(null);

        if (mode === "url" && !url.trim()) return;
        if (mode === "file" && !file) return;

        setStage("uploading");
        setStageIdx(0);

        // Kick off fake progress + real API in parallel
        let apiDone = false;
        let progressDone = false;
        let resultBlob: Blob | null = null;
        let apiError = "";

        const tryFinish = () => {
            if (apiDone && progressDone) {
                if (apiError) {
                    setStage("error");
                    setError(apiError);
                    setStageIdx(-1);
                } else {
                    setZipBlob(resultBlob);
                    setStage("done");
                    setStageIdx(STAGES.length - 1);
                }
            }
        };

        runFakeProgress(() => {
            progressDone = true;
            tryFinish();
        });

        try {
            setStage("processing");
            resultBlob = await callAPI(mode, mode === "url" ? url : file!);
            apiDone = true;
            tryFinish();
        } catch (err: unknown) {
            if (fakeTimerRef.current) clearTimeout(fakeTimerRef.current);
            apiError = err instanceof Error ? err.message : "Unexpected error";
            apiDone = true;
            progressDone = true;
            tryFinish();
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
        setStage("idle");
        setStageIdx(-1);
        setError("");
        setZipBlob(null);
        setUrl("");
        setFile(null);
        setRepoName("generated-repo");
    };

    const isRunning = stage === "uploading" || stage === "processing";
    const canSubmit = !isRunning && (mode === "url" ? url.trim() !== "" : file !== null);

    return (
        <div className="b2c-root">
            {/* ── Ambient background ─────────────────────────────────────────── */}
            <div className="b2c-bg" aria-hidden>
                <div className="blob blob-1" />
                <div className="blob blob-2" />
                <div className="blob blob-3" />
                <div className="grid-overlay" />
            </div>

            {/* ── Back link ──────────────────────────────────────────────────── */}
            <a href="/" className="b2c-back">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                Back to Home
            </a>

            {/* ── Hero header ────────────────────────────────────────────────── */}
            <header className="b2c-header">
                <div className="b2c-badge">ML Track · Blog2Code</div>
                <h1 className="b2c-title">
                    <span className="word-blog">Blog</span>
                    <span className="word-arrow">→</span>
                    <span className="word-code">Code</span>
                </h1>
                <p className="b2c-subtitle">
                    Paste a technical blog URL or upload a <code>.md</code> file.<br />
                    Our pipeline parses, plans, analyses &amp; generates a full working repo — ready to download.
                </p>
            </header>

            {/* ── Main card ──────────────────────────────────────────────────── */}
            <main className="b2c-card">

                {stage === "idle" || stage === "error" ? (
                    <>
                        {/* Mode toggle */}
                        <div className="b2c-toggle" role="tablist">
                            {(["url", "file"] as InputMode[]).map((m) => (
                                <button
                                    key={m}
                                    role="tab"
                                    aria-selected={mode === m}
                                    className={`toggle-btn ${mode === m ? "active" : ""}`}
                                    onClick={() => setMode(m)}
                                >
                                    {m === "url" ? "🔗  Blog URL" : "📄  Upload .md"}
                                </button>
                            ))}
                        </div>

                        {/* Input area */}
                        {mode === "url" ? (
                            <div className="b2c-input-wrap">
                                <input
                                    className="b2c-input"
                                    type="url"
                                    placeholder="https://towardsdatascience.com/your-article"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && canSubmit && handleSubmit()}
                                />
                            </div>
                        ) : (
                            <div
                                className={`b2c-dropzone ${file ? "has-file" : ""}`}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => fileRef.current?.click()}
                            >
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept=".md,.html"
                                    style={{ display: "none" }}
                                    onChange={handleFileChange}
                                />
                                {file ? (
                                    <div className="dropzone-file">
                                        <span className="file-icon">📄</span>
                                        <span className="file-name">{file.name}</span>
                                        <span className="file-size">({(file.size / 1024).toFixed(1)} KB)</span>
                                    </div>
                                ) : (
                                    <div className="dropzone-empty">
                                        <div className="dz-icon">⬆</div>
                                        <p>Drag &amp; drop your <strong>.md</strong> blog file here</p>
                                        <p className="dz-sub">or click to browse</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {error && <p className="b2c-error">⚠ {error}</p>}

                        <button
                            className="b2c-submit"
                            disabled={!canSubmit}
                            onClick={handleSubmit}
                        >
                            <span>Generate Repo</span>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </>
                ) : stage === "done" ? (
                    /* ── Done state ──────────────────────────────────────────────── */
                    <div className="b2c-done">
                        <div className="done-icon">✓</div>
                        <h2>Repo Ready!</h2>
                        <p>Your generated repository has been packaged into a <code>.zip</code> file.</p>
                        <button className="b2c-download" onClick={handleDownload}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M9 3v9M5 8l4 4 4-4M3 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            Download {repoName}.zip
                        </button>
                        <button className="b2c-reset" onClick={reset}>Convert another blog</button>
                    </div>
                ) : (
                    /* ── Processing state ────────────────────────────────────────── */
                    <div className="b2c-processing">
                        <div className="pipeline">
                            {STAGES.map((s, i) => {
                                const status =
                                    i < stageIdx ? "done" :
                                        i === stageIdx ? "active" :
                                            "pending";
                                return (
                                    <div key={i} className={`pipeline-step ${status}`}>
                                        <div className="step-dot">
                                            {status === "done" ? "✓" : status === "active" ? <span className="spinner" /> : i + 1}
                                        </div>
                                        <div className="step-info">
                                            <span className="step-label">{s.label}</span>
                                            {status === "active" && <span className="step-detail">{s.detail}</span>}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <p className="processing-note">This usually takes 30–90 seconds depending on blog length.</p>
                    </div>
                )}
            </main>

            {/* ── How it works ───────────────────────────────────────────────── */}
            {stage === "idle" && (
                <section className="b2c-how">
                    <h3>How it works</h3>
                    <div className="how-grid">
                        {[
                            { icon: "🔍", title: "Parse", desc: "Extracts title, content & code snippets from the blog" },
                            { icon: "🗺", title: "Plan", desc: "Designs a production-ready file & folder structure" },
                            { icon: "🔬", title: "Analyse", desc: "Identifies dependencies, env configs & patterns" },
                            { icon: "⚙️", title: "Generate", desc: "LLM writes every file iteratively & consistently" },
                        ].map((c) => (
                            <div className="how-card" key={c.title}>
                                <span className="how-icon">{c.icon}</span>
                                <strong>{c.title}</strong>
                                <p>{c.desc}</p>
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
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --ink:        #0d0d12;
    --surface:    #13131a;
    --card:       #1a1a26;
    --border:     rgba(255,255,255,0.08);
    --accent:     #6cffb4;
    --accent2:    #4f8fff;
    --accent3:    #ff6cb4;
    --muted:      rgba(255,255,255,0.45);
    --text:       rgba(255,255,255,0.92);
    --r:          16px;
    --font:       'Syne', sans-serif;
    --mono:       'JetBrains Mono', monospace;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .b2c-root {
    min-height: 100vh;
    background: var(--ink);
    color: var(--text);
    font-family: var(--font);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 1.25rem 5rem;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Ambient bg ── */
  .b2c-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: drift 18s ease-in-out infinite alternate;
  }
  .blob-1 { width: 560px; height: 560px; background: var(--accent2); top: -120px; left: -160px; animation-delay: 0s; }
  .blob-2 { width: 400px; height: 400px; background: var(--accent);  bottom: 0;   right: -80px;  animation-delay: -6s; }
  .blob-3 { width: 300px; height: 300px; background: var(--accent3); top: 40%;    left: 40%;     animation-delay: -12s; }
  .grid-overlay {
    inset: 0; position: absolute;
    background-image:
      linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
    background-size: 48px 48px;
  }
  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(40px, 30px) scale(1.08); }
  }

  /* ── Back link ── */
  .b2c-back {
    position: relative; z-index: 2;
    align-self: flex-start;
    display: flex; align-items: center; gap: .5rem;
    color: var(--muted); font-size: .85rem;
    text-decoration: none;
    margin-top: 1.75rem;
    transition: color .2s;
  }
  .b2c-back:hover { color: var(--text); }

  /* ── Header ── */
  .b2c-header {
    position: relative; z-index: 2;
    text-align: center;
    margin-top: 3.5rem;
    max-width: 680px;
  }
  .b2c-badge {
    display: inline-block;
    font-family: var(--mono);
    font-size: .72rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--accent);
    background: rgba(108,255,180,.1);
    border: 1px solid rgba(108,255,180,.25);
    border-radius: 100px;
    padding: .3rem .9rem;
    margin-bottom: 1.4rem;
  }
  .b2c-title {
    font-size: clamp(3.2rem, 9vw, 6rem);
    font-weight: 800;
    line-height: .95;
    letter-spacing: -.03em;
    display: flex; align-items: center; justify-content: center; gap: .3em;
    flex-wrap: wrap;
  }
  .word-blog  { color: var(--text); }
  .word-arrow {
    color: var(--accent3);
    display: inline-block;
    animation: nudge 2.4s ease-in-out infinite;
  }
  .word-code  { color: var(--accent); }
  @keyframes nudge {
    0%,100% { transform: translateX(0); }
    50%      { transform: translateX(8px); }
  }
  .b2c-subtitle {
    margin-top: 1.25rem;
    color: var(--muted);
    font-size: 1rem;
    line-height: 1.7;
    font-family: var(--mono);
  }
  .b2c-subtitle code {
    color: var(--accent);
    font-family: var(--mono);
  }

  /* ── Card ── */
  .b2c-card {
    position: relative; z-index: 2;
    width: 100%; max-width: 640px;
    margin-top: 2.5rem;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 2.25rem;
    box-shadow: 0 24px 64px rgba(0,0,0,.45);
  }

  /* ── Toggle ── */
  .b2c-toggle {
    display: flex; gap: .5rem;
    background: rgba(255,255,255,.04);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: .35rem;
    margin-bottom: 1.6rem;
  }
  .toggle-btn {
    flex: 1;
    background: transparent;
    border: none;
    color: var(--muted);
    font-family: var(--font);
    font-size: .9rem;
    font-weight: 600;
    padding: .6rem;
    border-radius: 9px;
    cursor: pointer;
    transition: all .2s;
  }
  .toggle-btn.active {
    background: rgba(108,255,180,.12);
    color: var(--accent);
  }
  .toggle-btn:hover:not(.active) { color: var(--text); }

  /* ── URL Input ── */
  .b2c-input-wrap { margin-bottom: 1.4rem; }
  .b2c-input {
    width: 100%;
    background: rgba(255,255,255,.04);
    border: 1px solid var(--border);
    border-radius: 12px;
    color: var(--text);
    font-family: var(--mono);
    font-size: .9rem;
    padding: .9rem 1.1rem;
    outline: none;
    transition: border-color .2s;
  }
  .b2c-input::placeholder { color: rgba(255,255,255,.25); }
  .b2c-input:focus { border-color: var(--accent2); }

  /* ── Dropzone ── */
  .b2c-dropzone {
    border: 2px dashed rgba(255,255,255,.15);
    border-radius: 14px;
    padding: 2.5rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all .2s;
    margin-bottom: 1.4rem;
  }
  .b2c-dropzone:hover, .b2c-dropzone.has-file {
    border-color: var(--accent);
    background: rgba(108,255,180,.04);
  }
  .dz-icon {
    font-size: 2rem;
    margin-bottom: .75rem;
    color: var(--muted);
  }
  .dropzone-empty p { color: var(--muted); font-size: .9rem; line-height: 1.6; }
  .dz-sub { font-size: .78rem; margin-top: .25rem; }
  .dropzone-file {
    display: flex; align-items: center; justify-content: center; gap: .6rem;
    font-family: var(--mono);
  }
  .file-icon { font-size: 1.4rem; }
  .file-name { color: var(--accent); font-weight: 500; }
  .file-size { color: var(--muted); font-size: .82rem; }

  /* ── Error ── */
  .b2c-error {
    color: var(--accent3);
    font-family: var(--mono);
    font-size: .85rem;
    margin-bottom: 1rem;
    padding: .6rem 1rem;
    background: rgba(255,108,180,.08);
    border-radius: 8px;
    border: 1px solid rgba(255,108,180,.2);
  }

  /* ── Submit ── */
  .b2c-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: .6rem;
    background: var(--accent);
    color: var(--ink);
    font-family: var(--font);
    font-size: 1rem;
    font-weight: 700;
    border: none;
    border-radius: 12px;
    padding: .9rem;
    cursor: pointer;
    transition: all .2s;
  }
  .b2c-submit:hover:not(:disabled) {
    background: #8fffcc;
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(108,255,180,.3);
  }
  .b2c-submit:disabled {
    opacity: .35; cursor: not-allowed;
  }

  /* ── Processing ── */
  .b2c-processing { padding: .5rem 0; }
  .pipeline { display: flex; flex-direction: column; gap: 1rem; }
  .pipeline-step {
    display: flex; align-items: flex-start; gap: 1rem;
    opacity: .4; transition: opacity .3s;
  }
  .pipeline-step.active  { opacity: 1; }
  .pipeline-step.done    { opacity: .65; }
  .step-dot {
    width: 32px; height: 32px; flex-shrink: 0;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: .8rem;
    background: var(--surface);
    color: var(--muted);
    transition: all .3s;
  }
  .pipeline-step.active .step-dot {
    border-color: var(--accent);
    color: var(--accent);
    box-shadow: 0 0 12px rgba(108,255,180,.35);
  }
  .pipeline-step.done .step-dot {
    background: rgba(108,255,180,.15);
    border-color: var(--accent);
    color: var(--accent);
  }
  .step-info { display: flex; flex-direction: column; gap: .2rem; padding-top: .3rem; }
  .step-label { font-weight: 700; font-size: .95rem; }
  .step-detail { color: var(--muted); font-size: .82rem; font-family: var(--mono); }
  .processing-note {
    margin-top: 1.75rem;
    color: var(--muted);
    font-size: .8rem;
    font-family: var(--mono);
    text-align: center;
  }

  /* Spinner */
  .spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(108,255,180,.3);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin .7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Done ── */
  .b2c-done {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; gap: 1rem; padding: 1rem 0;
  }
  .done-icon {
    width: 64px; height: 64px;
    background: rgba(108,255,180,.12);
    border: 2px solid var(--accent);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.6rem; color: var(--accent);
    box-shadow: 0 0 32px rgba(108,255,180,.25);
    animation: popIn .4s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes popIn {
    from { transform: scale(0.4); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .b2c-done h2 { font-size: 1.6rem; font-weight: 800; }
  .b2c-done p  { color: var(--muted); font-size: .9rem; }
  .b2c-done code { color: var(--accent); font-family: var(--mono); }
  .b2c-download {
    display: flex; align-items: center; gap: .6rem;
    background: var(--accent); color: var(--ink);
    font-family: var(--font); font-size: 1rem; font-weight: 700;
    border: none; border-radius: 12px; padding: .85rem 2rem;
    cursor: pointer; transition: all .2s;
    margin-top: .5rem;
  }
  .b2c-download:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(108,255,180,.3);
  }
  .b2c-reset {
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); font-family: var(--font); font-size: .88rem;
    border-radius: 10px; padding: .55rem 1.25rem;
    cursor: pointer; transition: all .2s;
  }
  .b2c-reset:hover { color: var(--text); border-color: rgba(255,255,255,.25); }

  /* ── How it works ── */
  .b2c-how {
    position: relative; z-index: 2;
    width: 100%; max-width: 640px;
    margin-top: 3rem;
  }
  .b2c-how h3 {
    font-size: 1.1rem; font-weight: 700;
    color: var(--muted); text-transform: uppercase;
    letter-spacing: .1em; margin-bottom: 1.25rem;
    font-family: var(--mono);
  }
  .how-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
  .how-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1.25rem;
    display: flex; flex-direction: column; gap: .4rem;
    transition: border-color .2s;
  }
  .how-card:hover { border-color: rgba(108,255,180,.3); }
  .how-icon { font-size: 1.4rem; }
  .how-card strong { font-size: .95rem; font-weight: 700; }
  .how-card p { color: var(--muted); font-size: .82rem; line-height: 1.5; font-family: var(--mono); }

  @media (max-width: 520px) {
    .b2c-card { padding: 1.5rem 1.25rem; }
    .how-grid  { grid-template-columns: 1fr; }
    .b2c-title { font-size: 2.8rem; }
  }
`;
