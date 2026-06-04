// Shared types for the live/controlled session driven by the backend.

export type LiveStage =
  | 'home'
  | 'onderling'
  | 'fase1'
  | 'voting'
  | 'fase2'
  | 'pauze2'
  | 'fase3'
  | 'done';
export type LivePhase = 'onderling' | 'fase1' | 'voting' | 'fase2' | 'pauze2' | 'fase3';

export interface Timer {
  startTime: string | null;
  durationMin: number;
}

export interface Outcome {
  id: string;
  text: string;
  createdAt: string;
}

export interface VotingConfig {
  open: boolean;
  resultsRevealed: boolean;
  dotsPerVoter: number;
}

export interface SessionState {
  stage: LiveStage;
  timers: Record<LivePhase, Timer>;
  outcomes: Outcome[];
  voting: VotingConfig;
  votesCast: number;
  tallies: Record<string, number> | null;
  /** Top (≤9) droombeelden by votes, highest first. Null until visible. */
  topOutcomes: Outcome[] | null;
  myVote: string[];
  serverTime: string;
  updatedAt: string;
}

/** Whether the front-end runs in backend-controlled "live" mode. */
export const LIVE_MODE = import.meta.env.VITE_LIVE === 'true';

/** API origin. Empty string = same origin as where the app is served. */
export const API_BASE = (import.meta.env.VITE_API_BASE ?? '').replace(/\/$/, '');
