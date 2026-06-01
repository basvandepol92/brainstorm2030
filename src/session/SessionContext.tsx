import { createContext, useContext } from 'react';
import type { LivePhase, Timer } from './types';

interface SessionTiming {
  timers: Record<LivePhase, Timer> | null;
}

export const SessionTimingContext = createContext<SessionTiming>({ timers: null });

/** Returns the live timer for a phase, or null in standalone mode. */
export function usePhaseTimer(phase?: LivePhase): Timer | null {
  const { timers } = useContext(SessionTimingContext);
  if (!phase || !timers) return null;
  return timers[phase] ?? null;
}
