<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loader_connections', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('driver');
            $table->string('host');
            $table->unsignedInteger('port');
            $table->string('username');
            $table->text('password');
            $table->string('database');
            $table->foreignId('created_by')
                ->nullable()
                ->constrained('users');
            $table->foreignId('updated_by')
                ->nullable()
                ->constrained('users');
            $table->timestamps();
            $table->softDeletes(); //
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loader_connections');
    }
};
