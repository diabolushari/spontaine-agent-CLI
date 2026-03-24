<?php

namespace App\Http\Requests\DataLoader;

use App\Services\DataLoader\JsonStructure\JsonStructureDefinition;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\In;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * @property KeyValue[] $headers
 * @property KeyValue[] $body
 * @property JsonStructureDefinition $responseStructure
 */
#[MapName(SnakeCaseMapper::class)]
class DataLoaderAPIFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public readonly string $name,
        #[Max(2000)]
        public readonly ?string $description,
        #[In('GET', 'POST')]
        public readonly string $method,
        #[Max(2000)]
        public readonly string $url,
        #[Nullable, In('netsuite')]
        public readonly ?string $sdk,
        public readonly array $headers,
        public readonly array $body,
        public readonly JsonStructureDefinition $responseStructure,
    ) {}
}
