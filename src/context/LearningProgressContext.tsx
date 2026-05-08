import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { doc, getDoc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';
import { slugFromLeetcodeUrl } from '../learning/problemSlug';
import {
  LEARNING_LOCAL_STORAGE_KEY,
  emptyProgress,
  fromFirestoreData,
  mergeProgress,
  toggleInList,
  toFirestorePayload,
  type DsaTrackId,
  type LearningProgressState,
} from '../learning/progressModel';

export type { DsaTrackId };

type PersistenceMode = 'cloud' | 'local';

type LearningProgressContextValue = {
  loading: boolean;
  persistence: PersistenceMode;
  cpTopicIds: Set<string>;
  toggleCpTopic: (topicId: string) => void;
  isDsaDone: (track: DsaTrackId, slug: string) => boolean;
  toggleDsaProblem: (track: DsaTrackId, slug: string) => void;
  dsaCompletedInList: (track: DsaTrackId, urls: readonly string[]) => number;
};

const LearningProgressContext = createContext<LearningProgressContextValue | undefined>(undefined);

function readLocalProgress(): LearningProgressState {
  try {
    const raw = localStorage.getItem(LEARNING_LOCAL_STORAGE_KEY);
    if (!raw) return emptyProgress();
    return fromFirestoreData(JSON.parse(raw));
  } catch {
    return emptyProgress();
  }
}

function writeLocalProgress(state: LearningProgressState) {
  try {
    localStorage.setItem(LEARNING_LOCAL_STORAGE_KEY, JSON.stringify(toFirestorePayload(state)));
  } catch {
    /* quota / private mode */
  }
}

export const LearningProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const [learningState, setLearningState] = useState<LearningProgressState>(emptyProgress);
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef<(() => void) | undefined>(undefined);

  const persist = useCallback(
    (next: LearningProgressState) => {
      writeLocalProgress(next);
      if (user?.uid) {
        const ref = doc(db, 'users', user.uid, 'learning', 'progress');
        void setDoc(ref, { ...toFirestorePayload(next), updatedAt: serverTimestamp() }, { merge: true }).catch((err) => {
          console.warn('[LearningProgress] Firestore write failed', err);
        });
      }
    },
    [user?.uid],
  );

  const commit = useCallback(
    (updater: (prev: LearningProgressState) => LearningProgressState) => {
      setLearningState((prev) => {
        const next = updater(prev);
        persist(next);
        return next;
      });
    },
    [persist],
  );

  useEffect(() => {
    if (authLoading) return;

    unsubRef.current?.();
    unsubRef.current = undefined;

    if (!user) {
      setLearningState(readLocalProgress());
      setLoading(false);
      return;
    }

    let cancelled = false;
    const ref = doc(db, 'users', user.uid, 'learning', 'progress');

    setLoading(true);

    void (async () => {
      try {
        const snap = await getDoc(ref);
        const remote = snap.exists() ? fromFirestoreData(snap.data()) : emptyProgress();
        const local = readLocalProgress();
        const merged = mergeProgress(remote, local);
        if (cancelled) return;
        setLearningState(merged);
        writeLocalProgress(merged);
        await setDoc(ref, { ...toFirestorePayload(merged), updatedAt: serverTimestamp() }, { merge: true });
      } catch (e) {
        console.warn('[LearningProgress] Firestore unavailable; using saved browser data only.', e);
        if (!cancelled) setLearningState(readLocalProgress());
      } finally {
        if (!cancelled) setLoading(false);
      }

      if (cancelled) return;

      unsubRef.current = onSnapshot(
        ref,
        (s) => {
          if (!s.exists()) return;
          const remote = fromFirestoreData(s.data());
          setLearningState(remote);
          writeLocalProgress(remote);
        },
        (err) => console.warn('[LearningProgress] Snapshot error', err),
      );
    })();

    return () => {
      cancelled = true;
      unsubRef.current?.();
      unsubRef.current = undefined;
    };
  }, [user?.uid, authLoading]);

  const persistence: PersistenceMode = user ? 'cloud' : 'local';

  const toggleCpTopic = useCallback(
    (topicId: string) => {
      commit((prev) => ({
        ...prev,
        cpTopicIds: toggleInList(prev.cpTopicIds, topicId),
      }));
    },
    [commit],
  );

  const toggleDsaProblem = useCallback(
    (track: DsaTrackId, slug: string) => {
      commit((prev) => ({
        ...prev,
        dsa: {
          ...prev.dsa,
          [track]: toggleInList(prev.dsa[track], slug),
        },
      }));
    },
    [commit],
  );

  const isDsaDone = useCallback(
    (track: DsaTrackId, slug: string) => learningState.dsa[track].includes(slug),
    [learningState],
  );

  const dsaCompletedInList = useCallback(
    (track: DsaTrackId, urls: readonly string[]) => {
      const done = new Set(learningState.dsa[track]);
      let n = 0;
      for (const u of urls) {
        if (done.has(slugFromLeetcodeUrl(u))) n++;
      }
      return n;
    },
    [learningState],
  );

  const value = useMemo<LearningProgressContextValue>(
    () => ({
      loading,
      persistence,
      cpTopicIds: new Set(learningState.cpTopicIds),
      toggleCpTopic,
      isDsaDone,
      toggleDsaProblem,
      dsaCompletedInList,
    }),
    [loading, persistence, learningState.cpTopicIds, toggleCpTopic, isDsaDone, toggleDsaProblem, dsaCompletedInList],
  );

  return <LearningProgressContext.Provider value={value}>{children}</LearningProgressContext.Provider>;
};

export function useLearningProgress(): LearningProgressContextValue {
  const ctx = useContext(LearningProgressContext);
  if (!ctx) throw new Error('useLearningProgress must be used within LearningProgressProvider');
  return ctx;
}
