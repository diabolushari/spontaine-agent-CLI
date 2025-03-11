<?php

namespace App\Http\Requests\DataLoader;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class KeyValue extends Data
{
    public function __construct(
        #[Max(255)]
        public readonly string $key,
        #[Max(500)]
        public readonly string $value,
    ) {}
}
