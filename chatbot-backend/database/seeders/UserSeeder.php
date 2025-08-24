<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Subscription;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Ensure base plans exist
        $this->call(SubscriptionSeeder::class);

        $planIds = Subscription::pluck('id')->all();

        // Regular users with random plans
        User::factory()
            ->count(10)
            ->state(['user_role' => 'regular'])
            ->create()
            ->each(function (User $user) use ($planIds) {
                $user->subscription_id = fake()->randomElement($planIds);
                $user->save();
            });
    }
}
