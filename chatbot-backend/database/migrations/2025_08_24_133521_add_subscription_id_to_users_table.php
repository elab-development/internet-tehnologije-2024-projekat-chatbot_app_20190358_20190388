<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Nullable so existing users remain valid; when a subscription is deleted, set null.
            $table->foreignId('subscription_id')
                  ->nullable()
                  ->constrained('subscriptions')
                  ->nullOnDelete()
                  ->after('remember_token'); // adjust position if you prefer
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('subscription_id');
        });
    }
};
