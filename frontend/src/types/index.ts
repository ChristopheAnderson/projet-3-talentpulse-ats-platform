export type RecruitmentStage = 
  | 'APPLIED' 
  | 'TECH_SCREENING' 
  | 'CODE_TEST' 
  | 'FINAL_INTERVIEW' 
  | 'OFFER';

export interface Candidate {
  id: number;
  name: string;
  role: string;
  stage: RecruitmentStage;
  years_exp: number;
  overall_score: number;
  github: string;
  skills: string[];
}
