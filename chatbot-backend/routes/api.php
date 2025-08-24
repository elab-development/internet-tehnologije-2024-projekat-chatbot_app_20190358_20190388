<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ChatHistoryController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\AdvancedChatController;

Route::post('/register', [AuthController::class, 'register']); 
Route::post('/login', [AuthController::class, 'login']); 

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/advanced-chat-history', [AdvancedChatController::class, 'index']);
    Route::post('/advanced-chat-history', [AdvancedChatController::class, 'store']);

    Route::patch('/users/{user}/subscription', [UserController::class, 'setSubscription']);
    Route::apiResource('subscriptions', SubscriptionController::class);

    Route::patch('/chatbots/{id}/version', [ChatbotController::class, 'updateVersion']); 
    Route::put('/chatbots/{id}', [ChatbotController::class, 'updateChatbot']);

    Route::get('/chat-history', [ChatHistoryController::class, 'index']);
    Route::post('/chat-history', [ChatHistoryController::class, 'create']); 
    Route::delete('/chat-history/{id}', [ChatHistoryController::class, 'destroy']);

    Route::get('/users/search', [UserController::class, 'search']);
    Route::resource('users', UserController::class)->only(['index', 'show', 'destroy']);

    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
    