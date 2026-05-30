import { SPELREGELS } from '../../data/content';
import { PageHeader } from '../ui';

export function SpelregelsTab() {
  return (
    <>
      <PageHeader tag="Goed om te weten" title="Spelregels" />
      <div className="flex flex-col gap-2.5">
        {SPELREGELS.map((rule, i) => (
          <div key={rule} className="glass flex items-start gap-3.5 rounded-[18px] p-4">
            <div className="grid size-8 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber to-brand text-[14px] font-black text-black">
              {i + 1}
            </div>
            <div className="pt-1 text-[14px] leading-[1.55] font-medium text-ink/85">{rule}</div>
          </div>
        ))}
      </div>
    </>
  );
}
