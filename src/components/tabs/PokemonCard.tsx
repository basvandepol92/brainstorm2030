import { useState } from 'react';
import { ROLES } from '../../data/roles';
import { avatarSlug, ROLE_LABEL } from '../../data/selectors';
import type { Person, Role } from '../../data/types';

/** Card-art extensions tried in order before falling back to the role illustration. */
const CARD_EXTENSIONS = ['png', 'jpg'] as const;

const FRAME: Record<Role, string> = {
  superheld: 'from-[#ffe690] via-[#f7c948] to-[#b8860b]',
  villain: 'from-[#ff9a92] via-[#ff453a] to-[#8b1a12]',
  sidekick: 'from-[#9ccdff] via-[#2f9eff] to-[#0a4a8c]',
};

const ART_TINT: Record<Role, string> = {
  superheld: 'from-[#2a2207] to-[#0d0b03]',
  villain: 'from-[#2a0a07] to-[#0d0403]',
  sidekick: 'from-[#06192a] to-[#03090d]',
};

const TYPE_PILL: Record<Role, string> = {
  superheld: 'bg-brand text-black',
  villain: 'bg-villain text-white',
  sidekick: 'bg-sidekick text-white',
};

const ACCENT_TEXT: Record<Role, string> = {
  superheld: 'text-[#7a5b00]',
  villain: 'text-[#7a1109]',
  sidekick: 'text-[#0a4a8c]',
};

const GLOW: Record<Role, string> = {
  superheld: 'bg-brand',
  villain: 'bg-villain',
  sidekick: 'bg-sidekick',
};

/** The artwork window: a per-person card image, falling back to the role illustration. */
function CardArt({ name, role }: { name: string; role: Role }) {
  const [attempt, setAttempt] = useState(0);
  const ext = CARD_EXTENSIONS[attempt];
  const slug = avatarSlug(name);
  const info = ROLES[role];

  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gradient-to-b ring-1 ring-black/30 ${ART_TINT[role]}`}
    >
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-10 left-1/2 size-44 -translate-x-1/2 rounded-full opacity-30 blur-3xl ${GLOW[role]}`}
      />
      {ext ? (
        <img
          key={ext}
          src={`${import.meta.env.BASE_URL}cards/${slug}.${ext}`}
          alt={`Kaart van ${name}`}
          loading="lazy"
          onError={() => setAttempt((n) => n + 1)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center [&_svg]:size-32">
          {info.illustration}
        </div>
      )}
    </div>
  );
}

/**
 * Trading-card ("Pokémon-kaart") showcase of a participant's Fase 2 role,
 * with their guiding questions printed inside the card.
 */
export function PokemonCard({ user }: { user: Person }) {
  const role = user.rol;
  const info = ROLES[role];

  return (
    <div
      className={`animate-pop-in rounded-[26px] bg-gradient-to-br p-[3px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ${FRAME[role]}`}
    >
      <div className="rounded-[23px] bg-gradient-to-b from-[#15140f] to-[#0a0a08] p-3.5">
        {/* Title bar */}
        <div className="mb-2.5 flex items-baseline justify-between gap-2 px-0.5">
          <div className="flex items-baseline gap-2">
            <span className="text-[19px] font-black tracking-[-0.01em] text-ink">{info.title}</span>
            <span className="text-[12px] font-semibold text-dim">· {user.name}</span>
          </div>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-black tracking-[0.04em] uppercase ${TYPE_PILL[role]}`}
          >
            {ROLE_LABEL[role]}
          </span>
        </div>

        {/* Artwork window */}
        <CardArt name={user.name} role={role} />

        {/* Attitude / type line */}
        <div className="mt-2.5 flex items-center gap-2 px-0.5">
          <span className={`text-[11px] font-black tracking-[0.1em] uppercase ${ACCENT_TEXT[role]}`}>
            Type
          </span>
          <span className="text-[12.5px] font-semibold text-ink/80">{info.attitude}</span>
        </div>

        <p className="mt-1.5 px-0.5 text-[12.5px] leading-[1.55] text-ink/65">{info.desc}</p>

        {/* Questions box, inside the card */}
        <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-3.5">
          <div className="mb-2 text-[12px] font-bold tracking-[0.02em] text-ink/90">
            Jij geeft antwoorden op vragen als:
          </div>
          <ul className="flex flex-col gap-2">
            {info.questions.map((q) => (
              <li key={q} className="flex gap-2.5 text-[13.5px] leading-[1.5] text-ink/80">
                <span className={`mt-2 size-1.5 flex-shrink-0 rounded-full ${TYPE_PILL[role]}`} />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
