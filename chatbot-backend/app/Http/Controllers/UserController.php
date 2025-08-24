<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Subscription;

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

    public function setSubscription(Request $request, User $user)
    {
        $data = $request->validate([
            'subscription_id' => ['nullable', 'exists:subscriptions,id'],
        ]);

        $user->update($data);

        // Return the updated user with subscription details
        return (new UserResource($user->load('subscription')))
            ->response()
            ->setStatusCode(200);
    }

    public function statistics()
    {
        if (!Auth::check() || Auth::user()->user_role !== 'admin') {
            return response()->json(['error' => 'Unauthorized action.'], 403);
        }

        // Exclude admins for subscription stats (only regular users counted)
        $totalUsers   = User::count();
        $admins       = User::where('user_role', 'admin')->count();
        $regulars     = User::where('user_role', '!=', 'admin')->count();

        $freeCount    = User::where('user_role', '!=', 'admin')
                            ->whereNull('subscription_id')
                            ->count();

        // counts by plan name for users that have a subscription_id
        $plans = User::query()
            ->select('subscriptions.id as id', 'subscriptions.name as name', DB::raw('COUNT(users.id) as count'))
            ->join('subscriptions', 'subscriptions.id', '=', 'users.subscription_id')
            ->where('users.user_role', '!=', 'admin')
            ->groupBy('subscriptions.id', 'subscriptions.name')
            ->orderBy('subscriptions.name')
            ->get();

        $paidCount = $plans->sum('count');

        return response()->json([
            'totals' => [
                'total_users' => $totalUsers,
                'admins'      => $admins,
                'regulars'    => $regulars,
                'free'        => $freeCount,
                'paid'        => $paidCount,
            ],
            'plans' => $plans, // array of { id, name, count }
        ], 200);
    }

}
