import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

/** True when Firestore doc `admins/{uid}` exists for the signed-in user (create via Firebase Console). */
export function useIsAdmin(): boolean {
  const { user } = useAuth();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    if (!user?.uid) {
      setAdmin(false);
      return;
    }
    const ref = doc(db, 'admins', user.uid);
    const unsub = onSnapshot(
      ref,
      (snap) => setAdmin(snap.exists()),
      () => setAdmin(false),
    );
    return unsub;
  }, [user?.uid]);

  return admin;
}
