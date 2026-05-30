import { useCallback, useEffect, useState } from 'react';
import { PEOPLE } from '../data/people';
import { findByName } from '../data/selectors';
import type { Person } from '../data/types';

const STORAGE_KEY = 'rz_user';

/** Persists the selected participant in localStorage across refreshes. */
export function useStoredUser() {
  const [user, setUser] = useState<Person | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (findByName(PEOPLE, saved) ?? null) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, user.name);
    else localStorage.removeItem(STORAGE_KEY);
  }, [user]);

  const clearUser = useCallback(() => setUser(null), []);

  return { user, setUser, clearUser };
}
