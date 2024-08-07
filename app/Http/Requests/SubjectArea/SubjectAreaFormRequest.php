<?php

namespace App\Http\Requests\SubjectArea;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

#[MapName(SnakeCaseMapper::class)]
class SubjectAreaFormRequest extends Data
{
    public function __construct(
        public string $name,
        public ?string $description,
        public bool $isActive,
        public string $tableName
    ) {}

    /**
     * @return array<string, string[]>
     */
    public static function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:subject_areas'],
            'description' => ['nullable', 'string', 'max:1000'],
            'is_active' => ['required', 'boolean'],
            'table_name' => ['required', 'string', 'max:255', 'unique:subject_areas'],
        ];
    }
}
