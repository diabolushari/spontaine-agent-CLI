<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields\RankingDataField;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigRanking extends Data
{
    public function __construct(
        #[Nullable, IntegerType]
        public ?int $subsetId,

        #[Nullable]
        public ?string $title,

        #[Nullable]
        public ?RankingDataField $dataField,
    ) {}

    public static function rules(string $prefix = ''): array
    {
        $base = $prefix ? $prefix . '.' : '';

        return [
            $base . 'subset_id' => ['nullable', 'integer'],
            $base . 'title' => ['nullable', 'string'],

            // Only validate data_field when subset_id is present and > 0
            $base . 'data_field' => ['nullable', 'array', 'required_with:' . $base . 'subset_id'],
            $base . 'data_field.label' => ['required_with:' . $base . 'subset_id', 'string'],
            $base . 'data_field.value' => ['required_with:' . $base . 'subset_id', 'string'],
            $base . 'data_field.show_label' => ['required_with:' . $base . 'subset_id', 'boolean'],
        ];
    }
}
