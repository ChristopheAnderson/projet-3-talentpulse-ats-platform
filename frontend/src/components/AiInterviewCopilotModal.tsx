import { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight,
  Code2,
  Cpu,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { Candidate } from '../App';

interface AiInterviewCopilotModalProps {
  candidate: Candidate;
  onClose: () => void;
}

export default function AiInterviewCopilotModal({ candidate, onClose }: AiInterviewCopilotModalProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Generate role-specific high-level questions
  const getQuestions = () => {
    switch (candidate.role) {
      case 'TECH_LEAD_ARCHITECT':
        return [
          {
            title: 'Scalabilité & Idempotence des Paiements',
            question: 'Dans une architecture de passerelle fintech gérant des pics de charge de 2 000 requêtes/seconde sur Mobile Money, comment concevez-vous la couche d\'idempotence avec Redis et PostgreSQL pour garantir qu\'aucun débit double ne soit jamais effectué en cas de timeout réseau ?',
            criteria: 'Rechercher : Verrous distribués (Redlock), clés d\'idempotence uniques horodatées, transactions isolées SERIALIZABLE.',
            difficulty: 'ARCHITECTE SENIOR'
          },
          {
            title: 'Découplage Microservices & Observabilité',
            question: 'Comment orchestreriez-vous la transition d\'un monolithe Laravel vers une architecture de microservices asynchrones avec RabbitMQ ou Kafka ? Quels patterns de résilience mettriez-vous en place (Circuit Breaker, Dead Letter Queue) ?',
            criteria: 'Rechercher : Pattern Saga, observabilité OpenTelemetry, gestion des transactions distribuées sans 2PC.',
            difficulty: 'EXPERT'
          },
          {
            title: 'Gouvernance du Code & Leadership Technique',
            question: 'Comment structurez-vous les revues de code et les standards de qualité (CI/CD, SonarQube, PHPStan niveau 8) sans freiner la vélocité de livraison de l\'équipe produit ?',
            criteria: 'Rechercher : Automatisation des linters en pre-commit, pyramide des tests (80% unitaires), culture du feedback bienveillant.',
            difficulty: 'LEADERSHIP'
          }
        ];
      case 'DEVOPS_SRE':
        return [
          {
            title: 'Cluster Kubernetes & Haute Disponibilité',
            question: 'En cas de panne soudaine d\'un nœud de production sur un cluster Kubernetes multi-zones, comment garantissez-vous que le trafic des pods sensibles soit réacheminé sans coupure ni saturation des nœuds restants ?',
            criteria: 'Rechercher : PodDisruptionBudgets, affinités de nœuds (anti-affinity), Horizontal Pod Autoscaler (HPA).',
            difficulty: 'SRE SENIOR'
          },
          {
            title: 'Infrastructure-as-Code & Drift Detection',
            question: 'Comment organisez-vous vos modules Terraform pour gérer plusieurs environnements (Dev, Staging, Prod) et comment prévenez-vous les modifications manuelles hors pipeline GitOps ?',
            criteria: 'Rechercher : Terraform State locking (DynamoDB/S3), intégration Atlantis ou Terraform Cloud, politiques de drift daily.',
            difficulty: 'DEVOPS'
          }
        ];
      default:
        return [
          {
            title: 'Conception d\'API & Sécurité Applicative',
            question: 'Quelles mesures concrètes appliquez-vous pour protéger vos endpoints sensibles contre les attaques par injection, le rejeu de requêtes et les dépassements de quota (Rate Limiting) ?',
            criteria: 'Rechercher : Signatures HMAC, validation stricte DTO, algorithme Token Bucket pour le throttling.',
            difficulty: 'TECH SENIOR'
          },
          {
            title: 'Gestion de la Dette Technique & Refactoring',
            question: 'Donnez un exemple concret d\'un refactoring complexe que vous avez mené à terme sous pression de production sans causer de régression.',
            criteria: 'Rechercher : Tests de non-régression préalables, déploiement canary/blue-green, communication proactive.',
            difficulty: 'EXPÉRIMENTÉ'
          }
        ];
    }
  };

  const questions = getQuestions();

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                AI Interview Copilot — Questions Ciblées
              </h3>
              <p className="text-xs text-slate-500">
                Générées pour : <strong>{candidate.name}</strong> ({candidate.role})
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <span>
            Ces questions ont été calibrées sur le niveau d'expérience ({candidate.experience_years} ans) et la stack technique du candidat afin de tester sa vision d'architecture et ses réflexes en situation réelle.
          </span>
        </div>

        {/* Questions list */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                    {idx + 1}
                  </span>
                  {q.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-slate-700 border">
                    {q.difficulty}
                  </span>
                  <button
                    onClick={() => handleCopy(q.question, idx)}
                    className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white transition"
                    title="Copier la question"
                  >
                    {copiedIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <p className="text-xs font-medium text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                "{q.question}"
              </p>

              <p className="text-[11px] text-slate-500 italic">
                <strong className="text-slate-700 font-semibold not-italic">Grille d'évaluation attendue :</strong> {q.criteria}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
          >
            Fermer le Copilote
          </button>
        </div>
      </div>
    </div>
  );
}
