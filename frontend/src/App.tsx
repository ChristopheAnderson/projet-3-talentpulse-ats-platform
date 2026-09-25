import { useState } from 'react';
import { 
  Users, 
  ChevronRight, 
  Github, 
  Star, 
  Plus, 
  Sparkles,
  X,
  Award,
  Sliders
} from 'lucide-react';
import { Candidate, RecruitmentStage } from './types';
import { atsApi, EvaluationPayload } from './api/client';

const STAGES: { id: RecruitmentStage; title: string; badge: string }[] = [
  { id: 'APPLIED', title: 'Candidatures Reçues', badge: 'Reçu' },
  { id: 'TECH_SCREENING', title: 'Screening Technique', badge: 'Screening' },
  { id: 'CODE_TEST', title: 'Test Pratique (Laravel/React)', badge: 'Test Code' },
  { id: 'FINAL_INTERVIEW', title: 'Entretien Tech & Culture', badge: 'Entretien' },
  { id: 'OFFER', title: 'Offre d\'Embauche (CDI)', badge: 'Offre CDI' },
];

export default function App() {
  const [showEvalModal, setShowEvalModal] = useState<boolean>(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState<boolean>(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const [newCandidateForm, setNewCandidateForm] = useState({
    name: '',
    role: 'Développeur Full-Stack (Laravel & React)',
    years_exp: 3,
    github: 'github.com/',
    skills: 'Laravel 11, React 18, PostgreSQL'
  });

  const [evalScores, setEvalScores] = useState({
    backend_score: 95,
    frontend_score: 96,
    clean_code_score: 98,
    culture_fit_score: 95,
    feedback: 'Excellente maîtrise des APIs Laravel, de PostgreSQL et des composants modulaires React.'
  });

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 1,
      name: 'Christophe WAVOEKE',
      role: 'Développeur Full-Stack (Laravel & React)',
      stage: 'CODE_TEST',
      years_exp: 5,
      overall_score: 96,
      github: 'github.com/ChristopheAnderson',
      skills: ['Laravel 11', 'React 18', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker']
    },
    {
      id: 2,
      name: 'Kafui Lawson',
      role: 'QA Engineer / Test Automation',
      stage: 'FINAL_INTERVIEW',
      years_exp: 4,
      overall_score: 92,
      github: 'github.com/klawson-qa',
      skills: ['Playwright', 'Cypress', 'Postman', 'CI/CD']
    },
    {
      id: 3,
      name: 'Bernice Dossou',
      role: 'Growth Engineer',
      stage: 'TECH_SCREENING',
      years_exp: 3,
      overall_score: 88,
      github: 'github.com/bdossou-growth',
      skills: ['n8n', 'GA4 / GTM', 'SQL', 'APIs']
    },
    {
      id: 4,
      name: 'Marc-Aurèle Agbo',
      role: 'Product Designer UI/UX',
      stage: 'OFFER',
      years_exp: 4,
      overall_score: 95,
      github: 'figma.com/@marcau-design',
      skills: ['Figma', 'Design System', 'User Flows']
    }
  ]);

  const advanceCandidate = async (id: number, currentStage: RecruitmentStage) => {
    const stageFlow: RecruitmentStage[] = ['APPLIED', 'TECH_SCREENING', 'CODE_TEST', 'FINAL_INTERVIEW', 'OFFER'];
    const idx = stageFlow.indexOf(currentStage);
    if (idx < stageFlow.length - 1) {
      const next = stageFlow[idx + 1];
      try {
        await atsApi.updateStage(id, next);
      } catch {
        // Fallback local
      }
      setCandidates(candidates.map(c => c.id === id ? { ...c, stage: next } : c));
    }
  };

  const calculatedWeightedScore = Math.round(
    (evalScores.backend_score * 0.35) +
    (evalScores.frontend_score * 0.30) +
    (evalScores.clean_code_score * 0.20) +
    (evalScores.culture_fit_score * 0.15)
  );

  const handleSaveEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    const payload: EvaluationPayload = {
      evaluator_name: 'Lead Developer Tech & Produit',
      backend_score: evalScores.backend_score,
      frontend_score: evalScores.frontend_score,
      clean_code_score: evalScores.clean_code_score,
      culture_fit_score: evalScores.culture_fit_score,
      feedback: evalScores.feedback
    };

    try {
      await atsApi.submitEvaluation(selectedCandidate.id, payload);
    } catch {
      // Fallback local
    }

    setCandidates(candidates.map(c => 
      c.id === selectedCandidate.id ? { ...c, overall_score: calculatedWeightedScore } : c
    ));

    setShowEvalModal(false);
  };

  const handleAddCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const created: Candidate = {
      id: Date.now(),
      name: newCandidateForm.name,
      role: newCandidateForm.role,
      stage: 'APPLIED',
      years_exp: Number(newCandidateForm.years_exp),
      overall_score: 85,
      github: newCandidateForm.github,
      skills: newCandidateForm.skills.split(',').map(s => s.trim()).filter(Boolean)
    };

    try {
      await atsApi.createCandidate({
        name: created.name,
        email: `${created.name.toLowerCase().replace(/\s+/g, '.')}@candidate-tech.bj`,
        role_applied: created.role,
        years_exp: created.years_exp,
        github_url: `https://${created.github}`,
        skills: created.skills
      });
    } catch {
      // Fallback local
    }

    setCandidates([created, ...candidates]);
    setShowAddCandidateModal(false);
    setNewCandidateForm({
      name: '',
      role: 'Développeur Full-Stack (Laravel & React)',
      years_exp: 3,
      github: 'github.com/',
      skills: 'Laravel 11, React 18, PostgreSQL'
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100 tracking-tight">TalentPulse ATS</h1>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Équipe Tech &amp; Produit
              </span>
            </div>
            <p className="text-xs text-slate-400">Pipeline de Sélection &amp; Évaluation Technique Normalisée • PostgreSQL 16</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block pr-2">
            <span className="text-[11px] text-slate-400 block">Postes Ouverts CDI</span>
            <span className="text-sm font-bold text-slate-100">5 Talents</span>
          </div>
          <button 
            onClick={() => setShowAddCandidateModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter un Candidat
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-6 space-y-6">
        
        {/* Recrutement Stats (3-Color System: Slate + Indigo + Emerald) */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Total Candidatures</span>
            <p className="text-xl font-bold text-slate-100 mt-1">148 Dossiers</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-400 font-medium">En Pipeline Actif</span>
            <p className="text-xl font-bold text-indigo-400 mt-1">24 Profils</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Délai Moyen Recrutement</span>
            <p className="text-xl font-bold text-slate-100 mt-1">12 Jours</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-sm">
            <span className="text-xs text-slate-400 font-medium">Taux Réussite Test Code</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">38.5%</p>
          </div>
        </div>

        {/* Pipeline Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {STAGES.map((col) => {
            const colCandidates = candidates.filter(c => c.stage === col.id);
            return (
              <div key={col.id} className="flex flex-col bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden min-h-[580px]">
                {/* Column Header */}
                <div className="p-3.5 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-200 truncate">{col.title}</h3>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                    {colCandidates.length}
                  </span>
                </div>

                {/* Candidate Cards */}
                <div className="p-3 space-y-3 flex-1 overflow-y-auto">
                  {colCandidates.map((c) => (
                    <div key={c.id} className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-lg shadow-sm transition space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                            {c.name}
                            {c.overall_score >= 90 && (
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                            )}
                          </h4>
                          <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                            {c.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 text-[11px] font-semibold">
                          <Star className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                          {c.overall_score}%
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span>Expérience : {c.years_exp} ans</span>
                        <a href={`https://${c.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-slate-300 hover:text-white transition">
                          <Github className="w-3 h-3" /> Profil
                        </a>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1">
                        {c.skills.map(s => (
                          <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800/80 border border-slate-750 text-slate-300">
                            {s}
                          </span>
                        ))}
                      </div>

                      {/* Card Actions */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
                        <button
                          onClick={() => {
                            setSelectedCandidate(c);
                            setShowEvalModal(true);
                          }}
                          className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium transition"
                        >
                          <Sliders className="w-3 h-3" /> Grille Évaluation
                        </button>

                        {col.id !== 'OFFER' ? (
                          <button
                            onClick={() => advanceCandidate(c.id, c.stage)}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 transition text-[11px] font-medium"
                          >
                            Étape <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-medium">Offre Proposée</span>
                        )}
                      </div>
                    </div>
                  ))}

                  {colCandidates.length === 0 && (
                    <div className="text-center py-12 text-xs text-slate-600">
                      Aucun candidat
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* MODAL : GRILLE D'ÉVALUATION TECHNIQUE */}
      {showEvalModal && selectedCandidate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Award className="w-4 h-4 text-indigo-400" />
                  Grille d'Évaluation : {selectedCandidate.name}
                </h3>
                <p className="text-[11px] text-slate-400">{selectedCandidate.role}</p>
              </div>
              <button onClick={() => setShowEvalModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvaluation} className="space-y-4 text-xs">
              {/* Back-end Slider (35%) */}
              <div>
                <div className="flex justify-between font-medium text-slate-300 mb-1">
                  <span>Architecture Back-end &amp; Laravel (35%)</span>
                  <span className="text-indigo-400 font-bold">{evalScores.backend_score} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={evalScores.backend_score}
                  onChange={(e) => setEvalScores({ ...evalScores, backend_score: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Front-end Slider (30%) */}
              <div>
                <div className="flex justify-between font-medium text-slate-300 mb-1">
                  <span>Composants React 18 &amp; TypeScript (30%)</span>
                  <span className="text-indigo-400 font-bold">{evalScores.frontend_score} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={evalScores.frontend_score}
                  onChange={(e) => setEvalScores({ ...evalScores, frontend_score: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Clean Code & QA Slider (20%) */}
              <div>
                <div className="flex justify-between font-medium text-slate-300 mb-1">
                  <span>Clean Code &amp; Tests QA (20%)</span>
                  <span className="text-indigo-400 font-bold">{evalScores.clean_code_score} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={evalScores.clean_code_score}
                  onChange={(e) => setEvalScores({ ...evalScores, clean_code_score: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Culture Fit Slider (15%) */}
              <div>
                <div className="flex justify-between font-medium text-slate-300 mb-1">
                  <span>Culture Produit &amp; Collaboration (15%)</span>
                  <span className="text-indigo-400 font-bold">{evalScores.culture_fit_score} / 100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={evalScores.culture_fit_score}
                  onChange={(e) => setEvalScores({ ...evalScores, culture_fit_score: Number(e.target.value) })}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Résultat calculé en direct */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-medium">Note Finale Pondérée :</span>
                <span className="text-base font-bold text-emerald-400 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  {calculatedWeightedScore} %
                </span>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Commentaires de l'Évaluateur</label>
                <textarea
                  value={evalScores.feedback}
                  onChange={(e) => setEvalScores({ ...evalScores, feedback: e.target.value })}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEvalModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  Enregistrer l'Évaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2 : AJOUTER UN CANDIDAT */}
      {showAddCandidateModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" />
                Enregistrer une Nouvelle Candidature
              </h3>
              <button onClick={() => setShowAddCandidateModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddCandidate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Nom &amp; Prénom du Candidat</label>
                <input
                  type="text"
                  placeholder="ex: Jean-Luc Mensah"
                  value={newCandidateForm.name}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Poste Ciblé (Offre Tech &amp; Produit)</label>
                <select
                  value={newCandidateForm.role}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, role: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Développeur Full-Stack (Laravel & React)">Développeur Full-Stack (Laravel &amp; React)</option>
                  <option value="QA Engineer / Test Automation">QA Engineer / Test Automation</option>
                  <option value="Growth Engineer">Growth Engineer</option>
                  <option value="Product Designer UI/UX">Product Designer UI/UX</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Expérience (Années)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={newCandidateForm.years_exp}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, years_exp: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Profil GitHub / Portfolio</label>
                  <input
                    type="text"
                    placeholder="github.com/mon-profil"
                    value={newCandidateForm.github}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, github: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Compétences Clés (séparées par virgule)</label>
                <input
                  type="text"
                  placeholder="Laravel, React, PostgreSQL, Docker..."
                  value={newCandidateForm.skills}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, skills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCandidateModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  Intégrer au Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-6 text-center text-xs text-slate-500">
        TalentPulse ATS • Plateforme de Recrutement Normalisé • Laravel 11 Backend + React 18 TypeScript Dashboard
      </footer>
    </div>
  );
}
