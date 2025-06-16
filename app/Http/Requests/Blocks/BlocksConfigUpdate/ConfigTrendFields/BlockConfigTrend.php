<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\StringType;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Casts\CastData;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigTrend extends Data
{
    public function __construct(
        #[Nullable, Exists('subset_group_items', 'id')]
        public ?int $subsetId,

        #[Nullable]
        public ?string $title,

        public ?DataFieldGroup $dataField,

        public ?TooltipFieldData $tooltipField,
    ) {}

    public static function rules(): array
    {

        return [
            'subsetId' => ['nullable', 'integer', 'exists:subset_group_items,id'],
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

    public static function customAttributes(): array
    {
        return [
            'dataField.xAxis.label' => 'X-axis label',
            'dataField.xAxis.value' => 'X-axis value',
            'dataField.xAxis.show_label' => 'X-axis show label',
            'dataField.yAxis.label' => 'Y-axis label',
            'dataField.yAxis.value' => 'Y-axis value',
            'dataField.yAxis.show_label' => 'Y-axis show label',
            'tooltipField.label' => 'Tooltip label',
            'tooltipField.unit' => 'Tooltip unit',
            'tooltipField.show_label' => 'Tooltip show label',
        ];
    }

    public static function customMessages(): array
    {
        return [
            'dataField.xAxis.label.required_with' => 'The X-axis label is required when subset is selected.',
            'dataField.xAxis.value.required_with' => 'The X-axis value is required when subset is selected.',
            'dataField.yAxis.label.required_with' => 'The Y-axis label is required when subset is selected.',
            'dataField.yAxis.value.required_with' => 'The Y-axis value is required when subset is selected.',
            'tooltipField.label.required_with' => 'The tooltip label is required when subset is selected.',
            'tooltipField.unit.required_with' => 'The tooltip unit is required when subset is selected.',
        ];
    }
}
