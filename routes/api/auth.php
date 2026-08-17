<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\ForceJsonResponse;
use Illuminate\Support\Facades\Route;

// Login mínimo para obtener un token de Sanctum desde el frontend.
// Desbloquea a los módulos de Membresías y Publicaciones (auth:sanctum).
Route::middleware(ForceJsonResponse::class)->group(function () {
    Route::post('login', [AuthController::class, 'login']);
});
