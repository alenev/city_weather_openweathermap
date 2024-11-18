<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class WeatherResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'timestamp_dt' =>$this->timestamp_dt,
            'city_name' => $this->city_name,
            'min_tmp' => $this->min_tmp,
            'max_tmp' => $this->max_tmp,
            'wind_spd' => $this->wind_spd,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
