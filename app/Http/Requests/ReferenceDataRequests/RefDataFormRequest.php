<?php

namespace App\Http\Requests\ReferenceDataRequests;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class RefDataFormRequest extends Data
{
    public function __construct(
        public string $domainId,
        public string $parameterId,
        public string $sortOrder,
        public string $valueOne,
        public ?string $valueTwo,
    ) {}

    public static function rules(): array
    {
        return [
            'domain_id' => ['required', 'string', 'exists:reference_data_domains,id'],
            'parameter_id' => ['required', 'string', 'exists:reference_data_parameters,id'],
            'sort_order' => ['required', 'integer', 'min:1'],
            'value_one' => ['required', 'string', 'max:255'],
            'value_two' => ['nullable', 'string', 'max:255'],
        ];
    }
}
