<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use App\Models\ChatHistory;
use App\Models\Chatbot;
use App\Http\Resources\ChatHistoryResource;

class AdvancedChatController extends Controller
{
    /**
     * Vrati ID “Advanced Model” chatbota (napravi ga ako ne postoji).
     */
    private function getAdvancedBotId(): int
    {
        $bot = Chatbot::firstOrCreate(
            ['chatbot_name' => 'Advanced Model'],
            ['version' => 'v1', 'rating' => 5]
        );

        return (int) $bot->id;
    }

    // GET /api/advanced-chat-history
    public function index(Request $request)
    {
        $user = Auth::user();

        // Poredak po koloni koja realno postoji
        $orderBy = Schema::hasColumn('chat_histories', 'timestamp')
            ? 'timestamp'
            : (Schema::hasColumn('chat_histories', 'created_at') ? 'created_at' : 'id');

        $rows = ChatHistory::where('user_id', $user->id)
            ->orderBy($orderBy, 'asc')
            ->take(200)
            ->get();

        return response()->json([
            'data' => class_exists(ChatHistoryResource::class)
                ? ChatHistoryResource::collection($rows)
                : $rows
        ]);
    }

    // POST /api/advanced-chat-history
    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'message'  => ['required', 'string'],
            'response' => ['required', 'string'],
        ]);

        $now = now();

        $row = new ChatHistory();
        $row->user_id    = $user->id;
        $row->chatbot_id = $this->getAdvancedBotId(); // ✅ obavezan FK
        $row->message    = $data['message'];
        $row->response   = $data['response'];

        // Ako postoji kolona `timestamp` – popuni je
        if (Schema::hasColumn('chat_histories', 'timestamp')) {
            $row->timestamp = $now;
        }

        // Pošto je $timestamps = false; ručno popuni created_at/updated_at
        if (Schema::hasColumn('chat_histories', 'created_at')) {
            $row->created_at = $now;
        }
        if (Schema::hasColumn('chat_histories', 'updated_at')) {
            $row->updated_at = $now;
        }

        $row->save();

        if (class_exists(ChatHistoryResource::class)) {
            return (new ChatHistoryResource($row))->response()->setStatusCode(201);
        }

        return response()->json(['data' => $row], 201);
    }
}
