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
        Schema::create('loader_a_p_i_s', function (Blueprint $table) {
            $table->id();

            $table->string('name');
            $table->text('description')->nullable();
            $table->text('url');
            $table->string('method');
            $table->json('headers');
            $table->json('body');
            $table->json('response_structure');

            //fields
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
        Schema::dropIfExists('loader_a_p_i_s');
    }
};
