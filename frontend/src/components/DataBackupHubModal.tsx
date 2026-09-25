import { useState, useRef } from 'react';
import { 
  Database, 
  FileSpreadsheet, 
  FileCode2, 
  RotateCcw, 
  Download, 
  Upload, 
  X, 
  CheckCircle2, 
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Candidate } from '../App';

interface DataBackupHubModalProps {
  candidates: Candidate[];
  initialCandidates: Candidate[];
  onUpdateCandidates: (updated: Candidate[]) => void;
  onClose: () => void;
}

export default function DataBackupHubModal({
  candidates,
  initialCandidates,
  onUpdateCandidates,
  onClose
}: DataBackupHubModalProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const excelInputRef = useRef<HTMLInputElement | null>(null);
  const jsonInputRef = useRef<HTMLInputElement | null>(null);

  const notify = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  // 1. EXCEL EXPORT (.xlsx)
  const handleExportExcel = () => {
    try {
      const formatted = candidates.map(c => ({
        'ID': c.id,
        'Nom et Prénom': c.name,
        'Email': c.email,
        'Téléphone': c.phone,
        'Poste / Rôle': c.role,
        'Années Expérience': c.experience_years,
        'Étape Recrutement': c.stage,
        'Compétences Clés': c.tags.join(', '),
        'Prétention Salariale (XOF)': c.salary_expectation_xof,
        'Disponibilité': c.availability,
        'Score Backend / Archi': c.evaluation.backend,
        'Score Frontend': c.evaluation.frontend,
        'Score QA / Archi': c.evaluation.qa_architecture,
        'Score Culture Fit': c.evaluation.culture_fit,
        'Appréciation Lead Dev': c.evaluation.lead_dev_notes,
        'Date Candidature': c.applied_date,
        'Lien GitHub': c.github_url || 'N/A',
        'Lien Portfolio': c.portfolio_url || 'N/A'
      }));

      const worksheet = XLSX.utils.json_to_sheet(formatted);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Vivier Candidats ATS');
      XLSX.writeFile(workbook, `TalentPulse_Vivier_Candidats_${new Date().toISOString().slice(0, 10)}.xlsx`);
      notify(`Export Excel réussi : ${candidates.length} profils candidats exportés en .xlsx !`);
    } catch (err) {
      console.error(err);
      notify('Erreur lors de la génération du fichier Excel.');
    }
  };

  // 2. EXCEL IMPORT (.xlsx)
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(sheet);

        if (rawJson.length === 0) {
          notify('Le fichier Excel importé est vide.');
          return;
        }

        const mapped: Candidate[] = rawJson.map((row, idx) => ({
          id: String(row['ID'] || `c_imp_${Date.now()}_${idx}`),
          name: String(row['Nom et Prénom'] || row['name'] || `Candidat Importé ${idx + 1}`),
          email: String(row['Email'] || row['email'] || `candidat_${idx}@talent.bj`),
          phone: String(row['Téléphone'] || row['phone'] || '+229 97 00 00 00'),
          role: (row['Poste / Rôle'] || row['role'] || 'TECH_LEAD_ARCHITECT') as any,
          experience_years: Number(row['Années Expérience'] || row['experience_years'] || 4),
          stage: (row['Étape Recrutement'] || row['stage'] || 'APPLIED') as any,
          tags: typeof row['Compétences Clés'] === 'string' 
            ? row['Compétences Clés'].split(',').map((s: string) => s.trim()) 
            : ['Architecture', 'Full-Stack'],
          salary_expectation_xof: Number(row['Prétention Salariale (XOF)'] || row['salary_expectation_xof'] || 1200000),
          availability: String(row['Disponibilité'] || row['availability'] || 'Immédiate'),
          applied_date: String(row['Date Candidature'] || row['applied_date'] || '2026-09-25'),
          github_url: row['Lien GitHub'] !== 'N/A' ? row['Lien GitHub'] : undefined,
          portfolio_url: row['Lien Portfolio'] !== 'N/A' ? row['Lien Portfolio'] : undefined,
          evaluation: {
            backend: Number(row['Score Backend / Archi'] || 85),
            frontend: Number(row['Score Frontend'] || 80),
            qa_architecture: Number(row['Score QA / Archi'] || 88),
            culture_fit: Number(row['Score Culture Fit'] || 85),
            lead_dev_notes: String(row['Appréciation Lead Dev'] || 'Profil synchronisé via tableur Excel')
          }
        }));

        onUpdateCandidates(mapped);
        notify(`Base vivier synchronisée : ${mapped.length} candidats importés depuis Excel avec succès !`);
      } catch (err) {
        console.error(err);
        notify('Format de fichier Excel non reconnu ou invalide.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  // 3. JSON EXPORT
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(candidates, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `talentpulse_candidates_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    notify(`Sauvegarde JSON téléchargée (${candidates.length} candidats).`);
  };

  // 4. JSON IMPORT
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onUpdateCandidates(parsed);
          notify(`Vivier restauré depuis le fichier JSON : ${parsed.length} candidats chargés.`);
        } else {
          notify('Structure JSON invalide (un tableau de candidats est attendu).');
        }
      } catch (err) {
        notify('Fichier JSON corrompu ou illisible.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // 5. RESTORE INITIAL DATA
  const handleResetToInitial = () => {
    onUpdateCandidates([...initialCandidates]);
    notify(`Données d'origine restaurées : ${initialCandidates.length} candidats de référence dans le pipeline.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xl animate-scaleUp">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                Gestionnaire de Données : Excel & JSON
              </h3>
              <p className="text-xs text-slate-500">
                Synchronisation du vivier, import/export et sauvegarde réversible
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

        {/* Feedback message */}
        {feedbackMessage && (
          <div className="p-3.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Current State Info */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 block">Candidats dans le Vivier :</span>
            <span className="text-base font-extrabold text-slate-900 font-display">
              {candidates.length} Profils Actifs
            </span>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
            État : Dynamique & Connecté
          </span>
        </div>

        {/* Option 1: EXCEL (.xlsx) */}
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
              Option 1 : Base Tableur Excel (.xlsx)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
              Pratique & Universel
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Consultez ou modifiez tous les candidats sous Excel (postes, salaires, notes), puis réimportez le fichier pour synchroniser le Kanban et les Scorecards.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter en Excel (.xlsx)</span>
            </button>

            <button
              onClick={() => excelInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-emerald-100 text-emerald-900 font-bold text-xs border border-emerald-300 flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-700" />
              <span>Importer Fichier Excel</span>
            </button>
            <input 
              ref={excelInputRef} 
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleImportExcel} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Option 2: JSON (.json) */}
        <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 flex items-center gap-2">
              <FileCode2 className="w-4 h-4 text-indigo-700" />
              Option 2 : Format Développeur JSON (.json)
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-200 text-indigo-900">
              API Standard
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Exportez l'état complet des évaluations et entretiens en format JSON structuré.
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleExportJson}
              className="px-3.5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Télécharger JSON</span>
            </button>

            <button
              onClick={() => jsonInputRef.current?.click()}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-indigo-100 text-indigo-900 font-bold text-xs border border-indigo-300 flex items-center justify-center gap-1.5 transition"
            >
              <Upload className="w-3.5 h-3.5 text-indigo-700" />
              <span>Restaurer JSON</span>
            </button>
            <input 
              ref={jsonInputRef} 
              type="file" 
              accept=".json" 
              onChange={handleImportJson} 
              className="hidden" 
            />
          </div>
        </div>

        {/* Option 3: Reset to Factory Start */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={handleResetToInitial}
            className="px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 font-bold text-xs flex items-center gap-1.5 transition border border-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Revenir aux Données de Départ</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
