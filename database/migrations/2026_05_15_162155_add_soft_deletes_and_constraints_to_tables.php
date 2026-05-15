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
        Schema::table('events', function (Blueprint $table) {
            $table->softDeletes();
            $table->index('created_by');
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->softDeletes();
            $table->index('event_id');
            $table->index('user_id');
            $table->unique(['user_id', 'event_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropIndex(['created_by']);
        });

        Schema::table('registrations', function (Blueprint $table) {
            $table->dropSoftDeletes();
            $table->dropUnique(['user_id', 'event_id']);
            $table->dropIndex(['event_id']);
            $table->dropIndex(['user_id']);
        });
    }
};
