import { STANDARD_NAV, type NavItem } from './navItems';

interface Props {
  active: string;
  onSelect: (id: string) => void;
  items?: NavItem[];
}

export function BottomNav({ active, onSelect, items = STANDARD_NAV }: Props) {
  return (
    <nav className="safe-bottom pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center px-5 pb-5">
      <div className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1.5">
        {items.map((item) => {
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
