<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Subscription;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            ['name' => 'Free',    'price' => 0.00,  'interval' => 'monthly', 'description' => 'Basic features',        'is_active' => true],
            ['name' => 'Pro',     'price' => 9.99,  'interval' => 'monthly', 'description' => 'For active users',      'is_active' => true],
            ['name' => 'Premium', 'price' => 19.99, 'interval' => 'monthly', 'description' => 'All features unlocked', 'is_active' => true],
        ];

        foreach ($plans as $plan) {
            Subscription::updateOrCreate(['name' => $plan['name']], $plan);
        }
    }
}
