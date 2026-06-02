import { describe, expect, it } from 'vitest';
import { PEOPLE } from './people';
import {
  avatarSlug,
  capitalize,
  findByName,
  groupForPhase,
  groupMates,
  HERO_NAMES,
  heroName,
  initials,
  ROLE_LABEL,
  sortedByName,
} from './selectors';
import type { Person } from './types';

const bas = findByName(PEOPLE, 'Bas')!;

describe('sortedByName', () => {
  it('orders alphabetically with Dutch collation and does not mutate input', () => {
    const input = [...PEOPLE];
    const sorted = sortedByName(input);
    const names = sorted.map((p) => p.name);
    expect(names[0]).toBe('Anne-Sophie');
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b, 'nl')));
    expect(input).toEqual(PEOPLE);
  });
});

describe('findByName', () => {
  it('finds an existing person', () => {
    expect(findByName(PEOPLE, 'Julia')?.rol).toBe('villain');
  });

  it('returns undefined for an unknown name', () => {
    expect(findByName(PEOPLE, 'Nobody')).toBeUndefined();
  });
});

describe('groupForPhase', () => {
  it('returns the group for the requested phase', () => {
    expect(groupForPhase(bas, 'f1')).toBe('Groep 2');
    expect(groupForPhase(bas, 'f2')).toBe('Groep 1');
    expect(groupForPhase(bas, 'f3')).toBe('Groep 2');
  });
});

describe('groupMates', () => {
  it('includes the person and everyone sharing their phase group', () => {
    const mates = groupMates(PEOPLE, bas, 'f2');
    const names = mates.map((p) => p.name);
    expect(names).toContain('Bas');
    expect(mates.every((p) => p.f2 === 'Groep 1')).toBe(true);
  });

  it('partitions everyone for a phase', () => {
    const phaseGroups = new Set(PEOPLE.map((p) => p.f1));
    const total = [...phaseGroups].reduce((sum, g) => {
      const sample = PEOPLE.find((p) => p.f1 === g) as Person;
      return sum + groupMates(PEOPLE, sample, 'f1').length;
    }, 0);
    expect(total).toBe(PEOPLE.length);
  });
});

describe('initials & capitalize', () => {
  it('builds two-letter uppercase initials', () => {
    expect(initials('Anne-Sophie')).toBe('AN');
    expect(initials('Bas')).toBe('BA');
  });

  it('capitalizes the first letter', () => {
    expect(capitalize('superhero')).toBe('Superhero');
  });
});

describe('avatarSlug', () => {
  it('lowercases and keeps hyphenated names', () => {
    expect(avatarSlug('Anne-Sophie')).toBe('anne-sophie');
  });

  it('strips diacritics', () => {
    expect(avatarSlug('René')).toBe('rene');
  });

  it('produces a clean slug for every participant', () => {
    for (const p of PEOPLE) {
      expect(avatarSlug(p.name)).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    }
  });
});

describe('ROLE_LABEL', () => {
  it('maps every role key', () => {
    expect(ROLE_LABEL).toEqual({
      superhero: 'Superhero',
      villain: 'Villain',
      sidekick: 'Sidekick',
    });
  });
});

describe('heroName', () => {
  it('returns the mapped hero name', () => {
    expect(heroName('Bas')).toBe('Booster Bas');
    expect(heroName('Anne-Sophie')).toBe('Amazing Anne-Sophie');
  });

  it('falls back to the plain name when none is defined', () => {
    expect(heroName('Nobody')).toBe('Nobody');
  });

  it('defines a hero name for every participant', () => {
    for (const p of PEOPLE) {
      expect(HERO_NAMES[p.name]).toBeTruthy();
    }
  });
});
