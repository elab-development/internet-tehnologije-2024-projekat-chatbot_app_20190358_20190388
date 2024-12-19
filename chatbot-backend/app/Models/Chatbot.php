<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chatbot extends Model
{
    protected $fillable = [
        'chatbot_name',
        'version',
        'rating'        
    ];

    /**
     * Relationship: A Chatbot can log multiple ChatHistories.
     */
    public function chatHistories()
    {
        return $this->hasMany(ChatHistory::class);
    }
}

