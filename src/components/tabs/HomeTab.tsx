import type { Person, TabId } from '../../data/types';
import { SectionLabel } from '../ui';

function PhaseRow({
  num,
  phase,
  group,
  onClick,
}: {
  num: number;
  phase: string;
  group: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="glass flex w-full items-center gap-3.5 rounded-[18px] p-3.5 text-left transition-transform duration-150 active:scale-[0.98]"
    >
      <div className="grid size-11 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-white/12 to-white/[0.03] text-[17px] font-black text-brand ring-1 ring-white/10">
        {num}
      </div>
      <div className="flex-1">
        <div className="text-[11px] font-semibold tracking-[0.06em] text-dim uppercase">{phase}</div>
        <div className="mt-0.5 text-[16px] font-bold">{group}</div>
      </div>
      <span className="text-xl text-muted">›</span>
    </button>
  );
}

interface Props {
  user: Person;
  onNavigate: (tab: TabId) => void;
}

export function HomeTab({ user, onNavigate }: Props) {
  return (
    <>
      <div className="mb-6">
        <div className="text-[13px] font-medium text-dim">Welkom bij de brainstorm 👋</div>
        <div className="mt-1 text-[32px] leading-none font-black tracking-[-0.03em]">
          Hey,{' '}
          <span className="bg-gradient-to-r from-amber to-brand bg-clip-text text-transparent">
            {user.name}
          </span>
        </div>
      </div>

      <SectionLabel>Jouw indeling per fase</SectionLabel>

      <div className="flex flex-col gap-2.5">
        <PhaseRow num={1} phase="Fase 1 · Dromen" group={user.f1} onClick={() => onNavigate('fase1')} />
        <PhaseRow num={2} phase="Fase 2 · Toetsen" group={user.f2} onClick={() => onNavigate('fase2')} />
        <PhaseRow num={3} phase="Fase 3 · Acties" group={user.f3} onClick={() => onNavigate('fase3')} />
      </div>
    </>
  );
}
