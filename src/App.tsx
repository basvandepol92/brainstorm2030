import { useState } from 'react';
import { Aurora } from './components/Aurora';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import LiveApp from './components/LiveApp';
import { NamePicker } from './components/NamePicker';
import { Fase1Tab } from './components/tabs/Fase1Tab';
import { Fase2Tab } from './components/tabs/Fase2Tab';
import { Fase3Tab } from './components/tabs/Fase3Tab';
import { HomeTab } from './components/tabs/HomeTab';
import { SpelregelsTab } from './components/tabs/SpelregelsTab';
import type { Person, TabId } from './data/types';
import { useStoredUser } from './hooks/useStoredUser';
import { LIVE_MODE } from './session/types';

function CurrentTab({
  tab,
  user,
  onNavigate,
}: {
  tab: TabId;
  user: Person;
  onNavigate: (tab: TabId) => void;
}) {
  switch (tab) {
    case 'home':
      return <HomeTab user={user} onNavigate={onNavigate} />;
    case 'spelregels':
      return <SpelregelsTab />;
    case 'fase1':
      return <Fase1Tab user={user} />;
    case 'fase2':
      return <Fase2Tab user={user} />;
    case 'fase3':
      return <Fase3Tab user={user} />;
  }
}

export default function App() {
  // In live mode the active phase, timers and dotvoting are driven by the
  // backend. Without a backend the app runs standalone (manual tabs), which is
  // also how the test suite exercises it.
  if (LIVE_MODE) return <LiveApp />;
  return <StandaloneApp />;
}

function StandaloneApp() {
  const { user, setUser, clearUser } = useStoredUser();
  const [tab, setTab] = useState<TabId>('home');

  return (
    <>
      <Aurora />

      {!user ? (
        <NamePicker
          onSelect={(person: Person) => {
            setUser(person);
            setTab('home');
          }}
        />
      ) : (
        <div className="relative z-10 mx-auto flex h-full max-w-[480px] flex-col">
          <Header user={user} onChangeUser={clearUser} />
          <main
            key={tab}
            className="animate-fade-up flex-1 overflow-y-auto px-5 pt-5 pb-[140px]"
          >
            <CurrentTab tab={tab} user={user} onNavigate={setTab} />
          </main>
          <BottomNav active={tab} onSelect={(id) => setTab(id as TabId)} />
        </div>
      )}
    </>
  );
}
