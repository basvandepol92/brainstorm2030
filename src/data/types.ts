export type Role = 'superheld' | 'villain' | 'sidekick';

export type Group = 'Groep 1' | 'Groep 2' | 'Groep 3';

export type Phase = 'f1' | 'f2' | 'f3';

export interface Person {
  name: string;
  f1: Group;
  f2: Group;
  rol: Role;
  f3: Group;
}

export type TabId = 'home' | 'spelregels' | 'fase1' | 'fase2' | 'fase3';
