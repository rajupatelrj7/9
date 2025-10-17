
export type Section = 'writing' | 'speaking' | 'reading' | 'listening';

export interface CriterionFeedback {
  score: number;
  feedback: string;
}

export interface WritingFeedback {
  overallBand: number;
  taskAchievement: CriterionFeedback;
  coherenceCohesion: CriterionFeedback;
  lexicalResource: CriterionFeedback;
  grammaticalRange: CriterionFeedback;
  correctedEssay: string;
}
