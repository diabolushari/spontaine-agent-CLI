<?php

namespace App\Http\Requests\Blocks\BlocksConfigUpdate;

use App\Http\Requests\Blocks\BlocksConfigUpdate\ConfigTrendFields\BlockConfigTrend;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;
use Spatie\LaravelData\Attributes\Validation\Required;

#[MapName(SnakeCaseMapper::class)]
class BlocksConfigTrendUpdateRequest extends Data
{
    public function __construct(
        #[Required]
        public BlockConfigTrend $trend,
    ) {}

    public static function rules(): array
    {
        return [
            'trend' => ['required'],
        ];
    }
}



