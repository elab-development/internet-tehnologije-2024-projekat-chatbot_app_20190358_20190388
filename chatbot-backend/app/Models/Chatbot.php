<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Chatbot extends Model
{
    use HasFactory;
    public $timestamps = false;
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

