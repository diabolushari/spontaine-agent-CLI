<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigOverviewFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigOverviewTable extends Data
{
    public function __construct(

        public int $id,

        #[Max(255)]
        public string $title,

        public string $subsetId,

        public string $measureField,

        public bool $colSpan,

        /** @var BlockConfigOverviewTableFilter[]|null */
        public ?array $filters,


    ) {}
    public static function messages(): array
    {
        return [
            'title.required_with' => 'Please provide a title when a subset is selected.',
            'subsetId.required_with' => 'Please provide a subset when a title is provided.',
            'measureField.required_with' => 'Please provide a measure field when a subset is selected.',
            'colSpan.required_with' => 'Please provide a col span when a subset is selected.',
            'filters.required_with' => 'Please provide a filters when a subset is selected.',

        ];
    }
}
