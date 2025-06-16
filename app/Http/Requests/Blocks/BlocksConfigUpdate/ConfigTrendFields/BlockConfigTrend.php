<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigTrend extends Data
{
    public function __construct(
        #[Nullable, Exists('subset_group_items', 'subset_detail_id')]
        public ?int $subsetId,

        #[Nullable, Max(255)]
        public ?string $title,

        public ?DataFieldGroup $dataField,

        public ?array $tooltipField,
    ) {}

    public static function rules(): array
    {
        return [
            'subsetId' => ['nullable', 'integer', 'exists:subset_group_items,subset_detail_id'],
            'title' => ['nullable', 'string', 'max:255'],

            'dataField.xAxis.label' => ['required_with:subsetId', 'string'],
            'dataField.xAxis.value' => ['required_with:subsetId', 'string'],
            'dataField.xAxis.show_label' => ['required_with:subsetId', 'boolean'],

            'dataField.yAxis.label' => ['required_with:subsetId', 'string'],
            'dataField.yAxis.value' => ['required_with:subsetId', 'string'],
            'dataField.yAxis.show_label' => ['required_with:subsetId', 'boolean'],

            'tooltipField.label' => ['required_with:subsetId', 'string'],
            'tooltipField.unit' => ['required_with:subsetId', 'string'],
            'tooltipField.show_label' => ['required_with:subsetId', 'boolean'],
        ];
    }
}
