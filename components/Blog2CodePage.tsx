/// <reference types="vite/client" />
import React, { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type InputMode = "url" | "file";
type Stage = "idle" | "uploading" | "processing" | "done" | "error";
type CompLevel = "all" | "beginner" | "intermediate" | "advanced";

interface StageInfo { label: string; detail: string; icon: string; }
interface Competition {
  title: string;
  org: string;
  prize: string;
  deadline: string;
  tags: string[];
  level: "beginner" | "intermediate" | "advanced";
  slug: string;
  desc: string;
  teams: string;
  img: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const STAGES: StageInfo[] = [
  { label: "Parsing Blog",    detail: "Tokenising content, extracting headings & code blocks…",       icon: "◎" },
  { label: "Planning Repo",   detail: "Designing production-ready file & folder structure…",          icon: "⬡" },
  { label: "Analysing Deps",  detail: "Inferring libraries, env configs & architectural patterns…",   icon: "⬢" },
  { label: "Generating Code", detail: "LLM writing each file iteratively with context memory…",       icon: "◈" },
  { label: "Packaging Zip",   detail: "Bundling repository into a downloadable archive…",             icon: "⬟" },
];

const COMPETITIONS: Competition[] = [
  // ── Beginner ────────────────────────────────────────────────────────────────
  {
    title: "Titanic — Machine Learning from Disaster",
    org: "Kaggle",
    prize: "Knowledge",
    deadline: "Ongoing",
    tags: ["Classification", "Binary", "Tabular"],
    level: "beginner",
    slug: "titanic",
    desc: "Use passenger data to predict survival. The canonical first Kaggle competition.",
    teams: "16,000+",
    // Titanic: dramatic ocean/ship at night — matches Kaggle's iceberg imagery
    img: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "House Prices: Advanced Regression",
    org: "Kaggle",
    prize: "Knowledge",
    deadline: "Ongoing",
    tags: ["Regression", "Tabular", "Feature Eng."],
    level: "beginner",
    slug: "house-prices-advanced-regression-techniques",
    desc: "Predict residential home prices with 79 explanatory variables.",
    teams: "5,400+",
    // House Prices: suburban American housing row — matches Kaggle's banner
    img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Digit Recognizer",
    org: "Kaggle",
    prize: "Knowledge",
    deadline: "Ongoing",
    tags: ["CNN", "Computer Vision", "MNIST"],
    level: "beginner",
    slug: "digit-recognizer",
    desc: "Classify handwritten digits using the MNIST dataset. Great intro to CNNs.",
    teams: "3,200+",
    // Digit Recognizer: handwritten numbers / chalk on board
    img: "https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Spaceship Titanic",
    org: "Kaggle",
    prize: "Knowledge",
    deadline: "Ongoing",
    tags: ["Classification", "Feature Eng.", "EDA"],
    level: "beginner",
    slug: "spaceship-titanic",
    desc: "Predict which passengers were transported to an alternate dimension.",
    teams: "2,800+",
    // Spaceship Titanic: deep space / galaxy — matches Kaggle's sci-fi banner
    img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=800&q=80",
  },
  // ── Intermediate ─────────────────────────────────────────────────────────────
  {
    title: "NLP with Disaster Tweets",
    org: "Kaggle",
    prize: "Knowledge",
    deadline: "Ongoing",
    tags: ["NLP", "BERT", "Classification"],
    level: "intermediate",
    slug: "nlp-getting-started",
    desc: "Predict which tweets are about real disasters using NLP techniques.",
    teams: "4,100+",
    // NLP Tweets: wildfire/disaster smoke plume
    img: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Store Sales — Time Series Forecasting",
    org: "Kaggle",
    prize: "Knowledge",
    deadline: "Ongoing",
    tags: ["Time Series", "Forecasting", "Retail"],
    level: "intermediate",
    slug: "store-sales-time-series-forecasting",
    desc: "Forecast store sales across product families using time-series methods.",
    teams: "1,900+",
    // Store Sales: supermarket aisle overhead shot
    img: "https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Feedback Prize — Effective Arguments",
    org: "Kaggle",
    prize: "$60,000",
    deadline: "Archived",
    tags: ["NLP", "Argumentation", "Transformers"],
    level: "intermediate",
    slug: "feedback-prize-effectiveness",
    desc: "Classify argumentative elements in student writing as effective or not.",
    teams: "1,558",
    // Feedback Prize: student writing / pen on paper
    img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Google Brain — Ventilator Pressure",
    org: "Google Brain",
    prize: "$35,000",
    deadline: "Archived",
    tags: ["Time Series", "Regression", "Healthcare"],
    level: "intermediate",
    slug: "ventilator-pressure-prediction",
    desc: "Simulate a breathing circuit and predict airway pressure over time.",
    teams: "2,605",
    // Ventilator: medical ICU / hospital equipment
    img: "https://images.unsplash.com/photo-1530026186672-2cd00ffc50fe?auto=format&fit=crop&w=800&q=80",
  },
  // ── Advanced ──────────────────────────────────────────────────────────────────
  {
    title: "BirdCLEF 2024",
    org: "Cornell Lab",
    prize: "$25,000",
    deadline: "Archived",
    tags: ["Audio", "Multi-label", "Species ID"],
    level: "advanced",
    slug: "birdclef-2024",
    desc: "Identify bird species from soundscape recordings in complex acoustic environments.",
    teams: "952",
    // BirdCLEF: lush rainforest canopy with bird silhouettes
    img: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "RSNA 2023 Abdominal Trauma Detection",
    org: "RSNA",
    prize: "$80,000",
    deadline: "Archived",
    tags: ["Medical Imaging", "Detection", "3D-CNN"],
    level: "advanced",
    slug: "rsna-2023-abdominal-trauma-detection",
    desc: "Detect and classify abdominal traumatic injuries from CT scans.",
    teams: "1,171",
    // RSNA: blue-toned CT scan / medical imaging
    img: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "LLM Science Exam",
    org: "Kaggle",
    prize: "$50,000",
    deadline: "Archived",
    tags: ["LLM", "RAG", "Science QA"],
    level: "advanced",
    slug: "kaggle-llm-science-exam",
    desc: "Answer difficult science questions inspired by the MMLU benchmark.",
    teams: "2,664",
    // LLM Science: library / books stacked — knowledge retrieval
    img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80",
  },
  {
    title: "Stability AI — Stable Diffusion",
    org: "Stability AI",
    prize: "$50,000",
    deadline: "Archived",
    tags: ["Generative AI", "Image", "Diffusion"],
    level: "advanced",
    slug: "stable-diffusion-image-to-prompts",
    desc: "Reverse-engineer Stable Diffusion prompts from generated images.",
    teams: "1,604",
    // Stable Diffusion: abstract colourful AI-art style paint swirls
    img: "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=800&q=80",
  },
];

const LEVEL_META = {
  beginner:     { label: "Beginner",     color: "#4ade80", bg: "rgba(74,222,128,0.10)",  border: "rgba(74,222,128,0.28)"  },
  intermediate: { label: "Intermediate", color: "#facc15", bg: "rgba(250,204,21,0.10)",  border: "rgba(250,204,21,0.28)"  },
  advanced:     { label: "Advanced",     color: "#f87171", bg: "rgba(248,113,113,0.10)", border: "rgba(248,113,113,0.28)" },
};

const TRACK_STATS = [
  { val: "4",   label: "Tools"        },
  { val: "12+", label: "Competitions" },
  { val: "6",   label: "Projects"     },
  { val: "∞",   label: "Datasets"     },
];

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

// ─── Neural net background ────────────────────────────────────────────────────
const NeuralBg: React.FC = () => {
  const nodes = [
    { x: 8,  y: 20 }, { x: 8,  y: 40 }, { x: 8,  y: 60 }, { x: 8,  y: 80 },
    { x: 28, y: 15 }, { x: 28, y: 35 }, { x: 28, y: 55 }, { x: 28, y: 75 }, { x: 28, y: 90 },
    { x: 50, y: 25 }, { x: 50, y: 50 }, { x: 50, y: 75 },
    { x: 72, y: 15 }, { x: 72, y: 35 }, { x: 72, y: 55 }, { x: 72, y: 75 }, { x: 72, y: 90 },
    { x: 92, y: 30 }, { x: 92, y: 50 }, { x: 92, y: 70 },
  ];
  const l1=[0,1,2,3], l2=[4,5,6,7,8], l3=[9,10,11], l4=[12,13,14,15,16], l5=[17,18,19];
  const edges: [number,number][] = [];
  const connect = (la:number[],lb:number[]) => la.forEach(a=>lb.forEach(b=>{ if(Math.abs(nodes[a].y-nodes[b].y)<45) edges.push([a,b]); }));
  connect(l1,l2); connect(l2,l3); connect(l3,l4); connect(l4,l5);
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none"
      style={{ position:"absolute", inset:0, width:"100%", height:"100%", opacity:0.055 }}>
      {edges.map(([a,b],i) => (
        <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y}
          stroke="#a78bfa" strokeWidth="0.15" />
      ))}
      {nodes.map((n,i) => (
        <circle key={i} cx={n.x} cy={n.y} r="0.7"
          fill={i<4?"#facc15":i<9?"#818cf8":i<12?"#a78bfa":i<17?"#818cf8":"#38bdf8"} />
      ))}
    </svg>
  );
};

const PARTICLES = [
  { x:"12%", y:"18%", label:"∇loss",    delay:"0s"   },
  { x:"85%", y:"12%", label:"θ←θ-α∇",  delay:"1.2s" },
  { x:"6%",  y:"72%", label:"sigmoid",  delay:"0.4s" },
  { x:"88%", y:"68%", label:"softmax",  delay:"2s"   },
  { x:"45%", y:"8%",  label:"W·X+b",   delay:"0.8s" },
  { x:"92%", y:"40%", label:"ReLU",     delay:"1.6s" },
  { x:"3%",  y:"45%", label:"epoch",    delay:"3s"   },
  { x:"60%", y:"88%", label:"dropout",  delay:"1.4s" },
  { x:"25%", y:"92%", label:"embed",    delay:"2.4s" },
  { x:"75%", y:"85%", label:"attn",     delay:"0.6s" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Track About Banner */
const TrackBanner: React.FC = () => (
  <section className="ml-banner">
    <div className="ml-banner-inner">
      {/* Left content */}
      <div className="ml-banner-left">
        <div className="ml-banner-eyebrow">
          <span className="ml-banner-dot" />
          GLOBALY · ML TRACK
        </div>
        <h2 className="ml-banner-title">
          Machine<br />
          <span className="ml-banner-title-hl">Learning</span>
        </h2>
        <p className="ml-banner-desc">
          A hands-on curriculum built around real research, open datasets and
          production-grade tooling. From your first gradient descent to
          fine-tuning foundation models — we build things that run.
        </p>
        <div className="ml-banner-pills">
          {["Python", "PyTorch", "Transformers", "Kaggle", "HuggingFace"].map(t => (
            <span key={t} className="ml-banner-pill">{t}</span>
          ))}
        </div>
      </div>

      {/* Right stats */}
      <div className="ml-banner-right">
        <div className="ml-banner-stats">
          {TRACK_STATS.map(s => (
            <div key={s.label} className="ml-banner-stat">
              <span className="ml-banner-stat-val">{s.val}</span>
              <span className="ml-banner-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Level ladder */}
        <div className="ml-banner-ladder">
          {(["beginner","intermediate","advanced"] as const).map((lv,i) => (
            <div key={lv} className="ml-banner-rung" style={{ "--rung-clr": LEVEL_META[lv].color } as React.CSSProperties}>
              <span className="ml-banner-rung-num">0{i+1}</span>
              <div className="ml-banner-rung-bar">
                <div className="ml-banner-rung-fill" style={{ width: `${33+i*30}%` }} />
              </div>
              <span className="ml-banner-rung-name">{LEVEL_META[lv].label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Decorative SVG curves — matches homepage Hero.tsx */}
    <svg className="ml-banner-curves" viewBox="0 0 1000 200" preserveAspectRatio="none">
      <path d="M-100 100 C 200 20 800 180 1100 100" stroke="rgba(250,204,21,0.08)" fill="none" strokeWidth="1.5" />
      <path d="M-100 60 C 300 160 700 40 1100 140" stroke="rgba(79,70,229,0.07)" fill="none" strokeWidth="1" />
    </svg>
  </section>
);

/** Kaggle Competitions Section */
const KaggleSection: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<CompLevel>("all");

  const filtered = activeLevel === "all"
    ? COMPETITIONS
    : COMPETITIONS.filter(c => c.level === activeLevel);

  const counts = {
    all:          COMPETITIONS.length,
    beginner:     COMPETITIONS.filter(c=>c.level==="beginner").length,
    intermediate: COMPETITIONS.filter(c=>c.level==="intermediate").length,
    advanced:     COMPETITIONS.filter(c=>c.level==="advanced").length,
  };

  return (
    <section className="ml-kaggle">
      {/* Section header — matches homepage "Our Tracks" header style */}
      <div className="ml-kaggle-hdr">
        <div className="ml-kaggle-hdr-left">
          <div className="ml-kaggle-eyebrow">
            <span className="ml-kag-dot" />
            Kaggle Competitions
          </div>
          <h2 className="ml-kaggle-title">Compete &amp; Learn</h2>
          <p className="ml-kaggle-sub">
            Curated competitions matched to your level. Click any card to open on Kaggle.
          </p>
        </div>
        <div className="ml-kaggle-meta">
          <span className="ml-kaggle-meta-val">{COMPETITIONS.length}</span>
          <span className="ml-kaggle-meta-label">Curated</span>
        </div>
      </div>

      {/* Level filter — pill row */}
      <div className="ml-kaggle-filters">
        {(["all","beginner","intermediate","advanced"] as CompLevel[]).map(lv => (
          <button
            key={lv}
            className={`ml-kf-btn ${activeLevel === lv ? "active" : ""} ${lv !== "all" ? lv : ""}`}
            onClick={() => setActiveLevel(lv)}
          >
            {lv === "all" ? "All" : LEVEL_META[lv].label}
            <span className="ml-kf-count">{counts[lv]}</span>
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="ml-kaggle-grid">
        {filtered.map(comp => {
          const meta = LEVEL_META[comp.level];
          return (
            <a
              key={comp.slug}
              href={`https://kaggle.com/competitions/${comp.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-comp-card"
            >
              {/* ── Image banner — OurTracks-style card with gradient overlay ── */}
              <div className="ml-comp-img-wrap">
                <img
                  src={comp.img}
                  alt={comp.title}
                  className="ml-comp-img"
                  loading="lazy"
                />
                {/* Gradient overlay — same as OurTracks bg-gradient-to-t from-black/80 */}
                <div className="ml-comp-img-overlay" />

                {/* Level badge floated over image — bottom left */}
                <span className="ml-comp-level-badge" style={{
                  color: meta.color,
                  background: meta.bg,
                  border: `1px solid ${meta.border}`,
                }}>
                  {meta.label}
                </span>

                {/* Prize floated top right */}
                {comp.prize !== "Knowledge" && (
                  <span className="ml-comp-prize-badge" style={{ color: meta.color }}>
                    {comp.prize}
                  </span>
                )}

                {/* Hover arrow — top right */}
                <div className="ml-comp-arrow">
                  <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                    <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </div>
              </div>

              {/* ── Card body ── */}
              <div className="ml-comp-body">
                <div className="ml-comp-top">
                  <span className="ml-comp-org">{comp.org}</span>
                  <span className="ml-comp-meta-item">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <circle cx="6" cy="4" r="2" stroke="currentColor" strokeWidth="1.4"/>
                      <path d="M1 11c0-2.8 2.2-4 5-4s5 1.2 5 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    {comp.teams}
                  </span>
                </div>

                <h3 className="ml-comp-title">{comp.title}</h3>
                <p className="ml-comp-desc">{comp.desc}</p>

                <div className="ml-comp-tags">
                  {comp.tags.map(t => (
                    <span key={t} className="ml-comp-tag">{t}</span>
                  ))}
                </div>

                <div className="ml-comp-footer">
                  <span className="ml-comp-meta-item">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M6 1v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    {comp.deadline}
                  </span>
                  {comp.prize === "Knowledge" && (
                    <span className="ml-comp-knowledge">📚 Knowledge</span>
                  )}
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
};

/** Blog2Code Tool */
const Blog2CodeTool: React.FC = () => {
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
    let i = 0; setStageIdx(0);
    const tick = () => { i++; if (i < STAGES.length) { setStageIdx(i); fakeTimerRef.current = setTimeout(tick, 3200); } else onDone(); };
    fakeTimerRef.current = setTimeout(tick, 3200);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith(".md") || f.name.endsWith(".html"))) {
      setFile(f); setMode("file"); setRepoName(f.name.replace(/\.[^.]+$/, ""));
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
    setStage("uploading"); setStageIdx(0);
    let apiDone=false, progressDone=false, resultBlob:Blob|null=null, apiError="";
    const tryFinish = () => {
      if (apiDone && progressDone) {
        if (apiError) { setStage("error"); setError(apiError); setStageIdx(-1); }
        else { setZipBlob(resultBlob); setStage("done"); setStageIdx(STAGES.length-1); }
      }
    };
    runFakeProgress(() => { progressDone=true; tryFinish(); });
    try {
      setStage("processing");
      resultBlob = await callAPI(mode, mode==="url" ? url : file!);
      apiDone=true; tryFinish();
    } catch(err: unknown) {
      if (fakeTimerRef.current) clearTimeout(fakeTimerRef.current);
      apiError = err instanceof Error ? err.message : "Unexpected error";
      apiDone=true; progressDone=true; tryFinish();
    }
  };

  const handleDownload = () => {
    if (!zipBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(zipBlob);
    a.download = `${repoName}.zip`;
    a.click(); URL.revokeObjectURL(a.href);
  };

  const reset = () => {
    if (fakeTimerRef.current) clearTimeout(fakeTimerRef.current);
    setStage("idle"); setStageIdx(-1); setError(""); setZipBlob(null);
    setUrl(""); setFile(null); setRepoName("generated-repo");
  };

  const isRunning = stage==="uploading"||stage==="processing";
  const canSubmit = !isRunning && (mode==="url" ? url.trim()!=="" : file!==null);

  return (
    <section className="ml-tool-section">
      {/* Section divider header */}
      <div className="ml-section-divider">
        <div className="ml-sd-line" />
        <div className="ml-sd-label">
          <span className="ml-sd-icon">◈</span>
          Tool · Blog2Code
        </div>
        <div className="ml-sd-line" />
      </div>

      {/* Tool header */}
      <div className="ml-tool-header">
        <h2 className="ml-tool-title">
          <span className="ml-word-blog">Blog</span>
          <span className="ml-word-sep">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path d="M6 18h24M22 10l8 8-8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="ml-word-code">Code</span>
        </h2>
        <p className="ml-tool-sub">
          Feed any ML/AI blog article — our LLM agent parses, architects and generates a{" "}
          <span className="ml-hl">full working repo</span>, ready to clone and run.
        </p>

        {/* Pipeline strip */}
        <div className="ml-pipeline-strip">
          {["Input","Tokenise","Plan","Generate","Output"].map((s,i,arr) => (
            <React.Fragment key={s}>
              <div className="ml-strip-node">{s}</div>
              {i < arr.length-1 && <div className="ml-strip-edge" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Card */}
      <div className="ml-card">
        <div className="ml-card-accent" />

        {stage==="idle" || stage==="error" ? (
          <>
            <div className="ml-toggle" role="tablist">
              {(["url","file"] as InputMode[]).map(m => (
                <button key={m} role="tab" aria-selected={mode===m}
                  className={`ml-tab ${mode===m?"active":""}`} onClick={()=>setMode(m)}>
                  {m==="url"
                    ? <><span className="ml-tab-icon">🔗</span> Blog URL</>
                    : <><span className="ml-tab-icon">📄</span> Upload .md</>}
                </button>
              ))}
            </div>

            {mode==="url" ? (
              <div className="ml-input-wrap">
                <span className="ml-input-prefix">url://</span>
                <input className="ml-input" type="url"
                  placeholder="towardsdatascience.com/your-article"
                  value={url} onChange={e=>setUrl(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&canSubmit&&handleSubmit()} />
              </div>
            ) : (
              <div className={`ml-drop ${file?"filled":""}`}
                onDrop={handleDrop} onDragOver={e=>e.preventDefault()}
                onClick={()=>fileRef.current?.click()}>
                <input ref={fileRef} type="file" accept=".md,.html"
                  style={{display:"none"}} onChange={handleFileChange} />
                {file ? (
                  <div className="ml-drop-file">
                    <span className="ml-drop-file-icon">◈</span>
                    <div>
                      <div className="ml-drop-file-name">{file.name}</div>
                      <div className="ml-drop-file-meta">{(file.size/1024).toFixed(1)} KB · ready to process</div>
                    </div>
                  </div>
                ) : (
                  <div className="ml-drop-empty">
                    <div className="ml-drop-icon">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path d="M12 3v12M7 8l5-5 5 5M5 19h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
                  <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 5v4M8 11v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <button className="ml-submit" disabled={!canSubmit} onClick={handleSubmit}>
              <span>Generate Repository</span>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </>

        ) : stage==="done" ? (
          <div className="ml-done">
            <div className="ml-done-ring">
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                <path d="M8 19l8 8 14-16" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="ml-done-title">Repository Generated</h2>
            <p className="ml-done-sub">Your repo has been packaged as a <code>.zip</code> and is ready to download.</p>
            <button className="ml-download" onClick={handleDownload}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M9 3v9M5 8l4 4 4-4M3 14h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
              {STAGES.map((s,i) => {
                const status = i<stageIdx?"done":i===stageIdx?"active":"pending";
                return (
                  <div key={i} className={`ml-step ${status}`}>
                    <div className="ml-step-left">
                      <div className={`ml-step-node ${status}`}>
                        {status==="done"
                          ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                          : status==="active"
                            ? <span className="ml-spin" />
                            : <span className="ml-step-num">{i+1}</span>}
                      </div>
                      {i<STAGES.length-1 && <div className={`ml-step-line ${status==="done"?"done":""}`} />}
                    </div>
                    <div className="ml-step-content">
                      <div className="ml-step-name">
                        <span className="ml-step-icon">{s.icon}</span>{s.label}
                      </div>
                      {status==="active" && <div className="ml-step-detail">{s.detail}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="ml-proc-eta">Inference time: ~30–90 seconds depending on article length</p>
          </div>
        )}
      </div>

      {/* How it works */}
      {stage==="idle" && (
        <div className="ml-how">
          <div className="ml-how-header">
            <div className="ml-how-line" />
            <span>Architecture</span>
            <div className="ml-how-line" />
          </div>
          <div className="ml-how-grid">
            {[
              { icon:"◉", label:"01", title:"Parse",    desc:"Tokenises the blog — extracts title, body, headings and inline code blocks" },
              { icon:"⬡", label:"02", title:"Plan",     desc:"Designs production-ready folder structure based on detected tech stack" },
              { icon:"⬢", label:"03", title:"Analyse",  desc:"Infers pip/npm dependencies, env vars and architectural patterns" },
              { icon:"◈", label:"04", title:"Generate", desc:"LLM writes every file with full context of the plan and prior files" },
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
        </div>
      )}
    </section>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function MLTrackPage() {
  return (
    <div className="ml-root">

      {/* Ambient background */}
      <div className="ml-bg" aria-hidden>
        <NeuralBg />
        <div className="ml-mesh" />
        {PARTICLES.map((p,i) => (
          <span key={i} className="ml-particle"
            style={{ left:p.x, top:p.y, animationDelay:p.delay }}>
            {p.label}
          </span>
        ))}
        <div className="ml-scanline" />
      </div>

      {/* Back */}
      <a href="/" className="ml-back">
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Home
      </a>

      {/* ① Track Banner */}
      <TrackBanner />

      {/* ② Blog2Code Tool */}
      <Blog2CodeTool />

      {/* ③ Kaggle Competitions */}
      <KaggleSection />

      <style>{CSS}</style>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&family=Outfit:wght@700;800;900&display=swap');

  :root {
    --bg       : #03050e;
    --surface  : #080d1a;
    --card-bg  : #0b1120;
    --border   : rgba(120,140,255,0.12);
    --border-h : rgba(120,140,255,0.28);
    --violet   : #7c6fff;
    --sky      : #38bdf8;
    --emerald  : #34d399;
    --amber    : #facc15;
    --red      : #f87171;
    --green    : #4ade80;
    --muted    : rgba(148,163,184,0.6);
    --text     : rgba(226,232,240,0.92);
    --mono     : 'IBM Plex Mono', monospace;
    --sans     : 'IBM Plex Sans', sans-serif;
    --display  : 'Outfit', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── Root ── */
  .ml-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--sans);
    display: flex; flex-direction: column; align-items: center;
    padding: 0 1.25rem 6rem;
    position: relative; overflow-x: hidden;
  }

  /* ── Ambient BG ── */
  .ml-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
  .ml-mesh {
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 15% 20%, rgba(250,204,21,.07) 0%, transparent 60%),
      radial-gradient(ellipse 50% 60% at 85% 75%, rgba(56,189,248,.07) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(124,111,255,.04) 0%, transparent 70%);
  }
  .ml-particle {
    position: absolute;
    font-family: var(--mono); font-size: .6rem;
    color: rgba(124,111,255,.3);
    animation: float-up 8s ease-in-out infinite alternate;
    white-space: nowrap; pointer-events: none;
  }
  @keyframes float-up {
    0%   { transform: translateY(0) translateX(0); opacity:.25; }
    50%  { opacity:.55; }
    100% { transform: translateY(-18px) translateX(6px); opacity:.15; }
  }
  .ml-scanline {
    position: absolute; inset: 0;
    background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,.06) 3px, rgba(0,0,0,.06) 4px);
  }

  /* ── Back button — matches shared.css pill style ── */
  .ml-back {
    position: relative; z-index: 2;
    align-self: flex-start; margin-top: 1.6rem;
    display: inline-flex; align-items: center; gap: .45rem;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 100px; padding: .42rem 1rem;
    font-family: var(--display); font-size: .68rem; font-weight: 800;
    letter-spacing: .14em; text-transform: uppercase;
    color: rgba(255,255,255,.5); text-decoration: none;
    transition: all .2s;
  }
  .ml-back:hover { color: #fff; background: rgba(255,255,255,.1); border-color: rgba(255,255,255,.24); }

  /* ═══════════════════════════════════════════════
     TRACK BANNER
  ═══════════════════════════════════════════════ */
  .ml-banner {
    position: relative; z-index: 2;
    width: 100%; max-width: 900px;
    margin-top: 2rem;
    /* Stacked card shadow — homepage Hero.tsx motif */
    background: rgba(250,204,21,.04);
    border: 1px solid rgba(250,204,21,.15);
    border-radius: 24px;
    padding: 2.75rem 2.5rem;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(250,204,21,.05),
      0 24px 64px rgba(0,0,0,.55);
  }

  /* Rotated backer card — mirrors Hero.tsx yellow backer */
  .ml-banner::before {
    content: '';
    position: absolute; inset: -12px;
    background: rgba(250,204,21,.03);
    border: 1px solid rgba(250,204,21,.08);
    border-radius: 28px;
    transform: rotate(-1.2deg);
    z-index: -1;
  }

  .ml-banner-curves {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 100%; width: 100%;
    pointer-events: none; opacity: 1;
  }

  .ml-banner-inner {
    display: flex; gap: 3rem; align-items: flex-start; flex-wrap: wrap;
    position: relative; z-index: 1;
  }

  .ml-banner-left { flex: 1; min-width: 260px; }

  .ml-banner-eyebrow {
    display: inline-flex; align-items: center; gap: .5rem;
    font-family: var(--display); font-size: .62rem; font-weight: 800;
    letter-spacing: .22em; text-transform: uppercase;
    color: var(--amber);
    background: rgba(250,204,21,.1);
    border: 1px solid rgba(250,204,21,.25);
    border-radius: 100px; padding: .28rem 1rem;
    margin-bottom: 1.25rem;
  }

  .ml-banner-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--amber);
    box-shadow: 0 0 6px var(--amber);
    animation: pulse-dot 2s ease-in-out infinite;
    flex-shrink: 0;
  }

  /* Big editorial title — Outfit 900, matches homepage h2 style */
  .ml-banner-title {
    font-family: var(--display);
    font-size: clamp(3rem, 6vw, 4.5rem);
    font-weight: 900; line-height: .92;
    letter-spacing: -.04em; text-transform: uppercase;
    color: rgba(255,255,255,.95);
    margin-bottom: 1.2rem;
  }
  .ml-banner-title-hl {
    /* gradient text — matches page title treatment */
    background: linear-gradient(135deg, var(--amber) 0%, #fb923c 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .ml-banner-desc {
    font-family: var(--sans); font-size: .88rem; line-height: 1.8;
    color: var(--muted); max-width: 400px; margin-bottom: 1.5rem;
  }

  .ml-banner-pills { display: flex; gap: .45rem; flex-wrap: wrap; }
  .ml-banner-pill {
    font-family: var(--mono); font-size: .65rem;
    color: rgba(255,255,255,.45);
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.09);
    border-radius: 100px; padding: .25rem .7rem;
    transition: all .2s;
  }
  .ml-banner-pill:hover { color: var(--amber); border-color: rgba(250,204,21,.28); }

  .ml-banner-right { display: flex; flex-direction: column; gap: 1.75rem; }

  /* Stats grid — matches homepage metadata row */
  .ml-banner-stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: .6rem;
  }
  .ml-banner-stat {
    display: flex; flex-direction: column; align-items: center;
    background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 16px; padding: .85rem 1.25rem;
    transition: border-color .2s;
  }
  .ml-banner-stat:hover { border-color: rgba(250,204,21,.25); }
  .ml-banner-stat-val {
    font-family: var(--display); font-size: 1.8rem;
    font-weight: 900; letter-spacing: -.04em; color: var(--amber);
  }
  .ml-banner-stat-label {
    font-family: var(--display); font-size: .6rem;
    font-weight: 800; letter-spacing: .16em; text-transform: uppercase;
    color: rgba(255,255,255,.3); margin-top: .15rem;
  }

  /* Level ladder */
  .ml-banner-ladder { display: flex; flex-direction: column; gap: .7rem; min-width: 220px; }
  .ml-banner-rung { display: flex; align-items: center; gap: .7rem; }
  .ml-banner-rung-num {
    font-family: var(--mono); font-size: .6rem; color: rgba(255,255,255,.25);
    min-width: 20px;
  }
  .ml-banner-rung-bar {
    flex: 1; height: 4px; background: rgba(255,255,255,.07); border-radius: 100px; overflow: hidden;
  }
  .ml-banner-rung-fill {
    height: 100%; border-radius: 100px;
    background: var(--rung-clr);
    opacity: .75;
    transition: width .6s cubic-bezier(.34,1.56,.64,1);
  }
  .ml-banner-rung-name {
    font-family: var(--display); font-size: .65rem; font-weight: 800;
    letter-spacing: .1em; text-transform: uppercase;
    color: var(--rung-clr); min-width: 90px;
  }

  /* ═══════════════════════════════════════════════
     SECTION DIVIDER
  ═══════════════════════════════════════════════ */
  .ml-section-divider {
    display: flex; align-items: center; gap: .75rem;
    width: 100%; max-width: 900px;
    margin: 3.5rem 0 0;
    position: relative; z-index: 2;
  }
  .ml-sd-line { flex: 1; height: 1px; background: rgba(255,255,255,.07); }
  .ml-sd-label {
    display: flex; align-items: center; gap: .45rem;
    font-family: var(--display); font-size: .62rem; font-weight: 800;
    letter-spacing: .2em; text-transform: uppercase;
    color: rgba(255,255,255,.25);
  }
  .ml-sd-icon { color: var(--violet); font-size: .75rem; }

  /* ═══════════════════════════════════════════════
     TOOL SECTION
  ═══════════════════════════════════════════════ */
  .ml-tool-section {
    position: relative; z-index: 2;
    width: 100%; max-width: 900px;
    display: flex; flex-direction: column; align-items: center;
  }

  .ml-tool-header {
    text-align: center; margin-top: 2rem; margin-bottom: 0;
    max-width: 640px; width: 100%;
  }

  .ml-tool-title {
    font-family: var(--mono);
    font-size: clamp(2.6rem, 7vw, 4.5rem);
    font-weight: 600; line-height: 1; letter-spacing: -.03em;
    display: flex; align-items: center; justify-content: center;
    gap: .25em; flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .ml-word-blog  { color: var(--sky); }
  .ml-word-sep   { color: rgba(148,163,184,.3); display:flex; align-items:center; animation: sep-pulse 3s ease-in-out infinite; }
  .ml-word-code  { color: var(--emerald); }
  @keyframes sep-pulse { 0%,100%{color:rgba(148,163,184,.2)} 50%{color:rgba(124,111,255,.7)} }

  .ml-tool-sub {
    color: var(--muted); font-size: .88rem; line-height: 1.8; font-family: var(--mono);
    margin-bottom: 1.5rem;
  }
  .ml-hl { color: var(--violet); border-bottom: 1px dashed rgba(124,111,255,.4); padding-bottom: 1px; }

  /* Pipeline strip */
  .ml-pipeline-strip {
    display: flex; align-items: center; justify-content: center;
    gap: 0; margin-bottom: 0; flex-wrap: wrap; row-gap: .5rem;
  }
  .ml-strip-node {
    font-family: var(--mono); font-size: .65rem; font-weight: 500;
    color: rgba(148,163,184,.45); background: rgba(255,255,255,.04);
    border: 1px solid rgba(255,255,255,.07); border-radius: 4px;
    padding: .28rem .65rem; white-space: nowrap;
  }
  .ml-strip-edge {
    width: 22px; height: 1px;
    background: linear-gradient(90deg, rgba(124,111,255,.2), rgba(56,189,248,.2));
    flex-shrink: 0; position: relative;
  }
  .ml-strip-edge::after {
    content:''; position:absolute; right:0; top:-3px;
    border-left:5px solid rgba(56,189,248,.3);
    border-top:3px solid transparent; border-bottom:3px solid transparent;
  }

  /* ── Main Card ── */
  .ml-card {
    position: relative; z-index: 2;
    width: 100%; max-width: 640px;
    margin-top: 2rem;
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 2.25rem;
    box-shadow: 0 0 0 1px rgba(124,111,255,.04), 0 24px 60px rgba(0,0,0,.6);
    overflow: hidden;
  }
  .ml-card-accent {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--amber), var(--violet), var(--emerald));
  }

  /* Toggle */
  .ml-toggle {
    display: flex; gap: 2px;
    background: rgba(0,0,0,.4);
    border: 1px solid var(--border);
    border-radius: 100px; padding: 3px;
    margin-bottom: 1.5rem;
  }
  .ml-tab {
    flex: 1; background: transparent; border: none;
    color: var(--muted); font-family: var(--mono); font-size: .8rem;
    padding: .58rem; border-radius: 100px; cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: .4rem;
    transition: all .2s;
  }
  .ml-tab-icon { font-size: .95rem; }
  .ml-tab.active { background: rgba(124,111,255,.15); color: var(--violet); border: 1px solid rgba(124,111,255,.25); }
  .ml-tab:hover:not(.active) { color: var(--text); }

  /* URL input */
  .ml-input-wrap {
    display: flex; align-items: center;
    background: rgba(0,0,0,.4); border: 1px solid var(--border);
    border-radius: 12px; margin-bottom: 1.25rem; transition: border-color .2s;
  }
  .ml-input-wrap:focus-within { border-color: var(--violet); box-shadow: 0 0 0 3px rgba(124,111,255,.08); }
  .ml-input-prefix {
    font-family: var(--mono); font-size: .75rem; font-weight: 500;
    color: var(--violet); padding: 0 .85rem;
    border-right: 1px solid var(--border); white-space: nowrap; opacity: .7;
  }
  .ml-input {
    flex: 1; background: transparent; border: none;
    color: var(--text); font-family: var(--mono); font-size: .84rem;
    padding: .85rem .9rem; outline: none;
  }
  .ml-input::placeholder { color: rgba(148,163,184,.28); }

  /* Dropzone */
  .ml-drop {
    border: 1px dashed rgba(124,111,255,.22);
    border-radius: 16px; padding: 2.25rem 1.5rem;
    text-align: center; cursor: pointer;
    transition: all .2s; margin-bottom: 1.25rem;
    background: rgba(124,111,255,.02);
  }
  .ml-drop:hover,.ml-drop.filled { border-color: var(--violet); background: rgba(124,111,255,.06); }
  .ml-drop-empty { display: flex; flex-direction: column; align-items: center; gap: .55rem; }
  .ml-drop-icon { color: rgba(124,111,255,.45); }
  .ml-drop-empty p { color: var(--muted); font-family: var(--mono); font-size: .82rem; }
  .ml-drop-empty code { color: var(--violet); }
  .ml-drop-sub { font-size: .72rem; opacity: .6; }
  .ml-drop-file { display: flex; align-items: center; gap: .85rem; font-family: var(--mono); }
  .ml-drop-file-icon { font-size: 1.5rem; color: var(--violet); }
  .ml-drop-file-name { font-size: .9rem; font-weight: 500; color: var(--violet); }
  .ml-drop-file-meta { font-size: .72rem; color: var(--muted); margin-top: .18rem; }

  /* Error */
  .ml-error {
    display: flex; align-items: center; gap: .5rem;
    color: var(--red); font-family: var(--mono); font-size: .8rem;
    margin-bottom: 1rem; padding: .65rem .9rem;
    background: rgba(248,113,113,.07); border: 1px solid rgba(248,113,113,.2); border-radius: 10px;
  }

  /* Submit */
  .ml-submit {
    width: 100%;
    display: flex; align-items: center; justify-content: center; gap: .6rem;
    background: linear-gradient(135deg, var(--violet), #6366f1);
    color: #fff; font-family: var(--display); font-size: .88rem; font-weight: 800;
    letter-spacing: .06em; text-transform: uppercase;
    border: none; border-radius: 100px; padding: .9rem;
    cursor: pointer; transition: all .2s;
  }
  .ml-submit:hover:not(:disabled) {
    background: linear-gradient(135deg, #9180ff, #818cf8);
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(124,111,255,.3);
  }
  .ml-submit:disabled { opacity: .3; cursor: not-allowed; }

  /* Processing */
  .ml-processing { display: flex; flex-direction: column; gap: 0; }
  .ml-proc-label {
    display: flex; align-items: center; gap: .6rem;
    font-family: var(--display); font-size: .62rem; font-weight: 800;
    letter-spacing: .18em; text-transform: uppercase; color: var(--muted);
    margin-bottom: 1.5rem;
  }
  .ml-proc-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--violet);
    animation: pulse-dot 1.5s ease-in-out infinite;
  }
  @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.45;transform:scale(.72)} }

  .ml-steps { display: flex; flex-direction: column; }
  .ml-step { display: flex; gap: 1rem; opacity: .3; transition: opacity .35s; }
  .ml-step.active { opacity: 1; }
  .ml-step.done   { opacity: .6; }
  .ml-step-left { display: flex; flex-direction: column; align-items: center; }
  .ml-step-node {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: rgba(0,0,0,.5); border: 1.5px solid rgba(255,255,255,.14);
    display: flex; align-items: center; justify-content: center;
    font-family: var(--mono); font-size: .72rem; color: var(--muted);
    transition: all .3s;
  }
  .ml-step-node.active { border-color: var(--violet); color: var(--violet); box-shadow: 0 0 12px rgba(124,111,255,.4); }
  .ml-step-node.done   { border-color: var(--emerald); color: var(--emerald); background: rgba(52,211,153,.1); }
  .ml-step-num { font-size: .7rem; color: rgba(255,255,255,.22); }
  .ml-step-line { flex: 1; width: 1px; background: rgba(255,255,255,.07); min-height: 20px; margin: 3px 0; transition: background .4s; }
  .ml-step-line.done { background: rgba(52,211,153,.28); }
  .ml-step-content { padding-top: .3rem; padding-bottom: 1rem; }
  .ml-step-name { display: flex; align-items: center; gap: .45rem; font-size: .88rem; font-weight: 600; font-family: var(--sans); }
  .ml-step-icon { font-family: var(--mono); font-size: .78rem; color: var(--violet); opacity: .7; }
  .ml-step-detail { font-family: var(--mono); font-size: .74rem; color: var(--muted); margin-top: .28rem; line-height: 1.6; }
  .ml-spin { display: inline-block; width: 12px; height: 12px; border: 1.5px solid rgba(124,111,255,.22); border-top-color: var(--violet); border-radius: 50%; animation: spin .7s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ml-proc-eta { font-family: var(--mono); font-size: .72rem; color: rgba(148,163,184,.32); text-align: center; margin-top: .75rem; }

  /* Done */
  .ml-done { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; padding: .75rem 0; }
  .ml-done-ring {
    width: 68px; height: 68px; border-radius: 50%;
    border: 2px solid var(--emerald);
    background: rgba(52,211,153,.08);
    display: flex; align-items: center; justify-content: center; color: var(--emerald);
    box-shadow: 0 0 24px rgba(52,211,153,.2), inset 0 0 20px rgba(52,211,153,.05);
    animation: pop-in .45s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes pop-in { from{transform:scale(.3);opacity:0} to{transform:scale(1);opacity:1} }
  .ml-done-title { font-family: var(--display); font-size: 1.5rem; font-weight: 900; letter-spacing: -.03em; text-transform: uppercase; }
  .ml-done-sub   { color: var(--muted); font-family: var(--mono); font-size: .8rem; line-height: 1.75; }
  .ml-done-sub code { color: var(--emerald); }
  .ml-download {
    display: flex; align-items: center; gap: .6rem;
    background: rgba(52,211,153,.12); color: var(--emerald);
    font-family: var(--display); font-size: .82rem; font-weight: 800;
    letter-spacing: .08em; text-transform: uppercase;
    border: 1px solid rgba(52,211,153,.32); border-radius: 100px;
    padding: .8rem 2rem; cursor: pointer; transition: all .2s;
  }
  .ml-download:hover { background: rgba(52,211,153,.18); box-shadow: 0 6px 24px rgba(52,211,153,.18); transform: translateY(-1px); }
  .ml-retry {
    background: transparent; border: 1px solid var(--border);
    color: var(--muted); font-family: var(--mono); font-size: .8rem;
    border-radius: 100px; padding: .5rem 1.4rem; cursor: pointer; transition: all .2s;
  }
  .ml-retry:hover { color: var(--text); border-color: var(--border-h); }

  /* How it works */
  .ml-how { position: relative; z-index: 2; width: 100%; max-width: 640px; margin-top: 2.5rem; }
  .ml-how-header {
    display: flex; align-items: center; gap: .8rem; margin-bottom: 1.25rem;
    font-family: var(--display); font-size: .6rem; font-weight: 800;
    letter-spacing: .2em; text-transform: uppercase; color: rgba(148,163,184,.3);
  }
  .ml-how-line { flex: 1; height: 1px; background: rgba(255,255,255,.07); }
  .ml-how-grid { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .ml-how-card {
    background: var(--card-bg); border: 1px solid var(--border);
    border-radius: 16px; padding: 1.1rem;
    display: flex; flex-direction: column; gap: .5rem;
    transition: border-color .2s, transform .2s;
    position: relative; overflow: hidden;
  }
  .ml-how-card:hover { border-color: rgba(124,111,255,.3); transform: translateY(-2px); }
  .ml-how-card::before {
    content:''; position:absolute; top:0; left:0; right:0; height:1px;
    background: linear-gradient(90deg, transparent, rgba(124,111,255,.3), transparent);
    opacity: 0; transition: opacity .2s;
  }
  .ml-how-card:hover::before { opacity: 1; }
  .ml-how-card-top { display: flex; justify-content: space-between; align-items: center; }
  .ml-how-num  { font-family: var(--mono); font-size: .62rem; color: rgba(124,111,255,.4); }
  .ml-how-node { font-family: var(--mono); font-size: 1.1rem; color: rgba(124,111,255,.5); }
  .ml-how-card-title { font-family: var(--display); font-size: .88rem; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; }
  .ml-how-card-desc  { color: var(--muted); font-family: var(--mono); font-size: .73rem; line-height: 1.65; }

  /* ═══════════════════════════════════════════════
     KAGGLE SECTION
  ═══════════════════════════════════════════════ */
  .ml-kaggle {
    position: relative; z-index: 2;
    width: 100%; max-width: 900px;
    margin-top: 4rem;
  }

  /* Section header — matches homepage "Our Tracks" layout */
  .ml-kaggle-hdr {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 1rem; margin-bottom: 1.75rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(255,255,255,.07);
  }
  .ml-kaggle-hdr-left { flex: 1; }

  .ml-kaggle-eyebrow {
    display: inline-flex; align-items: center; gap: .45rem;
    font-family: var(--display); font-size: .62rem; font-weight: 800;
    letter-spacing: .22em; text-transform: uppercase; color: var(--amber);
    background: rgba(250,204,21,.08); border: 1px solid rgba(250,204,21,.22);
    border-radius: 100px; padding: .28rem 1rem; margin-bottom: .9rem;
  }

  .ml-kag-dot {
    width: 5px; height: 5px; border-radius: 50%; background: var(--amber); flex-shrink: 0;
  }

  /* Big section title — Outfit 900 uppercase, homepage h2 style */
  .ml-kaggle-title {
    font-family: var(--display);
    font-size: clamp(2rem, 5vw, 3.2rem);
    font-weight: 900; letter-spacing: -.04em; text-transform: uppercase;
    color: rgba(255,255,255,.95); line-height: .95; margin-bottom: .65rem;
  }

  .ml-kaggle-sub {
    font-family: var(--sans); font-size: .82rem; color: var(--muted); line-height: 1.7;
  }

  .ml-kaggle-meta {
    display: flex; flex-direction: column; align-items: flex-end; gap: .1rem; flex-shrink: 0;
    padding-top: .3rem;
  }
  .ml-kaggle-meta-val {
    font-family: var(--display); font-size: 3rem; font-weight: 900;
    letter-spacing: -.05em; color: rgba(255,255,255,.12); line-height: 1;
  }
  .ml-kaggle-meta-label {
    font-family: var(--display); font-size: .58rem; font-weight: 800;
    letter-spacing: .2em; text-transform: uppercase; color: rgba(255,255,255,.2);
  }

  /* ── Filters — pill row ── */
  .ml-kaggle-filters {
    display: flex; gap: .4rem; flex-wrap: wrap;
    background: rgba(0,0,0,.4);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 100px; padding: .35rem;
    margin-bottom: 1.75rem; width: fit-content;
  }

  .ml-kf-btn {
    display: flex; align-items: center; gap: .45rem;
    background: transparent; border: 1px solid transparent;
    border-radius: 100px; padding: .44rem 1rem;
    font-family: var(--display); font-size: .68rem; font-weight: 800;
    letter-spacing: .1em; text-transform: uppercase;
    color: rgba(255,255,255,.35); cursor: pointer; transition: all .2s;
    white-space: nowrap;
  }
  .ml-kf-btn:hover { color: rgba(255,255,255,.75); }

  .ml-kf-btn.active {
    background: rgba(255,255,255,.08);
    border-color: rgba(255,255,255,.14);
    color: #fff;
  }
  .ml-kf-btn.active.beginner {
    background: rgba(74,222,128,.1); border-color: rgba(74,222,128,.28); color: var(--green);
  }
  .ml-kf-btn.active.intermediate {
    background: rgba(250,204,21,.1); border-color: rgba(250,204,21,.28); color: var(--amber);
  }
  .ml-kf-btn.active.advanced {
    background: rgba(248,113,113,.1); border-color: rgba(248,113,113,.28); color: var(--red);
  }

  .ml-kf-count {
    background: rgba(255,255,255,.1); border-radius: 100px;
    font-size: .6rem; padding: .04rem .42rem; min-width: 18px; text-align: center;
  }

  /* ── Competition Grid ── */
  .ml-kaggle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
    gap: 1rem;
  }

  /* Competition card — image-first, OurTracks-style */
  .ml-comp-card {
    position: relative;
    background: var(--card-bg);
    border: 1px solid rgba(255,255,255,.08);
    border-radius: 20px;
    text-decoration: none; color: inherit;
    display: flex; flex-direction: column;
    overflow: hidden;
    transition: border-color .22s, transform .22s, box-shadow .22s;
    cursor: pointer;
  }
  .ml-comp-card:hover {
    border-color: rgba(255,255,255,.2);
    transform: translateY(-4px);
    box-shadow: 0 16px 48px rgba(0,0,0,.5);
  }

  /* Image banner — same proportions as OurTracks h-80 */
  .ml-comp-img-wrap {
    position: relative;
    width: 100%;
    height: 170px;
    overflow: hidden;
    flex-shrink: 0;
  }
  .ml-comp-img {
    width: 100%; height: 100%;
    object-fit: cover;
    transition: transform .7s cubic-bezier(.25,.46,.45,.94);
    display: block;
  }
  .ml-comp-card:hover .ml-comp-img {
    transform: scale(1.07);
  }

  /* Gradient overlay — bg-gradient-to-t from-black/80 (OurTracks) */
  .ml-comp-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(11,17,32,0.95) 0%,
      rgba(11,17,32,0.55) 45%,
      rgba(11,17,32,0.15) 100%
    );
  }

  /* Level badge — bottom-left over image */
  .ml-comp-level-badge {
    position: absolute; bottom: .75rem; left: .85rem;
    font-family: var(--display); font-size: .58rem; font-weight: 800;
    letter-spacing: .16em; text-transform: uppercase;
    border-radius: 100px; padding: .2rem .65rem;
    backdrop-filter: blur(6px);
  }

  /* Prize badge — top-right corner over image */
  .ml-comp-prize-badge {
    position: absolute; top: .75rem; right: .85rem;
    font-family: var(--display); font-size: .75rem; font-weight: 900;
    letter-spacing: -.01em;
    text-shadow: 0 1px 8px rgba(0,0,0,.6);
  }

  /* Hover arrow — top right, appears on hover */
  .ml-comp-arrow {
    position: absolute; top: .75rem; left: .85rem;
    width: 28px; height: 28px; border-radius: 50%;
    background: rgba(0,0,0,.5); backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,.15);
    display: flex; align-items: center; justify-content: center;
    color: rgba(255,255,255,.5);
    opacity: 0;
    transition: opacity .22s, color .22s, transform .22s;
  }
  .ml-comp-card:hover .ml-comp-arrow {
    opacity: 1;
    color: #fff;
    transform: translate(2px,-2px);
  }

  /* Card body — below image */
  .ml-comp-body {
    display: flex; flex-direction: column; gap: .6rem;
    padding: 1rem 1.1rem 1.1rem;
    flex: 1;
  }

  .ml-comp-top {
    display: flex; align-items: center; justify-content: space-between;
  }

  .ml-comp-org {
    font-family: var(--mono); font-size: .62rem;
    color: rgba(255,255,255,.28); letter-spacing: .04em;
  }

  .ml-comp-title {
    font-family: var(--display); font-size: .92rem; font-weight: 800;
    letter-spacing: -.01em; line-height: 1.32;
    color: rgba(255,255,255,.9);
  }

  .ml-comp-desc {
    font-family: var(--sans); font-size: .76rem; line-height: 1.65;
    color: var(--muted);
    flex: 1;
  }

  .ml-comp-tags { display: flex; gap: .32rem; flex-wrap: wrap; }
  .ml-comp-tag {
    font-family: var(--mono); font-size: .58rem;
    color: rgba(255,255,255,.32);
    background: rgba(255,255,255,.05);
    border: 1px solid rgba(255,255,255,.07);
    border-radius: 100px; padding: .16rem .52rem;
    transition: all .18s;
  }
  .ml-comp-card:hover .ml-comp-tag {
    color: rgba(255,255,255,.55); border-color: rgba(255,255,255,.14);
  }

  .ml-comp-footer {
    display: flex; justify-content: space-between; align-items: center;
    padding-top: .6rem; border-top: 1px solid rgba(255,255,255,.05);
    margin-top: auto;
  }

  .ml-comp-meta-item {
    display: flex; align-items: center; gap: .32rem;
    font-family: var(--mono); font-size: .62rem;
    color: rgba(255,255,255,.28);
  }

  .ml-comp-knowledge {
    font-family: var(--display); font-size: .62rem; font-weight: 700;
    color: rgba(255,255,255,.28); letter-spacing: .04em;
  }

  /* ── Responsive ── */
  @media (max-width: 680px) {
    .ml-banner { padding: 1.75rem 1.25rem; }
    .ml-banner-inner { flex-direction: column; gap: 1.75rem; }
    .ml-kaggle-grid { grid-template-columns: 1fr; }
    .ml-how-grid { grid-template-columns: 1fr; }
    .ml-card { border-radius: 16px; padding: 1.5rem 1.1rem; }
    .ml-tool-title { font-size: 2.4rem; }
    .ml-pipeline-strip { display: none; }
    .ml-kaggle-filters { border-radius: 16px; }
    .ml-banner-title { font-size: 2.6rem; }
  }
`;