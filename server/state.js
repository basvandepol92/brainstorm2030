import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { PARTICIPANTS } from './participants.js';

/**
 * Persistent session state, stored as a single JSON file. On Railway this file
 * lives on a mounted volume (set DATA_DIR to the mount path, e.g. /data) so it
 * survives redeploys. Locally it defaults to ./data/state.json.
 */

const DATA_DIR = process.env.DATA_DIR || join(process.cwd(), 'data');
const FILE = join(DATA_DIR, 'state.json');

// 'onderling' = ronde "Onderling begrip" vóór fase 1;
// 'voting' = eerste pauze (dotvoten); 'pauze2' = tweede pauze (even chillen).
export const STAGES = ['home', 'onderling', 'fase1', 'voting', 'fase2', 'pauze2', 'fase3', 'done'];
export const TIMED_PHASES = ['onderling', 'fase1', 'voting', 'fase2', 'pauze2', 'fase3'];

const DEFAULT_DURATIONS = { onderling: 15, fase1: 40, voting: 10, fase2: 40, pauze2: 10, fase3: 40 };

function defaultState() {
  return {
    stage: 'home',
    timers: {
      onderling: { startTime: null, durationMin: 15 },
      fase1: { startTime: null, durationMin: 40 },
      voting: { startTime: null, durationMin: 10 },
      fase2: { startTime: null, durationMin: 40 },
      pauze2: { startTime: null, durationMin: 10 },
      fase3: { startTime: null, durationMin: 40 },
    },
    outcomes: [], // { id, text, createdAt }
    voting: { open: false, resultsRevealed: false, dotsPerVoter: 3 },
    votes: {}, // { [participantName]: [outcomeId, ...] }
    updatedAt: new Date().toISOString(),
  };
}

let state = defaultState();

/** Fill in any missing fields so an older/partial file still loads cleanly. */
function normalize(loaded) {
  const base = defaultState();
  const next = { ...base, ...loaded };
  next.timers = { ...base.timers };
  for (const phase of TIMED_PHASES) {
    const t = loaded?.timers?.[phase] ?? {};
    next.timers[phase] = {
      startTime: t.startTime ?? null,
      durationMin: Number.isFinite(t.durationMin) ? t.durationMin : DEFAULT_DURATIONS[phase],
    };
  }
  next.voting = { ...base.voting, ...(loaded?.voting ?? {}) };
  next.outcomes = Array.isArray(loaded?.outcomes) ? loaded.outcomes : [];
  next.votes = loaded?.votes && typeof loaded.votes === 'object' ? loaded.votes : {};
  if (!STAGES.includes(next.stage)) next.stage = 'home';
  return next;
}

export function load() {
  try {
    if (existsSync(FILE)) {
      state = normalize(JSON.parse(readFileSync(FILE, 'utf8')));
    } else {
      persist();
    }
  } catch (err) {
    console.error('[state] could not read state file, starting fresh:', err.message);
    state = defaultState();
  }
  return state;
}

function persist() {
  try {
    mkdirSync(dirname(FILE), { recursive: true });
    const tmp = `${FILE}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(state, null, 2));
    renameSync(tmp, FILE); // atomic swap
  } catch (err) {
    console.error('[state] could not write state file:', err.message);
  }
}

function touch() {
  state.updatedAt = new Date().toISOString();
  persist();
}

export function getState() {
  return state;
}

// ── Mutations ─────────────────────────────────────────────────────────────

export function setStage(stage) {
  if (!STAGES.includes(stage)) throw new Error('invalid stage');
  state.stage = stage;
  touch();
  return state;
}

export function setTimer(phase, { startTime, durationMin, startNow } = {}) {
  if (!TIMED_PHASES.includes(phase)) throw new Error('invalid phase');
  const timer = state.timers[phase];
  if (startNow) {
    timer.startTime = new Date().toISOString();
  } else if (startTime === null) {
    timer.startTime = null;
  } else if (typeof startTime === 'string') {
    const d = new Date(startTime);
    if (Number.isNaN(d.getTime())) throw new Error('invalid startTime');
    timer.startTime = d.toISOString();
  }
  if (durationMin !== undefined) {
    const n = Number(durationMin);
    if (!Number.isFinite(n) || n < 0 || n > 600) throw new Error('invalid durationMin');
    timer.durationMin = Math.round(n);
  }
  touch();
  return state;
}

export function addOutcome(text) {
  const clean = String(text ?? '').trim();
  if (!clean) throw new Error('empty outcome');
  if (clean.length > 500) throw new Error('outcome too long');
  const outcome = { id: randomUUID(), text: clean, createdAt: new Date().toISOString() };
  state.outcomes.push(outcome);
  touch();
  return outcome;
}

export function updateOutcome(id, text) {
  const outcome = state.outcomes.find((o) => o.id === id);
  if (!outcome) throw new Error('not found');
  const clean = String(text ?? '').trim();
  if (!clean) throw new Error('empty outcome');
  if (clean.length > 500) throw new Error('outcome too long');
  outcome.text = clean;
  touch();
  return outcome;
}

export function deleteOutcome(id) {
  const before = state.outcomes.length;
  state.outcomes = state.outcomes.filter((o) => o.id !== id);
  if (state.outcomes.length === before) throw new Error('not found');
  // Drop this outcome from any ballots that referenced it.
  for (const name of Object.keys(state.votes)) {
    state.votes[name] = state.votes[name].filter((oid) => oid !== id);
  }
  touch();
  return state;
}

export function setVotingConfig({ open, resultsRevealed, dotsPerVoter } = {}) {
  if (open !== undefined) state.voting.open = Boolean(open);
  if (resultsRevealed !== undefined) state.voting.resultsRevealed = Boolean(resultsRevealed);
  if (dotsPerVoter !== undefined) {
    const n = Number(dotsPerVoter);
    if (!Number.isFinite(n) || n < 1 || n > 20) throw new Error('invalid dotsPerVoter');
    state.voting.dotsPerVoter = Math.round(n);
  }
  touch();
  return state;
}

export function resetVotes() {
  state.votes = {};
  touch();
  return state;
}

/** Record (or replace) a participant's ballot. Returns their stored selection. */
export function castVote(name, outcomeIds) {
  if (!state.voting.open) throw new Error('voting closed');
  if (!Array.isArray(outcomeIds)) throw new Error('invalid ballot');
  const valid = new Set(state.outcomes.map((o) => o.id));
  const unique = [...new Set(outcomeIds)].filter((id) => valid.has(id));
  if (unique.length > state.voting.dotsPerVoter) throw new Error('too many dots');
  state.votes[name] = unique;
  touch();
  return unique;
}

/** Map of outcomeId -> number of ballots that included it. */
export function tallies() {
  const counts = {};
  for (const o of state.outcomes) counts[o.id] = 0;
  for (const ids of Object.values(state.votes)) {
    for (const id of ids) if (id in counts) counts[id] += 1;
  }
  return counts;
}

export function votesCast() {
  return Object.values(state.votes).filter((ids) => ids.length > 0).length;
}

export const TOP_N = 9;

/** The top (max 9) droombeelden by votes, highest first, only those with >0 votes. */
export function rankedTop() {
  const counts = tallies();
  return state.outcomes
    .map((o) => ({ id: o.id, text: o.text, createdAt: o.createdAt, count: counts[o.id] || 0 }))
    .filter((o) => o.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, TOP_N)
    .map(({ id, text, createdAt }) => ({ id, text, createdAt }));
}

// Stages from fase 2 onward: the top is locked in and shown to the groups even
// if Bas hasn't explicitly revealed the vote counts.
const TOP_VISIBLE_STAGES = new Set(['fase2', 'pauze2', 'fase3', 'done']);

/** Public view of the session: no per-name ballots, tallies only when revealed. */
export function publicState(name) {
  const revealed = state.voting.resultsRevealed;
  const showTop = revealed || TOP_VISIBLE_STAGES.has(state.stage);
  return {
    stage: state.stage,
    timers: state.timers,
    outcomes: state.outcomes,
    voting: state.voting,
    votesCast: votesCast(),
    tallies: revealed ? tallies() : null,
    topOutcomes: showTop ? rankedTop() : null,
    myVote: name && state.votes[name] ? state.votes[name] : [],
    serverTime: new Date().toISOString(),
    updatedAt: state.updatedAt,
  };
}

/** Full view for the admin console. */
export function adminState() {
  const voted = PARTICIPANTS.filter((name) => (state.votes[name] ?? []).length > 0);
  const pending = PARTICIPANTS.filter((name) => (state.votes[name] ?? []).length === 0);
  return {
    ...state,
    tallies: tallies(),
    votesCast: votesCast(),
    participants: PARTICIPANTS,
    voted,
    pending,
  };
}
