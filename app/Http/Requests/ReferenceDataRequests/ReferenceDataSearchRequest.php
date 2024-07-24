<?php

namespace App\Http\Requests\ReferenceDataRequests;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class ReferenceDataSearchRequest extends Data
{
    public function __construct(
        public ?string $domainId,
        public ?string $parameterId,
        public ?string $value,
    ) {}
}
