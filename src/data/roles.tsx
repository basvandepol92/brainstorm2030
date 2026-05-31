import type { ReactNode } from 'react';
import type { Role } from './types';

export interface RoleInfo {
  title: string;
  attitude: string;
  desc: string;
  questions: string[];
  illustration: ReactNode;
}

const SuperheroIllo = (
  <svg width="140" height="130" viewBox="0 0 140 130" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="g_sh" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#F7C948" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#F7C948" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="70" cy="65" r="62" fill="url(#g_sh)" />
    <polygon
      points="70,8 76,32 101,32 81,47 88,71 70,56 52,71 59,47 39,32 64,32"
      fill="#F7C948"
      opacity="0.95"
    />
    <ellipse cx="70" cy="100" rx="28" ry="8" fill="#F7C948" opacity="0.12" />
    <rect x="62" y="52" width="16" height="28" rx="8" fill="#F7C948" />
    <path d="M62 62 L38 56 M78 62 L102 56" stroke="#F7C948" strokeWidth="6" strokeLinecap="round" />
    <path
      d="M62 58 Q46 80 42 105 Q56 92 70 90 Q84 92 98 105 Q94 80 78 58"
      fill="#F7C948"
      opacity="0.55"
    />
    <circle cx="70" cy="44" r="10" fill="#F7C948" />
    <circle cx="20" cy="25" r="2.5" fill="#F7C948" opacity="0.5" />
    <circle cx="118" cy="20" r="2" fill="#F7C948" opacity="0.4" />
    <circle cx="15" cy="80" r="1.8" fill="#F7C948" opacity="0.35" />
    <circle cx="125" cy="75" r="2.2" fill="#F7C948" opacity="0.45" />
    <path d="M110 40 L113 44 L116 40 L113 36 Z" fill="#F7C948" opacity="0.5" />
    <path d="M24 50 L27 54 L30 50 L27 46 Z" fill="#F7C948" opacity="0.4" />
  </svg>
);

const VillainIllo = (
  <svg width="140" height="130" viewBox="0 0 140 130" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="g_vi" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FF453A" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#FF453A" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="70" cy="65" r="62" fill="url(#g_vi)" />
    <path
      d="M70 20 Q40 40 30 110 Q50 85 70 80 Q90 85 110 110 Q100 40 70 20Z"
      fill="#FF453A"
      opacity="0.75"
    />
    <circle cx="70" cy="35" r="13" fill="#FF453A" />
    <path d="M60 26 L54 10 L64 22" fill="#FF453A" />
    <path d="M80 26 L86 10 L76 22" fill="#FF453A" />
    <ellipse cx="64" cy="35" rx="4" ry="3" fill="#1A0000" />
    <ellipse cx="76" cy="35" rx="4" ry="3" fill="#1A0000" />
    <circle cx="64" cy="35" r="1.5" fill="#FF453A" opacity="0.9" />
    <circle cx="76" cy="35" r="1.5" fill="#FF453A" opacity="0.9" />
    <path
      d="M25 55 L34 42 L30 55 L39 42"
      stroke="#FF453A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
    />
    <path
      d="M101 55 L110 42 L106 55 L115 42"
      stroke="#FF453A"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.7"
    />
    <path d="M58 112 L82 112" stroke="#FF453A" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    <polygon points="15,30 20,20 25,30 20,38" fill="#FF453A" opacity="0.3" />
    <polygon points="118,45 122,36 126,45 122,52" fill="#FF453A" opacity="0.25" />
  </svg>
);

const SidekickIllo = (
  <svg width="140" height="130" viewBox="0 0 140 130" fill="none" aria-hidden="true">
    <defs>
      <radialGradient id="g_sk" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#2F9EFF" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#2F9EFF" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="70" cy="65" r="62" fill="url(#g_sk)" />
    <path
      d="M70 15 L100 30 L100 60 Q100 85 70 100 Q40 85 40 60 L40 30 Z"
      fill="#2F9EFF"
      opacity="0.18"
    />
    <path
      d="M70 15 L100 30 L100 60 Q100 85 70 100 Q40 85 40 60 L40 30 Z"
      stroke="#2F9EFF"
      strokeWidth="2.5"
      fill="none"
      opacity="0.7"
    />
    <path
      d="M55 57 L65 68 L85 48"
      stroke="#2F9EFF"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="70" cy="35" r="9" fill="#2F9EFF" opacity="0.9" />
    <rect x="63" y="45" width="14" height="18" rx="7" fill="#2F9EFF" opacity="0.85" />
    <circle cx="20" cy="55" r="4" fill="#2F9EFF" opacity="0.4" />
    <circle cx="120" cy="55" r="4" fill="#2F9EFF" opacity="0.4" />
    <circle cx="35" cy="95" r="3" fill="#2F9EFF" opacity="0.3" />
    <circle cx="105" cy="95" r="3" fill="#2F9EFF" opacity="0.3" />
    <line x1="24" y1="55" x2="40" y2="50" stroke="#2F9EFF" strokeWidth="1.5" opacity="0.3" />
    <line x1="116" y1="55" x2="100" y2="50" stroke="#2F9EFF" strokeWidth="1.5" opacity="0.3" />
    <line x1="37" y1="92" x2="48" y2="80" stroke="#2F9EFF" strokeWidth="1.5" opacity="0.25" />
    <line x1="103" y1="92" x2="92" y2="80" stroke="#2F9EFF" strokeWidth="1.5" opacity="0.25" />
  </svg>
);

export const ROLES: Record<Role, RoleInfo> = {
  superhero: {
    title: 'Superhero',
    attitude: 'Positief optimistisch',
    desc: "Jij hebt een positief optimistische houding en belicht het thema met een 'can-do' mentaliteit. Jouw superkracht is hoop en ambitie.",
    questions: [
      'Waarom is dit thema kansrijk?',
      'Wat wordt de beste versie hiervan in 2030?',
      'Welke superkracht heeft Regio Zuid al om dit waar te maken?',
      'Wat zou een moedige eerste stap zijn?',
    ],
    illustration: SuperheroIllo,
  },
  villain: {
    title: 'Villain',
    attitude: 'Kritisch, valkuilen',
    desc: "Jij ziet valkuilen, risico's en de 'kan niet'-mentaliteit. Jouw kracht is kritisch denken — je maakt ideeën sterker door ze te testen.",
    questions: [
      'Waarom kan dit mislukken?',
      'Welke aannames zijn te makkelijk gemaakt?',
      'Waar gaan we onszelf voor de gek houden?',
      'Wat maakt dit praktisch of commercieel lastig?',
    ],
    illustration: VillainIllo,
  },
  sidekick: {
    title: 'Sidekick',
    attitude: 'Helpend, meerdere perspectieven',
    desc: 'Jij bent de helpende kracht die vanuit verschillende perspectieven kijkt — de klant, de Rockstar, de samenwerking. Jij verbindt.',
    questions: [
      'Wie of wat hebben we nodig om dit te laten slagen?',
      'Welke disciplines moeten hierin samenwerken?',
      'Welke randvoorwaarden zijn nodig?',
      'Hoe zetten we hiermee de Rockstar op 1?',
    ],
    illustration: SidekickIllo,
  },
};
