import type { DocumentData } from 'firebase/firestore';

export const LEARNING_LOCAL_STORAGE_KEY = 'byteclub-learning-progress-v1';

export const DSA_TRACK_IDS = [
  'arrays',
  'trees',
  'linkedLists',
  'stacksQueues',
  'heaps',
  'hashTables',
  'graphs',
] as const;

export type DsaTrackId = (typeof DSA_TRACK_IDS)[number];

/** Firestore field names (flat arrays per track). */
export const FIRESTORE_DSA_FIELDS: Record<DsaTrackId, string> = {
  arrays: 'dsaArrays',
  trees: 'dsaTrees',
  linkedLists: 'dsaLinkedLists',
  stacksQueues: 'dsaStacksQueues',
  heaps: 'dsaHeaps',
  hashTables: 'dsaHashTables',
  graphs: 'dsaGraphs',
};

export type DsaProgressMap = Record<DsaTrackId, string[]>;

export type LearningProgressState = {
  cpTopicIds: string[];
  dsa: DsaProgressMap;
};

export function emptyProgress(): LearningProgressState {
  return {
    cpTopicIds: [],
    dsa: {
      arrays: [],
      trees: [],
      linkedLists: [],
      stacksQueues: [],
      heaps: [],
      hashTables: [],
      graphs: [],
    },
  };
}

function uniq(ids: string[]): string[] {
  return [...new Set(ids)];
}

export function mergeProgress(a: LearningProgressState, b: LearningProgressState): LearningProgressState {
  const dsa = { ...emptyProgress().dsa };
  for (const k of DSA_TRACK_IDS) {
    dsa[k] = uniq([...(a.dsa[k] ?? []), ...(b.dsa[k] ?? [])]);
  }
  return {
    cpTopicIds: uniq([...(a.cpTopicIds ?? []), ...(b.cpTopicIds ?? [])]),
    dsa,
  };
}

export function toggleInList(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
}

export function fromFirestoreData(data: DocumentData | undefined): LearningProgressState {
  if (!data) return emptyProgress();
  const base = emptyProgress();
  base.cpTopicIds = Array.isArray(data.cpTopicIds) ? data.cpTopicIds.map(String) : [];

  for (const track of DSA_TRACK_IDS) {
    const field = FIRESTORE_DSA_FIELDS[track];
    const arr = data[field];
    base.dsa[track] = Array.isArray(arr) ? arr.map(String) : [];
  }
  return base;
}

export function toFirestorePayload(state: LearningProgressState): Record<string, unknown> {
  const out: Record<string, unknown> = {
    cpTopicIds: state.cpTopicIds,
  };
  for (const track of DSA_TRACK_IDS) {
    out[FIRESTORE_DSA_FIELDS[track]] = state.dsa[track];
  }
  return out;
}
