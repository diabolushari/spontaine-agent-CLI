<?php

namespace Tests\Services;

use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Imports\DataTableImport;
use App\Models\DataDetail\DataDetail;
use App\Models\Meta\MetaStructure;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Services\DataLoader\ImportToDataTable\ImportToDataTable;
use App\Services\DataTable\SetupDataTable;
use Exception;
use Maatwebsite\Excel\Facades\Excel;

class DistributionHierarchyFactory
{
    /**
     * @throws Exception
     */
    public static function create(): void
    {
        //create structures needed for hierarchy datatable
        $sectionId = MetaStructure::create([
            'id' => 1,
            'structure_name' => 'Section Id',
        ]);
        $sectionCode = MetaStructure::create([
            'id' => 2,
            'structure_name' => 'Section Code',
        ]);
        $sectionName = MetaStructure::create([
            'id' => 3,
            'structure_name' => 'Section Name',
        ]);
        $subdivisionId = MetaStructure::create([
            'id' => 4,
            'structure_name' => 'Subdivision Id',
        ]);
        $subdivisionCode = MetaStructure::create([
            'id' => 5,
            'structure_name' => 'Subdivision Code',
        ]);
        $subdivisionName = MetaStructure::create([
            'id' => 6,
            'structure_name' => 'Subdivision Name',
        ]);
        $divisionId = MetaStructure::create([
            'id' => 7,
            'structure_name' => 'Division Id',
        ]);
        $divisionCode = MetaStructure::create([
            'id' => 8,
            'structure_name' => 'Division Code',
        ]);
        $divisionName = MetaStructure::create([
            'id' => 9,
            'structure_name' => 'Division Name',
        ]);
        $circleId = MetaStructure::create([
            'id' => 10,
            'structure_name' => 'Circle Id',
        ]);
        $circleCode = MetaStructure::create([
            'id' => 11,
            'structure_name' => 'Circle Code',
        ]);
        $circleName = MetaStructure::create([
            'id' => 12,
            'structure_name' => 'Circle Name',
        ]);
        $regionId = MetaStructure::create([
            'id' => 13,
            'structure_name' => 'Region Id',
        ]);
        $regionCode = MetaStructure::create([
            'id' => 14,
            'structure_name' => 'Region Code',
        ]);
        $regionName = MetaStructure::create([
            'id' => 15,
            'structure_name' => 'Region Name',
        ]);
        //create hierarchy datatable

        $request = DataDetailFormRequest::from([
            'name' => 'Distribution Hierarchy',
            'description' => 'This is a test distribution hierarchy',
            'tableName' => 'data_table_distribution_hierarchy',
            'isActive' => true,
            'subjectArea' => 'Distribution',
            'dates' => [
                ['column' => 'data_date', 'fieldName' => 'Data Date'],
            ],
            'dimensions' => [
                ['column' => 'section_id', 'fieldName' => 'Section Id', 'metaStructureId' => $sectionId->id],
                ['column' => 'section_code', 'fieldName' => 'Section Code', 'metaStructureId' => $sectionCode->id],
                ['column' => 'section_name', 'fieldName' => 'Section Name', 'metaStructureId' => $sectionName->id],
                ['column' => 'subdivision_id', 'fieldName' => 'Subdivision Id', 'metaStructureId' => $subdivisionId->id],
                ['column' => 'subdivision_code', 'fieldName' => 'Subdivision Code', 'metaStructureId' => $subdivisionCode->id],
                ['column' => 'subdivision_name', 'fieldName' => 'Subdivision Name', 'metaStructureId' => $subdivisionName->id],
                ['column' => 'division_id', 'fieldName' => 'Division Id', 'metaStructureId' => $divisionId->id],
                ['column' => 'division_code', 'fieldName' => 'Division Code', 'metaStructureId' => $divisionCode->id],
                ['column' => 'division_name', 'fieldName' => 'Division Name', 'metaStructureId' => $divisionName->id],
                ['column' => 'circle_id', 'fieldName' => 'Circle Id', 'metaStructureId' => $circleId->id],
                ['column' => 'circle_code', 'fieldName' => 'Circle Code', 'metaStructureId' => $circleCode->id],
                ['column' => 'circle_name', 'fieldName' => 'Circle Name', 'metaStructureId' => $circleName->id],
                ['column' => 'region_id', 'fieldName' => 'Region Id', 'metaStructureId' => $regionId->id],
                ['column' => 'region_code', 'fieldName' => 'Region Code', 'metaStructureId' => $regionCode->id],
                ['column' => 'region_name', 'fieldName' => 'Region Name', 'metaStructureId' => $regionName->id],
            ],
            'measures' => [],
        ]);

        $setupDataTable = app(SetupDataTable::class);
        $setupDataTable->setup($request);

        $fileContents = Excel::toArray(
            new DataTableImport,
            base_path().'/tests/TestData/data_table_distribution_hierarchy.csv'
        );

        $dataTableItems = [];
        $columnTitles = $fileContents[0][0];
        foreach ($fileContents[0] as $index => $row) {
            if ($index === 0) {
                continue;
            }
            $record = [];
            foreach ($columnTitles as $columnIndex => $columnTitle) {
                $record[$columnTitle] = $row[$columnIndex] ?? null;
            }
            $dataTableItems[] = $record;
        }

        $dataDetail = DataDetail::where('name', 'Distribution Hierarchy')
            ->withCount('dateFields', 'dimensionFields')
            ->with('dateFields', 'dimensionFields', 'measureFields')
            ->first();

        $importToDataTable = app(ImportToDataTable::class);
        $importToDataTable->importToDataTable($dataDetail, $dataTableItems);

        //create subset for distribution hierarchy
        $subset = SubsetDetail::create([
            'name' => 'Distribution Hierarchy',
            'description' => 'This is a test distribution hierarchy',
            'data_detail_id' => $dataDetail->id,
            'group_data' => 0,
        ]);

        foreach ($dataDetail->dateFields as $dateField) {
            SubsetDetailDate::create([
                'subset_detail_id' => $subset->id,
                'field_id' => $dateField->id,
                'subset_column' => $dateField->column,
                'subset_field_name' => $dateField->field_name,
            ]);
        }

        foreach ($dataDetail->dimensionFields as $dimensionField) {
            SubsetDetailDimension::create([
                'subset_detail_id' => $subset->id,
                'field_id' => $dimensionField->id,
                'subset_column' => $dimensionField->column,
                'subset_field_name' => $dimensionField->field_name,
            ]);
        }

    }
}
