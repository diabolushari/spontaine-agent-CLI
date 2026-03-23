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
        Schema::table('loader_a_p_i_s', function (Blueprint $table) {
            $table->string('sdk', 50)->nullable()->comment('Optional integration binding; netsuite enables automatic bearer token injection')->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loader_a_p_i_s', function (Blueprint $table) {
            $table->dropColumn('sdk');
        });
    }
};
