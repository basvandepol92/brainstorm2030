import { describe, expect, it } from 'vitest';
import { PEOPLE } from './people';
import {
  avatarSlug,
  capitalize,
  findByName,
  groupForPhase,
  groupMates,
  groupNumber,
  HERO_NAMES,
  heroName,
  initials,
  ROLE_LABEL,
  sortedByName,
  topForGroup,
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

describe('groupNumber & topForGroup', () => {
  it('parses the group number from a label', () => {
    expect(groupNumber('Groep 1')).toBe(1);
    expect(groupNumber('Groep 3')).toBe(3);
    expect(groupNumber('onbekend')).toBe(0);
  });

  it('distributes a top of 9 round-robin over three groups', () => {
    const top = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const ranks = (g: string) => topForGroup(top, g).map((x) => x.rank);
    expect(ranks('Groep 1')).toEqual([1, 4, 7]);
    expect(ranks('Groep 2')).toEqual([2, 5, 8]);
    expect(ranks('Groep 3')).toEqual([3, 6, 9]);
    // The item lines up with its rank.
    expect(topForGroup(top, 'Groep 2').map((x) => x.item)).toEqual([2, 5, 8]);
  });

  it('handles a shorter top (fewer than 9 droombeelden)', () => {
    const top = ['a', 'b', 'c', 'd', 'e'];
    expect(topForGroup(top, 'Groep 1').map((x) => x.rank)).toEqual([1, 4]);
    expect(topForGroup(top, 'Groep 2').map((x) => x.rank)).toEqual([2, 5]);
    expect(topForGroup(top, 'Groep 3').map((x) => x.rank)).toEqual([3]);
  });
});
