import { useEffect, useMemo, useState } from 'react';
import type { Outcome, VotingConfig } from '../../session/types';
import { Card, PageHeader, SectionLabel, TimeBar } from '../ui';

interface Props {
  outcomes: Outcome[];
  voting: VotingConfig;
  myVote: string[];
  tallies: Record<string, number> | null;
  votesCast: number;
  onVote: (ids: string[]) => Promise<void>;
}

export function VotingTab({ outcomes, voting, myVote, tallies, votesCast, onVote }: Props) {
  const [selected, setSelected] = useState<string[]>(myVote);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Keep local selection in sync with the server (e.g. after a reset).
  const myVoteKey = myVote.join(',');
  useEffect(() => {
    setSelected(myVote);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myVoteKey]);

  const dotsLeft = voting.dotsPerVoter - selected.length;
  const dirty = selected.join(',') !== myVoteKey;
  const submitted = myVote.length > 0 && !dirty;

  function toggle(id: string) {
    setError('');
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id);
      if (cur.length >= voting.dotsPerVoter) return cur;
      return [...cur, id];
    });
  }

  async function submit() {
    setSubmitting(true);
    setError('');
    try {
      await onVote(selected);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader
        tag="Tussenronde"
        title="Stem op de opbrengsten"
        sub="Welke dromen nemen we mee naar fase 2?"
      />

      <TimeBar phase="voting" />

      {voting.resultsRevealed ? (
        <Results outcomes={outcomes} tallies={tallies} votesCast={votesCast} />
      ) : !voting.open ? (
        <Card>
          <p className="text-[14px] leading-[1.6] text-ink/75">
            Stemmen is op dit moment gesloten. Houd dit scherm in de gaten — Bas opent het zo.
          </p>
        </Card>
      ) : (
        <>
          <div className="glass mb-4 flex items-center justify-between rounded-[18px] px-4 py-3">
            <span className="text-[13px] font-semibold text-dim">
              {submitted ? 'Je stem is opgeslagen ✓' : `Kies max. ${voting.dotsPerVoter}`}
            </span>
            <span className="flex items-center gap-1.5">
              {Array.from({ length: voting.dotsPerVoter }).map((_, i) => (
                <span
                  key={i}
                  className={`size-2.5 rounded-full ${
                    i < selected.length ? 'bg-brand' : 'bg-white/15'
                  }`}
                />
              ))}
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            {outcomes.map((o) => {
              const on = selected.includes(o.id);
              const disabled = !on && dotsLeft <= 0;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggle(o.id)}
                  disabled={disabled}
                  className={`flex w-full items-center gap-3 rounded-[18px] p-4 text-left transition-all duration-150 active:scale-[0.98] ${
                    on
                      ? 'bg-gradient-to-br from-amber to-brand text-black'
                      : `glass ${disabled ? 'opacity-40' : ''}`
                  }`}
                >
                  <span
                    className={`grid size-6 flex-shrink-0 place-items-center rounded-full border-2 text-[13px] font-black ${
                      on ? 'border-black/30 bg-black/15 text-black' : 'border-white/20 text-transparent'
                    }`}
                  >
                    ✓
                  </span>
                  <span className={`text-[15px] font-semibold ${on ? 'text-black' : 'text-ink'}`}>
                    {o.text}
                  </span>
                </button>
              );
            })}
            {outcomes.length === 0 && (
              <Card>
                <p className="text-[14px] text-dim">Nog geen opbrengsten om op te stemmen.</p>
              </Card>
            )}
          </div>

          {error && <p className="mt-3 text-[13px] font-semibold text-villain">{error}</p>}

          <button
            type="button"
            onClick={submit}
            disabled={submitting || (!dirty && submitted) || outcomes.length === 0}
            className="mt-5 w-full rounded-card bg-gradient-to-br from-amber to-brand py-4 text-[16px] font-black text-black shadow-[0_8px_24px_-8px_rgba(247,201,72,0.8)] transition-transform active:scale-[0.98] disabled:opacity-45"
          >
            {submitting
              ? 'Versturen…'
              : submitted
                ? 'Stem opgeslagen ✓'
                : myVote.length > 0
                  ? 'Stem bijwerken'
                  : 'Stem vastleggen'}
          </button>
          <p className="mt-3 text-center text-[12px] text-dim">{votesCast} van 14 hebben gestemd</p>
        </>
      )}
    </>
  );
}

const TOP_N = 9;

function Results({
  outcomes,
  tallies,
  votesCast,
}: {
  outcomes: Outcome[];
  tallies: Record<string, number> | null;
  votesCast: number;
}) {
  const ranked = useMemo(() => {
    const counts = tallies ?? {};
    return [...outcomes]
      .map((o) => ({ ...o, count: counts[o.id] ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [outcomes, tallies]);

  const max = Math.max(1, ...ranked.map((r) => r.count));
  const isThrough = (rank: number, count: number) => rank < TOP_N && count > 0;
  const throughCount = ranked.filter((o, i) => isThrough(i, o.count)).length;

  return (
    <>
      <SectionLabel>Uitslag</SectionLabel>
      <div className="glass mb-4 rounded-[18px] px-4 py-3 text-[13px] leading-[1.5] text-ink/75">
        De <span className="font-bold text-brand">top {TOP_N}</span> met de meeste stemmen gaat door
        naar fase 2.
      </div>
      <div className="flex flex-col gap-2.5">
        {ranked.map((o, i) => {
          const through = isThrough(i, o.count);
          return (
            <div
              key={o.id}
              className={`rounded-[18px] p-4 ${
                through ? 'glass ring-1 ring-brand/30' : 'glass-soft opacity-70'
              }`}
            >
              <div className="mb-2 flex items-center gap-3">
                <span
                  className={`grid size-6 flex-shrink-0 place-items-center rounded-lg text-[12px] font-black ${
                    through ? 'bg-gradient-to-br from-amber to-brand text-black' : 'bg-white/10 text-dim'
                  }`}
                >
                  {i + 1}
                </span>
                <span className={`flex-1 text-[15px] font-bold ${through ? '' : 'text-dim'}`}>
                  {o.text}
                </span>
                <span className={`text-[14px] font-black ${through ? 'text-brand' : 'text-dim'}`}>
                  {o.count}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full ${
                    through ? 'bg-gradient-to-r from-amber to-brand' : 'bg-white/25'
                  }`}
                  style={{ width: `${(o.count / max) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-[12px] text-dim">
        {votesCast} van 14 hebben gestemd · {throughCount} door naar fase 2
      </p>
    </>
  );
}
