<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Attributes\MapName;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataFieldGroup extends Data
{
    public function __construct(
        public ?array $xAxis,
        public ?array $yAxis,
    ) {}

    public static function rules(): array
    {
        return [
            'x_axis' => ['nullable'],
            'y_axis' => ['nullable'],
        ];
    }
}
