import { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Github, 
  ExternalLink, 
  Award, 
  Briefcase, 
  Calendar, 
  Mail, 
  Phone, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Star, 
  TrendingUp, 
  Layers, 
  Sliders, 
  FileText, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Code2
} from 'lucide-react';

export type JobRole = 'FULLSTACK_DEV' | 'GROWTH_ENGINEER' | 'QA_ENGINEER' | 'PRODUCT_DESIGNER';
export type Stage = 'APPLIED' | 'SCREENING' | 'TECH_TEST' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

export interface EvaluationScore {
  backend: number;      // Coeff 35%
  frontend: number;     // Coeff 30%
  qa_architecture: number; // Coeff 20%
  culture_fit: number;  // Coeff 15%
  lead_dev_notes: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: JobRole;
  experience_years: number;
  stage: Stage;
  tags: string[];
  github_url?: string;
  portfolio_url?: string;
  applied_date: string;
  salary_expectation_xof: number;
  availability: string;
  evaluation: EvaluationScore;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'kanban' | 'scorecard' | 'directory' | 'analytics'>('kanban');
  const [roleFilter, setRoleFilter] = useState<'ALL' | JobRole>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Candidates Initial Data
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 'c_1',
      name: 'Christophe Wavoeke',
      email: 'wavoekechristophe@gmail.com',
      phone: '+229 97 00 11 22',
      role: 'FULLSTACK_DEV',
      experience_years: 5,
      stage: 'INTERVIEW',
      tags: ['Laravel 11', 'React 18', 'TypeScript', 'Docker', 'PostgreSQL', 'Redis'],
      github_url: 'https://github.com/christophewavoeke',
      portfolio_url: 'https://christophewavoeke.dev',
      applied_date: '2026-09-19',
      salary_expectation_xof: 1200000,
      availability: 'Immédiate',
      evaluation: {
        backend: 98,
        frontend: 96,
        qa_architecture: 95,
        culture_fit: 94,
        lead_dev_notes: 'Candidat d une rigueur exceptionnelle. Architecture propre, clean code, excellente maîtrise de Laravel 11 et de l écosystème React/Vite. Potentiel Lead immédiat.'
      }
    },
    {
      id: 'c_2',
      name: 'Armel Hounkpatin',
      email: 'a.hounkpatin@gmail.com',
      phone: '+229 95 33 44 55',
      role: 'FULLSTACK_DEV',
      experience_years: 3,
      stage: 'TECH_TEST',
      tags: ['Laravel', 'Vue.js', 'MySQL', 'APIs REST'],
      github_url: 'https://github.com/armel-h',
      applied_date: '2026-09-20',
      salary_expectation_xof: 850000,
      availability: '1 mois de préavis',
      evaluation: {
        backend: 82,
        frontend: 78,
        qa_architecture: 75,
        culture_fit: 85,
        lead_dev_notes: 'Bonne compréhension des requêtes SQL et Eloquent. Test technique de code en cours de revue.'
      }
    },
    {
      id: 'c_3',
      name: 'Syntyche Agossa',
      email: 's.agossa@growth-afri.bj',
      phone: '+229 96 11 22 33',
      role: 'GROWTH_ENGINEER',
      experience_years: 4,
      stage: 'INTERVIEW',
      tags: ['GA4/GTM', 'n8n', 'SQL', 'APIs', 'Python', 'Hubspot'],
      applied_date: '2026-09-21',
      salary_expectation_xof: 950000,
      availability: 'Immédiate',
      evaluation: {
        backend: 75,
        frontend: 70,
        qa_architecture: 80,
        culture_fit: 92,
        lead_dev_notes: 'Profil très analytique, excellente maîtrise du tracking n8n et de l automatisation d acquisition B2B.'
      }
    },
    {
      id: 'c_4',
      name: 'Rodrigue Dossou',
      email: 'r.dossou@qa-automation.bj',
      phone: '+229 94 88 77 66',
      role: 'QA_ENGINEER',
      experience_years: 4,
      stage: 'TECH_TEST',
      tags: ['Playwright', 'Cypress', 'Postman', 'CI/CD GitHub Actions', 'Appium'],
      github_url: 'https://github.com/rodrigue-qa',
      applied_date: '2026-09-22',
      salary_expectation_xof: 900000,
      availability: '2 semaines',
      evaluation: {
        backend: 70,
        frontend: 75,
        qa_architecture: 94,
        culture_fit: 88,
        lead_dev_notes: 'Excellente suite de tests E2E Playwright et scénarios d intégration continue sur pipelines Docker.'
      }
    },
    {
      id: 'c_5',
      name: 'Inès Gbaguidi',
      email: 'ines.design@studio.bj',
      phone: '+229 40 55 66 77',
      role: 'PRODUCT_DESIGNER',
      experience_years: 3,
      stage: 'SCREENING',
      tags: ['Figma', 'Design System', 'User Flows', 'Wireframing', 'Prototypage'],
      portfolio_url: 'https://behance.net/ines-ux',
      applied_date: '2026-09-23',
      salary_expectation_xof: 800000,
      availability: 'Immédiate',
      evaluation: {
        backend: 40,
        frontend: 85,
        qa_architecture: 80,
        culture_fit: 90,
        lead_dev_notes: 'Superbe portfolio Figma, très bonne maîtrise des composants réutilisables et des tokens de design.'
      }
    }
  ]);

  // Selected Candidate for Scorecard or Detail Modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  // Scorecard Evaluation Form State
  const [evalCandidateId, setEvalCandidateId] = useState<string>('c_1');
  const [evalBack, setEvalBack] = useState<number>(95);
  const [evalFront, setEvalFront] = useState<number>(92);
  const [evalQa, setEvalQa] = useState<number>(90);
  const [evalCulture, setEvalCulture] = useState<number>(94);
  const [evalNotes, setEvalNotes] = useState<string>('Maîtrise technique confirmée lors de l entretien de code.');
  const [evalSavedBanner, setEvalSavedBanner] = useState<boolean>(false);

  // New Candidate Modal
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+229 ');
  const [newRole, setNewRole] = useState<JobRole>('FULLSTACK_DEV');
  const [newExp, setNewExp] = useState(3);
  const [newTags, setNewTags] = useState('Laravel, React, TypeScript');
  const [newSalary, setNewSalary] = useState(900000);
  const [newGithub, setNewGithub] = useState('');

  // Calculate Weighted Score: 35% Back + 30% Front + 20% QA + 15% Culture
  const calculateScore = (e: EvaluationScore) => {
    const total = (e.backend * 0.35) + (e.frontend * 0.30) + (e.qa_architecture * 0.20) + (e.culture_fit * 0.15);
    return Math.round(total * 10) / 10;
  };

  const currentEvalTotal = useMemo(() => {
    const total = (evalBack * 0.35) + (evalFront * 0.30) + (evalQa * 0.20) + (evalCulture * 0.15);
    return Math.round(total * 10) / 10;
  }, [evalBack, evalFront, evalQa, evalCulture]);

  // Save Evaluation
  const handleSaveEvaluation = () => {
    setCandidates(prev => prev.map(c => {
      if (c.id === evalCandidateId) {
        return {
          ...c,
          evaluation: {
            backend: evalBack,
            frontend: evalFront,
            qa_architecture: evalQa,
            culture_fit: evalCulture,
            lead_dev_notes: evalNotes
          }
        };
      }
      return c;
    }));
    setEvalSavedBanner(true);
    setTimeout(() => setEvalSavedBanner(false), 3000);
  };

  // Switch evaluated candidate
  const handleSelectEvalCandidate = (id: string) => {
    setEvalCandidateId(id);
    const cand = candidates.find(c => c.id === id);
    if (cand) {
      setEvalBack(cand.evaluation.backend);
      setEvalFront(cand.evaluation.frontend);
      setEvalQa(cand.evaluation.qa_architecture);
      setEvalCulture(cand.evaluation.culture_fit);
      setEvalNotes(cand.evaluation.lead_dev_notes);
    }
  };

  // Move candidate to next stage
  const handleUpdateStage = (id: string, newStage: Stage) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));
  };

  // Add Candidate
  const handleAddCandidate = () => {
    if (!newName.trim()) return;
    const newCand: Candidate = {
      id: `c_${Date.now()}`,
      name: newName,
      email: newEmail,
      phone: newPhone,
      role: newRole,
      experience_years: Number(newExp),
      stage: 'APPLIED',
      tags: newTags.split(',').map(t => t.trim()),
      github_url: newGithub || undefined,
      applied_date: new Date().toISOString().substring(0, 10),
      salary_expectation_xof: Number(newSalary),
      availability: 'Immédiate',
      evaluation: {
        backend: 70,
        frontend: 70,
        qa_architecture: 70,
        culture_fit: 75,
        lead_dev_notes: 'Dossier reçu via portail recrutement talents@qileo.com'
      }
    };

    setCandidates(prev => [newCand, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

  // Role Meta Configuration
  const roleMeta: Record<JobRole, { title: string; badgeBg: string; text: string; border: string }> = {
    FULLSTACK_DEV: { title: 'Développeur Full Stack', badgeBg: 'bg-indigo-500/20', text: 'text-indigo-300', border: 'border-indigo-500/40' },
    GROWTH_ENGINEER: { title: 'Growth Engineer', badgeBg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40' },
    QA_ENGINEER: { title: 'QA Engineer / Automation', badgeBg: 'bg-cyan-500/20', text: 'text-cyan-300', border: 'border-cyan-500/40' },
    PRODUCT_DESIGNER: { title: 'Product Designer UI/UX', badgeBg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/40' },
  };

  const stageMeta: Record<Stage, { label: string; badgeBg: string; text: string }> = {
    APPLIED: { label: 'Candidatures Reçues', badgeBg: 'bg-slate-700/60', text: 'text-slate-200' },
    SCREENING: { label: 'Screening CV & Tech', badgeBg: 'bg-blue-500/20', text: 'text-blue-300' },
    TECH_TEST: { label: 'Test Pratique (Code)', badgeBg: 'bg-amber-500/20', text: 'text-amber-300' },
    INTERVIEW: { label: 'Entretien Tech & Culture', badgeBg: 'bg-purple-500/20', text: 'text-purple-300' },
    HIRED: { label: 'Offre Validée (CDI)', badgeBg: 'bg-emerald-500/20', text: 'text-emerald-300' },
    REJECTED: { label: 'Non Retenu', badgeBg: 'bg-rose-500/20', text: 'text-rose-300' },
  };

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter(c => {
      const matchRole = roleFilter === 'ALL' || c.role === roleFilter;
      const matchSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchRole && matchSearch;
    });
  }, [candidates, roleFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#080C1A] text-slate-100 flex flex-col font-sans">
      {/* Top Banner Navigation */}
      <header className="border-b border-slate-800 bg-[#0D1326] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 border border-purple-400/30">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">TalentPulse ATS</h1>
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Recrutement Tech & Produit
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 font-medium">Pipeline de Recrutement & Évaluation Technique Pondérée</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold rounded-lg shadow-md shadow-purple-900/30 border border-purple-400/30 flex items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Candidat</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 -mb-px overflow-x-auto pt-2 border-t border-slate-800/80">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'kanban'
                  ? 'border-purple-500 text-white bg-purple-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>Pipeline de Recrutement</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-200 font-bold">
                {candidates.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'scorecard'
                  ? 'border-purple-500 text-white bg-purple-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Scorecard Technique Pondérée</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'border-purple-500 text-white bg-purple-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span>Vivier des Candidats (360°)</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-purple-500 text-white bg-purple-500/10'
                  : 'border-transparent text-slate-300 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Métriques RH & Funnel</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Role Filter Bar (Visible in Kanban & Directory) */}
        {(activeTab === 'kanban' || activeTab === 'directory') && (
          <div className="p-4 rounded-2xl bg-[#0F172A] border border-slate-700/80 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 shrink-0">Filtrer Poste :</span>
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                  roleFilter === 'ALL'
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1E293B] text-slate-300 hover:text-white'
                }`}
              >
                Tous les Postes ({candidates.length})
              </button>
              {(['FULLSTACK_DEV', 'GROWTH_ENGINEER', 'QA_ENGINEER', 'PRODUCT_DESIGNER'] as JobRole[]).map(r => {
                const count = candidates.filter(c => c.role === r).length;
                return (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                      roleFilter === r
                        ? 'bg-purple-600 text-white'
                        : 'bg-[#1E293B] text-slate-300 hover:text-white'
                    }`}
                  >
                    {roleMeta[r].title} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, email, compétence..."
                className="w-full bg-[#080C1A] border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: KANBAN PIPELINE */}
        {/* ============================================================== */}
        {activeTab === 'kanban' && (
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
            {(['APPLIED', 'SCREENING', 'TECH_TEST', 'INTERVIEW', 'HIRED'] as Stage[]).map(stageKey => {
              const stageCandidates = filteredCandidates.filter(c => c.stage === stageKey);
              const meta = stageMeta[stageKey];

              return (
                <div key={stageKey} className="rounded-2xl bg-[#0F172A] border border-slate-700/80 flex flex-col h-[calc(100vh-290px)] min-h-[520px]">
                  {/* Column Header */}
                  <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-white text-xs sm:text-sm">{meta.label}</span>
                    <span className="w-6 h-6 rounded-full bg-[#1E293B] text-slate-200 text-xs font-bold flex items-center justify-center border border-slate-700">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {stageCandidates.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-800 rounded-xl">
                        Aucun candidat
                      </div>
                    ) : (
                      stageCandidates.map(cand => {
                        const score = calculateScore(cand.evaluation);
                        const isTop = score >= 90;
                        const role = roleMeta[cand.role];

                        return (
                          <div 
                            key={cand.id}
                            className="p-3.5 rounded-xl bg-[#131D33] border border-slate-700 hover:border-purple-500/60 shadow-md transition space-y-2.5"
                          >
                            {/* Card Top: Role & Score */}
                            <div className="flex items-start justify-between">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${role.badgeBg} ${role.text} ${role.border}`}>
                                {role.title}
                              </span>
                              <div className={`flex items-center gap-1 font-mono text-xs font-black px-2 py-0.5 rounded ${
                                isTop ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-200'
                              }`}>
                                {isTop && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                                <span>{score}/100</span>
                              </div>
                            </div>

                            {/* Candidate Name & Exp */}
                            <div>
                              <h4 className="font-extrabold text-white text-sm">{cand.name}</h4>
                              <p className="text-xs text-slate-400">{cand.experience_years} ans d'expérience</p>
                            </div>

                            {/* Tech Stack Tags */}
                            <div className="flex flex-wrap gap-1">
                              {cand.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0A0E1A] text-slate-300 border border-slate-800">
                                  {tag}
                                </span>
                              ))}
                              {cand.tags.length > 3 && (
                                <span className="text-[10px] text-slate-400 self-center">+{cand.tags.length - 3}</span>
                              )}
                            </div>

                            {/* Actions & Move Stage */}
                            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                              <button
                                onClick={() => setSelectedCandidate(cand)}
                                className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1"
                              >
                                Dossier <ChevronRight className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center gap-1">
                                {stageKey !== 'APPLIED' && (
                                  <button
                                    title="Reculer d'étape"
                                    onClick={() => {
                                      const prevStageMap: Record<Stage, Stage> = {
                                        APPLIED: 'APPLIED',
                                        SCREENING: 'APPLIED',
                                        TECH_TEST: 'SCREENING',
                                        INTERVIEW: 'TECH_TEST',
                                        HIRED: 'INTERVIEW',
                                        REJECTED: 'APPLIED'
                                      };
                                      handleUpdateStage(cand.id, prevStageMap[stageKey]);
                                    }}
                                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </button>
                                )}

                                {stageKey !== 'HIRED' && (
                                  <button
                                    onClick={() => {
                                      const nextStageMap: Record<Stage, Stage> = {
                                        APPLIED: 'SCREENING',
                                        SCREENING: 'TECH_TEST',
                                        TECH_TEST: 'INTERVIEW',
                                        INTERVIEW: 'HIRED',
                                        HIRED: 'HIRED',
                                        REJECTED: 'APPLIED'
                                      };
                                      handleUpdateStage(cand.id, nextStageMap[stageKey]);
                                    }}
                                    className="px-2 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition"
                                  >
                                    <span>Avancer</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: SCORECARD TECHNIQUE PONDÉRÉE */}
        {/* ============================================================== */}
        {activeTab === 'scorecard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Interactive Scorecard Form */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-indigo-400" />
                    Grille d'Évaluation Technique Collaborative
                  </h2>
                  <p className="text-xs sm:text-sm font-medium text-slate-300 mt-1">
                    Calcul automatisé de la note pondérée sur 100 selon les 4 critères de sélection
                  </p>
                </div>
              </div>

              {evalSavedBanner && (
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 text-sm font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Évaluation technique enregistrée avec succès dans le profil du candidat !</span>
                </div>
              )}

              {/* Candidate Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Candidat à Évaluer
                </label>
                <select
                  value={evalCandidateId}
                  onChange={(e) => handleSelectEvalCandidate(e.target.value)}
                  className="w-full bg-[#080C1A] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {roleMeta[c.role].title} ({c.experience_years} ans)
                    </option>
                  ))}
                </select>
              </div>

              {/* Criteria Sliders */}
              <div className="space-y-5 pt-2">
                {/* 1. Back-end */}
                <div className="p-4 rounded-xl bg-[#131D33] border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-white">Back-end & Architecture APIs</span>
                      <span className="ml-2 text-xs font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded">
                        Coeff : 35%
                      </span>
                    </div>
                    <span className="text-lg font-black text-white font-mono">{evalBack} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalBack}
                    onChange={(e) => setEvalBack(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <p className="text-[11px] text-slate-400">Laravel 11, Clean Architecture, Eloquent ORM, Transactions ACID, Queues Redis</p>
                </div>

                {/* 2. Front-end */}
                <div className="p-4 rounded-xl bg-[#131D33] border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-white">Front-end & Composants Réutilisables</span>
                      <span className="ml-2 text-xs font-bold text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded">
                        Coeff : 30%
                      </span>
                    </div>
                    <span className="text-lg font-black text-white font-mono">{evalFront} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalFront}
                    onChange={(e) => setEvalFront(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <p className="text-[11px] text-slate-400">React 18, TypeScript strict, TailwindCSS, ergonomie, gestion d'état réactive</p>
                </div>

                {/* 3. QA & Clean Code */}
                <div className="p-4 rounded-xl bg-[#131D33] border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-white">QA, Automatisation Tests & Docker</span>
                      <span className="ml-2 text-xs font-bold text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded">
                        Coeff : 20%
                      </span>
                    </div>
                    <span className="text-lg font-black text-white font-mono">{evalQa} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalQa}
                    onChange={(e) => setEvalQa(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <p className="text-[11px] text-slate-400">Pest / PHPUnit, Playwright / Cypress, Postman, CI/CD, conteneurs Docker</p>
                </div>

                {/* 4. Culture Fit & Soft Skills */}
                <div className="p-4 rounded-xl bg-[#131D33] border border-slate-700 space-y-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-white">Culture Fit, Autonomie & Communication</span>
                      <span className="ml-2 text-xs font-bold text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded">
                        Coeff : 15%
                      </span>
                    </div>
                    <span className="text-lg font-black text-white font-mono">{evalCulture} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalCulture}
                    onChange={(e) => setEvalCulture(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <p className="text-[11px] text-slate-400">Esprit d'équipe, clarté pédagogique, capacité d'adaptation et leadership</p>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Synthèse & Commentaires du Lead Évaluateur
                </label>
                <textarea
                  rows={3}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  className="w-full bg-[#080C1A] border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSaveEvaluation}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Enregistrer la Scorecard Technique</span>
              </button>
            </div>

            {/* Right: Live Verdict & Weighted Formula Card */}
            <div className="lg:col-span-5 space-y-6">
              {/* Live Score Display */}
              <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md text-center space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Note Globale Pondérée Calculée
                </span>
                
                <div className="py-2">
                  <span className={`text-6xl font-black tracking-tight font-mono ${
                    currentEvalTotal >= 90 ? 'text-amber-400' : (currentEvalTotal >= 75 ? 'text-emerald-400' : 'text-blue-400')
                  }`}>
                    {currentEvalTotal}
                  </span>
                  <span className="text-2xl font-bold text-slate-400"> / 100</span>
                </div>

                {/* Verdict Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-extrabold border shadow">
                  {currentEvalTotal >= 90 ? (
                    <span className="text-amber-300 bg-amber-500/20 border-amber-500/40 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-amber-400" />
                      Top 1% Élite — Embauche Prioritaire
                    </span>
                  ) : currentEvalTotal >= 75 ? (
                    <span className="text-emerald-300 bg-emerald-500/20 border-emerald-500/40 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Profil Validé — Conforme aux Exigences
                    </span>
                  ) : currentEvalTotal >= 60 ? (
                    <span className="text-blue-300 bg-blue-500/20 border-blue-500/40 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-blue-400" />
                      Vivier en Réserve
                    </span>
                  ) : (
                    <span className="text-rose-300 bg-rose-500/20 border-rose-500/40 px-3 py-1 rounded-lg flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-400" />
                      Non Retenu
                    </span>
                  )}
                </div>
              </div>

              {/* Formula Explanation */}
              <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md space-y-3 text-xs text-slate-300">
                <h4 className="font-bold text-white uppercase tracking-wider text-sm flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  Formule Mathématique Officielle
                </h4>
                <div className="p-3 rounded-xl bg-[#080C1A] border border-slate-800 font-mono text-purple-300 leading-relaxed">
                  Note = (0.35 × Back) + (0.30 × Front) + (0.20 × QA) + (0.15 × Culture)
                </div>
                <p className="leading-relaxed">
                  Cette pondération assure la stricte équité de sélection entre les candidats en accordant la priorité à la robustesse architecturale backend (Laravel 11 APIs) et à la fluidité de l'expérience frontend (React 18).
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: VIVIER DES CANDIDATS (360°) */}
        {/* ============================================================== */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h2 className="text-xl font-bold text-white mb-4">Annuaire des Talents & Candidatures Reçues</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#131D33] text-slate-300 font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Candidat & Coordonnées</th>
                      <th className="py-3 px-4">Poste Ciblé</th>
                      <th className="py-3 px-4 text-center">Score Global</th>
                      <th className="py-3 px-4">Prétention (XOF)</th>
                      <th className="py-3 px-4 text-center">Étape Pipeline</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredCandidates.map(cand => {
                      const score = calculateScore(cand.evaluation);
                      const role = roleMeta[cand.role];
                      const stage = stageMeta[cand.stage];

                      return (
                        <tr key={cand.id} className="hover:bg-slate-800/40 transition">
                          <td className="py-3.5 px-4">
                            <div className="font-extrabold text-white text-base">{cand.name}</div>
                            <div className="text-xs text-slate-400">{cand.email} • {cand.phone}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${role.badgeBg} ${role.text} ${role.border}`}>
                              {role.title}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="font-mono text-sm font-black text-amber-400">
                              {score} / 100
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-200">
                            {cand.salary_expectation_xof.toLocaleString()} XOF
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${stage.badgeBg} ${stage.text}`}>
                              {stage.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => setSelectedCandidate(cand)}
                              className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-bold rounded-lg text-xs border border-purple-500/40 transition"
                            >
                              Fiche 360°
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MÉTRIQUES RH & FUNNEL */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Délai Moyen d'Embauche</h3>
              <p className="text-4xl font-black text-purple-400 mt-2">14 Jours</p>
              <p className="text-xs text-slate-400 mt-1">Du premier screening jusqu'à l'offre formelle</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Taux de Réussite Test Code</h3>
              <p className="text-4xl font-black text-emerald-400 mt-2">68.5%</p>
              <p className="text-xs text-slate-400 mt-1">Tests pratiques validés au-dessus de 75/100</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-slate-700/80 shadow-md">
              <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Compétences Phares Évaluées</h3>
              <p className="text-base font-extrabold text-white mt-3">Laravel 11, React 18, TypeScript, Docker</p>
              <p className="text-xs text-cyan-400 mt-1">100% aligné sur l'équipe Tech & Produit</p>
            </div>
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* MODAL : FICHE CANDIDAT 360° */}
      {/* ============================================================== */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl bg-[#0F172A] border border-slate-700 rounded-2xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-xl font-bold text-white">{selectedCandidate.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${roleMeta[selectedCandidate.role].badgeBg} ${roleMeta[selectedCandidate.role].text} ${roleMeta[selectedCandidate.role].border}`}>
                  {roleMeta[selectedCandidate.role].title}
                </span>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#080C1A] border border-slate-800">
                <span className="text-slate-400 block font-semibold">Email & Téléphone</span>
                <span className="text-sm font-bold text-white block mt-0.5">{selectedCandidate.email}</span>
                <span className="text-slate-300 font-mono">{selectedCandidate.phone}</span>
              </div>
              <div className="p-3 rounded-lg bg-[#080C1A] border border-slate-800">
                <span className="text-slate-400 block font-semibold">Prétention Salariale</span>
                <span className="text-sm font-black text-emerald-400 block mt-0.5">
                  {selectedCandidate.salary_expectation_xof.toLocaleString()} XOF
                </span>
                <span className="text-slate-400">Disponibilité : {selectedCandidate.availability}</span>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="p-4 rounded-xl bg-[#131D33] border border-slate-700 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Scorecard Technique</span>
                <span className="text-base font-black text-amber-400 font-mono">
                  {calculateScore(selectedCandidate.evaluation)} / 100
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                <div className="p-2 rounded bg-[#080C1A]">
                  <span className="text-slate-400 block text-[10px]">Back-end</span>
                  <span className="font-bold text-white">{selectedCandidate.evaluation.backend}</span>
                </div>
                <div className="p-2 rounded bg-[#080C1A]">
                  <span className="text-slate-400 block text-[10px]">Front-end</span>
                  <span className="font-bold text-white">{selectedCandidate.evaluation.frontend}</span>
                </div>
                <div className="p-2 rounded bg-[#080C1A]">
                  <span className="text-slate-400 block text-[10px]">QA / Tests</span>
                  <span className="font-bold text-white">{selectedCandidate.evaluation.qa_architecture}</span>
                </div>
                <div className="p-2 rounded bg-[#080C1A]">
                  <span className="text-slate-400 block text-[10px]">Culture</span>
                  <span className="font-bold text-white">{selectedCandidate.evaluation.culture_fit}</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 pt-2 italic">
                "{selectedCandidate.evaluation.lead_dev_notes}"
              </p>
            </div>

            {/* Links */}
            <div className="flex items-center gap-3">
              {selectedCandidate.github_url && (
                <a
                  href={selectedCandidate.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <Github className="w-4 h-4" />
                  <span>Dépôt GitHub</span>
                </a>
              )}
              {selectedCandidate.portfolio_url && (
                <a
                  href={selectedCandidate.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Portfolio Démo</span>
                </a>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition"
              >
                Fermer Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : AJOUT CANDIDAT */}
      {/* ============================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#0F172A] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Ajouter un Nouveau Candidat</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Jean Houndé"
                  className="w-full bg-[#080C1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Poste Candidaté
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as JobRole)}
                  className="w-full bg-[#080C1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="FULLSTACK_DEV">Développeur Full Stack</option>
                  <option value="GROWTH_ENGINEER">Growth Engineer</option>
                  <option value="QA_ENGINEER">QA Engineer / Automation</option>
                  <option value="PRODUCT_DESIGNER">Product Designer UI/UX</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="candidat@email.bj"
                    className="w-full bg-[#080C1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#080C1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Compétences Clés (séparées par virgule)
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-[#080C1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Prétention Salariale (XOF)
                </label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(Number(e.target.value))}
                  className="w-full bg-[#080C1A] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCandidate}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-sm shadow-md transition"
              >
                Ajouter au Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
