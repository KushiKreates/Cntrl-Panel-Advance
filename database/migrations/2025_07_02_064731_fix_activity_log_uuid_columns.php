<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        // Create a temporary table
        Schema::create('activity_log_new', function (Blueprint $table) {
            $table->id();
            $table->string('log_name')->nullable();
            $table->text('description');
            $table->string('subject_id')->nullable();
            $table->string('subject_type')->nullable();
            $table->string('causer_id')->nullable();
            $table->string('causer_type')->nullable();
            $table->longText('properties')->nullable();
            $table->string('event')->nullable();
            $table->uuid('batch_uuid')->nullable();
            $table->timestamps();
            
            $table->index('log_name');
            $table->index(['subject_id', 'subject_type']);
            $table->index(['causer_id', 'causer_type']);
        });

        // Copy data from the old table to the new one
        DB::statement('
            INSERT INTO activity_log_new 
            SELECT 
                id,
                log_name,
                description,
                CAST(subject_id AS CHAR) as subject_id,
                subject_type,
                CAST(causer_id AS CHAR) as causer_id,
                causer_type,
                properties,
                event,
                batch_uuid,
                created_at,
                updated_at
            FROM activity_log
        ');

        // Drop the old table
        Schema::dropIfExists('activity_log');

        // Rename the new table
        Schema::rename('activity_log_new', 'activity_log');
    }

    public function down()
    {
        // This is a one-way migration, but we'll provide a basic rollback
        Schema::table('activity_log', function (Blueprint $table) {
            $table->uuid('subject_id')->change();
            $table->uuid('causer_id')->change();
        });
    }
};