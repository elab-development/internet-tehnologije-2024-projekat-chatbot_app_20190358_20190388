<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\Chatbot;
use App\Models\ChatHistory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ChatHistory>
 */
class ChatHistoryFactory extends Factory
{
        /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ChatHistory::class;
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(), 
            'chatbot_id' => Chatbot::factory(), 
            'message' => $this->faker->sentence, 
            'response' => $this->faker->sentence, 
            'timestamp' => $this->faker->dateTime
        ];
    }
}
