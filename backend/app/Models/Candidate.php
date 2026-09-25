<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'target_role',       // 'FULLSTACK_DEV', 'GROWTH_ENGINEER', 'QA_ENGINEER', 'PRODUCT_DESIGNER'
        'stage',             // 'APPLIED', 'TECH_SCREENING', 'CODE_TEST', 'INTERVIEW', 'OFFER', 'HIRED', 'REJECTED'
        'years_experience',
        'github_url',
        'portfolio_url',
        'resume_path',
        'overall_score',     // Note pondérée sur 100
        'tags',
    ];

    protected $casts = [
        'years_experience' => 'integer',
        'overall_score' => 'float',
        'tags' => 'array',
    ];
}
