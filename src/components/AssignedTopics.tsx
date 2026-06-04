import { topForGroup } from '../data/selectors';
import { useTopOutcomes } from '../session/SessionContext';
import { SectionLabel } from './ui';

/**
 * Shows the droombeelden from the dotvote top that are assigned to the user's
 * group in this fase (Groep 1 → ranks 1,4,7; Groep 2 → 2,5,8; Groep 3 → 3,6,9).
 * Renders nothing in standalone mode or before the top is available.
 */
export function AssignedTopics({ group }: { group: string }) {
  const top = useTopOutcomes();
  if (!top || top.length === 0) return null;

  const mine = topForGroup(top, group);
  if (mine.length === 0) return null;

  return (
    <>
      <SectionLabel>Droombeelden voor jouw groepje</SectionLabel>
      <div className="flex flex-col gap-2">
        {mine.map(({ rank, item }) => (
          <div key={item.id} className="glass flex items-center gap-3 rounded-[16px] p-3.5">
            <span className="grid size-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-amber to-brand text-[13px] font-black text-black">
              {rank}
            </span>
            <span className="text-[14.5px] leading-snug font-semibold">{item.text}</span>
          </div>
        ))}
      </div>
    </>
  );
}
