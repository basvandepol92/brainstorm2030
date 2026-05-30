# Pokémon-kaart afbeeldingen per deelnemer

Hier komt de kaart-artwork die in Fase 2 wordt getoond zodra iemand op
**"Toon mijn rol"** klikt. Elke afbeelding vult het artwork-venster van de
kaart. Ontbreekt een afbeelding? Dan vallen we netjes terug op de
rol-illustratie (Superheld / Villain / Sidekick) — je hoeft dus niet alle
kaarten tegelijk aan te leveren.

## Regels

- **Map**: `public/cards/`
- **Bestandsformaat**: `.png` (of `.jpg` — beide worden ondersteund)
- **Bestandsnaam**: de naam in kleine letters, zonder accenten; spaties/
  koppeltekens worden `-`. (Zelfde slug als bij de avatars.)
- **Aanbevolen verhouding**: liggend **4:3** (bijv. 800×600 px); de afbeelding
  wordt bijgesneden om het venster te vullen (`object-cover`).

## Exacte bestandsnamen

| Deelnemer    | Bestandsnaam        |
| ------------ | ------------------- |
| Anne-Sophie  | `anne-sophie.png`   |
| Bas          | `bas.png`           |
| Bram         | `bram.png`          |
| Britt        | `britt.png`         |
| Eline        | `eline.png`         |
| Ellen        | `ellen.png`         |
| Elske        | `elske.png`         |
| Jordy        | `jordy.png`         |
| Julia        | `julia.png`         |
| Remco        | `remco.png`         |
| René         | `rene.png`          |
| Richard      | `richard.png`       |
| Sven         | `sven.png`          |
| Wouter       | `wouter.png`        |

## Een ander formaat gebruiken?

`.png` en `.jpg` werken out of the box. Wil je nog een ander formaat zoals
`.webp`? Voeg de extensie toe aan de `CARD_EXTENSIONS`-lijst bovenin
`src/components/tabs/PokemonCard.tsx`.
