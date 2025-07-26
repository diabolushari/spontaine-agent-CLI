<?php

namespace Tests\Unit\Services\DataLoader\JsonStructure;

use App\Http\Requests\DataLoader\FieldMappingData;
use App\Services\DataLoader\JsonStructure\PerformJSONProcessing;
use Tests\TestCase;

final class PerformFieldMappingTest extends TestCase
{
    private PerformJSONProcessing $performFieldMapping;

    protected function setUp(): void
    {
        parent::setUp();
        $this->performFieldMapping = new PerformJSONProcessing;
    }

    public function test_maps_json_field_paths_to_data_table_columns(): void
    {
        // Arrange
        $flattenedData = [
            [
                'response.data.id' => 1,
                'response.data.name' => 'John Doe',
                'response.data.email' => 'john@example.com',
                'response.data.created_at' => '2023-01-01',
            ],
            [
                'response.data.id' => 2,
                'response.data.name' => 'Jane Smith',
                'response.data.email' => 'jane@example.com',
                'response.data.created_at' => '2023-01-02',
            ],
        ];

        $fieldMapping = [
            new FieldMappingData(
                column: 'user_id',
                fieldName: 'User ID',
                fieldType: 'dimension',
                jsonFieldPath: 'response.data.id',
                dateFormat: null
            ),
            new FieldMappingData(
                column: 'full_name',
                fieldName: 'Full Name',
                fieldType: 'text',
                jsonFieldPath: 'response.data.name',
                dateFormat: null
            ),
            new FieldMappingData(
                column: 'email_address',
                fieldName: 'Email Address',
                fieldType: 'text',
                jsonFieldPath: 'response.data.email',
                dateFormat: null
            ),
        ];

        $expected = [
            [
                'user_id' => 1,
                'full_name' => 'John Doe',
                'email_address' => 'john@example.com',
                'response.data.created_at' => '2023-01-01', // Unmapped field should remain unchanged
            ],
            [
                'user_id' => 2,
                'full_name' => 'Jane Smith',
                'email_address' => 'jane@example.com',
                'response.data.created_at' => '2023-01-02', // Unmapped field should remain unchanged
            ],
        ];

        // Act
        $result = $this->performFieldMapping->handle($flattenedData, $fieldMapping);

        // Assert
        $this->assertEquals($expected, $result);
    }

    public function test_returns_original_data_when_field_mapping_is_empty(): void
    {
        // Arrange
        $flattenedData = [
            [
                'response.data.id' => 1,
                'response.data.name' => 'John Doe',
            ],
        ];

        $fieldMapping = [];

        // Act
        $result = $this->performFieldMapping->handle($flattenedData, $fieldMapping);

        // Assert
        $this->assertEquals($flattenedData, $result);
    }

    public function test_returns_original_data_when_flattened_data_is_empty(): void
    {
        // Arrange
        $flattenedData = [];
        $fieldMapping = [
            new FieldMappingData(
                column: 'user_id',
                fieldName: 'User ID',
                fieldType: 'dimension',
                jsonFieldPath: 'response.data.id',
                dateFormat: null
            ),
        ];

        // Act
        $result = $this->performFieldMapping->handle($flattenedData, $fieldMapping);

        // Assert
        $this->assertEquals([], $result);
    }

    public function test_ignores_mappings_with_null_or_empty_json_field_path(): void
    {
        // Arrange
        $flattenedData = [
            [
                'response.data.id' => 1,
                'response.data.name' => 'John Doe',
            ],
        ];

        $fieldMapping = [
            new FieldMappingData(
                column: 'user_id',
                fieldName: 'User ID',
                fieldType: 'dimension',
                jsonFieldPath: 'response.data.id',
                dateFormat: null
            ),
            new FieldMappingData(
                column: 'full_name',
                fieldName: 'Full Name',
                fieldType: 'text',
                jsonFieldPath: null, // Null path should be ignored
                dateFormat: null
            ),
            new FieldMappingData(
                column: 'description',
                fieldName: 'Description',
                fieldType: 'text',
                jsonFieldPath: '', // Empty path should be ignored
                dateFormat: null
            ),
        ];

        $expected = [
            [
                'user_id' => 1,
                'response.data.name' => 'John Doe', // Should remain unchanged
            ],
        ];

        // Act
        $result = $this->performFieldMapping->handle($flattenedData, $fieldMapping);

        // Assert
        $this->assertEquals($expected, $result);
    }
}
