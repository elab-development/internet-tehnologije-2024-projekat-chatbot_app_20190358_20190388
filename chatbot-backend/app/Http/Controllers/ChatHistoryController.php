<?php

namespace App\Http\Controllers;

use App\Models\ChatHistory;
use App\Models\Chatbot;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatHistoryController extends Controller
{
    /**
     * Create a new chat history entry and process a chat message.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $authUser = Auth::user();
        if ($authUser->user_role !== 'regular') {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $request->validate([
            'chatbot_id' => 'required|exists:chatbots,id',
            'message' => 'required|string|max:1000',
        ]);

        $chatbot = Chatbot::find($request->input('chatbot_id'));

        $userMessage = $request->input('message');
        $response = $this->generateChatbotResponse($userMessage);

        $chatHistory = ChatHistory::create([
            'user_id' => $authUser->id,
            'chatbot_id' => $chatbot->id,
            'message' => $userMessage,
            'response' => $response,
            'timestamp' => now(),
        ]);

        return response()->json([
            'message' => 'Chat history created successfully.',
            'chat_history' => $chatHistory,
        ], 201);
    }

    /**
     * Delete a specific chat history if the authenticated user is its creator.
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $authUser = Auth::user();
        if ($authUser->user_role !== 'regular') {
            return response()->json(['error' => 'Unauthorized.'], 403);
        }

        $chatHistory = ChatHistory::find($id);
        if (!$chatHistory) {
            return response()->json(['error' => 'Chat history not found.'], 404);
        }

        if ($chatHistory->user_id !== $authUser->id) {
            return response()->json(['error' => 'You are not authorized to delete this chat history.'], 403);
        }

        $chatHistory->delete();

        return response()->json(['message' => 'Chat history deleted successfully.'], 200);
    }

    /**
     * Generate a chatbot response based on the user's message.
     *
     * @param string $message
     * @return string
     */
    private function generateChatbotResponse($message)
    {
            // Load predefined responses with synonyms
            $responses = include app_path('Helpers/chat_responses.php');

            // Normalize the user's message for consistent comparison
            $normalizedMessage = strtolower(trim($message));

            // Loop through each response and check for matches
            foreach ($responses as $key => $data) {
                // Check for an exact match with the key
                if ($key === $normalizedMessage) {
                    return $data['response'];
                }

                // Check if the message matches any synonym
                if (isset($data['synonyms']) && in_array($normalizedMessage, $data['synonyms'])) {
                    return $data['response'];
                }
            }

            // Return the default response if no match is found
            return $responses['default']['response'];
    }
}
