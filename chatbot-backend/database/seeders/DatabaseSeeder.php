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
            'password' => bcrypt('admin123')
        ]);

        $this->call([
            UserSeeder::class,
            ChatbotSeeder::class,
            ChatHistorySeeder::class,
        ]);
    }
}
