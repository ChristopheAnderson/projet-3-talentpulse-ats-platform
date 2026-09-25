import { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  X, 
  Github, 
  ExternalLink, 
  Briefcase, 
  CheckCircle2, 
  RotateCcw,
  Sliders, 
  TrendingUp, 
  ChevronRight,
  Code2,
  Menu
} from 'lucide-react';

export type JobRole = 
  | 'TECH_LEAD_ARCHITECT'
  | 'DEVOPS_SRE'
  | 'DATA_ENGINEER'
  | 'PRODUCT_MANAGER'
  | 'DEVSECOPS'
  | 'MOBILE_ENGINEER';

export type Stage = 'APPLIED' | 'SCREENING' | 'TECH_TEST' | 'INTERVIEW' | 'HIRED' | 'REJECTED';

export interface EvaluationScore {
  backend: number;
  frontend: number;
  qa_architecture: number;
  culture_fit: number;
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Candidates Data with new diverse roles
  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: 'c_1',
      name: 'Christophe Wavoeke',
      email: 'wavoekechristophe@gmail.com',
      phone: '+229 97 00 11 22',
      role: 'TECH_LEAD_ARCHITECT',
      experience_years: 5,
      stage: 'INTERVIEW',
      tags: ['Architecture Microservices', 'Laravel 11', 'React 18', 'Docker', 'PostgreSQL', 'Redis'],
      github_url: 'https://github.com/christophewavoeke',
      portfolio_url: 'https://christophewavoeke.dev',
      applied_date: '2026-09-19',
      salary_expectation_xof: 1500000,
      availability: 'Immédiate',
      evaluation: {
        backend: 98,
        frontend: 96,
        qa_architecture: 95,
        culture_fit: 94,
        lead_dev_notes: 'Candidat d une rigueur architecturale rare. Maîtrise avancée des microservices, Clean Code et direction technique.'
      }
    },
    {
      id: 'c_2',
      name: 'Kafui Amoussou',
      email: 'k.amoussou@cloud-infra.bj',
      phone: '+229 95 33 44 55',
      role: 'DEVOPS_SRE',
      experience_years: 4,
      stage: 'TECH_TEST',
      tags: ['Kubernetes', 'Terraform', 'AWS Cloud', 'GitLab CI/CD', 'Prometheus'],
      github_url: 'https://github.com/kafui-devops',
      applied_date: '2026-09-20',
      salary_expectation_xof: 1250000,
      availability: '1 mois de préavis',
      evaluation: {
        backend: 85,
        frontend: 70,
        qa_architecture: 94,
        culture_fit: 88,
        lead_dev_notes: 'Excellente maîtrise des clusters Kubernetes, Infrastructure-as-Code et observabilité SRE.'
      }
    },
    {
      id: 'c_3',
      name: 'Syntyche Agossa',
      email: 's.agossa@data-tech.bj',
      phone: '+229 96 11 22 33',
      role: 'DATA_ENGINEER',
      experience_years: 4,
      stage: 'INTERVIEW',
      tags: ['PostgreSQL', 'Airflow Pipelines', 'dbt', 'Python ETL', 'Data Modeling'],
      github_url: 'https://github.com/syntyche-data',
      applied_date: '2026-09-21',
      salary_expectation_xof: 1100000,
      availability: 'Immédiate',
      evaluation: {
        backend: 88,
        frontend: 65,
        qa_architecture: 90,
        culture_fit: 92,
        lead_dev_notes: 'Forte expertise dans la structuration des data warehouses et l orchestration de pipelines volumineux.'
      }
    },
    {
      id: 'c_4',
      name: 'Armel Hounkpatin',
      email: 'a.hounkpatin@product-lab.bj',
      phone: '+229 94 88 77 66',
      role: 'PRODUCT_MANAGER',
      experience_years: 5,
      stage: 'TECH_TEST',
      tags: ['Product Discovery', 'Roadmapping SaaS', 'Scrum & Agile', 'User Research', 'Metrics KPI'],
      applied_date: '2026-09-22',
      salary_expectation_xof: 1300000,
      availability: '2 semaines',
      evaluation: {
        backend: 70,
        frontend: 80,
        qa_architecture: 85,
        culture_fit: 95,
        lead_dev_notes: 'Excellente vision produit B2B, grande clarté dans la formulation des user stories et l analyse d impact.'
      }
    },
    {
      id: 'c_5',
      name: 'Rodrigue Dossou',
      email: 'r.dossou@security-guard.bj',
      phone: '+229 97 44 22 88',
      role: 'DEVSECOPS',
      experience_years: 4,
      stage: 'SCREENING',
      tags: ['OWASP Top 10', 'Audit Pentest', 'PCI-DSS', 'HashiCorp Vault', 'SonarQube'],
      github_url: 'https://github.com/rodrigue-security',
      applied_date: '2026-09-23',
      salary_expectation_xof: 1200000,
      availability: 'Immédiate',
      evaluation: {
        backend: 82,
        frontend: 60,
        qa_architecture: 95,
        culture_fit: 88,
        lead_dev_notes: 'Spécialiste de la sécurité applicative et du durcissement des environnements de conteneurs.'
      }
    },
    {
      id: 'c_6',
      name: 'Inès Gbaguidi',
      email: 'ines.mobile@app-creators.bj',
      phone: '+229 40 55 66 77',
      role: 'MOBILE_ENGINEER',
      experience_years: 3,
      stage: 'SCREENING',
      tags: ['Flutter', 'Dart', 'iOS & Android', 'State Management', 'Offline-First'],
      github_url: 'https://github.com/ines-mobile',
      portfolio_url: 'https://apps.ines.dev',
      applied_date: '2026-09-24',
      salary_expectation_xof: 950000,
      availability: 'Immédiate',
      evaluation: {
        backend: 72,
        frontend: 92,
        qa_architecture: 84,
        culture_fit: 90,
        lead_dev_notes: 'Excellente maîtrise de Flutter cross-platform avec applications publiées sur les stores.'
      }
    }
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [evalCandidateId, setEvalCandidateId] = useState<string>('c_1');
  const [evalBack, setEvalBack] = useState<number>(95);
  const [evalFront, setEvalFront] = useState<number>(92);
  const [evalQa, setEvalQa] = useState<number>(90);
  const [evalCulture, setEvalCulture] = useState<number>(94);
  const [evalNotes, setEvalNotes] = useState<string>('Maîtrise technique confirmée lors de l entretien de code.');
  const [evalSavedBanner, setEvalSavedBanner] = useState<boolean>(false);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('+229 ');
  const [newRole, setNewRole] = useState<JobRole>('TECH_LEAD_ARCHITECT');
  const [newExp, setNewExp] = useState(4);
  const [newTags, setNewTags] = useState('Architecture, Microservices, Cloud, Docker');
  const [newSalary, setNewSalary] = useState(900000);
  const [newGithub, setNewGithub] = useState('');

  const calculateScore = (e: EvaluationScore) => {
    const total = (e.backend * 0.35) + (e.frontend * 0.30) + (e.qa_architecture * 0.20) + (e.culture_fit * 0.15);
    return Math.round(total * 10) / 10;
  };

  const currentEvalTotal = useMemo(() => {
    const total = (evalBack * 0.35) + (evalFront * 0.30) + (evalQa * 0.20) + (evalCulture * 0.15);
    return Math.round(total * 10) / 10;
  }, [evalBack, evalFront, evalQa, evalCulture]);

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

  const handleUpdateStage = (id: string, newStage: Stage) => {
    setCandidates(prev => prev.map(c => c.id === id ? { ...c, stage: newStage } : c));
  };

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
        lead_dev_notes: 'Candidature reçue via talents@qileo.com'
      }
    };

    setCandidates(prev => [newCand, ...prev]);
    setShowAddModal(false);
    setNewName('');
    setNewEmail('');
  };

  // Sober Corporate Role Titles
  const roleTitles: Record<JobRole, string> = {
    TECH_LEAD_ARCHITECT: 'Tech Lead & Architecte',
    DEVOPS_SRE: 'DevOps & Cloud SRE',
    DATA_ENGINEER: 'Data Engineer',
    PRODUCT_MANAGER: 'Lead Product Manager',
    DEVSECOPS: 'Ingénieur DevSecOps',
    MOBILE_ENGINEER: 'Lead Mobile Flutter',
  };

  const stageLabels: Record<Stage, string> = {
    APPLIED: 'Candidatures Reçues',
    SCREENING: 'Screening CV & Tech',
    TECH_TEST: 'Test Pratique (Code)',
    INTERVIEW: 'Entretien Tech & Culture',
    HIRED: 'Offre Validée (CDI)',
    REJECTED: 'Non Retenu',
  };

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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans">
      {/* Top Enterprise Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-indigo-700 flex items-center justify-center text-white shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">TalentPulse ATS</h1>
                  <span className="hidden sm:inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">
                    Recrutement Tech & Produit
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">Pipeline & Évaluation Technique Pondérée</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="hidden sm:flex px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white text-sm font-semibold rounded-lg shadow-sm items-center gap-2 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Candidat</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex items-center gap-1 -mb-px overflow-x-auto pt-1 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('kanban')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'kanban'
                  ? 'border-indigo-700 text-indigo-800 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Pipeline de Recrutement</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-slate-200 text-slate-800 font-bold">
                {candidates.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'scorecard'
                  ? 'border-indigo-700 text-indigo-800 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>Scorecard Technique Pondérée</span>
            </button>
            <button
              onClick={() => setActiveTab('directory')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'directory'
                  ? 'border-indigo-700 text-indigo-800 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Vivier des Candidats</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 text-sm font-semibold transition whitespace-nowrap ${
                activeTab === 'analytics'
                  ? 'border-indigo-700 text-indigo-800 bg-indigo-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Métriques & Funnel</span>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden py-3 border-t border-slate-200 space-y-1">
              {[
                { id: 'kanban', label: `Pipeline (${candidates.length})`, icon: Briefcase },
                { id: 'scorecard', label: 'Scorecard Technique', icon: Sliders },
                { id: 'directory', label: 'Vivier des Candidats', icon: Users },
                { id: 'analytics', label: 'Métriques & Funnel', icon: TrendingUp }
              ].map(item => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-left ${
                      activeTab === item.id ? 'bg-indigo-50 text-indigo-800' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Role Filter & Search */}
        {(activeTab === 'kanban' || activeTab === 'directory') && (
          <div className="p-4 rounded-xl bg-white border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mr-2 shrink-0">Poste :</span>
              <button
                onClick={() => setRoleFilter('ALL')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap ${
                  roleFilter === 'ALL'
                    ? 'bg-indigo-700 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tous ({candidates.length})
              </button>
              {(['TECH_LEAD_ARCHITECT', 'DEVOPS_SRE', 'DATA_ENGINEER', 'PRODUCT_MANAGER', 'DEVSECOPS', 'MOBILE_ENGINEER'] as JobRole[]).map(r => {
                const count = candidates.filter(c => c.role === r).length;
                return (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition whitespace-nowrap ${
                      roleFilter === r
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {roleTitles[r]} ({count})
                  </button>
                );
              })}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nom, compétence..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700 font-medium"
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

              return (
                <div key={stageKey} className="rounded-xl bg-white border border-slate-200 flex flex-col min-h-[500px] shadow-sm">
                  {/* Column Header */}
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{stageLabels[stageKey]}</span>
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">
                      {stageCandidates.length}
                    </span>
                  </div>

                  {/* Cards List */}
                  <div className="p-3 flex-1 overflow-y-auto space-y-3">
                    {stageCandidates.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-400 font-medium border border-dashed border-slate-200 rounded-lg">
                        Aucun candidat
                      </div>
                    ) : (
                      stageCandidates.map(cand => {
                        const score = calculateScore(cand.evaluation);

                        return (
                          <div 
                            key={cand.id}
                            className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-indigo-600 shadow-xs transition space-y-2"
                          >
                            <div className="flex items-start justify-between">
                              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white text-slate-700 border border-slate-200">
                                {roleTitles[cand.role]}
                              </span>
                              <span className="font-mono text-xs font-bold text-slate-900 px-1.5 py-0.5 rounded bg-white border border-slate-200">
                                {score}/100
                              </span>
                            </div>

                            <div>
                              <h4 className="font-bold text-slate-900 text-sm">{cand.name}</h4>
                              <p className="text-xs text-slate-500">{cand.experience_years} ans d'expérience</p>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {cand.tags.slice(0, 3).map((tag, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-white text-slate-600 border border-slate-200">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                              <button
                                onClick={() => setSelectedCandidate(cand)}
                                className="text-xs font-bold text-indigo-700 hover:text-indigo-800 flex items-center gap-1"
                              >
                                Dossier <ChevronRight className="w-3.5 h-3.5" />
                              </button>

                              <div className="flex items-center gap-1">
                                {stageKey !== 'APPLIED' && (
                                  <button
                                    title="Reculer"
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
                                    className="p-1 rounded bg-white hover:bg-slate-100 text-slate-500 border border-slate-200"
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
                                    className="px-2 py-1 rounded bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center gap-1 transition"
                                  >
                                    <span>Avancer</span>
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
        {/* TAB 2: SCORECARD TECHNIQUE */}
        {/* ============================================================== */}
        {activeTab === 'scorecard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-700" />
                  Grille d'Évaluation Technique Pondérée
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Calcul automatisé de la note pondérée sur 100 selon les 4 critères
                </p>
              </div>

              {evalSavedBanner && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Évaluation technique enregistrée avec succès dans le profil !</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Candidat à Évaluer
                </label>
                <select
                  value={evalCandidateId}
                  onChange={(e) => handleSelectEvalCandidate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                >
                  {candidates.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {roleTitles[c.role]} ({c.experience_years} ans)
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 pt-1">
                {/* 1. Back */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">Back-end & Architecture APIs</span>
                      <span className="ml-2 font-semibold text-slate-500">(Coeff: 35%)</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono text-sm">{evalBack} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalBack}
                    onChange={(e) => setEvalBack(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                  />
                  <p className="text-[11px] text-slate-500">Laravel 11, Clean Architecture, Eloquent ORM, Transactions ACID</p>
                </div>

                {/* 2. Front */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">Front-end & Composants</span>
                      <span className="ml-2 font-semibold text-slate-500">(Coeff: 30%)</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono text-sm">{evalFront} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalFront}
                    onChange={(e) => setEvalFront(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                  />
                  <p className="text-[11px] text-slate-500">React 18, TypeScript strict, ergonomie, gestion d'état</p>
                </div>

                {/* 3. QA */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">QA, Tests & Qualité de Code</span>
                      <span className="ml-2 font-semibold text-slate-500">(Coeff: 20%)</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono text-sm">{evalQa} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalQa}
                    onChange={(e) => setEvalQa(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                  />
                  <p className="text-[11px] text-slate-500">Tests E2E Playwright, PHPUnit/Pest, Postman, CI/CD Docker</p>
                </div>

                {/* 4. Culture */}
                <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">Culture Fit & Communication</span>
                      <span className="ml-2 font-semibold text-slate-500">(Coeff: 15%)</span>
                    </div>
                    <span className="font-bold text-slate-900 font-mono text-sm">{evalCulture} / 100</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={evalCulture}
                    onChange={(e) => setEvalCulture(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-700"
                  />
                  <p className="text-[11px] text-slate-500">Esprit d'équipe, clarté pédagogique et rigueur</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Commentaires du Lead Évaluateur
                </label>
                <textarea
                  rows={3}
                  value={evalNotes}
                  onChange={(e) => setEvalNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                ></textarea>
              </div>

              <button
                type="button"
                onClick={handleSaveEvaluation}
                className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Enregistrer la Scorecard Technique</span>
              </button>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm text-center space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Note Globale Pondérée
                </span>
                
                <div className="py-2">
                  <span className="text-5xl font-black text-slate-900 font-mono">
                    {currentEvalTotal}
                  </span>
                  <span className="text-xl font-bold text-slate-400"> / 100</span>
                </div>

                <div className="inline-flex px-3 py-1 rounded-md text-xs font-bold border bg-slate-50 border-slate-200 text-slate-800">
                  {currentEvalTotal >= 90 ? 'Recommandation : Top 1% (Embauche Prioritaire)' : (currentEvalTotal >= 75 ? 'Recommandation : Profil Validé' : 'En Réserve')}
                </div>
              </div>

              <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2 text-xs text-slate-600">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                  <Code2 className="w-4 h-4 text-indigo-700" />
                  Formule de Notation
                </h4>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-slate-800">
                  Note = (0.35 × Back) + (0.30 × Front) + (0.20 × QA) + (0.15 × Culture)
                </div>
                <p className="leading-relaxed">
                  Cette pondération assure la stricte équité de sélection entre les candidats en priorisant la rigueur backend et la fluidité frontend.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: VIVIER DES CANDIDATS */}
        {/* ============================================================== */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Annuaire des Talents & Candidatures</h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-4">Candidat</th>
                      <th className="py-3 px-4">Poste</th>
                      <th className="py-3 px-4 text-center">Score Global</th>
                      <th className="py-3 px-4">Prétention</th>
                      <th className="py-3 px-4 text-center">Étape</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredCandidates.map(cand => (
                      <tr key={cand.id} className="hover:bg-slate-50 transition">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-slate-900">{cand.name}</div>
                          <div className="text-xs text-slate-500">{cand.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                            {roleTitles[cand.role]}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="font-mono text-sm font-bold text-slate-900">
                            {calculateScore(cand.evaluation)} / 100
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800">
                          {cand.salary_expectation_xof.toLocaleString()} XOF
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                            {stageLabels[cand.stage]}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setSelectedCandidate(cand)}
                            className="px-3 py-1 bg-white hover:bg-slate-50 text-indigo-700 font-semibold rounded-md text-xs border border-slate-200 transition"
                          >
                            Fiche 360°
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: MÉTRIQUES RH */}
        {/* ============================================================== */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Délai Moyen d'Embauche</h3>
              <p className="text-3xl font-black text-slate-900 mt-2">14 Jours</p>
              <p className="text-xs text-slate-500 mt-1">Du screening initial à la validation</p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Réussite Test Code</h3>
              <p className="text-3xl font-black text-slate-900 mt-2">68.5%</p>
              <p className="text-xs text-slate-500 mt-1">Score supérieur à 75/100</p>
            </div>

            <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Compétences Phares</h3>
              <p className="text-base font-bold text-slate-900 mt-3">Laravel 11, React 18, TypeScript, Docker</p>
              <p className="text-xs text-slate-500 mt-0.5">Alignement 100% équipe tech</p>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Fiche Candidat 360 */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{selectedCandidate.name}</h3>
                <span className="text-xs font-semibold text-slate-500">{roleTitles[selectedCandidate.role]}</span>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Contact</span>
                <span className="font-semibold text-slate-900 block mt-0.5">{selectedCandidate.email}</span>
                <span className="text-slate-500 font-mono">{selectedCandidate.phone}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 block">Prétention</span>
                <span className="font-bold text-slate-900 block mt-0.5">
                  {selectedCandidate.salary_expectation_xof.toLocaleString()} XOF
                </span>
                <span className="text-slate-500">{selectedCandidate.availability}</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Score Technique Global</span>
                <span className="font-black text-slate-900 font-mono">
                  {calculateScore(selectedCandidate.evaluation)} / 100
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 text-center text-xs pt-1">
                <div className="p-1.5 rounded bg-white border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Back</span>
                  <span className="font-bold text-slate-900">{selectedCandidate.evaluation.backend}</span>
                </div>
                <div className="p-1.5 rounded bg-white border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Front</span>
                  <span className="font-bold text-slate-900">{selectedCandidate.evaluation.frontend}</span>
                </div>
                <div className="p-1.5 rounded bg-white border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">QA</span>
                  <span className="font-bold text-slate-900">{selectedCandidate.evaluation.qa_architecture}</span>
                </div>
                <div className="p-1.5 rounded bg-white border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Culture</span>
                  <span className="font-bold text-slate-900">{selectedCandidate.evaluation.culture_fit}</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 pt-1 italic">
                "{selectedCandidate.evaluation.lead_dev_notes}"
              </p>
            </div>

            <div className="flex items-center gap-2">
              {selectedCandidate.github_url && (
                <a
                  href={selectedCandidate.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {selectedCandidate.portfolio_url && (
                <a
                  href={selectedCandidate.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-md text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Portfolio</span>
                </a>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-md text-xs transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Candidate */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Nouveau Candidat</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Nom et Prénom
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Jean Houndé"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Poste Candidaté
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as JobRole)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                >
                  <option value="TECH_LEAD_ARCHITECT">Tech Lead & Architecte Logiciel</option>
                  <option value="DEVOPS_SRE">Ingénieur DevOps & Cloud SRE</option>
                  <option value="DATA_ENGINEER">Data Engineer & Analytics</option>
                  <option value="PRODUCT_MANAGER">Lead Product Manager SaaS</option>
                  <option value="DEVSECOPS">Ingénieur DevSecOps & Sécurité</option>
                  <option value="MOBILE_ENGINEER">Lead Développeur Mobile Flutter</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Compétences Clés
                </label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Prétention Salariale (XOF)
                </label>
                <input
                  type="number"
                  value={newSalary}
                  onChange={(e) => setNewSalary(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-700"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
              >
                Annuler
              </button>
              <button
                onClick={handleAddCandidate}
                className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg text-xs transition"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
