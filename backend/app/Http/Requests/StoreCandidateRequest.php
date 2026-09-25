<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCandidateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'job_offer_id' => ['nullable', 'exists:job_offers,id'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:150', 'unique:candidates,email'],
            'phone' => ['required', 'string', 'max:30'],
            'target_role' => ['required', 'in:FULLSTACK_DEV,GROWTH_ENGINEER,QA_ENGINEER,PRODUCT_DESIGNER'],
            'years_experience' => ['required', 'integer', 'min:0', 'max:40'],
            'github_url' => ['nullable', 'string', 'max:255'],
            'portfolio_url' => ['nullable', 'string', 'max:255'],
            'skills' => ['nullable', 'array'],
        ];
    }

    public function messages(): array
    {
        return [
            'first_name.required' => 'Le prénom est obligatoire.',
            'last_name.required' => 'Le nom de famille est obligatoire.',
            'email.required' => 'L\'adresse e-mail est obligatoire.',
            'email.unique' => 'Un candidat avec cet e-mail est déjà enregistré.',
            'target_role.required' => 'Le profil ciblé doit être renseigné.',
            'years_experience.required' => 'Les années d\'expérience sont obligatoires.',
        ];
    }
}
