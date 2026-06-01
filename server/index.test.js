import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, describe, test } from 'node:test';

// Configure an isolated data dir + admin password BEFORE importing the modules,
// because state.js resolves DATA_DIR at import time.
const DATA_DIR = mkdtempSync(join(tmpdir(), 'rz-state-'));
process.env.DATA_DIR = DATA_DIR;
process.env.ADMIN_PASSWORD = 'test-secret';

const { createApp } = await import('./index.js');
const { load } = await import('./state.js');

let server;
let base;
const admin = { Authorization: 'Bearer test-secret', 'Content-Type': 'application/json' };

function url(p) {
  return `${base}${p}`;
}

before(async () => {
  load();
  await new Promise((resolve) => {
    server = createApp().listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

after(() => {
  server?.close();
  rmSync(DATA_DIR, { recursive: true, force: true });
});

describe('public + admin API', () => {
  test('health is open', async () => {
    const res = await fetch(url('/api/health'));
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
  });

  test('public state starts at stage home', async () => {
    const s = await (await fetch(url('/api/state'))).json();
    assert.equal(s.stage, 'home');
    assert.deepEqual(s.outcomes, []);
    assert.equal(s.tallies, null); // hidden until revealed
  });

  test('admin endpoints reject without/with wrong token', async () => {
    assert.equal((await fetch(url('/api/admin/state'))).status, 401);
    const bad = await fetch(url('/api/admin/state'), { headers: { Authorization: 'Bearer nope' } });
    assert.equal(bad.status, 401);
  });

  test('admin can set the active stage', async () => {
    const res = await fetch(url('/api/admin/stage'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ stage: 'fase1' }),
    });
    assert.equal(res.status, 200);
    const s = await (await fetch(url('/api/state'))).json();
    assert.equal(s.stage, 'fase1');
  });

  test('admin rejects an invalid stage', async () => {
    const res = await fetch(url('/api/admin/stage'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ stage: 'bogus' }),
    });
    assert.equal(res.status, 400);
  });

  test('start-now timer yields a return time', async () => {
    await fetch(url('/api/admin/timer'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ phase: 'fase1', durationMin: 30, startNow: true }),
    });
    const s = await (await fetch(url('/api/state'))).json();
    assert.ok(s.timers.fase1.startTime);
    assert.equal(s.timers.fase1.durationMin, 30);
  });

  test('resetting a timer clears its start time but keeps the duration', async () => {
    await fetch(url('/api/admin/timer'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ phase: 'fase1', startTime: null }),
    });
    const s = await (await fetch(url('/api/state'))).json();
    assert.equal(s.timers.fase1.startTime, null);
    assert.equal(s.timers.fase1.durationMin, 30);
  });

  test('full voting flow: add outcomes, open, vote, tally', async () => {
    const a = await (
      await fetch(url('/api/admin/outcomes'), {
        method: 'POST',
        headers: admin,
        body: JSON.stringify({ text: 'AI-propositie' }),
      })
    ).json();
    await fetch(url('/api/admin/outcomes'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ text: 'Community voor Rockstars' }),
    });
    const o1 = a.outcomes[0].id;

    // Voting is closed by default → vote rejected.
    let v = await fetch(url('/api/vote'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bas', outcomeIds: [o1] }),
    });
    assert.equal(v.status, 400);

    // Open voting with 2 dots each.
    await fetch(url('/api/admin/voting'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ open: true, dotsPerVoter: 2 }),
    });

    // Unknown participant rejected.
    v = await fetch(url('/api/vote'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Mallory', outcomeIds: [o1] }),
    });
    assert.equal(v.status, 400);

    // Valid vote accepted and echoed back.
    v = await (
      await fetch(url('/api/vote'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Bas', outcomeIds: [o1] }),
      })
    ).json();
    assert.deepEqual(v.myVote, [o1]);

    // Re-vote replaces (no double counting).
    await fetch(url('/api/vote'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Bas', outcomeIds: [o1] }),
    });

    // Tallies hidden until revealed.
    let s = await (await fetch(url('/api/state?name=Bas'))).json();
    assert.equal(s.tallies, null);
    assert.deepEqual(s.myVote, [o1]);
    assert.equal(s.votesCast, 1);

    // Reveal → counts visible.
    await fetch(url('/api/admin/voting'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ resultsRevealed: true }),
    });
    s = await (await fetch(url('/api/state'))).json();
    assert.equal(s.tallies[o1], 1);
  });

  test('too many distinct dots is rejected (limit is 2)', async () => {
    // Add a third outcome so we can exceed the 2-dot limit with distinct ids.
    await fetch(url('/api/admin/outcomes'), {
      method: 'POST',
      headers: admin,
      body: JSON.stringify({ text: 'Derde opbrengst' }),
    });
    const s = await (await fetch(url('/api/admin/state'), { headers: admin })).json();
    const ids = s.outcomes.map((o) => o.id); // 3 distinct ids, limit is 2
    assert.ok(ids.length >= 3);
    const res = await fetch(url('/api/vote'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Elske', outcomeIds: ids }),
    });
    assert.equal(res.status, 400);
  });
});
