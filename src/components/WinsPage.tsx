import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Loader2, MessageCircle, Shield, Trash2, EyeOff } from 'lucide-react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useIsAdmin } from '../hooks/useIsAdmin';

const POSTS_COLL = 'wins_posts';
const POST_MAX = 2000;
const COMMENT_MAX = 1000;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatWhen(ts: Timestamp | null | undefined): string {
  if (!ts?.toDate) return '';
  try {
    return ts.toDate().toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch { return ''; }
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const safe = local.length <= 2 ? `${local[0] ?? ''}••` : `${local.slice(0, 2)}••`;
  return `${safe}@${domain}`;
}

function compareCommentTime(a: WinComment, b: WinComment): number {
  let ta = 0, tb = 0;
  try {
    ta = a.createdAt?.toMillis?.() ?? 0;
    tb = b.createdAt?.toMillis?.() ?? 0;
  } catch {
    ta = (a.createdAt as Timestamp | null)?.seconds ?? 0;
    tb = (b.createdAt as Timestamp | null)?.seconds ?? 0;
  }
  if (ta !== tb) return ta - tb;
  return a.id.localeCompare(b.id);
}

// Returns "June 2026" style key for a post
function monthKey(ts: Timestamp | null | undefined): string {
  if (!ts?.toDate) return 'Unknown';
  try {
    return ts.toDate().toLocaleString('en', { month: 'long', year: 'numeric' });
  } catch { return 'Unknown'; }
}

// ─── Types ────────────────────────────────────────────────────────────────────
type WinPost = {
  id: string;
  authorUid: string;
  authorEmail: string;
  body: string;
  hidden: boolean;
  createdAt: Timestamp | null;
};

type WinComment = {
  id: string;
  authorUid: string;
  authorEmail: string;
  body: string;
  hidden: boolean;
  createdAt: Timestamp | null;
};

// ─── CommentsPanel — unchanged logic, restyled for light bg ──────────────────
const CommentsPanel: React.FC<{
  postId: string;
  postHidden: boolean;
  isAdmin: boolean;
}> = ({ postId, postHidden, isAdmin }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<WinComment[]>([]);
  const [commentsErr, setCommentsErr] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (postHidden && !isAdmin) { setComments([]); setCommentsErr(null); return; }
    const base = collection(db, POSTS_COLL, postId, 'comments');
    const qRef = isAdmin
      ? query(base, orderBy('createdAt', 'asc'), limit(80))
      : query(base, where('hidden', '==', false), limit(120));
    const unsub: Unsubscribe = onSnapshot(qRef,
      (snap) => {
        setCommentsErr(null);
        const rows = snap.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            authorUid: String(x.authorUid ?? ''),
            authorEmail: String(x.authorEmail ?? ''),
            body: String(x.body ?? ''),
            hidden: Boolean(x.hidden),
            createdAt: (x.createdAt as Timestamp | undefined) ?? null,
          };
        });
        if (!isAdmin) { rows.sort(compareCommentTime); setComments(rows.slice(0, 80)); }
        else setComments(rows);
      },
      (err) => {
        console.error('[Wins comments listener]', postId, err);
        setCommentsErr(err instanceof Error ? err.message : 'Could not load comments.');
      },
    );
    return unsub;
  }, [postId, postHidden, isAdmin]);

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email || postHidden) return;
    const t = body.trim();
    if (!t || t.length > COMMENT_MAX) return;
    setSending(true);
    try {
      await addDoc(collection(db, POSTS_COLL, postId, 'comments'), {
        authorUid: user.uid, authorEmail: user.email,
        body: t, hidden: false, createdAt: serverTimestamp(),
      });
      setBody('');
    } catch (err) {
      console.error(err);
      alert('Could not post comment. Check Firestore rules and indexes.');
    } finally { setSending(false); }
  };

  const hideComment = async (commentId: string) => {
    setBusyId(commentId);
    try { await updateDoc(doc(db, POSTS_COLL, postId, 'comments', commentId), { hidden: true }); }
    finally { setBusyId(null); }
  };

  const deleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    setBusyId(commentId);
    try { await deleteDoc(doc(db, POSTS_COLL, postId, 'comments', commentId)); }
    finally { setBusyId(null); }
  };

  return (
    <div className="mt-4 pl-3 border-l-2 border-black/08 space-y-3">
      <p className="text-[10px] font-black uppercase tracking-widest text-black/35 flex items-center gap-1.5">
        <MessageCircle size={12} className="opacity-60" /> Comments
      </p>
      {commentsErr && (
        <p className="text-[11px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{commentsErr}</p>
      )}
      <ul className="space-y-2">
        {comments.map((c) => (
          <li key={c.id}
            className={`rounded-xl px-3 py-2 text-sm ${c.hidden ? 'bg-red-50 border border-red-200' : 'bg-black/[0.03]'}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span className="text-[11px] font-bold text-indigo-600">{maskEmail(c.authorEmail)}</span>
              <span className="text-[10px] text-black/30">{formatWhen(c.createdAt)}</span>
            </div>
            {c.hidden && isAdmin && (
              <p className="text-[10px] uppercase tracking-wide text-red-500 mb-1">Hidden from members</p>
            )}
            <p className="text-black/80 whitespace-pre-wrap leading-relaxed">{c.body}</p>
            <div className="flex gap-2 mt-2 flex-wrap">
              {isAdmin && !c.hidden && (
                <button type="button" onClick={() => void hideComment(c.id)} disabled={busyId === c.id}
                  className="text-[10px] font-bold uppercase tracking-wide text-black/35 hover:text-black flex items-center gap-1">
                  <EyeOff size={12} /> Hide
                </button>
              )}
              {(isAdmin || user?.uid === c.authorUid) && (
                <button type="button" onClick={() => void deleteComment(c.id)} disabled={busyId === c.id}
                  className="text-[10px] font-bold uppercase tracking-wide text-black/35 hover:text-red-500 flex items-center gap-1"
                  title={user?.uid === c.authorUid ? 'Remove your reply' : 'Remove comment (moderator)'}>
                  <Trash2 size={12} /> {user?.uid === c.authorUid ? 'Delete my reply' : 'Delete'}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!postHidden && (
        <form onSubmit={(e) => void submitComment(e)} className="pt-1 space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, COMMENT_MAX))}
            placeholder="Say congrats or ask a question…"
            rows={2}
            className="w-full rounded-xl bg-white border border-black/10 px-3 py-2 text-sm text-black placeholder:text-black/25 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 resize-y min-h-[72px]"
          />
          <div className="flex justify-between items-center gap-2">
            <span className="text-[10px] text-black/25">{body.trim().length}/{COMMENT_MAX}</span>
            <button type="submit" disabled={sending || !body.trim()}
              className="text-[11px] font-black uppercase tracking-widest bg-yellow-400 text-black px-4 py-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors">
              {sending ? 'Posting…' : 'Reply'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ─── PostCard — restyled for light feed background ────────────────────────────
const PostCard: React.FC<{ post: WinPost; isAdmin: boolean }> = ({ post, isAdmin }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const hidePost = async () => {
    setBusy(true);
    try { await updateDoc(doc(db, POSTS_COLL, post.id), { hidden: true }); }
    finally { setBusy(false); }
  };

  const unhidePost = async () => {
    setBusy(true);
    try { await updateDoc(doc(db, POSTS_COLL, post.id), { hidden: false }); }
    finally { setBusy(false); }
  };

  const removePost = async () => {
    if (!confirm('Delete this win and all its comments?')) return;
    setBusy(true);
    try {
      const cref = collection(db, POSTS_COLL, post.id, 'comments');
      const snap = await getDocs(cref);
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      batch.delete(doc(db, POSTS_COLL, post.id));
      await batch.commit();
    } catch (err) {
      console.error(err);
      alert('Delete failed. Try again or remove comments in batches.');
    } finally { setBusy(false); }
  };

  const canMod = isAdmin || user?.uid === post.authorUid;

  return (
    <article
      className={`rounded-2xl border p-5 bg-white shadow-sm transition-all hover:shadow-md ${post.hidden ? 'border-red-200 bg-red-50' : 'border-black/[0.08]'
        }`}
      style={{ borderLeft: !post.hidden ? '3px solid #facc15' : undefined }}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-indigo-600">{maskEmail(post.authorEmail)}</p>
          <p className="text-[10px] text-black/30 mt-0.5">{formatWhen(post.createdAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end">
          {post.hidden && (
            <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-500 border border-red-200">
              Hidden
            </span>
          )}
          {isAdmin && !post.hidden && (
            <button type="button" disabled={busy} onClick={() => void hidePost()}
              className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 text-black/35 hover:text-black border border-black/10 rounded-full px-2.5 py-1">
              <EyeOff size={12} /> Hide
            </button>
          )}
          {isAdmin && post.hidden && (
            <button type="button" disabled={busy} onClick={() => void unhidePost()}
              className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 border border-emerald-300 rounded-full px-2.5 py-1 hover:bg-emerald-50">
              Unhide
            </button>
          )}
          {canMod && (
            <button type="button" disabled={busy} onClick={() => void removePost()}
              className="text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 text-black/35 hover:text-red-500 border border-black/10 rounded-full px-2.5 py-1"
              title={user?.uid === post.authorUid ? 'Remove your win from the feed' : 'Remove post (moderator)'}>
              <Trash2 size={12} /> {user?.uid === post.authorUid ? 'Delete my win' : 'Delete'}
            </button>
          )}
        </div>
      </header>

      <p className="text-black/85 whitespace-pre-wrap leading-relaxed text-[15px]">{post.body}</p>

      <button type="button" onClick={() => setOpen((o) => !o)}
        className="mt-4 text-[11px] font-black uppercase tracking-widest text-black/35 hover:text-indigo-600 flex items-center gap-1.5 transition-colors">
        <MessageCircle size={14} />
        {open ? 'Hide thread' : 'Open thread'}
      </button>

      {open && <CommentsPanel postId={post.id} postHidden={post.hidden} isAdmin={isAdmin} />}
    </article>
  );
};

// ─── Month navigator ──────────────────────────────────────────────────────────
const MonthNav: React.FC<{
  months: string[];
  current: number;
  onPrev: () => void;
  onNext: () => void;
}> = ({ months, current, onPrev, onNext }) => {
  if (months.length === 0) return null;
  return (
    <div className="flex items-center justify-between mb-6 px-1">
      <button
        onClick={onPrev}
        disabled={current === months.length - 1}
        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-black/100 hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft size={16} />
        {months[current + 1] ?? 'Older'}
      </button>

      <div className="text-center">
        <p className="text-lg font-black uppercase tracking-tight text-black leading-none">
          {months[current]}
        </p>
        <p className="text-[10px] font-black uppercase tracking-widest text-black/45 mt-0.5">
          {current === 0 ? 'Most Recent' : `${months.length - current} of ${months.length}`}
        </p>
      </div>

      <button
        onClick={onNext}
        disabled={current === 0}
        className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-black/100 hover:text-black disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
      >
        {months[current - 1] ?? 'Newer'}
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const WinsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [posts, setPosts] = useState<WinPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [draft, setDraft] = useState('');
  const [posting, setPosting] = useState(false);
  const [monthIdx, setMonthIdx] = useState(0); // 0 = most recent month

  const postsQuery = useMemo(() => {
    const coll = collection(db, POSTS_COLL);
    if (isAdmin) return query(coll, orderBy('createdAt', 'desc'), limit(200));
    return query(coll, where('hidden', '==', false), orderBy('createdAt', 'desc'), limit(150));
  }, [isAdmin]);

  useEffect(() => {
    setLoadingPosts(true);
    const unsub = onSnapshot(postsQuery,
      (snap) => {
        setPosts(snap.docs.map((d) => {
          const x = d.data();
          return {
            id: d.id,
            authorUid: String(x.authorUid ?? ''),
            authorEmail: String(x.authorEmail ?? ''),
            body: String(x.body ?? ''),
            hidden: Boolean(x.hidden),
            createdAt: (x.createdAt as Timestamp | undefined) ?? null,
          };
        }));
        setLoadingPosts(false);
      },
      (err) => { console.error(err); setPosts([]); setLoadingPosts(false); },
    );
    return unsub;
  }, [postsQuery]);

  const submitPost = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    const t = draft.trim();
    if (!t || t.length > POST_MAX) return;
    setPosting(true);
    try {
      await addDoc(collection(db, POSTS_COLL), {
        authorUid: user.uid, authorEmail: user.email,
        body: t, hidden: false, createdAt: serverTimestamp(),
      });
      setDraft('');
      setMonthIdx(0); // jump to current month after posting
    } catch (err) {
      console.error(err);
      alert('Could not publish. Enable Firestore and deploy rules (see firestore.rules).');
    } finally { setPosting(false); }
  }, [draft, user]);

  // ── Group posts by month, sorted newest first ──────────────────────────────
  const { months, postsByMonth } = useMemo(() => {
    const map: Record<string, WinPost[]> = {};
    posts.forEach(p => {
      const key = monthKey(p.createdAt);
      if (!map[key]) map[key] = [];
      map[key].push(p);
    });
    // Sort month keys newest first
    const sortedMonths = Object.keys(map).sort((a, b) => {
      const da = new Date(a); const db_ = new Date(b);
      return db_.getTime() - da.getTime();
    });
    return { months: sortedMonths, postsByMonth: map };
  }, [posts]);

  // Clamp monthIdx if months list shrinks
  const safeIdx = Math.min(monthIdx, Math.max(0, months.length - 1));
  const currentMonth = months[safeIdx] ?? '';
  const visiblePosts = postsByMonth[currentMonth] ?? [];

  return (
    <div className="min-h-screen">

      {/* ── HERO ZONE — dark, matches dark-tech pages ── */}
      <div className="bg-[#09090b] text-white pt-28 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <button type="button" onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/35 hover:text-yellow-400 mb-8 transition-colors">
            <ArrowLeft size={14} /> Back
          </button>

          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-yellow-400/90 mb-2">Community</p>
          <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none mb-4">Hype Wall</h1>
          <p className="text-white/45 text-sm leading-relaxed max-w-lg mb-3">
            Cracked a hard problem, landed an internship, finally shipped that side project —
            don't keep it to yourself. Share it here, cheer someone else on, and do it before
            you forget how good it felt.
          </p>
          {isAdmin && (
            <p className="mt-3 inline-flex items-center gap-2 text-[11px] font-bold text-emerald-400/90 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-3 py-1">
              <Shield size={14} /> Moderator view — you can hide posts and comments
            </p>
          )}

          {/* ── Composer ── */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-white/40 mb-3">Share a win</h2>
            <form onSubmit={(e) => void submitPost(e)} className="space-y-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value.slice(0, POST_MAX))}
                placeholder="Today I… (keep it short and real)"
                rows={4}
                className="w-full rounded-xl bg-black/50 border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/25 focus:outline-none focus:ring-1 focus:ring-yellow-400/40 resize-y min-h-[120px]"
              />
              <div className="flex flex-wrap justify-between items-center gap-3">
                <span className="text-[10px] text-white/25">{draft.trim().length}/{POST_MAX}</span>
                <button type="submit" disabled={posting || !draft.trim()}
                  className="text-[11px] font-black uppercase tracking-widest bg-yellow-400 text-black px-6 py-2.5 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-yellow-300 transition-colors">
                  {posting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ── FEED ZONE — light warm grey, editorial card feel ── */}
      <div className="bg-[#f4f4f3] px-4 py-12 min-h-[60vh]">
        <div className="max-w-2xl mx-auto">

          {/* Month navigator */}
          {!loadingPosts && months.length > 0 && (
            <MonthNav
              months={months}
              current={safeIdx}
              onPrev={() => setMonthIdx(i => Math.min(i + 1, months.length - 1))}
              onNext={() => setMonthIdx(i => Math.max(i - 1, 0))}
            />
          )}

          {/* Divider */}
          <div className="border-b-4 border-black mb-8" />

          {loadingPosts && (
            <div className="flex items-center justify-center py-20 text-black/30">
              <Loader2 size={20} className="animate-spin mr-2" />
              <span className="text-sm font-black uppercase tracking-widest">Loading…</span>
            </div>
          )}

          {!loadingPosts && posts.length === 0 && (
            <p className="text-sm text-black/35 py-16 text-center border-2 border-dashed border-black/10 rounded-2xl font-medium">
              No posts yet. Be the first to share a win.
            </p>
          )}

          {!loadingPosts && posts.length > 0 && visiblePosts.length === 0 && (
            <p className="text-sm text-black/35 py-16 text-center border-2 border-dashed border-black/10 rounded-2xl font-medium">
              No posts for {currentMonth}.
            </p>
          )}

          <div className="space-y-5">
            {visiblePosts.map(p => (
              <PostCard key={p.id} post={p} isAdmin={isAdmin} />
            ))}
          </div>

          {/* Bottom month nav */}
          {!loadingPosts && months.length > 1 && visiblePosts.length > 0 && (
            <div className="mt-10 pt-6 border-t border-black/08">
              <MonthNav
                months={months}
                current={safeIdx}
                onPrev={() => setMonthIdx(i => Math.min(i + 1, months.length - 1))}
                onNext={() => setMonthIdx(i => Math.max(i - 1, 0))}
              />
            </div>
          )}

          <p className="mt-12 text-center text-[10px] text-black/25 uppercase tracking-widest">
            Be kind · No spam ·{' '}
            <Link to="/join" className="underline hover:text-black/50">Account help</Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default WinsPage;