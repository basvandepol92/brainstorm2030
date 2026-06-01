import { API_BASE, type SessionState } from './types';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

/** Fetch the public session state. Pass the participant name to get their ballot. */
export function fetchState(name?: string | null): Promise<SessionState> {
  const q = name ? `?name=${encodeURIComponent(name)}` : '';
  return request<SessionState>(`/api/state${q}`);
}

/** Submit a ballot (up to dotsPerVoter outcome ids). Returns the stored selection. */
export function postVote(name: string, outcomeIds: string[]): Promise<{ ok: boolean; myVote: string[] }> {
  return request('/api/vote', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, outcomeIds }),
  });
}
