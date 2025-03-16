<?php

namespace App\Services\DataLoader\JsonStructure;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class JsonStructureDefinition extends Data
{
    public function __construct(
        public int $lastUuid,
        public JsonDefinition $definition,
    ) {}
}
