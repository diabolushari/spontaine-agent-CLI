<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Attributes\Validation\BooleanType;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class TooltipFieldData extends Data
{
    public function __construct(
        public string $label,
        public string $unit,
        public bool $showLabel,
    ) {}

    public static function rules(): array
    {
        return [
            'label' => ['nullable', 'string'],
            'unit' => ['nullable', 'string'],
            'showLabel' => ['nullable', 'boolean'],
        ];
    }
}

