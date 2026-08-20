<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Support\Facades\Route;

// Registro y login para obtener un token de Sanctum desde el frontend.
// Desbloquean a los módulos de Membresías y Publicaciones (auth:sanctum).
Route::middleware(ForceJsonResponse::class)->group(function () {
    Route::post('register', [AuthController::class, 'registrar']);
    Route::post('login', [AuthController::class, 'login']);
});
