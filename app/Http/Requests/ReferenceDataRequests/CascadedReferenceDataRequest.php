<?php

namespace App\Http\Requests\ReferenceDataRequests;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Symfony\Contracts\Service\Attribute\Required;

#[MapName(SnakeCaseMapper::class)]
class CascadedReferenceDataRequest extends Data
{
    public function __construct(
        #[Required]
        #[Rule('string')]
        public string $domain,
        #[Required]
        #[Rule('string')]
        public string $parameter,
        #[Required]
        #[Rule('string')]
        public string $searchValue,
    ) {}
}
