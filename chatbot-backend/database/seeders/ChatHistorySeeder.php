<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\User;
use App\Models\Chatbot;
use App\Models\ChatHistory;

class ChatHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
          $users = User::all();
          $chatbots = Chatbot::all();

          foreach ($users as $user) {
              foreach ($chatbots as $chatbot) {
                  ChatHistory::factory()->count(3)->create([
                      'user_id' => $user->id,          
                      'chatbot_id' => $chatbot->id,   
                  ]);
              }
          }
    }
}
