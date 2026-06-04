import { FASE3_BRIEFING, FASE3_QUESTIONS } from '../../data/content';
import { groupMates } from '../../data/selectors';
import { PEOPLE } from '../../data/people';
import type { Person } from '../../data/types';
import { AssignedTopics } from '../AssignedTopics';
import {
  Briefing,
  Card,
  CardLabel,
  Divider,
  GroupCard,
  GroupTiles,
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
      <TimeBar phase="fase3" />
      <GroupCard group={user.f3} />
      <AssignedTopics group={user.f3} />
      <Card>
        <CardLabel>In jouw groep</CardLabel>
        <GroupTiles people={mates} myName={user.name} />
      </Card>

      <Divider />
      <Briefing werkwijze={FASE3_BRIEFING.werkwijze} oplevering={FASE3_BRIEFING.oplevering} />

      <Divider />
      <SectionLabel>Begeleidende vragen</SectionLabel>
      <Card>
        <QuestionList questions={FASE3_QUESTIONS} />
      </Card>
    </>
  );
}
