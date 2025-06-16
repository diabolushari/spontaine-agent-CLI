<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigRankingFields;

use Spatie\LaravelData\Data;

class RankingDataField extends Data
{
    public function __construct(
        public ?string $label,
        public ?string $value,
        public ?bool $showLabel,
    ) {}
}
