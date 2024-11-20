<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OpenWeatherMapService
{
    public function getOpenWeatherMapDataForCity($city_name)
    {
        try{
            $baseUrl = 'https://api.openweathermap.org/data/2.5/forecast';
            $parameters = [
                'q' => ''.$city_name.'',
                'units' => 'metric',
                'appid' => env('OPENWEATHERMAP_APPID'),
            ];
            $query_part = http_build_query($parameters);
            $response = Http::get($baseUrl, $query_part);
            $data = $response->json();
            return $data;
        }catch(\Exception $ex){
            return false;
        }
    }
}