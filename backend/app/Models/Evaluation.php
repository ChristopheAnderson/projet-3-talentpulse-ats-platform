<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evaluation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'candidate_id',
        'evaluator_name',
        'backend_score',
        'frontend_score',
        'clean_code_score',
        'culture_fit_score',
        'weighted_score',
        'feedback',
        'created_at',
    ];

    protected $casts = [
        'backend_score' => 'float',
        'frontend_score' => 'float',
        'clean_code_score' => 'float',
        'culture_fit_score' => 'float',
        'weighted_score' => 'float',
        'created_at' => 'datetime',
    ];

    public function candidate()
    {
        return $this->belongsTo(Candidate::class);
    }
}
