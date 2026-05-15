<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // We handle authorization in the Controller via Gate::authorize
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'distance' => 'required|string',
            'date' => 'required|date|after:today',
            'location' => 'required|string',
            'max_participants' => 'required|integer|min:1',
            'registration_start' => 'required|date',
            'registration_end' => 'required|date|after_or_equal:registration_start',
            'race_start_time' => 'required',
            'cut_off_time' => 'required',
            'organizer_name' => 'required|string',
            'contact' => 'required|string',
            'categories' => 'required|array',
            'banner_image' => 'required|image|mimes:jpg,jpeg,png|max:2048', // 2MB max
        ];
    }
}
