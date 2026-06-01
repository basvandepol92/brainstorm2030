import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchState, postVote } from '../session/api';
import type { SessionState } from '../session/types';

export type ConnStatus = 'connecting' | 'live' | 'offline';

const POLL_MS = 4000;

/**
 * Polls the backend for the live session state and exposes a vote action.
 * Keeps the last known state on transient errors so the room never goes blank.
 */
export function useSession(name: string | null) {
  const [state, setState] = useState<SessionState | null>(null);
  const [status, setStatus] = useState<ConnStatus>('connecting');
  const hasState = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const s = await fetchState(name);
      hasState.current = true;
      setState(s);
      setStatus('live');
      return s;
    } catch {
      setStatus(hasState.current ? 'live' : 'offline');
      return null;
    }
  }, [name]);

  useEffect(() => {
    let active = true;
    let handle: ReturnType<typeof setTimeout>;
    const loop = async () => {
      await refresh();
      if (active) handle = setTimeout(loop, POLL_MS);
    };
    loop();
    return () => {
      active = false;
      clearTimeout(handle);
    };
  }, [refresh]);

  const vote = useCallback(
    async (outcomeIds: string[]) => {
      if (!name) return;
      const { myVote } = await postVote(name, outcomeIds);
      setState((s) => (s ? { ...s, myVote } : s));
      void refresh();
    },
    [name, refresh],
  );

  return { state, status, vote, refresh };
}
