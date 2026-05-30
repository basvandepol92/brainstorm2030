import { useState } from 'react';
import { avatarSlug, initials } from '../data/selectors';

/** Extensions tried in order before falling back to initials. */
const EXTENSIONS = ['png', 'jpg'] as const;

interface Props {
  /** Participant name; resolves to public/avatars/<slug>.<ext>. */
  name: string;
  /** Sizing/shape utilities for the container (e.g. "size-10 rounded-[13px]"). */
  className?: string;
  /** Classes for the fallback initials text. */
  textClassName?: string;
}

/**
 * Shows a participant's photo from public/avatars/, trying each supported
 * extension and falling back to their initials when no image loads.
 */
export function Avatar({ name, className = '', textClassName = '' }: Props) {
  const [attempt, setAttempt] = useState(0);
  const slug = avatarSlug(name);
  const ext = EXTENSIONS[attempt];

  return (
    <span className={`relative grid flex-shrink-0 place-items-center overflow-hidden ${className}`}>
      {ext ? (
        <img
          key={ext}
          src={`${import.meta.env.BASE_URL}avatars/${slug}.${ext}`}
          alt={name}
          loading="lazy"
          onError={() => setAttempt((n) => n + 1)}
          className="absolute inset-0 size-full object-cover"
        />
      ) : (
        <span className={textClassName}>{initials(name)}</span>
      )}
    </span>
  );
}
