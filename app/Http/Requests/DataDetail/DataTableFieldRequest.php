<?php

namespace App\Http\Requests\DataDetail;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property DateColumnInfo[] $dates
 * @property DimensionColumnInfo[] $dimensions
 * @property MeasureColumnInfo[] $measures
 */
#[MapName(SnakeCaseMapper::class)]
class DataTableFieldRequest extends Data
{
    public function __construct(
        #[Rule('exists:data_details,id')]
        public int $detailId,
        public ?array $dates,
        public ?array $dimensions,
        public ?array $measures,
    ) {}
}
