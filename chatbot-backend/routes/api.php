<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ChatHistoryController;
use App\Http\Controllers\UserController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 

Route::middleware('auth:sanctum')->group(function () {

    Route::patch('/chatbots/{id}/version', [ChatbotController::class, 'updateVersion']); 
    Route::put('/chatbots/{id}', [ChatbotController::class, 'updateChatbot']);

    Route::post('/chat-history', [ChatHistoryController::class, 'create']); 
    Route::delete('/chat-history/{id}', [ChatHistoryController::class, 'destroy']);

    Route::get('/users/search', [UserController::class, 'search']);
    Route::resource('users', UserController::class)->only(['index', 'show', 'destroy']);

    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
    