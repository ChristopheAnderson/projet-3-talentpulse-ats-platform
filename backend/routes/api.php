<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\CandidateController;

/*
|--------------------------------------------------------------------------
| TalentPulse ATS API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Pipeline des candidatures
    Route::get('/candidates', [CandidateController::class, 'index']);
    Route::post('/candidates', [CandidateController::class, 'store']);
    Route::patch('/candidates/{id}/stage', [CandidateController::class, 'updateStage']);
    
    // Grille de notation technique collaborative
    Route::post('/candidates/{id}/evaluations', [CandidateController::class, 'submitEvaluation']);
    
    // Statistiques de recrutement (Taux de conversion, délai d'embauche)
    Route::get('/recruitment/metrics', [CandidateController::class, 'metrics']);
});
