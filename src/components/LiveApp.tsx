import { useEffect, useRef, useState } from 'react';
import { useStoredUser } from '../hooks/useStoredUser';
import { useSession } from '../hooks/useSession';
import { SessionTimingContext } from '../session/SessionContext';
import type { LiveStage } from '../session/types';
import type { Person } from '../data/types';
import { AGENDA, ONDERLING_BLUNT, ONDERLING_INTRO, ONDERLING_NUANCED } from '../data/content';
import { Aurora } from './Aurora';
import { BottomNav } from './BottomNav';
import { LIVE_NAV } from './navItems';
import { Header } from './Header';
import { NamePicker } from './NamePicker';
import { Card, PageHeader, SectionLabel, TimeBar } from './ui';
import { Fase1Tab } from './tabs/Fase1Tab';
import { Fase2Tab } from './tabs/Fase2Tab';
import { Fase3Tab } from './tabs/Fase3Tab';
import { SpelregelsTab } from './tabs/SpelregelsTab';
import { VotingTab } from './tabs/VotingTab';

type LiveTab = 'spelregels' | 'nu';

export default function LiveApp() {
  const { user, setUser, clearUser } = useStoredUser();
  const { state, status, vote } = useSession(user?.name ?? null);
  const [tab, setTab] = useState<LiveTab>('nu');

  // When Bas advances the stage, pull everyone to the live view.
  const prevStage = useRef<LiveStage | null>(null);
  const stage = state?.stage ?? null;
  useEffect(() => {
    if (stage && prevStage.current && stage !== prevStage.current) setTab('nu');
    if (stage) prevStage.current = stage;
  }, [stage]);

  if (!user) {
    return (
      <>
        <Aurora />
        <NamePicker onSelect={(p: Person) => setUser(p)} />
      </>
    );
  }

  return (
    <SessionTimingContext.Provider
      value={{ timers: state?.timers ?? null, topOutcomes: state?.topOutcomes ?? null }}
    >
      <Aurora />
      <div className="relative z-10 mx-auto flex h-full max-w-[480px] flex-col">
        <Header user={user} onChangeUser={clearUser} />
        {status === 'offline' && (
          <div className="mx-5 mb-1 rounded-xl border border-villain/30 bg-villain/10 px-3 py-2 text-center text-[12px] font-semibold text-villain">
            Verbinding maken met de sessie…
          </div>
        )}
        <main key={tab} className="animate-fade-up flex-1 overflow-y-auto px-5 pt-5 pb-[140px]">
          {tab === 'spelregels' && <SpelregelsTab />}
          {tab === 'nu' && <LiveStageView user={user} state={state} status={status} vote={vote} />}
        </main>
        <BottomNav active={tab} onSelect={(id) => setTab(id as LiveTab)} items={LIVE_NAV} />
      </div>
    </SessionTimingContext.Provider>
  );
}

function LiveStageView({
  user,
  state,
  status,
  vote,
}: {
  user: Person;
  state: ReturnType<typeof useSession>['state'];
  status: ReturnType<typeof useSession>['status'];
  vote: ReturnType<typeof useSession>['vote'];
}) {
  if (!state) {
    return (
      <Waiting
        title={status === 'offline' ? 'Geen verbinding' : 'Verbinden…'}
        sub={
          status === 'offline'
            ? 'We proberen automatisch opnieuw verbinding te maken met de sessie.'
            : 'Even geduld, we halen de sessie op.'
        }
      />
    );
  }

  switch (state.stage) {
    case 'onderling':
      return <OnderlingView />;
    case 'fase1':
      return <Fase1Tab user={user} />;
    case 'voting':
      return (
        <VotingTab
          outcomes={state.outcomes}
          voting={state.voting}
          myVote={state.myVote}
          tallies={state.tallies}
          votesCast={state.votesCast}
          onVote={vote}
        />
      );
    case 'fase2':
      return <Fase2Tab user={user} />;
    case 'pauze2':
      return <PauzeView />;
    case 'fase3':
      return <Fase3Tab user={user} />;
    case 'done':
      return (
        <Waiting title="Bedankt! 🎉" sub="De brainstorm zit erop. Bedankt voor je inzet!" />
      );
    case 'home':
    default:
      return <Lobby user={user} />;
  }
}

function Lobby({ user }: { user: Person }) {
  return (
    <>
      <PageHeader
        tag="Welkom"
        title={`Hey ${user.name}, we beginnen zo`}
        sub="Je hoeft niets te kiezen — je wordt automatisch meegenomen naar de juiste fase."
      />
      <SectionLabel>Programma van vandaag</SectionLabel>
      <AgendaList />
    </>
  );
}

function AgendaList() {
  return (
    <div className="flex flex-col gap-2">
      {AGENDA.map((item, i) => (
        <div key={i} className="glass flex items-center gap-3.5 rounded-[16px] p-3">
          <div className="flex size-12 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-white/[0.06] ring-1 ring-white/10">
            <span className="text-[15px] leading-none font-black text-brand">{item.minutes}</span>
            <span className="text-[9px] font-bold tracking-wide text-dim">MIN</span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[14.5px] leading-tight font-bold">{item.label}</div>
            {item.note && (
              <div className="mt-0.5 text-[12px] font-semibold text-brand/90">{item.note}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function OnderlingView() {
  return (
    <>
      <PageHeader
        tag="Ronde"
        title="Onderling begrip"
        sub="Begrijp waar de ander tegenaan loopt in zijn of haar werk"
      />
      <TimeBar phase="onderling" />
      <Card>
        <p className="text-[14px] leading-[1.7] text-ink/80">{ONDERLING_INTRO}</p>
      </Card>

      <SectionLabel>De vraag</SectionLabel>
      <div className="glass relative overflow-hidden rounded-card p-5">
        <span
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 h-full w-1 bg-gradient-to-b from-amber to-brand"
        />
        <p className="pl-2 text-[15px] leading-[1.6] font-semibold text-ink">{ONDERLING_NUANCED}</p>
      </div>
      <p className="mt-3 px-1 text-[13px] leading-[1.5] text-dim">
        Of recht voor z'n raap: <span className="font-semibold text-ink/80">{ONDERLING_BLUNT}</span>
      </p>
    </>
  );
}

function PauzeView() {
  return (
    <>
      <PageHeader
        tag="Pauze"
        title="Even chillen ☕"
        sub="Strek de benen en haal wat te drinken. We gaan zo verder met fase 3."
      />
      <TimeBar phase="pauze2" />
    </>
  );
}

function Waiting({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 size-3 animate-pulse rounded-full bg-brand shadow-[0_0_16px_4px_rgba(247,201,72,0.6)]" />
      <h2 className="text-[22px] font-black tracking-[-0.02em]">{title}</h2>
      <p className="mt-2 max-w-[300px] text-[14px] leading-[1.5] text-dim">{sub}</p>
    </div>
  );
}
