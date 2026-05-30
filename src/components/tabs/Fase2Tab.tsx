import { useState } from 'react';
import { groupMates } from '../../data/selectors';
import { PEOPLE } from '../../data/people';
import type { Person } from '../../data/types';
import { Card, CardLabel, Chips, Divider, GroupCard, PageHeader, SectionLabel, TimeBar } from '../ui';
import { PokemonCard } from './PokemonCard';

export function Fase2Tab({ user }: { user: Person }) {
  const mates = groupMates(PEOPLE, user, 'f2');
  const [revealed, setRevealed] = useState(false);

  return (
    <>
      <PageHeader
        tag="Fase 2"
        title="Optimisme, kritiek & realisme"
        sub="Toets de gedroomde thema's met jouw unieke rol"
      />
      <TimeBar />
      <GroupCard group={user.f2} />

      <SectionLabel>Jouw rol</SectionLabel>
      {revealed ? (
        <PokemonCard user={user} />
      ) : (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="glass group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-card py-7 text-center transition-transform duration-150 active:scale-[0.98]"
        >
          <span
            aria-hidden
            className="pointer-events-none absolute -top-12 left-1/2 size-44 -translate-x-1/2 rounded-full bg-brand opacity-15 blur-3xl"
          />
          <span className="relative text-[22px]">🎴</span>
          <span className="relative text-[17px] font-black tracking-[-0.01em]">Toon mijn rol</span>
        </button>
      )}

      <Divider />
      <Card>
        <CardLabel>In jouw groep</CardLabel>
        <Chips people={mates} myName={user.name} showRole />
      </Card>
    </>
  );
}
