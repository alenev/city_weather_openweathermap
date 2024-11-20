<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Interfaces\API\WeatherRepositoryInterface;
use App\Classes\ApiResponseClass;
use App\Http\Resources\WeatherResource;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\API\GetByCityNameWeatherRequest;
use App\Http\Requests\API\GetOpenWeatherMapCityDataRequest;
use App\Http\Requests\API\StoreWeatherRequest;
use App\Services\OpenWeatherMapService;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    private WeatherRepositoryInterface $weatherRepositoryInterface;
    
    public function __construct(WeatherRepositoryInterface $weatherRepositoryInterface)
    {
        $this->weatherRepositoryInterface = $weatherRepositoryInterface;
    }

    public function getOpenWeatherMapCityData(GetOpenWeatherMapCityDataRequest $request)
    {
        $openWeatherMapService = new OpenWeatherMapService();
        $weather = $openWeatherMapService->getOpenWeatherMapDataForCity($request->city_name);
        if(!$weather){
            return ApiResponseClass::sendResponse('','fetch weather for city '.$request->city_name.' problem',500);
        }
        if($weather['cod'] == 404){
            return ApiResponseClass::sendResponse('','weather for city '.$request->city_name.' not found',404);
        }
        if($weather['cod'] == 200){
            $weatherList = collect($weather['list']);
            $weatherResourcesData = [];
            foreach ($weatherList as $weatherResource){
                $weatherResourcesDataItem = array(
                    'timestamp_dt' => $weatherResource["dt"],
                    'city_name' => $weather["city"]["name"],
                    'min_tmp' => $weatherResource["main"]["temp_min"],
                    'max_tmp' => $weatherResource["main"]["temp_max"],
                    'wind_spd' => $weatherResource["wind"]["speed"]
                );
                $weatherResourcesData[] = $weatherResourcesDataItem;
            }
            return ApiResponseClass::sendResponse($weatherResourcesData,'',200);
        }
    }

    public function storeDbWeatherCityData(StoreWeatherRequest $request)
    {
        $data =[
            'timestamp_dt' => $request->timestamp_dt,
            'city_name' => $request->city_name,
            'min_tmp' => $request->min_tmp,
            'max_tmp' => $request->max_tmp,
            'wind_spd' => $request->wind_spd, 
        ];
        $cityWeatherInDB = $this->weatherRepositoryInterface->getByCity($request->city_name);
        if(!empty($cityWeatherInDB)){
            $updateCityWeatherInDB = $this->update($data, $cityWeatherInDB->id);
            if($updateCityWeatherInDB){
                return ApiResponseClass::sendResponse(new WeatherResource($updateCityWeatherInDB),'weather for city '.$request->city_name.' updated in DB',201);
            }else{
                return ApiResponseClass::sendResponse('','problem with updating weather for city '.$request->city_name.'',500);
            }
        }else{
            $storeCityWeatherInDB = $this->store($data);
            if($storeCityWeatherInDB){
                return ApiResponseClass::sendResponse(new WeatherResource($storeCityWeatherInDB),'weather for city '.$request->city_name.' added to DB',200);
            }else{
                return ApiResponseClass::sendResponse('','problem with adding weather for city '.$request->city_name.'',500);
            }
        }
    }





    public function index()
    {
        $data = $this->weatherRepositoryInterface->index();
        return ApiResponseClass::sendResponse(WeatherResource::collection($data),'',200);
    }

    public function show(GetByCityNameWeatherRequest $request)
    {
        $city_name = $request->city_name;
        $weather = $this->weatherRepositoryInterface->getByCity($city_name);
        if (empty($weather)){
            return ApiResponseClass::sendResponse('','weather in city '.$city_name.' not found',404);
        }else{
            return ApiResponseClass::sendResponse(new WeatherResource($weather),'',200);
        }
    }

    public function showById($id)
    {
        return $this->weatherRepositoryInterface->getById($id);
    }

    public function store($data)
    {
        $cityWeatherInDB = $this->weatherRepositoryInterface->getByCity($data["city_name"]);
        if (!empty($cityWeatherInDB)){
            $updateCityWeatherInDB = $this->update($data, $cityWeatherInDB->id);
            if (!$updateCityWeatherInDB){
                return false;
            }
        }else{
            DB::beginTransaction();
            try{
                $storeCityWeatherInDB = $this->weatherRepositoryInterface->store($data);
                DB::commit();
                $cityWeatherInDB = $this->showById($storeCityWeatherInDB->id); 
                return $cityWeatherInDB;
            }catch(\Exception $ex){
                return false;
            }
        }
    }

    public function update($data, $id)
    {
        DB::beginTransaction();
        try{
            $update = $this->weatherRepositoryInterface->update($data, $id);
            DB::commit();
            $cityWeatherInDB = $this->showById($id); 
            return $cityWeatherInDB;
        }catch(\Exception $ex){
            return false;
        }
    }

    public function destroy(Request $request)
    {
        $this->weatherRepositoryInterface->delete($request->id);
        return ApiResponseClass::sendResponse('weather item delete successful','',204);
    }

}
