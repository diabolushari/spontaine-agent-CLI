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
        Schema::create('data_table_dimensions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('data_detail_id')
                ->constrained('data_details');
            $table->string('column');
            $table->string('field_name');
            $table->foreignId('meta_structure_id')
                ->constrained('meta_structures');
            $table->softDeletes();
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('data_table_dimensions');
    }
};
