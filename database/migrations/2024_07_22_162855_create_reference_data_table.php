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
        Schema::create('reference_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('domain_id')
                ->constrained('reference_data_domains');
            $table->foreignId('parameter_id')
                ->constrained('reference_data_parameters');
            $table->unsignedBigInteger('sort_order')->nullable();
            $table->string('value_one');
            $table->string('value_two')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reference_data');
    }
};
