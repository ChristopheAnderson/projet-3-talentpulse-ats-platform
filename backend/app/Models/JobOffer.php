<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobOffer extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'department',
        'location',
        'contract_type',
        'open_slots',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'open_slots' => 'integer',
    ];

    public function candidates()
    {
        return $this->hasMany(Candidate::class);
    }
}
