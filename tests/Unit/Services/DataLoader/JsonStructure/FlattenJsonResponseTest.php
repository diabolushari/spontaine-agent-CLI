<?php

namespace Tests\Unit\Services\DataLoader\JsonStructure;

use App\Services\DataLoader\JsonStructure\FlattenJsonResponse;
use PHPUnit\Framework\TestCase;

final class FlattenJsonResponseTest extends TestCase
{
    private const CITY_NAME = 'New York';

    private const COUNTRY_NAME = 'United States of America';

    private const QUERY_STRING = 'New York, United States of America';

    private const LATITUDE = '40.714';

    private const LONGITUDE = '-74.006';

    private const TIMEZONE_ID = 'America/New_York';

    private const LOCALTIME = '2025-07-21 11:22';

    private const OBSERVATION_TIME = '03:22 PM';

    private const SUNRISE_TIME = '05:43 AM';

    private const SUNSET_TIME = '08:21 PM';

    private const MOONRISE_TIME = '01:53 AM';

    private const MOONSET_TIME = '06:07 PM';

    private const MOON_PHASE = 'Waning Crescent';

    private const CO_VALUE = '368.15';

    private const SO2_VALUE = '2.775';

    private const PM2_5_VALUE = '32.375';

    private const PM10_VALUE = '32.745';

    private FlattenJsonResponse $flattener;

    protected function setUp(): void
    {
        parent::setUp();
        $this->flattener = new FlattenJsonResponse;
    }

    public function test_flatten_weather_api_response(): void
    {
        $data = $this->getWeatherApiData();
        $expected = $this->getExpectedFlattenedData();

        $result = $this->flattener->flatten($data);

        $this->assertEquals($expected, $result);
    }

    private function getWeatherApiData(): array
    {
        return [
            'request' => [
                'type' => 'City',
                'query' => self::QUERY_STRING,
                'language' => 'en',
                'unit' => 'm',
            ],
            'location' => [
                'name' => self::CITY_NAME,
                'country' => self::COUNTRY_NAME,
                'region' => self::CITY_NAME,
                'lat' => self::LATITUDE,
                'lon' => self::LONGITUDE,
                'timezone_id' => self::TIMEZONE_ID,
                'localtime' => self::LOCALTIME,
                'localtime_epoch' => 1753096920,
                'utc_offset' => '-4.0',
            ],
            'current' => [
                'observation_time' => self::OBSERVATION_TIME,
                'temperature' => 27,
                'weather_code' => 113,
                'weather_icons' => [
                    'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png',
                ],
                'weather_descriptions' => [
                    'Sunny',
                ],
                'astro' => [
                    'sunrise' => self::SUNRISE_TIME,
                    'sunset' => self::SUNSET_TIME,
                    'moonrise' => self::MOONRISE_TIME,
                    'moonset' => self::MOONSET_TIME,
                    'moon_phase' => self::MOON_PHASE,
                    'moon_illumination' => 18,
                ],
                'air_quality' => [
                    'co' => self::CO_VALUE,
                    'no2' => '7.03',
                    'o3' => '109',
                    'so2' => self::SO2_VALUE,
                    'pm2_5' => self::PM2_5_VALUE,
                    'pm10' => self::PM10_VALUE,
                    'us-epa-index' => '2',
                    'gb-defra-index' => '2',
                ],
                'wind_speed' => 10,
                'wind_degree' => 321,
                'wind_dir' => 'NW',
                'pressure' => 1014,
                'precip' => 0,
                'humidity' => 51,
                'cloudcover' => 0,
                'feelslike' => 27,
                'uv_index' => 7,
                'visibility' => 16,
                'is_day' => 'yes',
            ],
        ];
    }

    private function getExpectedFlattenedData(): array
    {
        $commonData = $this->getCommonExpectedData();

        return [
            array_merge([
                '.current.weather_icons' => 'https://cdn.worldweatheronline.com/images/wsymbols01_png_64/wsymbol_0001_sunny.png',
            ], $commonData),
            array_merge([
                '.current.weather_descriptions' => 'Sunny',
            ], $commonData),
        ];
    }

    private function getCommonExpectedData(): array
    {
        return [
            '.current.observation_time' => self::OBSERVATION_TIME,
            '.current.temperature' => 27,
            '.current.weather_code' => 113,
            '.current.astro.sunrise' => self::SUNRISE_TIME,
            '.current.astro.sunset' => self::SUNSET_TIME,
            '.current.astro.moonrise' => self::MOONRISE_TIME,
            '.current.astro.moonset' => self::MOONSET_TIME,
            '.current.astro.moon_phase' => self::MOON_PHASE,
            '.current.astro.moon_illumination' => 18,
            '.current.air_quality.co' => self::CO_VALUE,
            '.current.air_quality.no2' => '7.03',
            '.current.air_quality.o3' => '109',
            '.current.air_quality.so2' => self::SO2_VALUE,
            '.current.air_quality.pm2_5' => self::PM2_5_VALUE,
            '.current.air_quality.pm10' => self::PM10_VALUE,
            '.current.air_quality.us-epa-index' => '2',
            '.current.air_quality.gb-defra-index' => '2',
            '.current.wind_speed' => 10,
            '.current.wind_degree' => 321,
            '.current.wind_dir' => 'NW',
            '.current.pressure' => 1014,
            '.current.precip' => 0,
            '.current.humidity' => 51,
            '.current.cloudcover' => 0,
            '.current.feelslike' => 27,
            '.current.uv_index' => 7,
            '.current.visibility' => 16,
            '.current.is_day' => 'yes',
            '.request.type' => 'City',
            '.request.query' => self::QUERY_STRING,
            '.request.language' => 'en',
            '.request.unit' => 'm',
            '.location.name' => self::CITY_NAME,
            '.location.country' => self::COUNTRY_NAME,
            '.location.region' => self::CITY_NAME,
            '.location.lat' => self::LATITUDE,
            '.location.lon' => self::LONGITUDE,
            '.location.timezone_id' => self::TIMEZONE_ID,
            '.location.localtime' => self::LOCALTIME,
            '.location.localtime_epoch' => 1753096920,
            '.location.utc_offset' => '-4.0',
        ];
    }
}
