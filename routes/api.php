<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\WeatherController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('weather/all', [WeatherController::class, 'index']);
Route::get('weather/get_by_city_name', [WeatherController::class, 'show']);
Route::get('weather/get_open_weather_map_city_data', [WeatherController::class, 'getOpenWeatherMapCityData']);
Route::post('weather/store_open_weather_map_city_data', [WeatherController::class, 'storeDbWeatherCityData']);

