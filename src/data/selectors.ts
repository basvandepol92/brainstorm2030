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
