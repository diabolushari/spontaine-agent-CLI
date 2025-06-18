<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\BlockConfigTrend;
use Spatie\LaravelData\Attributes\Validation\Required;
use Spatie\LaravelData\Data;

class BlocksConfigTrendUpdateRequest extends Data
{
    public function __construct(
        #[Required]
        public BlockConfigTrend $trend,
    ) {}
}
