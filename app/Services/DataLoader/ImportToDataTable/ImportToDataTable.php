<?php

namespace App\Services\DataLoader\ImportToDataTable;

use App\Models\DataDetail\DataDetail;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ImportToDataTable
{
    use DeleteDuplicateEntriesForField;

    public function __construct(
        private MapColumnsToField $mapColumnsToField,
        private ConvertToDataTable $convertToDataTable,
        private SyncColumnMetaData $syncColumnMetaData,
        private InsertItemToDataTable $insertItemToDataTable
    ) {
        //
    }

    /**
     * Import data to the data table
     *
     * @param  array[]  $data
     * @param  array{
     *     field_id: int,
     *     field_name: string,
     *     data_table_column: string|null
     * }[]|null  $fieldMapping
     * @return array{
     *     is_successful: bool,
     *     total_records: int,
     *     error_message: string|null,
     *     executed_at: Carbon,
     *     completed_at: Carbon|null
     *
     * @throws Exception
     */
    public function importToDataTable(
        DataDetail $dataDetail,
        array $data,
        bool $deleteExistingData = false,
        ?string $duplicationIdentifierField = null,
        ?array $fieldMapping = null
    ): array {

        $status = [
            'is_successful' => false,
            'total_records' => 0,
            'error_message' => null,
            'executed_at' => now(),
            'completed_at' => null,
        ];

        // Import data to the data table
        if (empty($data)) {
            $status['error_message'] = 'No data to import';
            $status['completed_at'] = now();

            return $status;
        }

        $dataColumns = array_keys($data[0]);

        $fieldInfo = $this->mapColumnsToField->map($dataColumns, $dataDetail->id, $fieldMapping);

        //map fieldInfo/data into data table
        $dataTable = $this->convertToDataTable->convert($fieldInfo, $data, $dataDetail->id);

        //insert new MetaData found in data to MetaData table and fetch id's of all present metadata
        /** @var array<string, array<string, int>> $metaDataIds */
        $metaDataIds = [];

        try {
            foreach ($fieldInfo as $field) {
                if ($field->metaStructureId != null) {
                    $metaDataIds[$field->column] = $this->syncColumnMetaData->sync(
                        $field->metaStructureId,
                        array_column($dataTable, $field->column)
                    );
                }
            }
        } catch (Exception $e) {
            $status['error_message'] = $e->getMessage();
            $status['completed_at'] = now();

            return $status;
        }

        //replace string values for dimensions with meta_data_id
        foreach ($dataTable as &$record) {
            foreach ($fieldInfo as $field) {
                if ($field->isMetaData) {
                    $newValue = null;
                    if ($record[$field->column] !== null && $record[$field->column] !== '') {
                        $newValue = $metaDataIds[$field->column][strtolower($record[$field->column])] ?? null;
                    }
                    $record[$field->column] = $newValue;
                }
            }
        }

        try {
            if ($deleteExistingData && $duplicationIdentifierField == null) {
                DB::table($dataDetail->table_name)->truncate();
            }
        } catch (Exception $e) {
            $status['error_message'] = $e->getMessage();
            $status['completed_at'] = now();

            return $status;
        }

        DB::beginTransaction();
        //save data
        try {
            if ($deleteExistingData && $duplicationIdentifierField != null) {
                $this->deleteDuplicateEntries(
                    $dataDetail,
                    $duplicationIdentifierField,
                    $data
                );
            }
            foreach (array_chunk($dataTable, 1000) as $chunk) {
                DB::table($dataDetail->table_name)->insert($chunk);
            }
        } catch (Exception $e) {
            DB::rollBack();
            Log::info('error while saving data to data table');
            $status['error_message'] = $e->getMessage();
            $status['completed_at'] = now();

            return $status;
        }

        DB::commit();

        Log::info('import successful');
        $status['is_successful'] = true;
        $status['total_records'] = count($data);
        $status['completed_at'] = now();

        return $status;
    }
}
