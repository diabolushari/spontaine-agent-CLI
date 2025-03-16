<?php

namespace App\Services\DataLoader\JsonStructure;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property JsonDefinition[] $children
 */
#[MapName(SnakeCaseMapper::class)]
class JsonDefinition extends Data
{
    public function __construct(
        public int $id,
        public string $fieldName,
        #[In('array', 'object', 'primitive', 'primitive-array')]
        public string $fieldType,
        public array $children,
    ) {}
}
