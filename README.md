# Weather in the city. Laravel 11 backend REST-API to show and store in DB weather data in the cities from api.openweathermap.org. 

## How to run

### clone to local directory
`clone -b backend https://github.com/alenev/city_weather_openweathermap.git`

- `create MySql DB and run MySql local server (XAMMP or other)`

### In local directory:

- `copy to local directory .env file and change MySql DB access params`

- `composer install`

- `php artisan migrate`

- `php artisan serve`

#### For frontend React app (https://github.com/alenev/city_weather_openweathermap/tree/frontend) serve must be by default on http://127.0.0.1:8000 