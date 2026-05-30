import { PEOPLE } from '../data/people';
import { sortedByName } from '../data/selectors';
import type { Person } from '../data/types';
import { Avatar } from './Avatar';

interface Props {
  onSelect: (person: Person) => void;
}

export function NamePicker({ onSelect }: Props) {
  const people = sortedByName(PEOPLE);

  return (
    <div className="relative z-10 mx-auto flex h-full max-w-[480px] flex-col items-center overflow-y-auto px-6 pt-16 pb-14">
      {/* Hero */}
      <div className="relative mb-7">
        <span className="absolute inset-0 rounded-[26px] bg-brand [animation:pulse-ring_2.8s_ease-out_infinite]" />
        <div className="relative flex size-[84px] items-center justify-center rounded-[26px] bg-gradient-to-br from-amber to-brand text-[30px] font-black text-black shadow-[0_0_70px_-10px_rgba(247,201,72,0.7)]">
          RZ
        </div>
      </div>

      <h1 className="text-center text-[34px] leading-[1.05] font-black tracking-[-0.03em]">
        Regio Zuid
        <br />
        <span className="bg-gradient-to-r from-amber to-brand bg-clip-text text-transparent">
          Brainstorm
        </span>
      </h1>
      <div className="mt-3 mb-11 rounded-full border border-brand/30 bg-brand/10 px-4 py-1 text-[12px] font-bold tracking-[0.32em] text-brand">
        2030
      </div>

      <p className="mb-4 self-start pl-1 text-[11px] font-bold tracking-[0.18em] text-dim uppercase">
        Kies je naam
      </p>

      <div className="flex w-full flex-col gap-2.5">
        {people.map((person, i) => (
          <button
            key={person.name}
            type="button"
            onClick={() => onSelect(person)}
            style={{ animationDelay: `${i * 35}ms` }}
            className="glass animate-fade-up group flex w-full items-center gap-3.5 rounded-[18px] px-3.5 py-3 text-left transition-transform duration-150 active:scale-[0.97]"
          >
            <Avatar
              name={person.name}
              className="size-10 rounded-[13px] bg-gradient-to-br from-white/15 to-white/5 ring-1 ring-white/10"
              textClassName="text-[13px] font-extrabold text-brand"
            />
            <span className="flex-1 text-[16px] font-semibold">{person.name}</span>
            <span className="text-lg text-muted transition-colors group-active:text-brand">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
