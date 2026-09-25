<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\JobOffer;
use App\Models\Candidate;
use App\Models\Evaluation;

class TalentPulseDatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $offer1 = JobOffer::firstOrCreate(
            ['title' => 'Développeur Full Stack (Laravel & React)'],
            [
                'department' => 'Équipe Tech & Produit',
                'location' => 'Cotonou, Bénin',
                'contract_type' => 'CDI Local',
                'open_slots' => 2,
                'is_active' => true,
            ]
        );

        $offer2 = JobOffer::firstOrCreate(
            ['title' => 'Growth Engineer'],
            [
                'department' => 'Équipe Tech & Produit',
                'location' => 'Cotonou, Bénin',
                'contract_type' => 'CDI Local',
                'open_slots' => 1,
                'is_active' => true,
            ]
        );

        $offer3 = JobOffer::firstOrCreate(
            ['title' => 'QA Engineer / Test Automation'],
            [
                'department' => 'Équipe Tech & Produit',
                'location' => 'Cotonou, Bénin',
                'contract_type' => 'CDI Local',
                'open_slots' => 1,
                'is_active' => true,
            ]
        );

        $offer4 = JobOffer::firstOrCreate(
            ['title' => 'Product Designer UI/UX'],
            [
                'department' => 'Équipe Tech & Produit',
                'location' => 'Cotonou, Bénin',
                'contract_type' => 'CDI Local',
                'open_slots' => 1,
                'is_active' => true,
            ]
        );

        $candidates = [
            [
                'job_offer_id' => $offer1->id,
                'first_name' => 'Christophe',
                'last_name' => 'WAVOEKE',
                'email' => 'wchristophe960@gmail.com',
                'phone' => '+229 97 00 00 00',
                'target_role' => 'FULLSTACK_DEV',
                'stage' => 'CODE_TEST',
                'years_experience' => 5,
                'github_url' => 'github.com/christophe-wavoeke',
                'overall_score' => 96.00,
                'skills' => ['Laravel 11', 'React 18', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker'],
            ],
            [
                'job_offer_id' => $offer3->id,
                'first_name' => 'Kafui',
                'last_name' => 'Lawson',
                'email' => 'klawson@example.com',
                'phone' => '+229 95 11 22 33',
                'target_role' => 'QA_ENGINEER',
                'stage' => 'FINAL_INTERVIEW',
                'years_experience' => 4,
                'github_url' => 'github.com/klawson-qa',
                'overall_score' => 92.00,
                'skills' => ['Playwright', 'Cypress', 'Postman', 'CI/CD GitHub Actions'],
            ],
            [
                'job_offer_id' => $offer2->id,
                'first_name' => 'Bernice',
                'last_name' => 'Dossou',
                'email' => 'bdossou@example.com',
                'phone' => '+229 96 33 44 55',
                'target_role' => 'GROWTH_ENGINEER',
                'stage' => 'TECH_SCREENING',
                'years_experience' => 3,
                'github_url' => 'github.com/bdossou-growth',
                'overall_score' => 88.00,
                'skills' => ['n8n', 'GA4 / GTM', 'SQL Analytique', 'Webhooks', 'APIs'],
            ],
            [
                'job_offer_id' => $offer4->id,
                'first_name' => 'Marc-Aurèle',
                'last_name' => 'Agbo',
                'email' => 'magbo@example.com',
                'phone' => '+229 40 55 66 77',
                'target_role' => 'PRODUCT_DESIGNER',
                'stage' => 'OFFER',
                'years_experience' => 4,
                'github_url' => 'figma.com/@marcau-design',
                'overall_score' => 95.00,
                'skills' => ['Figma', 'Design System', 'User Flows', 'Prototypage'],
            ]
        ];

        foreach ($candidates as $candData) {
            $c = Candidate::firstOrCreate(['email' => $candData['email']], $candData);

            Evaluation::firstOrCreate(
                ['candidate_id' => $c->id, 'evaluator_name' => 'Tech Lead'],
                [
                    'backend_score' => 95.00,
                    'frontend_score' => 96.00,
                    'clean_code_score' => 98.00,
                    'culture_fit_score' => 95.00,
                    'weighted_score' => $c->overall_score,
                    'feedback' => 'Excellente maîtrise des APIs Laravel et des composants React modulaires.',
                ]
            );
        }
    }
}
