import { FASE3_INTRO, FASE3_QUESTIONS } from '../../data/content';
import { groupMates } from '../../data/selectors';
import { PEOPLE } from '../../data/people';
import type { Person } from '../../data/types';
import {
  Card,
  CardLabel,
  Chips,
  Divider,
  GroupCard,
  PageHeader,
  QuestionList,
  SectionLabel,
  TimeBar,
} from '../ui';

export function Fase3Tab({ user }: { user: Person }) {
  const mates = groupMates(PEOPLE, user, 'f3');

  return (
    <>
      <PageHeader
        tag="Fase 3"
        title="Van dromen naar concrete acties in H2"
        sub="Maak het tastbaar en actiegericht"
      />
      <TimeBar />
      <GroupCard group={user.f3} />
      <Card>
        <CardLabel>In jouw groep</CardLabel>
        <Chips people={mates} myName={user.name} />
      </Card>

      <Divider />
      <SectionLabel>Wat wordt er van je gevraagd?</SectionLabel>
      <Card>
        <p className="text-[14px] leading-[1.7] text-ink/75">{FASE3_INTRO}</p>
      </Card>

      <SectionLabel>Begeleidende vragen</SectionLabel>
      <Card>
        <QuestionList questions={FASE3_QUESTIONS} />
      </Card>
    </>
  );
}
