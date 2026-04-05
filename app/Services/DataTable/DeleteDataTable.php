<?php

namespace App\Services\DataTable;

use App\Models\DataDetail\DataDetail;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

readonly class DeleteDataTable
{
    public function delete(DataDetail $dataDetail): void
    {
        $dataDetail->load('dateFields', 'dimensionFields', 'relationFields');

        $dataDetail->delete();

        if (Schema::hasTable($dataDetail->table_name)) {
            $archivedTableName = 'archived_'.time().'_'.$dataDetail->table_name;
            Schema::rename($dataDetail->table_name, $archivedTableName);

            
        }
    }

    /**
     * Get all foreign key constraints for the table
     *
     * @return array<array{column: string, related_table: string}>
     */
    private function getForeignKeys(DataDetail $dataDetail): array
    {
        $foreignKeys = [];

        // Add dimension foreign keys
        foreach ($dataDetail->dimensionFields as $dimensionField) {
            $foreignKeys[] = [
                'column' => $dimensionField->column,
                'related_table' => 'meta_data',
            ];
        }

        // Add relation foreign keys
        foreach ($dataDetail->relationFields as $relation) {
            $relatedTable = DataDetail::find($relation->related_table_id);
            if ($relatedTable) {
                $foreignKeys[] = [
                    'column' => $relation->column,
                    'related_table' => $relatedTable->table_name,
                ];
            }
        }

        return $foreignKeys;
    }
}
