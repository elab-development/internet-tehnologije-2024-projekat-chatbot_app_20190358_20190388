<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ChatHistoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'chatbot_id' => $this->chatbot_id,
            'message' => $this->message,
            'response' => $this->response,
            'timestamp' => $this->timestamp,
            'user' => new UserResource($this->whenLoaded('user')),
            'chatbot' => new ChatbotResource($this->whenLoaded('chatbot')),
        ];
    }
}
