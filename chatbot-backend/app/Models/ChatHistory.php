<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ChatHistory extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'user_id',      
        'chatbot_id',    
        'message',       
        'response',      
        'timestamp',     
    ];

    /**
     * Relationship: A ChatHistory belongs to a User.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: A ChatHistory belongs to a Chatbot.
     */
    public function chatbot()
    {
        return $this->belongsTo(Chatbot::class);
    }
}
