<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\ChatHistory;                // reuse your existing model
use App\Http\Resources\ChatHistoryResource; // reuse resource if available

class AdvancedChatController extends Controller
{
    // GET /api/advanced-chat-history
    public function index(Request $request)
    {
        $user = Auth::user();
        // If you already have a column to filter (e.g., source/model), use it. Otherwise just show last N.
        $items = ChatHistory::where('user_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->take(200)
            ->get();

        // If you have ChatHistoryResource, return that; else return raw.
        if (class_exists(ChatHistoryResource::class)) {
            return response()->json([
                'data' => ChatHistoryResource::collection($items)
            ]);
        }

        return response()->json(['data' => $items]);
    }

    // POST /api/advanced-chat-history
    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'message'  => ['required', 'string'],
            'response' => ['required', 'string'],
        ]);

        $row = new ChatHistory();
        $row->user_id = $user->id;
        // map to your actual column names
        // assuming you have 'message' and 'response' columns; adjust if it's 'question'/'answer'
        $row->message = $validated['message'];
        $row->response = $validated['response'];
        // If your schema needs chatbot_id or other fields, set sensible defaults (e.g., null)
        if (isset($row->chatbot_id)) $row->chatbot_id = null;
        // Optional: mark as advanced in a free text column if you have one
        if (isset($row->model)) $row->model = 'advanced';

        $row->save();

        if (class_exists(ChatHistoryResource::class)) {
            return (new ChatHistoryResource($row))->response()->setStatusCode(201);
        }

        return response()->json(['data' => $row], 201);
    }
}
