<?php

namespace App\Http\Requests;

use App\Models\Comunidad;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateComunidadRequest extends FormRequest
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
            'nombre' => [
                'required',
                'string',
                'max:100',
                // Ignora el propio registro para que no choque consigo mismo.
                Rule::unique('comunidades', 'nombre')->ignore($this->route('comunidad')),
            ],
            'descripcion' => ['required', 'string', 'max:500'],
            'categoria' => ['required', Rule::in(Comunidad::CATEGORIAS)],
            'logo' => ['nullable', 'url', 'max:255'],
            'administrador_id' => ['required', Rule::exists('users', 'id')],
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
            'nombre.required' => 'El nombre de la comunidad es obligatorio.',
            'nombre.string' => 'El nombre debe ser un texto.',
            'nombre.max' => 'El nombre no puede superar los :max caracteres.',
            'nombre.unique' => 'Ya existe otra comunidad registrada con ese nombre.',

            'descripcion.required' => 'La descripción es obligatoria.',
            'descripcion.string' => 'La descripción debe ser un texto.',
            'descripcion.max' => 'La descripción no puede superar los :max caracteres.',

            'categoria.required' => 'La categoría es obligatoria.',
            'categoria.in' => 'La categoría debe ser una de: academica, cultural, deportiva o tecnologica.',

            'logo.url' => 'El logo debe ser una URL válida.',
            'logo.max' => 'La URL del logo no puede superar los :max caracteres.',

            'administrador_id.required' => 'Debe indicar el administrador de la comunidad.',
            'administrador_id.exists' => 'El administrador seleccionado no existe.',
        ];
    }
}
