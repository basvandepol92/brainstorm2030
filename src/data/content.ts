export const SPELREGELS: string[] = [
  'Elk idee is welkom — oordeel pas later. Kwantiteit boven kwaliteit in de divergerende fase.',
  'Bouw voort op ideeën van anderen. Zeg "ja, en…" in plaats van "ja, maar…"',
  'Eén gesprek tegelijk. Laat elkaar uitpraten — geen interrupties.',
  'Iedereen draagt bij. Geen vrije passagiers — elke stem telt.',
  'Houd de energie hoog. Sta op, beweeg, wees enthousiast.',
  'Telefoon in de zak — behalve voor deze app 😉',
  'Respect voor ieders perspectief. Er zijn geen foute antwoorden.',
  'Houd de tijd in de gaten: 30 min brainstorm per fase, daarna 10 min plenair terugkoppelen.',
];

export interface QuestionTheme {
  emoji: string;
  title: string;
  questions: string[];
}

export const FASE1_THEMES: QuestionTheme[] = [
  {
    emoji: '👥',
    title: 'Klant',
    questions: [
      'Wat zeggen onze beste klanten in 2030 over Regio Zuid?',
      'Waarom kiezen klanten dan bewust voor ons?',
      'Waarin zijn we dan méér dan een detacheerder?',
    ],
  },
  {
    emoji: '⭐',
    title: 'Rockstar',
    questions: [
      'Waarom willen Rockstars in 2030 bij Regio Zuid horen?',
      'Wat ervaren zij hier wat ze elders niet ervaren?',
      'Hoe ziet ontwikkeling, community en werkgeluk er dan uit?',
    ],
  },
  {
    emoji: '🤝',
    title: 'Samenwerking in de regio',
    questions: [
      'Hoe werken Sales, TM, Recruitment, P&C en MD dan samen?',
      'Wat loopt dan vanzelf wat nu nog energie kost?',
      'Waar zijn we als regio uitzonderlijk goed in geworden?',
    ],
  },
  {
    emoji: '🚀',
    title: 'Dienstverlening',
    questions: [
      'Welke diensten leveren we dan die we nu nog beperkt of niet leveren?',
      'Welke rol spelen consultancy, projecten, AI of nieuwe proposities?',
      'Waar staan we in de markt om bekend?',
    ],
  },
  {
    emoji: '⚙️',
    title: 'Organisatie & Operatie',
    questions: [
      'Wat hebben we slimmer, schaalbaarder of professioneler gemaakt?',
      'Welke keuzes hebben we gemaakt waardoor we niet alles meer tegelijk doen?',
      'Wat doen we in 2030 juist níet meer?',
      'Wat is voor onze regio echt gamechanging geweest in 2030?',
    ],
  },
];

export const FASE3_QUESTIONS: string[] = [
  "Welke 1 of 2 thema's raken onze discipline het meest?",
  'Wat moeten wij in H2 al anders, beter of slimmer gaan doen?',
  'Welke concrete actie kunnen we starten binnen 30 dagen?',
  'Welke actie vraagt samenwerking met een andere discipline?',
  'Wat moeten we stoppen, versimpelen of niet meer doen?',
  'Wat hebben we nodig van MT om dit mogelijk te maken?',
];

export const FASE1_INTRO =
  'Droom samen over hoe Regio Zuid eruitziet in 2030. Denk groot, denk ambitieus. Gebruik de begeleidende vragen hieronder als inspiratie — er zijn geen foute antwoorden. Schrijf de mooiste dromen op.';

export const FASE3_INTRO =
  "Nu gaan we van grote dromen naar concrete stappen. Kies samen de 1 of 2 thema's die jullie discipline het meest raken en beantwoord de vragen zo concreet mogelijk. Wat gaan jullie echt anders doen in H2?";
