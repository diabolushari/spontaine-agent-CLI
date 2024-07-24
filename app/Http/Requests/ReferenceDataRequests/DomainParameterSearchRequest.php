<?php

namespace App\Http\Requests\ReferenceDataRequests;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Rule;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Symfony\Contracts\Service\Attribute\Required;

#[MapName(SnakeCaseMapper::class)]
class DomainParameterSearchRequest extends Data
{
    public function __construct(
        #[Rule('string')]
        #[Required]
        public string $domain,
        #[Rule('string')]
        #[Required]
        public string $parameter,
    ) {}
}
