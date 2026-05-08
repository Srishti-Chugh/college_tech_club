import React from 'react';
import { useLearningProgress } from '../../context/LearningProgressContext';
import type { DsaTrackId } from '../../learning/progressModel';
import { slugFromLeetcodeUrl } from '../../learning/problemSlug';

export function DsaHeroProgressBar({
  done,
  total,
  accent,
  loading,
  variant = 'hero',
}: {
  done: number;
  total: number;
  accent?: string;
  loading?: boolean;
  variant?: 'hero' | 'inline';
}) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const busy = loading === undefined ? false : loading;

  return (
    <div className={`dsa-hero-progress ${variant === 'inline' ? 'dsa-hero-progress--inline' : ''}`}>
      <div className="dsa-hero-progress-bar" aria-hidden>
        <div
          className="dsa-hero-progress-fill"
          style={{
            width: `${pct}%`,
            ...(accent ? { background: `linear-gradient(90deg, ${accent}, #818cf8)` } : {}),
          }}
        />
      </div>
      <div className="dsa-hero-progress-meta">
        <span className="dsa-hero-progress-label">
          {busy ? 'Loading progress…' : `${done} / ${total} problems marked done`}
        </span>
        <PersistenceHint />
      </div>
    </div>
  );
}

function PersistenceHint() {
  const { persistence } = useLearningProgress();
  return (
    <span className="dsa-persist-hint">
      {persistence === 'cloud'
        ? 'Synced to your account'
        : 'Saved on this device — sign in to sync'}
    </span>
  );
}

export function ProblemDoneToggle({
  trackId,
  url,
}: {
  trackId: DsaTrackId;
  url: string;
}) {
  const { isDsaDone, toggleDsaProblem } = useLearningProgress();
  const slug = slugFromLeetcodeUrl(url);
  const done = isDsaDone(trackId, slug);

  return (
    <button
      type="button"
      className={`dsa-done-btn ${done ? 'on' : ''}`}
      aria-pressed={done}
      aria-label={done ? 'Mark problem not done' : 'Mark problem done'}
      title={done ? 'Done — click to undo' : 'Mark as done'}
      onClick={(e) => {
        e.stopPropagation();
        toggleDsaProblem(trackId, slug);
      }}
    >
      {done ? '✓' : '○'}
    </button>
  );
}
