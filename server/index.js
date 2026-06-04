import { createServer } from 'node:http';
import { timingSafeEqual } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isParticipant } from './participants.js';
import {
  addOutcome,
  adminState,
  castVote,
  deleteOutcome,
  load,
  publicState,
  resetVotes,
  setStage,
  setTimer,
  setVotingConfig,
  updateOutcome,
} from './state.js';

/**
 * Zero-dependency HTTP server (Node built-ins only) so there is no supply-chain
 * surface to trust and it runs anywhere. Serves the built front-end (dist/),
 * the Bas console (/admin) and the JSON API (/api) on one origin.
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const ADMIN_DIR = join(__dirname, 'public');

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';
const CORS_ORIGINS = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

if (!ADMIN_PASSWORD) {
  console.warn(
    '[security] ADMIN_PASSWORD is not set — admin endpoints return 503. ' +
      'Set ADMIN_PASSWORD to enable the Bas console.',
  );
}

// ── Security headers ─────────────────────────────────────────────────────────
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  `connect-src 'self'${CORS_ORIGINS.length ? ' ' + CORS_ORIGINS.join(' ') : ''}`,
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join('; ');

function setSecurityHeaders(res) {
  res.setHeader('Content-Security-Policy', CSP);
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
}

// ── Rate limiting (fixed window) ─────────────────────────────────────────────
// NOTE: the whole room is typically behind one office NAT, so every participant
// shares a single public IP. Per-IP limits must therefore fit a roomful of
// devices polling at once — they are a coarse DoS backstop, not a per-user cap.
// Votes are instead limited per participant NAME so one person can't spam while
// the rest of the room stays unaffected.
function makeLimiter(windowMs, max) {
  const hits = new Map(); // key -> { count, resetAt }
  return (key) => {
    const now = Date.now();
    let e = hits.get(key);
    if (!e || now > e.resetAt) {
      e = { count: 0, resetAt: now + windowMs };
      hits.set(key, e);
    }
    e.count += 1;
    if (hits.size > 5000) for (const [k, v] of hits) if (now > v.resetAt) hits.delete(k);
    return e.count <= max;
  };
}
// Per IP: high enough for a NAT'd room (e.g. 30 devices polling every 4s ≈ 450/min).
const apiLimiter = makeLimiter(60_000, 1200);
// Per participant name: plenty for re-voting, blocks a single spammer.
const voteLimiter = makeLimiter(60_000, 40);
// Per IP: admin (Bas) clicking through outcomes/timers/stages.
const adminLimiter = makeLimiter(60_000, 240);

// ── Helpers ──────────────────────────────────────────────────────────────────
function json(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function readBody(req, limit = 16 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) {
        reject(new Error('payload too large'));
        req.destroy();
        return;
      }
      chunks.push(c);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('invalid json'));
      }
    });
    req.on('error', reject);
  });
}

function safeEqual(a, b) {
  const ba = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

function isAuthed(req) {
  if (!ADMIN_PASSWORD) return false;
  const header = req.headers['authorization'] || '';
  const token = header.startsWith('Bearer ')
    ? header.slice(7)
    : req.headers['x-admin-token'] || '';
  return Boolean(token) && safeEqual(token, ADMIN_PASSWORD);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

/** Serve a file from `dir`, refusing path traversal. Returns true if handled. */
function serveStatic(res, dir, relPath, fallbackFile) {
  // Strip query and normalise; reject anything escaping the root.
  const clean = normalize(decodeURIComponent(relPath)).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(dir, clean);
  if (!filePath.startsWith(dir)) {
    json(res, 403, { error: 'forbidden' });
    return true;
  }
  if (!existsSync(filePath) || extname(filePath) === '') {
    if (!fallbackFile) return false;
    filePath = fallbackFile;
  }
  if (!existsSync(filePath)) return false;
  const ext = extname(filePath);
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(filePath));
  return true;
}

// ── Request handler ──────────────────────────────────────────────────────────
export function handler(req, res) {
  setSecurityHeaders(res);

  const origin = req.headers.origin;
  if (origin && CORS_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || 'unknown';

  if (path.startsWith('/api/')) {
    if (!apiLimiter(ip)) return json(res, 429, { error: 'rate limited' });
    return routeApi(req, res, url, ip).catch((err) => json(res, 400, { error: err.message }));
  }

  // Admin console assets
  if (path === '/admin' || path === '/admin/') {
    if (serveStatic(res, ADMIN_DIR, 'admin.html')) return;
  }
  if (path.startsWith('/admin/')) {
    if (serveStatic(res, ADMIN_DIR, path.slice('/admin/'.length))) return;
  }

  // Front-end (built SPA) with index.html fallback for client routes
  if (existsSync(DIST)) {
    const rel = path === '/' ? 'index.html' : path.slice(1);
    if (serveStatic(res, DIST, rel, join(DIST, 'index.html'))) return;
  } else if (path === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Front-end not built. Run "npm run build". API is live at /api.');
  }

  json(res, 404, { error: 'not found' });
}

async function routeApi(req, res, url, ip) {
  const path = url.pathname;
  const method = req.method;

  // Public
  if (path === '/api/health' && method === 'GET') return json(res, 200, { ok: true });
  if (path === '/api/state' && method === 'GET') {
    const name = url.searchParams.get('name') || undefined;
    return json(res, 200, publicState(name));
  }
  if (path === '/api/vote' && method === 'POST') {
    const { name, outcomeIds } = await readBody(req);
    if (!isParticipant(name)) return json(res, 400, { error: 'unknown participant' });
    // Limit per participant name, not per IP — the room shares one office IP.
    if (!voteLimiter(name)) return json(res, 429, { error: 'rate limited' });
    try {
      return json(res, 200, { ok: true, myVote: castVote(name, outcomeIds) });
    } catch (err) {
      return json(res, 400, { error: err.message });
    }
  }

  // Admin (per-IP limiter + auth)
  if (path.startsWith('/api/admin/')) {
    if (!adminLimiter(ip)) return json(res, 429, { error: 'rate limited' });
    if (!ADMIN_PASSWORD) return json(res, 503, { error: 'admin disabled' });
    if (!isAuthed(req)) return json(res, 401, { error: 'unauthorized' });
    return routeAdmin(req, res, url);
  }

  return json(res, 404, { error: 'not found' });
}

async function routeAdmin(req, res, url) {
  const path = url.pathname.slice('/api/admin'.length); // e.g. /stage
  const method = req.method;

  try {
    if (path === '/login' && method === 'POST') return json(res, 200, { ok: true });
    if (path === '/state' && method === 'GET') return json(res, 200, adminState());

    if (path === '/stage' && method === 'POST') {
      setStage((await readBody(req)).stage);
      return json(res, 200, adminState());
    }
    if (path === '/timer' && method === 'POST') {
      const b = await readBody(req);
      setTimer(b.phase, b);
      return json(res, 200, adminState());
    }
    if (path === '/outcomes' && method === 'POST') {
      addOutcome((await readBody(req)).text);
      return json(res, 200, adminState());
    }
    if (path === '/voting' && method === 'POST') {
      setVotingConfig(await readBody(req));
      return json(res, 200, adminState());
    }
    if (path === '/reset-votes' && method === 'POST') {
      resetVotes();
      return json(res, 200, adminState());
    }

    const outcomeMatch = path.match(/^\/outcomes\/([^/]+)$/);
    if (outcomeMatch) {
      const id = decodeURIComponent(outcomeMatch[1]);
      if (method === 'PATCH') {
        updateOutcome(id, (await readBody(req)).text);
        return json(res, 200, adminState());
      }
      if (method === 'DELETE') {
        deleteOutcome(id);
        return json(res, 200, adminState());
      }
    }

    return json(res, 404, { error: 'not found' });
  } catch (err) {
    const status = err.message === 'not found' ? 404 : 400;
    return json(res, status, { error: err.message });
  }
}

export function createApp() {
  return createServer(handler);
}

// Start only when run directly (not when imported by tests).
const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  load();
  createApp().listen(PORT, () => console.log(`[server] listening on :${PORT}`));
}
