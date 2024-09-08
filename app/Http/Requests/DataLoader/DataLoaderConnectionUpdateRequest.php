<?php

namespace App\Http\Requests\DataLoader;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Optional;

#[MapName(SnakeCaseMapper::class)]
class DataLoaderConnectionUpdateRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public readonly string $name,
        #[Max(1000)]
        public readonly ?string $description,
        #[Max(255)]
        public readonly string $driver,
        #[Max(255)]
        public readonly string $host,
        #[Max(255)]
        public readonly string $username,
        #[Max(255)]
        public readonly string|Optional $password,
        #[Max(255)]
        public readonly string $database,
        public readonly int $port,
    ) {}
}
