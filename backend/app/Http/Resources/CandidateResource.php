<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CandidateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'job_offer' => $this->jobOffer ? [
                'id' => $this->jobOffer->id,
                'title' => $this->jobOffer->title,
            ] : null,
            'name' => "{$this->first_name} {$this->last_name}",
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'target_role' => $this->target_role,
            'stage' => $this->stage,
            'years_experience' => (int) $this->years_experience,
            'github_url' => $this->github_url,
            'portfolio_url' => $this->portfolio_url,
            'overall_score' => (float) $this->overall_score,
            'skills' => $this->skills ?? [],
            'evaluations_count' => $this->evaluations()->count(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
