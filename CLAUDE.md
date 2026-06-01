# Regio Zuid Brainstorm 2030 — Projectcontext

## Wat is dit?

Een mobiele webapp voor een interne brainstormsessie van Regio Zuid. Deelnemers openen de app op hun telefoon tijdens de sessie.

> **Let op (juni 2026):** de app is geen single-file HTML meer. Het is een **React + TypeScript + Vite + Tailwind v4**-project met tests (Vitest). De beschrijving hieronder is grotendeels nog inhoudelijk geldig (data, fases, content), maar de implementatie zit in `src/`. Daarnaast is er een optionele **NodeJS-backend** (`server/`) voor live sessiebesturing — zie "Backend & live-modus" onderaan.

## Technische opzet

- **Stack**: React 19 + TypeScript + Vite 6 + Tailwind v4; tests via Vitest. Entry: `index.html` → `src/main.tsx` → `src/App.tsx`.
- **Hosting front-end**: GitHub Pages (CI bouwt `dist/` → standalone modus) én/of Railway (samen met de backend → live modus).
- **Font**: Inter via Google Fonts CDN
- **Opslag (client)**: `localStorage` voor naam van de deelnemer (`rz_user`)
- **Backend (optioneel)**: dependency-vrije Node-server in `server/`, JSON-opslag op een Railway-volume.

## Design

- **Kleurenschema**: zwart (`#080808`) en geel (`#F7C948`) als primaire kleuren
- **Accenten fase 2-rollen**: geel (Superheld), rood (`#FF453A`, Villain), blauw (`#2F9EFF`, Sidekick)
- **Font**: Inter (400–900 weight)
- **Stijl**: dark mode, mobile-first, glassmorphism-achtige cards, subtiele glows
- **Navigatie**: fixed bottom nav bar met 5 tabs (Home, Spelregels, Fase 1, Fase 2, Fase 3)
- **Header**: fixed top bar met app-naam en naam van ingelogde deelnemer

## App-structuur

### Schermen
1. **Name picker** (eerste scherm) — deelnemer kiest naam uit alfabetische lijst; naam wordt opgeslagen in `localStorage`
2. **Hoofdapp** — zichtbaar na naamkeuze, bestaat uit:
   - Header (vast bovenaan)
   - Content area met 5 tabs
   - Bottom navigation bar

### Tabs
| Tab | ID | Inhoud |
|---|---|---|
| Home | `p-home` | Welkomstbericht + overzicht groepsindeling per fase |
| Spelregels | `p-spelregels` | 8 brainstormregels |
| Fase 1 | `p-fase1` | Uitleg, tijdsindicator, groep, groepsleden, uitklapbare themavragen |
| Fase 2 | `p-fase2` | Uitleg, tijdsindicator, groep, rolkaart (SVG-illustratie + beschrijving), begeleidende vragen per rol, groepsleden met roldotjes |
| Fase 3 | `p-fase3` | Uitleg, tijdsindicator, groep, groepsleden, begeleidende vragen |

## Deelnemersdata

De `PEOPLE`-array in de `<script>` bevat alle 14 deelnemers:

```js
{ name, f1, f2, rol, f3 }
// f1 = groep in fase 1 ("Groep 1" / "Groep 2" / "Groep 3")
// f2 = groep in fase 2
// rol = "superheld" | "villain" | "sidekick"
// f3 = groep in fase 3
```

| Naam | Fase 1 | Fase 2 groep | Rol | Fase 3 |
|---|---|---|---|---|
| Sven | Groep 1 | Groep 2 | superheld | Groep 1 |
| Bram | Groep 1 | Groep 3 | superheld | Groep 1 |
| Elske | Groep 1 | Groep 1 | superheld | Groep 2 |
| Anne-Sophie | Groep 1 | Groep 3 | superheld | Groep 3 |
| Britt | Groep 2 | Groep 1 | villain | Groep 1 |
| Richard | Groep 2 | Groep 2 | villain | Groep 3 |
| Ellen | Groep 2 | Groep 2 | sidekick | Groep 2 |
| Bas | Groep 2 | Groep 1 | sidekick | Groep 2 |
| Julia | Groep 2 | Groep 2 | villain | Groep 3 |
| Jordy | Groep 3 | Groep 1 | superheld | Groep 1 |
| René | Groep 3 | Groep 3 | villain | Groep 2 |
| Wouter | Groep 3 | Groep 3 | sidekick | Groep 2 |
| Remco | Groep 3 | Groep 2 | superheld | Groep 2 |
| Eline | Groep 3 | Groep 1 | villain | Groep 2 |

Namen worden alfabetisch gesorteerd weergegeven in de picker (`localeCompare('nl')`).

## Brainstorm-inhoud

### Fase 1 — Samen dromen over Regio Zuid in 2030
**Tijdsverdeling**: 30 min brainstorm + 10 min plenair terugkoppelen

**Thema's met begeleidende vragen** (uitklapbaar per thema):
- 👥 **Klant** — wat zeggen klanten, waarom kiezen ze voor ons, méér dan detacheerder?
- ⭐ **Rockstar** — waarom horen Rockstars bij ons, wat ervaren ze, hoe ziet werkgeluk eruit?
- 🤝 **Samenwerking in de regio** — Sales/TM/Recruitment/P&C/MD samenwerking, wat loopt vanzelf, uitzonderlijk goed in?
- 🚀 **Dienstverlening** — nieuwe diensten, rol van AI/consultancy/projecten, marktpositie?
- ⚙️ **Organisatie & Operatie** — slimmer/schaalbaarder, keuzes, wat doen we níet meer, gamechanging?

### Fase 2 — Optimisme, kritiek & realisme
**Tijdsverdeling**: 30 min brainstorm + 10 min plenair terugkoppelen

**Rollen** (vooraf bepaald, zichtbaar in app):

| Rol | Kleur | Houding | Begeleidende vragen |
|---|---|---|---|
| **Superheld** | Geel | Positief optimistisch | Waarom kansrijk? Beste versie in 2030? Welke superkracht? Moedige eerste stap? |
| **Villain** | Rood | Kritisch, valkuilen | Waarom mislukken? Te makkelijke aannames? Zelf voor de gek houden? Praktisch lastig? |
| **Sidekick** | Blauw | Helpend, meerdere perspectieven | Wat nodig om te slagen? Welke disciplines? Randvoorwaarden? Rockstar op 1? |

Elke rol heeft een SVG-illustratie inline in de `ROLES`-object.

### Fase 3 — Van dromen naar concrete acties in H2
**Tijdsverdeling**: 30 min brainstorm + 10 min plenair terugkoppelen

**Begeleidende vragen**:
1. Welke 1 of 2 thema's raken onze discipline het meest?
2. Wat moeten wij in H2 al anders, beter of slimmer gaan doen?
3. Welke concrete actie kunnen we starten binnen 30 dagen?
4. Welke actie vraagt samenwerking met een andere discipline?
5. Wat moeten we stoppen, versimpelen of niet meer doen?
6. Wat hebben we nodig van MT om dit mogelijk te maken?

## Spelregels (8 stuks)
1. Elk idee is welkom — oordeel pas later
2. Bouw voort op ideeën van anderen ("ja, en…")
3. Eén gesprek tegelijk
4. Iedereen draagt bij
5. Houd de energie hoog
6. Telefoon in de zak (behalve voor deze app)
7. Respect voor ieders perspectief
8. Houd de tijd in de gaten

## Belangrijke JS-functies

| Functie | Wat doet het |
|---|---|
| `buildNameList()` | Bouwt de alfabetische namenlijst in de picker |
| `selectUser(user, animate)` | Laadt alle persoonsgebonden data in de UI |
| `renderChips(containerId, people, myName, field)` | Toont groepsleden als chips; in fase 2 met roldotjes |
| `renderRoleCard(rol)` | Vult de rolkaart in fase 2 met naam, SVG, beschrijving en vragen |
| `showTab(tab)` | Schakelt tussen de 5 tabs |
| `toggleQ(head)` | Klapt een themavraag-sectie open/dicht |
| `resetUser()` | Wist localStorage en toont de name picker opnieuw |

## Openstaande wensen / mogelijke vervolgstappen

- **Afbeeldingen voor rollen**: de SVG-illustraties in `ROLES[rol].svg` zijn placeholders. Vervang ze door `<img src="superheld.png">` of een base64-afbeelding als je echte illustraties wilt toevoegen.
- **Spelregels aanpassen**: staat hardcoded in de HTML in `#p-spelregels`.
- **Nieuwe deelnemers toevoegen**: voeg een object toe aan de `PEOPLE`-array.
- **Tijden aanpassen**: zoek op `30 min brainstorm` en `10 min plenair` in de HTML.
- **Fasevergrendeling**: er is eerder een versie gemaakt waarbij fases niet terug te navigeren waren. Die is teruggedraaid op verzoek. De logica is beschikbaar als dat alsnog gewenst is.

## Backend & live-modus (`server/`)

Optionele, **dependency-vrije** Node-server (alleen ingebouwde modules) die op één origin draait en zowel de gebouwde front-end (`dist/`), de console voor Bas (`/admin`) als de JSON-API (`/api`) serveert. Bedoeld voor goedkope hosting op Railway. Zie `server/README.md` voor deploy- en beveiligingsdetails.

**Wat de backend stuurt:**

- **Actieve fase** centraal (`stage`: `home` / `fase1` / `voting` / `fase2` / `fase3` / `done`). Deelnemers kiezen niet meer zelf hun fase; de front-end toont automatisch de actieve fase.
- **Starttijd + duur per onderdeel** → de front-end toont een live countdown en "terug om HH:MM".
- **Opbrengsten fase 1** die Bas live meeschrijft.
- **Dotvoten** tussen fase 1 en 2: elke deelnemer kiest max. N opbrengsten (1 stembiljet per naam, serverseits afgedwongen); top 9 gaat door, uitslag wordt door Bas vrijgegeven.

**Twee modi (front-end):**

- **Standalone** (geen `VITE_LIVE`): exact het oude gedrag — handmatige tabs Home/Spelregels/Fase 1-3. Zo draaien ook de Vitest-tests en de GitHub Pages-build.
- **Live** (`VITE_LIVE=true`, gezet door het Railway build-commando in `railway.json`): backend-gestuurd. Bottom-nav = Home / Spelregels / **Nu**; "Nu" toont de actieve fase. Bij geen verbinding blijft de laatst bekende state staan.

**Belangrijke bestanden:**

| Pad | Wat |
|---|---|
| `server/index.js` | HTTP-server, routing, security headers, rate limiting, static serving |
| `server/state.js` | Persistente JSON-state (op `DATA_DIR`, default `./data`) + mutaties |
| `server/participants.js` | Bekende deelnemersnamen (sync houden met `src/data/people.ts`) |
| `server/public/admin.{html,js}` | Console voor Bas |
| `src/session/` | API-client, types, timer-context (front-end live-modus) |
| `src/hooks/useSession.ts` | Polling van `/api/state` + stem-actie |
| `src/components/LiveApp.tsx` | Live-modus shell + fase-routing |
| `src/components/tabs/VotingTab.tsx` | Dotvoten-UI |

**Secrets:** alleen `ADMIN_PASSWORD` (env / Railway-variable). `.env` en `data/` staan in `.gitignore` — nooit committen.
