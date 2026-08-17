<?php

/**
 * Endpoint de autenticación con Sanctum.
 *
 * Para activarlo agrega en routes/api.php:
 *   require __DIR__.'/api/auth.php';
 *
 * Dependencias (ya incluidas en Laravel 12 + Sanctum):
 *   composer require laravel/sanctum
 *   php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
 *   php artisan migrate
 */

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\ValidationException;

// POST /api/login  →  devuelve el Bearer token para usar en Authorization header.
Route::post('login', function (Request $request): JsonResponse {
    $request->validate([
        'email'    => ['required', 'email'],
        'password' => ['required', 'string'],
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['Las credenciales no coinciden con nuestros registros.'],
        ]);
    }

    // Revoca tokens previos del mismo dispositivo (opcional, evita acumulación).
    $user->tokens()->where('name', 'frontend')->delete();

    $token = $user->createToken('frontend')->plainTextToken;

    return response()->json([
        'token' => $token,
        'user'  => [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'rol'   => $user->rol,
        ],
    ]);
});

// POST /api/logout  →  invalida el token activo.
Route::middleware('auth:sanctum')->post('logout', function (Request $request): JsonResponse {
    $request->user()->currentAccessToken()->delete();

    return response()->json(['message' => 'Sesión cerrada correctamente.']);
});
