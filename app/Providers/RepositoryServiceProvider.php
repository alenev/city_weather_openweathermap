<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Interfaces\API\WeatherRepositoryInterface;
use App\Repositories\API\WeatherRepository;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(WeatherRepositoryInterface::class,WeatherRepository::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
