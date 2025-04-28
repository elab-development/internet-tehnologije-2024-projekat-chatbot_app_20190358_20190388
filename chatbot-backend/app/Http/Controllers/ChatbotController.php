<?php

namespace App\Http\Controllers;

use App\Models\Chatbot;
use App\Http\Resources\ChatbotResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatbotController extends Controller
{
    /**
     * Update the version of a chatbot.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateVersion(Request $request, $id)
    {
        // Ensure the user is an admin
        $authUser = Auth::user();
        if ($authUser->user_role !== 'admin') {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        // Validate the request
        $request->validate([
            'version' => 'required|string',
        ]);

        // Find the chatbot
        $chatbot = Chatbot::find($id);
        if (!$chatbot) {
            return response()->json(['error' => 'Chatbot not found.'], 404);
        }

        // Update the version
        $chatbot->version = $request->input('version');
        $chatbot->save();

        return response()->json([
            'message' => 'Chatbot version updated successfully.',
            'chatbot' => new ChatbotResource($chatbot)
        ], 200);
    }

    /**
     * Update the entire chatbot record.
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateChatbot(Request $request, $id)
    {
        // Ensure the user is an admin
        $authUser = Auth::user();
        if ($authUser->user_role !== 'admin') {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        // Validate the request
        $request->validate([
            'chatbot_name' => 'required|string',
            'version' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        // Find the chatbot
        $chatbot = Chatbot::find($id);
        if (!$chatbot) {
            return response()->json(['error' => 'Chatbot not found.'], 404);
        }

        // Update the chatbot
        $chatbot->update($request->only(['chatbot_name', 'version', 'rating']));

        return response()->json([
            'message' => 'Chatbot updated successfully.',
            'chatbot' => new ChatbotResource($chatbot)
        ], 200);
    }
}
