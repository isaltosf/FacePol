<?php

namespace App\Http\Requests;

use App\Models\Publicacion;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePublicacionRequest extends FormRequest
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
     * @return array<string, array<int, mixed>>
     */
    public function rules(): array
    {
        return [
            'titulo' => ['required', 'string', 'max:150'],
            'descripcion' => ['required', 'string', 'max:250'],
            'tipo' => ['required', Rule::in(Publicacion::TIPOS)],
            // Un evento necesita fecha; en un anuncio simplemente se ignora si llega.
            'fecha_evento' => ['required_if:tipo,evento', 'nullable', 'date'],
            // Imagen opcional del anuncio o evento (archivo, no URL).
            'imagen' => ['nullable', 'image', 'max:5120'],
        ];
    }

    /**
     * Mensajes de validación personalizados en español.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'titulo.required' => 'El título de la publicación es obligatorio.',
            'titulo.string' => 'El título debe ser un texto.',
            'titulo.max' => 'El título no puede superar los :max caracteres.',

            'descripcion.required' => 'La descripción es obligatoria.',
            'descripcion.string' => 'La descripción debe ser un texto.',
            'descripcion.max' => 'La descripción no puede superar los :max caracteres.',

            'tipo.required' => 'El tipo de publicación es obligatorio.',
            'tipo.in' => 'El tipo debe ser "anuncio" o "evento".',

            'fecha_evento.required_if' => 'La fecha del evento es obligatoria cuando el tipo es "evento".',
            'fecha_evento.date' => 'La fecha del evento no es una fecha válida.',

            'imagen.image' => 'El archivo debe ser una imagen.',
            'imagen.max' => 'La imagen no puede pesar más de :max KB.',
        ];
    }
}
