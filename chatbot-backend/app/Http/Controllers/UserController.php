<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of all users excluding the admin themselves.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        if (!Auth::check() || Auth::user()->user_role !== 'admin') {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        $adminId = Auth::id();
        $users = User::where('id', '!=', $adminId)->get();

        return response()->json([
            'users' => UserResource::collection($users)
        ], 200);
    }

    /**
     * Display a specific user by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        if (!Auth::check() || Auth::user()->user_role !== 'admin') {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        return response()->json([
            'user' => new UserResource($user)
        ], 200);
    }

    /**
     * Remove a specific user by ID.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        if (!Auth::check() || Auth::user()->user_role !== 'admin') {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found.'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully.'], 200);
    }

    /**
     * Search users by name or email with optional pagination.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function search(Request $request)
    {
        if (!Auth::check() || Auth::user()->user_role !== 'admin') {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        $search = $request->input('search');
        $perPage = $request->input('per_page', 10);

        $users = User::where(function ($query) use ($search) {
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
        })->paginate($perPage);

        return response()->json([
            'users' => UserResource::collection($users->items()),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'total_pages' => $users->lastPage(),
                'total_users' => $users->total(),
            ]
        ], 200);
    }
}
