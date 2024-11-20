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
        Schema::create('weather', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('timestamp_dt');
            $table->string('city_name');
            $table->decimal('min_tmp', total: 4, places: 2);
            $table->decimal('max_tmp', total: 4, places: 2);
            $table->decimal('wind_spd', total: 4, places: 2); #may be 10.00+ ?
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('weather');
    }
};
