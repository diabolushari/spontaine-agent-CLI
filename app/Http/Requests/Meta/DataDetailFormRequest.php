<?php

namespace App\Http\Requests\Meta;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class DataDetailFormRequest extends Data
{
    public function __construct(
        #[Max(255)]
        public string $name,
        #[Max(1000)]
        public ?string $description,
        #[Exists('subject_areas', 'id')]
        public int $subjectAreaId,
        #[Max(255)]
        public string $type,
        public bool $isActive,
    ) {}
}
