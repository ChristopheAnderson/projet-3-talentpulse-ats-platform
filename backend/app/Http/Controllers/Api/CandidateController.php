<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CandidateController extends Controller
{
    /**
     * Liste des candidatures actives groupées par étapes.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Candidate::query()->latest();

        if ($request->filled('role')) {
            $query->where('target_role', $request->role);
        }

        $candidates = $query->get();

        return response()->json([
            'status' => 'success',
            'data' => $candidates
        ]);
    }

    /**
     * Enregistrement d'une nouvelle candidature technique.
     */
    public function store(\App\Http\Requests\StoreCandidateRequest $request): JsonResponse
    {
        $candidate = Candidate::create(array_merge($request->validated(), [
            'stage' => 'APPLIED',
            'overall_score' => 0.00,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Candidature enregistrée avec succès',
            'data' => $candidate
        ], 201);
    }

    /**
     * Fiche détaillée d'un candidat avec ses évaluations.
     */
    public function show(int $id): JsonResponse
    {
        $candidate = Candidate::with(['jobOffer', 'evaluations'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data' => $candidate
        ]);
    }

    /**
     * Déplacement d'un candidat dans le pipeline Kanban.
     */
    public function updateStage(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'stage' => 'required|in:APPLIED,TECH_SCREENING,CODE_TEST,FINAL_INTERVIEW,OFFER,HIRED,REJECTED'
        ]);

        $candidate = Candidate::findOrFail($id);
        $candidate->stage = $request->stage;
        $candidate->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Étape mise à jour',
            'data' => $candidate
        ]);
    }

    /**
     * Enregistrement d'une évaluation technique avec calcul pondéré de la note.
     */
    public function submitEvaluation(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'backend_score' => 'required|numeric|min:0|max:100',
            'frontend_score' => 'required|numeric|min:0|max:100',
            'clean_code_score' => 'required|numeric|min:0|max:100',
            'culture_fit_score' => 'required|numeric|min:0|max:100',
            'feedback' => 'nullable|string',
        ]);

        $candidate = Candidate::findOrFail($id);

        // Calcul de la note pondérée : Back (35%) + Front (30%) + Clean Code/QA (20%) + Culture (15%)
        $weightedScore = ($validated['backend_score'] * 0.35) +
                         ($validated['frontend_score'] * 0.30) +
                         ($validated['clean_code_score'] * 0.20) +
                         ($validated['culture_fit_score'] * 0.15);

        $candidate->overall_score = round($weightedScore, 1);
        $candidate->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Évaluation enregistrée avec succès',
            'overall_score' => $candidate->overall_score
        ]);
    }

    /**
     * Métriques du tunnel de recrutement pour l'équipe Tech & Produit.
     */
    public function metrics(): JsonResponse
    {
        return response()->json([
            'total_applicants' => 148,
            'active_in_pipeline' => 24,
            'avg_time_to_hire_days' => 12,
            'pass_rate_code_test' => 38.5,
            'open_positions' => [
                'Fullstack Developer (Laravel/React)' => 2,
                'Growth Engineer' => 1,
                'QA Test Automation Engineer' => 1,
                'Product Designer UI/UX' => 1,
            ]
        ]);
    }
}
