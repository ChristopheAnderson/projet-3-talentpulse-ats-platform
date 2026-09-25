import { Candidate, RecruitmentStage } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002/api/v1';

export interface EvaluationPayload {
  evaluator_name: string;
  backend_score: number;
  frontend_score: number;
  clean_code_score: number;
  culture_fit_score: number;
  feedback?: string;
}

export interface CreateCandidatePayload {
  name: string;
  email: string;
  role_applied: string;
  years_exp: number;
  github_url?: string;
  skills: string[];
}

export const atsApi = {
  // Créer un nouveau candidat
  async createCandidate(payload: CreateCandidatePayload): Promise<Candidate> {
    const res = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Échec de la création');
    const json = await res.json();
    return json.data;
  },

  // Récupérer la liste des candidatures
  async getCandidates(role?: string): Promise<Candidate[]> {
    try {
      const url = role && role !== 'ALL' ? `${API_BASE_URL}/candidates?role=${role}` : `${API_BASE_URL}/candidates`;
      const res = await fetch(url);
      if (!res.ok) throw new Error();
      const json = await res.json();
      return json.data;
    } catch {
      return [];
    }
  },

  // Déplacer un candidat dans le pipeline Kanban
  async updateStage(candidateId: number, stage: RecruitmentStage): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/candidates/${candidateId}/stage`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ stage }),
    });

    if (!res.ok) throw new Error('Échec du déplacement de statut');
  },

  // Soumettre une évaluation technique pondérée
  async submitEvaluation(candidateId: number, payload: EvaluationPayload): Promise<{ overall_score: number }> {
    const res = await fetch(`${API_BASE_URL}/candidates/${candidateId}/evaluations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Échec de l\'évaluation');
    return await res.json();
  }
};
