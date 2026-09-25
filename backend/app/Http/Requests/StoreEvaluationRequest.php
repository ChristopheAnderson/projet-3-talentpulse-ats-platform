<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEvaluationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'evaluator_name' => ['required', 'string', 'max:100'],
            'backend_score' => ['required', 'numeric', 'min:0', 'max:100'],
            'frontend_score' => ['required', 'numeric', 'min:0', 'max:100'],
            'clean_code_score' => ['required', 'numeric', 'min:0', 'max:100'],
            'culture_fit_score' => ['required', 'numeric', 'min:0', 'max:100'],
            'feedback' => ['nullable', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'evaluator_name.required' => 'Le nom de l\'évaluateur est requis.',
            'backend_score.required' => 'La note back-end (0-100) est obligatoire.',
            'frontend_score.required' => 'La note front-end (0-100) est obligatoire.',
            'clean_code_score.required' => 'La note Clean Code / QA (0-100) est obligatoire.',
            'culture_fit_score.required' => 'La note Culture Fit (0-100) est obligatoire.',
        ];
    }
}
