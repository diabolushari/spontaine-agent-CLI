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
        Schema::table('loader_jobs', function (Blueprint $table) {
            $table->string('source_type')
                ->default('sql')
                ->after('cron_type');
            $table->foreignId('api_id')
                ->nullable()
                ->constrained('loader_a_p_i_s');
            $table->foreignId('query_id')
                ->change()
                ->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loader_jobs', function (Blueprint $table) {
            $table->dropColumn('source_type');
            $table->dropForeign('loader_jobs_api_id_foreign');
            $table->dropIndex('loader_jobs_api_id_foreign');
            $table->dropColumn('api_id');
            $table->foreignId('query_id')
                ->change()
                ->nullable(false);
        });
    }
};
