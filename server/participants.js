// The canonical list of participant names. Used to validate votes so that
// only known names can cast a ballot (one ballot per name). Keep this in sync
// with src/data/people.ts on the front-end.
export const PARTICIPANTS = [
  'Sven',
  'Bram',
  'Elske',
  'Anne-Sophie',
  'Britt',
  'Richard',
  'Ellen',
  'Bas',
  'Julia',
  'Jordy',
  'René',
  'Wouter',
  'Remco',
  'Eline',
];

const SET = new Set(PARTICIPANTS);

export function isParticipant(name) {
  return typeof name === 'string' && SET.has(name);
}
