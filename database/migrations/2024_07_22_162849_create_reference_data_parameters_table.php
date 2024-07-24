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
        Schema::create('reference_data_parameters', function (Blueprint $table) {
            $table->id();
            $table->string('parameter');
            $table->foreignId('domain_id')
                ->constrained('reference_data_domains');
            $table->boolean('has_second_value')
                ->default(0);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reference_data_parameters');
    }
};
