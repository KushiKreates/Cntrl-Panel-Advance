<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServerQueueTable extends Migration
{
    public function up()
    {
        Schema::create('server_queue', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type');
            $table->uuid('uuid')->nullable();
            $table->enum('status', ['pending','processing','failed','completed'])->default('pending');
            $table->json('data');     // attributes you'll send to Pterodactyl
            $table->json('output')->nullable(); // response from API
            $table->unsignedTinyInteger('attempts')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('server_queue');
    }
}