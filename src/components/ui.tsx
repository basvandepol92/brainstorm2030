import { useState, type ReactNode } from 'react';
import { initials } from '../data/selectors';
import type { Person } from '../data/types';

export function PageHeader({ tag, title, sub }: { tag: string; title: string; sub?: string }) {
  return (
    <div className="mb-7">
      <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1">
        <span className="size-1.5 rounded-full bg-brand" />
        <span className="text-[11px] font-bold tracking-[0.12em] text-brand uppercase">{tag}</span>
      </div>
      <h1 className="text-[29px] leading-[1.08] font-black tracking-[-0.03em] text-balance">
        {title}
      </h1>
      {sub && <p className="mt-2 text-[14px] leading-[1.5] text-dim">{sub}</p>}
    </div>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 mb-3 flex items-center gap-2.5">
      <span className="text-[11px] font-bold tracking-[0.12em] text-dim uppercase">{children}</span>
      <span className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
    </div>
  );
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`glass rounded-card p-5 ${className}`}>{children}</div>
  );
}

export function CardLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[11px] font-bold tracking-[0.1em] text-dim uppercase">{children}</div>
  );
}

export function TimeBar() {
  return (
    <div className="glass mb-4 flex items-center gap-3.5 rounded-[20px] p-3.5">
      <div className="flex size-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber to-brand text-black shadow-[0_6px_16px_-6px_rgba(247,201,72,0.7)]">
        <svg
          className="size-[22px]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          viewBox="0 0 24 24"
        >
          <circle cx="12" cy="13" r="8" />
          <path d="M12 9v4l2.5 2.5M9 2h6" />
        </svg>
      </div>
      <div>
        <div className="text-[17px] font-extrabold tracking-[-0.01em]">30 min brainstorm</div>
        <div className="mt-0.5 text-[12.5px] text-dim">+ 10 min plenair terugkoppelen</div>
      </div>
    </div>
  );
}

export function GroupCard({ group }: { group: string }) {
  return (
    <div className="relative mb-4 overflow-hidden rounded-card glass p-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 size-40 rounded-full bg-[radial-gradient(circle,rgba(247,201,72,0.28),transparent_65%)] blur-xl"
      />
      <div className="text-[11px] font-bold tracking-[0.12em] text-dim uppercase">Jouw groep</div>
      <div className="mt-1 bg-gradient-to-br from-amber to-brand bg-clip-text text-[34px] font-black tracking-[-0.02em] text-transparent">
        {group}
      </div>
    </div>
  );
}

const ROLE_DOT: Record<string, string> = {
  superheld: 'bg-superheld',
  villain: 'bg-villain',
  sidekick: 'bg-sidekick',
};

export function Chips({
  people,
  myName,
  showRole = false,
}: {
  people: Person[];
  myName: string;
  showRole?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {people.map((p) => {
        const isMe = p.name === myName;
        return (
          <div
            key={p.name}
            className={`flex items-center gap-1.5 rounded-full py-1.5 pr-3 pl-1.5 text-[13px] ${
              isMe
                ? 'bg-gradient-to-br from-amber to-brand font-bold text-black'
                : 'glass-soft font-medium'
            }`}
          >
            <span
              className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${
                isMe ? 'bg-black/15 text-black' : 'bg-white/10 text-ink/80'
              }`}
            >
              {initials(p.name)}
            </span>
            {p.name}
            {showRole && !isMe && (
              <span className={`ml-0.5 size-2 rounded-full ${ROLE_DOT[p.rol]}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const QN_ACCENT: Record<string, string> = {
  superheld: 'from-amber to-brand text-black',
  villain: 'from-villain to-[#ff7a70] text-black',
  sidekick: 'from-sidekick to-[#6fbcff] text-black',
};

export function QuestionList({
  questions,
  accent = 'superheld',
}: {
  questions: string[];
  accent?: 'superheld' | 'villain' | 'sidekick';
}) {
  return (
    <ul className="flex list-none flex-col gap-3.5">
      {questions.map((q, i) => (
        <li key={q} className="flex items-start gap-3 text-[14px] leading-[1.5] text-ink/85">
          <span
            className={`mt-px flex size-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-[11px] font-black ${QN_ACCENT[accent]}`}
          >
            {i + 1}
          </span>
          {q}
        </li>
      ))}
    </ul>
  );
}

export function Collapsible({
  emoji,
  title,
  children,
}: {
  emoji: string;
  title: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`glass overflow-hidden rounded-[18px] transition-colors ${open ? 'bg-white/[0.04]' : ''}`}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left select-none"
      >
        <span className="flex items-center gap-2.5 text-[14.5px] font-bold">
          <span className="text-[17px]">{emoji}</span>
          {title}
        </span>
        <span
          className={`grid size-6 place-items-center rounded-full bg-white/5 text-[13px] text-dim transition-transform duration-300 ${
            open ? 'rotate-180 text-brand' : ''
          }`}
        >
          ⌄
        </span>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pt-1 pb-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Divider() {
  return <div className="my-5 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />;
}
