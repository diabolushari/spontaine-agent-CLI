<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields;

use Spatie\LaravelData\Data;
use Spatie\LaravelData\Attributes\Validation\Nullable;
use Spatie\LaravelData\Attributes\Validation\IntegerType;
use Spatie\LaravelData\Attributes\Validation\Exists;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\RequiredWith;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields\RankingDataField;

#[MapName(SnakeCaseMapper::class)]
class BlockConfigRanking extends Data
{
    public function __construct(
        #[Exists('subset_group_items', 'subset_detail_id')]
        #[Nullable]
        public ?int $subsetId,

        #[Max(255)]
        #[RequiredWith('subset_id')]
        public ?string $title,

        #[RequiredWith('subset_id')]
        public ?RankingDataField $dataField,
    ) {}

    
}
