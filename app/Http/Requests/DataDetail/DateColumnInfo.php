<?php

namespace App\Http\Requests\DataDetail;

use Spatie\LaravelData\Data;

class DateColumnInfo extends Data
{
    public function __construct(
        public string $column,
        public string $fieldName,
    ) {}
}
