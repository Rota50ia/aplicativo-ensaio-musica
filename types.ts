
export enum SectionType {
  INTRO = 'Intro',
  INTRO_2 = 'Intro 2',
  INTRO_3 = 'Intro 3',
  INTRO_4 = 'Intro 4',
  VERSO_1 = 'Verso 1',
  VERSO_2 = 'Verso 2',
  VERSO_3 = 'Verso 3',
  VERSO_4 = 'Verso 4',
  PRE_REFRÃO = 'Pré-Refrão',
  REFRÃO = 'Refrão',
  POS_REFRÃO = 'Pós-Refrão',
  PONTE = 'Ponte',
  INTERLUDIO = 'Interlúdio',
  REFRÃO_FINAL = 'Refrão Final',
  OUTRO_FINAL = 'Outro / Final',
  CUSTOM = 'Customizado'
}

export interface ChartSection {
  id: string;
  type: SectionType;
  customLabel?: string;
  measures: number;
  notation?: string;
  cues: string;
}

export interface SongChart {
  id: string;
  title: string;
  artist: string;
  tempo: number;
  timeSignature: string;
  feel: string;
  genre: string;
  sections: ChartSection[];
}
