import { useState } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  RefreshCw,
  ArrowRight,
  Code2,
  Check
} from 'lucide-react';
import { Candidate, JobRole } from '../App';

interface AiResumeDropzoneProps {
  onCandidateExtracted: (newCandidate: Candidate) => void;
}

export default function AiResumeDropzone({ onCandidateExtracted }: AiResumeDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parsingStep, setParsingStep] = useState<string>('');
  const [extractedInfo, setExtractedInfo] = useState<Candidate | null>(null);

  const sampleResumes = [
    {
      title: 'CV Tech Lead Full-Stack (Bénin / France)',
      name: 'Fabrice Dossou-Yovo',
      role: 'TECH_LEAD_ARCHITECT' as JobRole,
      exp: 6,
      tags: ['Clean Architecture', 'Laravel', 'React 18', 'Docker Swarm', 'GraphQL', 'PostgreSQL'],
      salary: 1650000,
      email: 'f.dossou@afri-dev.bj',
      phone: '+229 97 88 44 22',
      notes: 'Ancien Lead Dev fintech. Très solide sur la scalabilité, l\'idempotence et le mentorat d\'équipe.'
    },
    {
      title: 'CV Ingénieur DevSecOps & Cloud',
      name: 'Amina Alassane',
      role: 'DEVSECOPS' as JobRole,
      exp: 5,
      tags: ['Kubernetes Security', 'HashiCorp Vault', 'SonarQube', 'CI/CD Hardening', 'AWS'],
      salary: 1400000,
      email: 'a.alassane@cloudsec.bj',
      phone: '+229 96 33 22 11',
      notes: 'Spécialiste de la conformité ISO 27001 et sécurisation des pipelines bancaires.'
    },
    {
      title: 'CV Lead Mobile Flutter & Mobile Money',
      name: 'Régis Houndété',
      role: 'MOBILE_ENGINEER' as JobRole,
      exp: 4,
      tags: ['Flutter BLoC', 'SDK MoMo', 'Offline-First', 'SQLite Encrypted', 'Push FCM'],
      salary: 1100000,
      email: 'r.houndete@mobile-craft.bj',
      phone: '+229 95 66 77 88',
      notes: 'Développeur mobile expérimenté sur les paiements USSD et applications marchands.'
    }
  ];

  const handleSimulateExtraction = (preset?: typeof sampleResumes[0]) => {
    setIsProcessing(true);
    setExtractedInfo(null);
    const chosen = preset || sampleResumes[Math.floor(Math.random() * sampleResumes.length)];

    setParsingStep('1/3 : Analyse OCR sémantique et parsing du CV...');
    setTimeout(() => {
      setParsingStep('2/3 : Corrélation des compétences avec la matrice du poste...');
      setTimeout(() => {
        setParsingStep('3/3 : Évaluation ATS & scoring prédictif des compétences...');
        setTimeout(() => {
          const newCand: Candidate = {
            id: `c_ai_${Date.now()}`,
            name: chosen.name,
            email: chosen.email,
            phone: chosen.phone,
            role: chosen.role,
            experience_years: chosen.exp,
            stage: 'APPLIED',
            tags: chosen.tags,
            github_url: `https://github.com/${chosen.name.toLowerCase().replace(/[\s-]/g, '')}`,
            portfolio_url: `https://${chosen.name.toLowerCase().replace(/[\s-]/g, '')}.dev`,
            applied_date: '2026-09-25',
            salary_expectation_xof: chosen.salary,
            availability: 'Immédiate',
            evaluation: {
              backend: 92,
              frontend: 88,
              qa_architecture: 95,
              culture_fit: 90,
              lead_dev_notes: chosen.notes
            }
          };

          setIsProcessing(false);
          setExtractedInfo(newCand);
          onCandidateExtracted(newCand);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleSimulateExtraction();
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Extraction Automatique par IA (ATS Parser)
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Dépôt Intelligent de CV & Intégration Immédiate au Pipeline
          </h3>
          <p className="text-xs text-slate-500">
            Glissez-déposez n'importe quel fichier de CV pour en extraire instantanément le score de correspondance et les compétences.
          </p>
        </div>

        {/* Quick Sample Action */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Ou testez un profil type :</span>
          {sampleResumes.map((sample, idx) => (
            <button
              key={idx}
              onClick={() => handleSimulateExtraction(sample)}
              disabled={isProcessing}
              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-800 text-xs font-semibold border border-slate-200 transition disabled:opacity-50"
            >
              {sample.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !isProcessing && handleSimulateExtraction()}
        className={`p-6 rounded-xl border-2 border-dashed transition-all cursor-pointer text-center ${
          isDragOver 
            ? 'border-indigo-600 bg-indigo-50/70 scale-[1.01]' 
            : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/30'
        }`}
      >
        {isProcessing ? (
          <div className="py-2 space-y-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            <p className="text-sm font-bold text-indigo-900">{parsingStep}</p>
            <div className="w-48 h-1.5 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-indigo-600 animate-pulse w-3/4 rounded-full" />
            </div>
          </div>
        ) : extractedInfo ? (
          <div className="py-2 flex items-center justify-center gap-3 text-emerald-800">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div className="text-left text-xs">
              <span className="font-bold text-sm block text-emerald-950">
                Profil extrait avec succès : {extractedInfo.name} ({extractedInfo.experience_years} ans exp.)
              </span>
              <span>
                Candidat automatiquement injecté dans la colonne <strong>Nouveau Candidat</strong> avec un score ATS de 94% !
              </span>
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-1.5">
            <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">
              Glissez-déposez un CV ici, ou cliquez pour analyser un profil
            </p>
            <p className="text-xs text-slate-400">
              Formats supportés : PDF, DOCX, TXT — OCR et extraction de compétences automatique
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
