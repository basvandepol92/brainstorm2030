# Avatarfoto's van deelnemers

Zet hier de foto's neer. Elke foto wordt automatisch getoond bij de juiste
naam in de name-picker. Ontbreekt een foto? Dan vallen we netjes terug op de
initialen — je hoeft dus niet alle foto's tegelijk toe te voegen.

## Regels

- **Map**: `public/avatars/`
- **Bestandsformaat**: `.png` (of `.jpg` — beide worden ondersteund)
- **Bestandsnaam**: de naam in kleine letters, zonder accenten, spaties/koppeltekens
  worden `-`. (Zie de exacte lijst hieronder.)
- **Aanbevolen**: vierkant bijgesneden (bijv. 400×400 px), want hij wordt rond/
  afgerond getoond.

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

`.png` en `.jpg` werken out of the box (het component probeert beide). Wil je
nog een ander formaat zoals `.webp`? Voeg de extensie toe aan de `EXTENSIONS`-
lijst bovenin `src/components/Avatar.tsx`.
