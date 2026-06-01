# Backend — live sessiebesturing

Een **dependency-vrije** Node-server (alleen Node-ingebouwde modules) die op één
origin draait:

- de gebouwde front-end (`dist/`, via `npm run build`)
- de console voor Bas op **`/admin`**
- de JSON-API op **`/api`**

De server houdt de live sessie bij: welke fase actief is, de starttijd/terugkomtijd
per onderdeel, de opbrengsten van fase 1, en het dotvoten daartussen.

## Lokaal draaien

```bash
cp .env.example .env          # vul ADMIN_PASSWORD in
npm install                   # eenmalig (front-end build-deps)
VITE_LIVE=true npm run build  # bouwt dist/ in live-modus
npm run server:dev            # start op http://localhost:3001
```

- Deelnemers-app: <http://localhost:3001>
- Console voor Bas: <http://localhost:3001/admin>

Backend-tests: `npm run test:server`.

## Deployen op Railway

1. Push deze branch naar GitHub en maak op [railway.app](https://railway.app) een
   **New Project → Deploy from GitHub repo**. Railway leest `railway.json`:
   - build: `VITE_LIVE=true npm run build`
   - start: `npm start`
2. **Variables** (Settings → Variables):
   - `ADMIN_PASSWORD` → een lange, willekeurige waarde. Zonder dit zijn de
     admin-endpoints uitgeschakeld (503).
   - `DATA_DIR` → `/data`
3. **Volume** (Settings → Volumes): voeg een volume toe met mount path `/data`.
   Hierin staat `state.json`, zodat de sessie **een redeploy overleeft**.
4. Open de gegenereerde URL. De app draait; `/admin` vraagt om het wachtwoord.

`PORT` wordt door Railway automatisch gezet — niet zelf invullen.

### Front-end los hosten (optioneel)

Wil je de front-end op GitHub Pages houden en alleen de API op Railway? Bouw de
front-end dan met `VITE_API_BASE=https://<jouw>.up.railway.app` en zet op Railway
`CORS_ORIGINS=https://brainstorm2030.nl`. Standaard (alles op Railway) is dit niet
nodig.

## Beveiliging

- **Admin achter een wachtwoord** dat via `Authorization: Bearer <wachtwoord>`
  wordt gecontroleerd met een constant-time vergelijking (geen timing-lek).
- **Deelnemers** stemmen op naam (uit de bekende lijst); één stembiljet per naam,
  en het serverseitige maximum aantal stippen wordt afgedwongen.
- **Security headers** op elk antwoord: Content-Security-Policy, `X-Frame-Options:
  DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`.
- **Rate limiting** per IP (ruim voor pollen, strenger op stemmen/admin-acties).
- **Padbescherming**: statische bestanden kunnen niet buiten hun map worden
  opgevraagd (geen path traversal).
- **Geen secrets in git**: `.env` en de `data/`-map staan in `.gitignore`. De
  enige secret (`ADMIN_PASSWORD`) leeft alleen in de omgeving / Railway-variables.

## API (kort)

Publiek:

- `GET /api/state?name=<naam>` — huidige fase, timers, opbrengsten, stemstatus en
  (na vrijgave) de uitslag; met `name` ook het eigen stembiljet.
- `POST /api/vote` `{ name, outcomeIds[] }` — stem uitbrengen/bijwerken.

Admin (Bearer-token vereist): `GET /api/admin/state`, `POST /api/admin/stage`,
`POST /api/admin/timer`, `POST /api/admin/outcomes`, `PATCH|DELETE
/api/admin/outcomes/:id`, `POST /api/admin/voting`, `POST /api/admin/reset-votes`.
