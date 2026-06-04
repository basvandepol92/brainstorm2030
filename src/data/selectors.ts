import type { Person, Phase, Role } from './types';

/** People sorted alphabetically by Dutch collation, for the name picker. */
export function sortedByName(people: Person[]): Person[] {
  return [...people].sort((a, b) => a.name.localeCompare(b.name, 'nl'));
}

export function findByName(people: Person[], name: string): Person | undefined {
  return people.find((p) => p.name === name);
}

/** The group label a person belongs to in the given phase. */
export function groupForPhase(person: Person, phase: Phase): string {
  return person[phase];
}

/** Everyone (including the person) sharing their group in the given phase. */
export function groupMates(people: Person[], person: Person, phase: Phase): Person[] {
  return people.filter((p) => p[phase] === person[phase]);
}

export function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

/**
 * Filename-safe slug for a participant, used to look up their avatar photo
 * at `public/avatars/<slug>.png`. Strips diacritics and non-alphanumerics.
 * e.g. "Anne-Sophie" -> "anne-sophie", "René" -> "rene".
 */
export function avatarSlug(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const ROLE_LABEL: Record<Role, string> = {
  superhero: 'Superhero',
  villain: 'Villain',
  sidekick: 'Sidekick',
};

/** Alliterative "hero name" per participant, matching their Fase 2 role. */
export const HERO_NAMES: Record<string, string> = {
  Sven: 'Super Sven',
  Bram: 'Brave Bram',
  Elske: 'Epic Elske',
  'Anne-Sophie': 'Amazing Anne-Sophie',
  Britt: 'Bad Britt',
  Richard: 'Ruthless Richard',
  Ellen: 'Electric Ellen',
  Bas: 'Booster Bas',
  Julia: 'Jinx Julia',
  Jordy: 'Justice Jordy',
  René: 'Rogue René',
  Wouter: 'Wingman Wouter',
  Remco: 'Rocket Remco',
  Eline: 'Evil Eline',
};

/** The participant's hero name, or their plain name if none is defined. */
export function heroName(name: string): string {
  return HERO_NAMES[name] ?? name;
}

/** Numeric group from a label like "Groep 2" → 2. Returns 0 if not found. */
export function groupNumber(group: string): number {
  const m = group.match(/(\d+)/);
  return m ? Number(m[1]) : 0;
}

/**
 * Distribute a ranked top-list round-robin over 3 groups and return the items
 * for one group, with their 1-based rank. Groep 1 → ranks 1,4,7; Groep 2 →
 * 2,5,8; Groep 3 → 3,6,9. Works for any list length (also < 9).
 */
export function topForGroup<T>(top: T[], group: string): { rank: number; item: T }[] {
  const g = groupNumber(group);
  if (g < 1) return [];
  const result: { rank: number; item: T }[] = [];
  for (let i = 0; i < top.length; i++) {
    if (i % 3 === g - 1) result.push({ rank: i + 1, item: top[i] });
  }
  return result;
}
