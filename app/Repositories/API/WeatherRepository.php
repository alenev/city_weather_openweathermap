<?php

namespace App\Repositories\API;

use App\Models\Weather;
use App\Interfaces\API\WeatherRepositoryInterface;

class WeatherRepository implements WeatherRepositoryInterface
{
    public function index(){
        return Weather::all();
    }

    public function getByCity($city_name){
        return Weather::where('city_name', 'like', '%' . strtolower($city_name) . '%')->first();
    }

    public function store(array $data){
        return Weather::create($data);
    }

    public function update(array $data,$id){
        return Weather::whereId($id)->update($data);
    }
    
    public function delete($id){
        Weather::destroy($id);
    }
}