<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subscription>
 */
class SubscriptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name'        => $this->faker->unique()->randomElement(['Free','Premium', 'Pro']).' '.$this->faker->randomNumber(3),
            'price'       => $this->faker->randomElement([0, 9.99, 19.99, 29.99, 99.00]),
            'interval'    => $this->faker->randomElement(['monthly','yearly']),
            'description' => $this->faker->sentence(10),
            'is_active'   => true,
        ];
    }
}
