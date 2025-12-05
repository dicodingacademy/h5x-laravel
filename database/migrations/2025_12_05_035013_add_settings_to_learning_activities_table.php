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
        Schema::table('learning_activities', function (Blueprint $table) {
            $table->integer('minimum_score')->default(0)->after('content');
            $table->boolean('show_wrong_answer')->default(true)->after('minimum_score');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('learning_activities', function (Blueprint $table) {
            $table->dropColumn(['minimum_score', 'show_wrong_answer']);
        });
    }
};
