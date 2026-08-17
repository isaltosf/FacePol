<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
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
}
