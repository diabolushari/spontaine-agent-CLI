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
        Schema::create('sdk_tokens', function (Blueprint $table) {
            $table->id();
            $table->string('sdk', 100)->comment('Integration namespace, fixed to netsuite');
            $table->string('token_key', 150)->comment('Logical token identifier, fixed to m2m_access_token');
            $table->text('token')->comment('Latest active NetSuite bearer token');
            $table->timestamp('expires_at')->comment('UTC expiry time for the current token');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sdk_tokens');
    }
};
