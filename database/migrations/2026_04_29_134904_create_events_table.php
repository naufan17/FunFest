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
        Schema::create('events', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->string('distance');
            $table->date('date');
            $table->string('location');
            $table->integer('max_participants');
            $table->date('registration_start');
            $table->date('registration_end');
            $table->time('race_start_time');
            $table->time('cut_off_time');
            $table->string('organizer_name');
            $table->string('contact');
            $table->string('banner_url')->nullable();
            $table->foreignUuid('created_by')->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
