<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Administrator',
            'email' => 'admin@godmode.com',
            'user_role' => 'admin',
            'password' => bcrypt('admin123'),
            'subscription_id' => null,
        ]);

        $this->call([
            UserSeeder::class,
            ChatbotSeeder::class,
            ChatHistorySeeder::class,
        ]);
    }
}
