<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Chatbot>
 */
class ChatbotFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'chatbot_name' => $this->faker->word, 
            'version' => $this->faker->randomFloat(1, 1.0, 5.0), 
            'rating' => $this->faker->numberBetween(1, 5), 
        ];
    }
}
