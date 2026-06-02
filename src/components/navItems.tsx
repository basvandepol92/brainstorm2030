import type { ReactNode } from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: ReactNode;
}

const ICONS = {
  home: <path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1zM9 21V12h6v9" />,
  spelregels: (
    <>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </>
  ),
  fase1: (
    <>
      <path d="M12 2a7 7 0 0 1 5 11.9V17a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-3.1A7 7 0 0 1 12 2z" />
      <path d="M9 21h6" />
    </>
  ),
  fase2: <polygon points="12,2 15,9 22,9.3 17,14 18.6,21 12,17.5 5.4,21 7,14 2,9.3 9,9" />,
  fase3: (
    <>
      <circle cx="12" cy="12" r="3" />
      <circle cx="12" cy="12" r="7" />
      <circle cx="12" cy="12" r="11" />
    </>
  ),
  nu: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none" />
    </>
  ),
} as const;

/** The classic five-tab layout used in standalone mode. */
export const STANDARD_NAV: NavItem[] = [
  { id: 'home', label: 'Home', icon: ICONS.home },
  { id: 'spelregels', label: 'Spelregels', icon: ICONS.spelregels },
  { id: 'fase1', label: 'Fase 1', icon: ICONS.fase1 },
  { id: 'fase2', label: 'Fase 2', icon: ICONS.fase2 },
  { id: 'fase3', label: 'Fase 3', icon: ICONS.fase3 },
];

/** Live mode: the phase is driven by the backend, so "Nu" leads, then Spelregels. */
export const LIVE_NAV: NavItem[] = [
  { id: 'nu', label: 'Nu', icon: ICONS.nu },
  { id: 'spelregels', label: 'Spelregels', icon: ICONS.spelregels },
];
