<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Candidate;
use App\Models\JobOffer;

class CandidateEvaluationTest extends TestCase
{
    /**
     * Teste la soumission d'une évaluation technique et le calcul pondéré du score.
     */
    public function test_can_submit_evaluation_and_calculate_weighted_score(): void
    {
        $offer = JobOffer::firstOrCreate(
            ['title' => 'Développeur Full Stack (Laravel & React)'],
            ['department' => 'Tech', 'location' => 'Cotonou']
        );

        $candidate = Candidate::create([
            'job_offer_id' => $offer->id,
            'first_name' => 'Jean',
            'last_name' => 'Akakpo',
            'email' => 'jean.akakpo@example.com',
            'phone' => '+229 97 44 33 22',
            'target_role' => 'FULLSTACK_DEV',
            'stage' => 'CODE_TEST',
            'years_experience' => 4,
        ]);

        $evalPayload = [
            'evaluator_name' => 'Tech Lead',
            'backend_score' => 90,     // 90 * 0.35 = 31.5
            'frontend_score' => 80,    // 80 * 0.30 = 24.0
            'clean_code_score' => 100, // 100 * 0.20 = 20.0
            'culture_fit_score' => 90, // 90 * 0.15 = 13.5
            'feedback' => 'Très bon profil technique.',
        ];

        // Total attendu = 31.5 + 24.0 + 20.0 + 13.5 = 89.0
        $response = $this->postJson("/api/v1/candidates/{$candidate->id}/evaluations", $evalPayload);

        $response->assertStatus(200)
                 ->assertJson([
                     'status' => 'success',
                     'overall_score' => 89.0,
                 ]);

        $this->assertEquals(89.0, $candidate->fresh()->overall_score);
    }

    /**
     * Teste le changement d'étape d'un candidat dans le pipeline Kanban.
     */
    public function test_can_update_candidate_recruitment_stage(): void
    {
        $candidate = Candidate::firstOrCreate(
            ['email' => 'test.pipeline@example.com'],
            [
                'first_name' => 'Sara',
                'last_name' => 'Koffi',
                'phone' => '+229 95 12 12 12',
                'target_role' => 'GROWTH_ENGINEER',
                'stage' => 'APPLIED',
                'years_experience' => 3,
            ]
        );

        $response = $this->patchJson("/api/v1/candidates/{$candidate->id}/stage", [
            'stage' => 'TECH_SCREENING',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('TECH_SCREENING', $candidate->fresh()->stage);
    }
}
