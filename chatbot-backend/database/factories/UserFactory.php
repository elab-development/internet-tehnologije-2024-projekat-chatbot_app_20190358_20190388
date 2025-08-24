<?php

namespace Database\Factories;

use App\Models\Subscription;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name'             => fake()->name(),
            'email'            => fake()->unique()->safeEmail(),
            'password'         => static::$password ??= Hash::make('password'),
            'remember_token'   => Str::random(10),
            'user_role'        => 'regular',
            'subscription_id'  => null, 
        ];
    }

    public function admin(): static
    {
        return $this->state(fn () => ['user_role' => 'admin']);
    }

    public function withSubscription(): static
    {
        return $this->state(function () {
            $id = Subscription::inRandomOrder()->value('id');
            if (!$id) {
                $id = Subscription::factory()->create()->id;
            }
            return ['subscription_id' => $id];
        });
    }
}
