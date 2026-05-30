import type { Person } from '../data/types';
import { Avatar } from './Avatar';

interface Props {
  user: Person;
  onChangeUser: () => void;
}

export function Header({ user, onChangeUser }: Props) {
  return (
    <header className="relative z-20 flex flex-shrink-0 items-center justify-between px-5 pt-5 pb-3">
      <div className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-brand shadow-[0_0_12px_2px_rgba(247,201,72,0.6)]" />
        <span className="text-[12px] font-extrabold tracking-[0.1em] text-ink/90 uppercase">
          Brainstorm <span className="text-brand">2030</span>
        </span>
      </div>

      <button
        type="button"
        onClick={onChangeUser}
        aria-label="Naam wijzigen"
        title="Naam wijzigen"
        className="glass-soft flex items-center gap-2 rounded-full py-1 pr-3 pl-1 transition-transform active:scale-95"
      >
        <Avatar
          name={user.name}
          className="size-7 rounded-full bg-gradient-to-br from-amber to-brand"
          textClassName="text-[11px] font-black text-black"
        />
        <span className="text-[13px] font-semibold">{user.name}</span>
      </button>
    </header>
  );
}
