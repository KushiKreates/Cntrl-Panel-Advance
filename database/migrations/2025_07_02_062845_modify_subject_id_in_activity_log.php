<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Add the new column if it doesn't exist
        if (!Schema::hasColumn('activity_log', 'subject_id_new')) {
            Schema::table('activity_log', function (Blueprint $table) {
                $table->unsignedBigInteger('subject_id_new')->nullable()->after('subject_id');
            });

            // First, set all to null
            DB::table('activity_log')->update(['subject_id_new' => null]);

            // Then update only the numeric values
            DB::table('activity_log')
                ->whereRaw('subject_id REGEXP ?', ['^[0-9]+$'])
                ->update([
                    'subject_id_new' => DB::raw('CAST(subject_id AS UNSIGNED)')
                ]);

            // Drop the old column
            Schema::table('activity_log', function (Blueprint $table) {
                $table->dropColumn('subject_id');
            });

            // Rename the new column
            Schema::table('activity_log', function (Blueprint $table) {
                $table->renameColumn('subject_id_new', 'subject_id');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('activity_log', 'subject_id_new')) {
            // If we need to rollback, we'll convert back to string type
            Schema::table('activity_log', function (Blueprint $table) {
                $table->string('subject_id_old')->nullable()->after('subject_id');
            });

            // Convert all values back to string
            DB::table('activity_log')->update([
                'subject_id_old' => DB::raw('CAST(subject_id AS CHAR)')
            ]);

            // Drop the new column
            Schema::table('activity_log', function (Blueprint $table) {
                $table->dropColumn('subject_id');
            });

            // Rename the old column back
            Schema::table('activity_log', function (Blueprint $table) {
                $table->renameColumn('subject_id_old', 'subject_id');
            });
        }
    }
};