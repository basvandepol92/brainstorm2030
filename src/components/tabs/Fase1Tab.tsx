import { FASE1_INTRO, FASE1_THEMES } from '../../data/content';
import { groupMates } from '../../data/selectors';
import { PEOPLE } from '../../data/people';
import type { Person } from '../../data/types';
import {
  Card,
  CardLabel,
  Collapsible,
  Divider,
  GroupCard,
  GroupTiles,
  PageHeader,
  QuestionList,
  SectionLabel,
  TimeBar,
} from '../ui';

export function Fase1Tab({ user }: { user: Person }) {
  const mates = groupMates(PEOPLE, user, 'f1');

  return (
    <>
      <PageHeader
        tag="Fase 1"
        title="Samen dromen over Regio Zuid in 2030"
        sub="Verken samen de meest ambitieuze toekomst"
      />
      <TimeBar phase="fase1" />
      <GroupCard group={user.f1} />
      <Card>
        <CardLabel>In jouw groep</CardLabel>
        <GroupTiles people={mates} myName={user.name} />
      </Card>

      <Divider />
      <SectionLabel>Wat wordt er van je gevraagd?</SectionLabel>
      <Card>
        <p className="text-[14px] leading-[1.7] text-ink/75">{FASE1_INTRO}</p>
      </Card>

      <SectionLabel>Begeleidende vragen per thema</SectionLabel>
      <div className="flex flex-col gap-2.5">
        {FASE1_THEMES.map((theme) => (
          <Collapsible key={theme.title} emoji={theme.emoji} title={theme.title}>
            <QuestionList questions={theme.questions} />
          </Collapsible>
        ))}
      </div>
    </>
  );
}
