export const SPELREGELS: string[] = [
  'Laat bij elke brainstormfase 1 iemand CoPilot aanzetten om te notuleren tijdens deze fase. Dit helpt je aan het einde van de fase om je opbrengsten sneller bij elkaar te krijgen.',
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

// ── Agenda (getoond in de lobby / "Nu"-tab vóór de start) ────────────────────
export interface AgendaItem {
  label: string;
  minutes: number;
  note?: string;
}

export const AGENDA: AgendaItem[] = [
  { label: 'Opening, Visie & Uitleg', minutes: 15 },
  { label: 'Onderling begrip', minutes: 15 },
  { label: 'Brainstorm fase 1', minutes: 40 },
  { label: 'Pauze', minutes: 10, note: 'Dotvoten' },
  { label: 'Brainstorm fase 2', minutes: 40 },
  { label: 'Pauze', minutes: 10, note: 'Even chillen' },
  { label: 'Brainstorm fase 3', minutes: 40 },
  { label: 'Afronding & Wrap-up', minutes: 10 },
];

// ── Per fase: "Deze ronde werkt als volgt" + "Na deze fase lever je op" ───────
export interface PhaseBriefing {
  werkwijze: string[];
  oplevering: string[];
}

export const FASE1_BRIEFING: PhaseBriefing = {
  werkwijze: [
    'We splitsen de groep op in 3 groepen. Elke groep vormt een droombeeld van regio Zuid in 2030. Hiervoor mag je zelf dromen óf gebruikmaken van de begeleidende vragen die verderop in de app staan — als dat helpt.',
    'Elke groep eindigt met 1 visie voor 2030 en maximaal 5 droombeelden.',
  ],
  oplevering: [
    'Jullie gezamenlijke visie voor 2030 en al jullie bedachte droombeelden voor Zuid 2030 op een flipover. Je pitcht dit in maximaal 2 minuten aan de rest van de groep.',
  ],
};

export const FASE2_BRIEFING: PhaseBriefing = {
  werkwijze: [
    'Hier tappen we in op onze creativiteit. We hebben het afgelopen jaar allemaal super gedaan, dus dwingen we onszelf om met een andere bril naar de opdracht te kijken — die van een superheld, superschurk of sidekick.',
    "We splitsen de groep op in 3 groepen. Elke groep gaat aan de slag met 1 van de 3 sets thema's uit de vorige ronde en kijkt wat er nodig is om ze realistisch te maken. Iedereen reflecteert op de thema's vanuit zijn of haar toegewezen rol. De groep maakt een flipover met de 3 thema's en daarop de kansen/potentie, de risico's en de randvoorwaarden.",
  ],
  oplevering: [
    "Jullie 3 droombeelden op een flipover, met per droombeeld: de kansen/potentie van thema X, de risico's van thema X en de randvoorwaarden voor thema X. Eén van je groep pitcht dit in de volgende ronde aan het volgende groepje.",
  ],
};

export const FASE3_BRIEFING: PhaseBriefing = {
  werkwijze: [
    "We hebben nu 3 sets thema's behandeld voor het plan 2030. Je krijgt 1 set toebedeeld als groepje. Nu denken we per discipline na over hoe we die grote thema's klein krijgen en wat we in H2 willen beetpakken om daar te komen.",
    'Beantwoord de vraag: "Denk vanuit je discipline, maar niet alleen vóór je discipline. Welke bijdrage kan jouw discipline leveren aan regio Zuid 2030 in elk thema?" Formuleer maximaal 3 H2-acties en schrijf ze op een flipover. Beschrijf per actie wat we gaan doen en waarom het bijdraagt aan 1 van de 2030-thema\'s. Gebruik desgewenst de begeleidende vragen verderop in de app.',
  ],
  oplevering: [
    'Acties voor de 3 droombeelden van je groep op een flipover. Elk groepje pitcht maximaal 2 minuten.',
  ],
};

// ── Ronde "Onderling begrip" (vóór fase 1) ───────────────────────────────────
export const ONDERLING_INTRO =
  'We starten niet om in de negativiteit te duiken, maar om te begrijpen waar de ander tegenaan loopt in zijn of haar werk. Luister, vraag door en probeer écht te snappen wat het werk van een ander soms lastig maakt.';

export const ONDERLING_BLUNT = 'Wat is het aller k*tste aan je werk?';

export const ONDERLING_NUANCED =
  'Wat maakt jouw werk soms onnodig moeilijk, en wat zou je willen dat anderen beter begrijpen over jouw rol?';
