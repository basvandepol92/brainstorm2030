import { useEffect, useState, type ReactNode } from 'react';
import { ROLE_LABEL } from '../data/selectors';
import type { Person, Role } from '../data/types';
import { usePhaseTimer } from '../session/SessionContext';
import type { LivePhase, Timer } from '../session/types';
import { Avatar } from './Avatar';

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

/** Per-fase uitleg: hoe de ronde werkt en wat je aan het eind oplevert. */
export function Briefing({
  werkwijze,
  oplevering,
}: {
  werkwijze: string[];
  oplevering: string[];
}) {
  return (
    <>
      <SectionLabel>Deze ronde werkt als volgt</SectionLabel>
      <Card>
        <div className="flex flex-col gap-3">
          {werkwijze.map((p, i) => (
            <p key={i} className="text-[14px] leading-[1.7] text-ink/80">
              {p}
            </p>
          ))}
        </div>
      </Card>

      <SectionLabel>Na deze fase presenteer je als groepje</SectionLabel>
      <div className="glass relative overflow-hidden rounded-card p-5">
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-amber to-brand"
        />
        <div className="flex flex-col gap-3 pl-2">
          {oplevering.map((p, i) => (
            <p key={i} className="text-[14px] leading-[1.7] text-ink/85">
              {p}
            </p>
          ))}
        </div>
      </div>
    </>
  );
}

const ClockIcon = (
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
);

function TimeShell({
  icon,
  title,
  sub,
  tone = 'brand',
}: {
  icon: ReactNode;
  title: ReactNode;
  sub: ReactNode;
  tone?: 'brand' | 'villain' | 'muted';
}) {
  const iconBg =
    tone === 'villain'
      ? 'from-villain to-[#ff7a70]'
      : tone === 'muted'
        ? 'from-white/15 to-white/5'
        : 'from-amber to-brand';
  return (
    <div className="glass mb-4 flex items-center gap-3.5 rounded-[20px] p-3.5">
      <div
        className={`flex size-11 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${iconBg} ${tone === 'muted' ? 'text-ink/80' : 'text-black'} shadow-[0_6px_16px_-6px_rgba(247,201,72,0.6)]`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[17px] font-extrabold tracking-[-0.01em]">{title}</div>
        <div className="mt-0.5 text-[12.5px] text-dim">{sub}</div>
      </div>
    </div>
  );
}

function StaticTimeBar() {
  return (
    <TimeShell
      icon={ClockIcon}
      title="30 min brainstorm"
      sub="+ 10 min plenair terugkoppelen"
    />
  );
}

function useNow(intervalMs: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function clock(d: Date) {
  return d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
}

function LiveTimeBar({ timer }: { timer: Timer }) {
  const now = useNow(1000);
  const start = timer.startTime ? new Date(timer.startTime) : null;

  if (!start) {
    return (
      <TimeShell
        tone="muted"
        icon={ClockIcon}
        title="Nog niet gestart"
        sub="Wacht op Bas"
      />
    );
  }

  const end = new Date(start.getTime() + timer.durationMin * 60000);
  const remaining = end.getTime() - now;

  if (remaining <= 0) {
    return (
      <TimeShell
        tone="villain"
        icon={<span className="text-[20px]">⏰</span>}
        title="Tijd voorbij"
        sub="Kom terug — we koppelen plenair terug"
      />
    );
  }

  const totalSec = Math.floor(remaining / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return (
    <TimeShell
      icon={ClockIcon}
      title={
        <span>
          {m}:{String(s).padStart(2, '0')}{' '}
          <span className="text-[13px] font-semibold text-dim">resterend</span>
        </span>
      }
      sub={`Terug om ${clock(end)} uur`}
    />
  );
}

export function TimeBar({ phase }: { phase?: LivePhase } = {}) {
  const timer = usePhaseTimer(phase);
  return timer ? <LiveTimeBar timer={timer} /> : <StaticTimeBar />;
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

const ROLE_TEXT: Record<Role, string> = {
  superhero: 'text-superhero',
  villain: 'text-villain',
  sidekick: 'text-sidekick',
};

/**
 * Grid of group members as tiles, each showing the person's avatar and name.
 * When `showRole` is set (Fase 2) the tile also notes the person's role.
 */
export function GroupTiles({
  people,
  myName,
  showRole = false,
}: {
  people: Person[];
  myName: string;
  showRole?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {people.map((p) => {
        const isMe = p.name === myName;
        return (
          <div
            key={p.name}
            className={`flex items-center gap-2.5 rounded-2xl p-2.5 ${
              isMe ? 'bg-gradient-to-br from-amber to-brand text-black' : 'glass-soft'
            }`}
          >
            <Avatar
              name={p.name}
              className={`size-10 rounded-xl ${
                isMe ? 'ring-2 ring-black/15' : 'bg-white/10 ring-1 ring-white/10'
              }`}
              textClassName={`text-[12px] font-black ${isMe ? 'text-black' : 'text-ink/80'}`}
            />
            <div className="min-w-0 flex-1">
              <div
                className={`truncate text-[13.5px] leading-tight font-bold ${
                  isMe ? 'text-black' : 'text-ink'
                }`}
              >
                {p.name}
              </div>
              {showRole ? (
                <div
                  className={`mt-0.5 truncate text-[11px] leading-tight font-semibold ${
                    isMe ? 'text-black/70' : ROLE_TEXT[p.rol]
                  }`}
                >
                  {ROLE_LABEL[p.rol]}
                </div>
              ) : (
                isMe && (
                  <div className="mt-0.5 text-[11px] leading-tight font-semibold text-black/70">
                    Jij
                  </div>
                )
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

const QN_ACCENT: Record<string, string> = {
  superhero: 'from-amber to-brand text-black',
  villain: 'from-villain to-[#ff7a70] text-black',
  sidekick: 'from-sidekick to-[#6fbcff] text-black',
};

export function QuestionList({
  questions,
  accent = 'superhero',
}: {
  questions: string[];
  accent?: Role;
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
