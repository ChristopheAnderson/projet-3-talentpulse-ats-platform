import { useState } from 'react';
import { 
  FileCheck, 
  X, 
  Copy, 
  Check, 
  DollarSign, 
  Briefcase, 
  Building2, 
  Sparkles,
  Download,
  Calendar
} from 'lucide-react';
import { Candidate } from '../App';

interface OfferLetterModalProps {
  candidate: Candidate;
  roleTitle: string;
  onClose: () => void;
  onAcceptOffer: (candidateId: string) => void;
}

export default function OfferLetterModal({ candidate, roleTitle, onClose, onAcceptOffer }: OfferLetterModalProps) {
  const [copied, setCopied] = useState(false);

  const monthlySalary = candidate.salary_expectation_xof;
  const annualSalary = monthlySalary * 12;
  const annualBonus = Math.round(annualSalary * 0.10);

  const offerText = `OFFRE D'EMBAUCHE OFFICIELLE — ÉQUIPE TECH & PRODUIT
Référence : OFFRE-2026-${candidate.id.toUpperCase()}
Date : 26 Septembre 2026

À l'attention de : ${candidate.name}
Poste : ${roleTitle}
Département : Direction Technique & Systèmes d'Information

Cher/Chère ${candidate.name},

Suite à vos entretiens et à l'excellence démontrée lors des évaluations techniques, nous avons le plaisir de vous proposer le poste de ${roleTitle} au sein de notre équipe.

CONDITIONS DU PACKAGE SALARIAL :
- Salaire de Base Mensuel : ${monthlySalary.toLocaleString()} XOF Net d'impôt
- Bonus Annuel sur Objectifs (10%) : ${annualBonus.toLocaleString()} XOF
- Couverture Médicale : Assurance Santé Internationale à 80%
- Modalités de Travail : Politique Hybride Flexible (2 jours remote / semaine)
- Équipement Professionnel : MacBook Pro M3 Max + Écran 4K + Indemnité Fibre Optique
- Date de Prise de Fonction Souhaitée : ${candidate.availability === 'Immédiate' ? 'Sous 7 jours' : 'À convenir selon préavis'}

Cette offre est valable pour une durée de 14 jours à compter de sa date d'émission.

Fait à Cotonou,
La Direction des Ressources Humaines & Le CTO`;

  const handleCopy = () => {
    navigator.clipboard.writeText(offerText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl animate-scaleUp max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900 font-display">
                Lettre d'Offre & Package Salarial
              </h3>
              <p className="text-xs text-slate-500">
                Générée pour : <strong>{candidate.name}</strong> ({roleTitle})
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

        {/* Financial Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
            <span className="text-xs text-emerald-800 font-semibold block">Salaire Mensuel</span>
            <p className="text-lg font-black text-emerald-950 font-display mt-0.5">
              {monthlySalary.toLocaleString()} XOF
            </p>
            <span className="text-[10px] text-emerald-700">Net négocié</span>
          </div>

          <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
            <span className="text-xs text-indigo-800 font-semibold block">Bonus de Performance</span>
            <p className="text-lg font-black text-indigo-950 font-display mt-0.5">
              +{annualBonus.toLocaleString()} XOF
            </p>
            <span className="text-[10px] text-indigo-700">10% sur KPIs annuels</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs text-slate-600 font-semibold block">Régime de Travail</span>
            <p className="text-lg font-black text-slate-900 font-display mt-0.5">Hybride</p>
            <span className="text-[10px] text-slate-500">2 j / sem. remote</span>
          </div>
        </div>

        {/* Formatted Letter Body */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto">
          {offerText}
        </div>

        {/* Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Offre Copiée !' : 'Copier le Texte de l\'Offre'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onAcceptOffer(candidate.id);
                onClose();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Valider Offre & Recruter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
