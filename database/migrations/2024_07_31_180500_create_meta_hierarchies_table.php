<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('meta_hierarchies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('primary_field_name');
            $table->string('primary_column');
            $table->string('secondary_field_name');
            $table->string('secondary_column');
            $table->softDeletes();
            $table->timestamps(); //
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meta_hierarchies');
    }
};
