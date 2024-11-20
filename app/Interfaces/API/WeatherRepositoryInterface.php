<?php

namespace App\Interfaces\API;

interface WeatherRepositoryInterface
{
    public function index();
    public function getByCity($city_name);
    public function getById($id);
    public function store(array $data);
    public function update(array $data,$id);
    public function delete($id);
}