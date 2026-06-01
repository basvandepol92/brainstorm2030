'use strict';

const TOKEN_KEY = 'rz_admin_token';
const STAGES = [
  { id: 'home', label: 'Home / lobby' },
  { id: 'fase1', label: 'Fase 1' },
  { id: 'voting', label: 'Dotvoten' },
  { id: 'fase2', label: 'Fase 2' },
  { id: 'fase3', label: 'Fase 3' },
  { id: 'done', label: 'Afgerond' },
];
const PHASES = [
  { id: 'fase1', label: 'Fase 1' },
  { id: 'voting', label: 'Dotvoten' },
  { id: 'fase2', label: 'Fase 2' },
  { id: 'fase3', label: 'Fase 3' },
];

let token = sessionStorage.getItem(TOKEN_KEY) || '';
let state = null;
let timer = null;

const $ = (id) => document.getElementById(id);

function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1600);
}

async function api(path, method = 'GET', body) {
  const res = await fetch(`/api/admin${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (res.status === 401) {
    logout();
    throw new Error('unauthorized');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function logout() {
  token = '';
  sessionStorage.removeItem(TOKEN_KEY);
  if (timer) clearInterval(timer);
  $('app').classList.add('hidden');
  $('login').classList.remove('hidden');
}

async function login() {
  const pw = $('pw').value;
  $('loginErr').textContent = '';
  token = pw;
  try {
    await api('/login', 'POST');
    sessionStorage.setItem(TOKEN_KEY, token);
    start();
  } catch {
    token = '';
    $('loginErr').textContent = 'Onjuist wachtwoord.';
  }
}

function fmtTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function endTime(t) {
  if (!t.startTime) return null;
  return new Date(new Date(t.startTime).getTime() + t.durationMin * 60000);
}

function render() {
  if (!state) return;
  $('status').textContent = `Actief: ${STAGES.find((s) => s.id === state.stage)?.label ?? state.stage}`;

  // Stages
  const stages = $('stages');
  stages.innerHTML = '';
  for (const s of STAGES) {
    const b = document.createElement('button');
    b.className = `stage-btn${state.stage === s.id ? ' active' : ''}`;
    b.textContent = s.label;
    b.onclick = () => act(() => api('/stage', 'POST', { stage: s.id }), `Fase: ${s.label}`);
    stages.appendChild(b);
  }

  // Timers
  const timers = $('timers');
  timers.innerHTML = '';
  for (const p of PHASES) {
    const t = state.timers[p.id];
    const end = endTime(t);
    const row = document.createElement('div');
    row.className = 'timer-row';
    const info = document.createElement('div');
    info.innerHTML =
      `<div class="name">${p.label}</div>` +
      `<div class="meta">Start ${fmtTime(t.startTime)} · ${t.durationMin} min · ` +
      `terug om <strong>${end ? fmtTime(end.toISOString()) : '—'}</strong></div>`;
    const dur = document.createElement('input');
    dur.type = 'number';
    dur.min = '1';
    dur.max = '600';
    dur.value = t.durationMin;
    dur.style.width = '64px';
    dur.onchange = () =>
      act(() => api('/timer', 'POST', { phase: p.id, durationMin: Number(dur.value) }), 'Duur opgeslagen');
    const startBtn = document.createElement('button');
    startBtn.className = 'primary';
    startBtn.textContent = 'Start nu';
    startBtn.onclick = () =>
      act(() => api('/timer', 'POST', { phase: p.id, startNow: true }), `${p.label} gestart`);
    row.append(info, dur, startBtn);
    timers.appendChild(row);
  }

  // Outcomes
  const list = $('outcomes');
  list.innerHTML = '';
  const counts = state.tallies || {};
  const max = Math.max(1, ...Object.values(counts));
  for (const o of state.outcomes) {
    const wrap = document.createElement('div');
    wrap.className = 'outcome';
    const left = document.createElement('div');
    const c = counts[o.id] || 0;
    left.innerHTML =
      `<div class="txt">${escapeHtml(o.text)}</div>` +
      `<div class="bar" style="width:${(c / max) * 100}%"></div>` +
      `<div class="meta muted">${c} stem${c === 1 ? '' : 'men'}</div>`;
    const actions = document.createElement('div');
    actions.className = 'row';
    const edit = document.createElement('button');
    edit.className = 'ghost';
    edit.textContent = '✏';
    edit.onclick = () => {
      const next = prompt('Opbrengst aanpassen:', o.text);
      if (next != null && next.trim()) act(() => api(`/outcomes/${o.id}`, 'PATCH', { text: next }), 'Aangepast');
    };
    const del = document.createElement('button');
    del.className = 'danger';
    del.textContent = '🗑';
    del.onclick = () => {
      if (confirm('Verwijderen?')) act(() => api(`/outcomes/${o.id}`, 'DELETE'), 'Verwijderd');
    };
    actions.append(edit, del);
    wrap.append(left, actions);
    list.appendChild(wrap);
  }
  if (!state.outcomes.length) list.innerHTML = '<p class="muted">Nog geen opbrengsten.</p>';

  // Voting
  const open = state.voting.open;
  const pill = $('votingPill');
  pill.className = `pill ${open ? 'on' : 'off'}`;
  pill.innerHTML = `<span class="dot"></span>${open ? 'Stemmen open' : 'Stemmen dicht'}`;
  $('votesCast').textContent = `${state.votesCast} van 14 hebben gestemd`;
  $('toggleVoting').textContent = open ? 'Stemmen sluiten' : 'Stemmen openen';
  $('toggleResults').textContent = state.voting.resultsRevealed ? 'Uitslag verbergen' : 'Uitslag tonen';
  if (document.activeElement !== $('dots')) $('dots').value = state.voting.dotsPerVoter;

  // Wie heeft al wel/niet gestemd
  const voted = state.voted || [];
  const pending = state.pending || [];
  const total = (state.participants || []).length;
  const chips = (names, cls) =>
    names.map((n) => `<span class="chip ${cls}"><span class="dot"></span>${escapeHtml(n)}</span>`).join('');
  $('voters').innerHTML =
    `<div class="label" style="margin-top:6px">Gestemd · ${voted.length}/${total}</div>` +
    `<div class="chips">${chips(voted, 'voted') || '<span class="muted" style="font-size:12px">Nog niemand</span>'}</div>` +
    `<div class="label" style="margin-top:12px">Nog niet</div>` +
    `<div class="chips">${
      chips(pending, 'pending') || '<span class="muted" style="font-size:12px">Iedereen heeft gestemd 🎉</span>'
    }</div>`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

async function act(fn, msg) {
  try {
    state = await fn();
    render();
    if (msg) toast(msg);
  } catch (e) {
    toast(`Fout: ${e.message}`);
  }
}

async function refresh() {
  try {
    state = await api('/state');
    render();
  } catch {
    /* transient; keep last state */
  }
}

function start() {
  $('login').classList.add('hidden');
  $('app').classList.remove('hidden');
  refresh();
  if (timer) clearInterval(timer);
  timer = setInterval(refresh, 4000);
}

// Wire up controls
$('loginBtn').onclick = login;
$('pw').addEventListener('keydown', (e) => e.key === 'Enter' && login());
$('logout').onclick = logout;
$('addOutcome').onclick = () => {
  const input = $('newOutcome');
  const text = input.value.trim();
  if (!text) return;
  act(() => api('/outcomes', 'POST', { text }), 'Toegevoegd').then(() => (input.value = ''));
};
$('newOutcome').addEventListener('keydown', (e) => e.key === 'Enter' && $('addOutcome').click());
$('saveDots').onclick = () =>
  act(() => api('/voting', 'POST', { dotsPerVoter: Number($('dots').value) }), 'Opgeslagen');
$('toggleVoting').onclick = () =>
  act(() => api('/voting', 'POST', { open: !state.voting.open }), 'Bijgewerkt');
$('toggleResults').onclick = () =>
  act(() => api('/voting', 'POST', { resultsRevealed: !state.voting.resultsRevealed }), 'Bijgewerkt');
$('resetVotes').onclick = () => {
  if (confirm('Alle stemmen wissen?')) act(() => api('/reset-votes', 'POST'), 'Stemmen gewist');
};

// Auto-resume if a token is already in this tab's session.
if (token) {
  api('/login', 'POST')
    .then(start)
    .catch(() => logout());
}
