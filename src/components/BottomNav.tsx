import type { ReactNode } from 'react';
import type { TabId } from '../data/types';

interface NavItem {
  id: TabId;
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
} as const;

const ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: ICONS.home },
  { id: 'spelregels', label: 'Spelregels', icon: ICONS.spelregels },
  { id: 'fase1', label: 'Fase 1', icon: ICONS.fase1 },
  { id: 'fase2', label: 'Fase 2', icon: ICONS.fase2 },
  { id: 'fase3', label: 'Fase 3', icon: ICONS.fase3 },
];

interface Props {
  active: TabId;
  onSelect: (tab: TabId) => void;
}

export function BottomNav({ active, onSelect }: Props) {
  return (
    <nav className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-5 pb-5">
      <div className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5">
        {ITEMS.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-2.5 transition-all duration-300 ease-out ${
                isActive
                  ? 'bg-gradient-to-br from-amber to-brand text-black shadow-[0_6px_18px_-6px_rgba(247,201,72,0.8)]'
                  : 'text-dim active:text-ink'
              }`}
            >
              <svg
                className="size-[21px] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
              <span
                className={`overflow-hidden text-[12px] font-bold whitespace-nowrap transition-all duration-300 ${
                  isActive ? 'max-w-[80px] opacity-100' : 'max-w-0 opacity-0'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
