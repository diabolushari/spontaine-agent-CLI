<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Attributes\MapName;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\AxisDataField;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;

#[MapName(SnakeCaseMapper::class)]
class DataFieldGroup extends Data
{
    public function __construct(

        public ?AxisDataField $xAxis,
        public ?AxisDataField $yAxis,
    ) {}
}
