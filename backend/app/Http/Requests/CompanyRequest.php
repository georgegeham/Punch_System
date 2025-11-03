<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CompanyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "required|min:3",
            "location" => "required|string",
            'area' => 'required|string',
            'requires_hours' => 'nullable|boolean',
            'start_time' => ['nullable', Rule::date()->format('H:i'), 'required_if:requires_hours,true'],
            'end_time' => ['nullable', Rule::date()->format('H:i'), 'required_if:requires_hours,true|after:start_time'],
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.min' => 'The name must be at least 3 characters.',
            'location.required' => 'The location field is required.',
            'area.required' => 'The area field is required.',
            'requires_hours.required' => 'The requires hours field is required.',
            'start_time.required' => 'The start hour field is required.',
            'end_time.required' => 'The end hour field is required.',
        ];
    }
}
