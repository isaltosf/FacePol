<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{
    /**
     * Autenticar un usuario y devolver un token de Sanctum.
     *
     * POST /api/login
     *
     * Endpoint mínimo para desbloquear a los módulos de Membresías y
     * Publicaciones, que exigen auth:sanctum y hasta ahora no tenían forma
     * de obtener un token desde el frontend.
     */
    public function login(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        if ($validador->fails()) {
            return response()->json([
                'message' => 'Revisa los datos ingresados.',
                'errors' => $validador->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $datos = $validador->validated();
        $user = User::where('email', $datos['email'])->first();

        if (! $user || ! Hash::check($datos['password'], $user->password)) {
            return response()->json([
                'message' => 'Las credenciales no coinciden con ningún usuario.',
            ], Response::HTTP_UNAUTHORIZED);
        }

        $token = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->name,
                    'email' => $user->email,
                    'rol' => $user->rol,
                ],
            ],
        ]);
    }

    /**
     * Registrar una cuenta nueva y devolver un token de Sanctum.
     *
     * POST /api/register
     *
     * Todo el que se registra queda como estudiante: el rol lo pone por
     * defecto la migración de users y la contraseña la encripta el cast
     * 'hashed' del modelo User, así que ninguno de los dos se toca aquí.
     */
    public function registrar(Request $request): JsonResponse
    {
        $validador = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ], [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser un texto.',
            'name.max' => 'El nombre no puede superar los :max caracteres.',

            'email.required' => 'El correo es obligatorio.',
            'email.email' => 'El correo debe tener un formato válido.',
            'email.max' => 'El correo no puede superar los :max caracteres.',
            'email.unique' => 'Ya existe una cuenta registrada con ese correo.',

            'password.required' => 'La contraseña es obligatoria.',
            'password.string' => 'La contraseña debe ser un texto.',
            'password.min' => 'La contraseña debe tener al menos :min caracteres.',
            'password.confirmed' => 'La confirmación de la contraseña no coincide.',
        ]);

        if ($validador->fails()) {
            return response()->json([
                'message' => 'Revisa los datos ingresados.',
                'errors' => $validador->errors(),
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $user = User::create($validador->validated());

        // El rol lo pone la base de datos como valor por defecto, así que el
        // modelo recién creado todavía no lo tiene cargado: sin este refresh la
        // respuesta saldría con "rol": null.
        $user->refresh();

        $token = $user->createToken('frontend')->plainTextToken;

        return response()->json([
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'nombre' => $user->name,
                    'email' => $user->email,
                    'rol' => $user->rol,
                ],
            ],
        ], Response::HTTP_CREATED);
    }
}
