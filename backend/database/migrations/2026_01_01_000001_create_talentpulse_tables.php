<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Table Offres d'Emploi
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->string('department', 100)->default('Équipe Tech & Produit');
            $table->string('location', 100)->default('Cotonou, Bénin');
            $table->string('contract_type', 30)->default('CDI Local');
            $table->integer('open_slots')->default(1);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 2. Table Candidats
        Schema::create('candidates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_offer_id')->nullable()->constrained('job_offers')->nullOnDelete();
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            $table->string('email', 150)->unique();
            $table->string('phone', 30);
            $table->enum('target_role', ['FULLSTACK_DEV', 'GROWTH_ENGINEER', 'QA_ENGINEER', 'PRODUCT_DESIGNER']);
            $table->enum('stage', ['APPLIED', 'TECH_SCREENING', 'CODE_TEST', 'FINAL_INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'])->default('APPLIED');
            $table->integer('years_experience');
            $table->string('github_url')->nullable();
            $table->string('portfolio_url')->nullable();
            $table->string('resume_path')->nullable();
            $table->decimal('overall_score', 5, 2)->default(0.00);
            $table->jsonb('skills')->nullable();
            $table->timestamps();

            $table->index('stage');
            $table->index('target_role');
            $table->index('overall_score');
        });

        // 3. Table Évaluations Collaboratives
        Schema::create('evaluations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('candidate_id')->constrained('candidates')->onDelete('cascade');
            $table->string('evaluator_name', 100);
            $table->decimal('backend_score', 5, 2);
            $table->decimal('frontend_score', 5, 2);
            $table->decimal('clean_code_score', 5, 2);
            $table->decimal('culture_fit_score', 5, 2);
            $table->decimal('weighted_score', 5, 2);
            $table->text('feedback')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('candidate_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evaluations');
        Schema::dropIfExists('candidates');
        Schema::dropIfExists('job_offers');
    }
};
