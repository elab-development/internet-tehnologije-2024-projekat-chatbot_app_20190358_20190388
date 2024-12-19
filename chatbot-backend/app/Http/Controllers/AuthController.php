<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;

use App\Models\User;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string',
        ]);
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'user_role' => 'regular',
            'password' => Hash::make($validated['password']),
        ]);
       $token = $user->createToken('auth_token')->plainTextToken;
       return response()->json([
           'message' => 'Registration complete. Welcome to chatbot!🤖',
           'user' => new UserResource($user),
           'token' => $token,
       ], 201); 
        
    }
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
    
        if (!Auth::attempt(['email' => $validated['email'], 'password' => $validated['password']])) {
            return response()->json(['error' => 'Invalid credentials!⚠️'], 401);
        }
    
        $user = Auth::user();
    
        $token = $user->createToken('auth_token')->plainTextToken;
    
        return response()->json([
            'message' => $user->user_role === 'admin' 
            ? "Login successful! Welcome, Admin $user->email! 🚀" 
            : "Login successful! Welcome to chatbot $user->email! 🤖",
            'user' => new UserResource($user),
            'token' => $token,
        ]);
    }
    
   
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => `User $user->email logged out successfully.`]);
    }
}

