<?php

namespace App\Interfaces\API;

interface WeatherRepositoryInterface
{
    public function index();
    public function getByCity($id);
    public function store(array $data);
    public function update(array $data,$id);
    public function delete($id);
}