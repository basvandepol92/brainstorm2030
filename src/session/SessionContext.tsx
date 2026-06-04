import { createContext, useContext } from 'react';
import type { LivePhase, Outcome, Timer } from './types';

interface SessionData {
  timers: Record<LivePhase, Timer> | null;
  topOutcomes: Outcome[] | null;
}

export const SessionTimingContext = createContext<SessionData>({
  timers: null,
  topOutcomes: null,
});

/** Returns the live timer for a phase, or null in standalone mode. */
export function usePhaseTimer(phase?: LivePhase): Timer | null {
  const { timers } = useContext(SessionTimingContext);
  if (!phase || !timers) return null;
  return timers[phase] ?? null;
}

/** The ranked top droombeelden (≤9), or null when not yet available/standalone. */
export function useTopOutcomes(): Outcome[] | null {
  return useContext(SessionTimingContext).topOutcomes;
}
