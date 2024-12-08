<?php

use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Services\DistributionHierarchyFactory;

use function Pest\Laravel\actingAs;
use function PHPUnit\Framework\assertCount;

uses(RefreshDatabase::class);

test('subset column search: the api is accessible', function () {
    $factory = app(DistributionHierarchyFactory::class);
    $factory->create();

    $user = User::factory()->create();

    $subset = SubsetDetail::where('name', 'Distribution Hierarchy')
        ->first();

    $response = actingAs($user)->get(route('subset.column.search', $subset->id));

    $response->assertOk();

});

test('subset column search: the api returns empty array when no column field is given', function () {
    $factory = app(DistributionHierarchyFactory::class);
    $factory->create();

    $user = User::factory()->create();

    $subset = SubsetDetail::where('name', 'Distribution Hierarchy')
        ->first();

    $response = actingAs($user)->get(route('subset.column.search', [
        'subsetDetail' => $subset->id,
    ]));

    $responseData = json_decode($response->getContent(), true);

    $response->assertOk();
    $response->assertExactJson([]);
});

test('subset column search: search for sections with letter t', function () {
    $factory = app(DistributionHierarchyFactory::class);
    $factory->create();

    $user = User::factory()->create();

    $subset = SubsetDetail::where('name', 'Distribution Hierarchy')
        ->first();

    $response = actingAs($user)->get(route('subset.column.search', [
        'subsetDetail' => $subset->id,
        'column' => 'section_name',
        'search' => 't',
    ]));

    $responseData = json_decode($response->getContent(), true);

    assertCount(10, $responseData);
    $response->assertOk();
});

test('subset column search: search for particular section to make sure returned data is not duplicated', function () {
    $factory = app(DistributionHierarchyFactory::class);
    $factory->create();

    $user = User::factory()->create();

    $subset = SubsetDetail::where('name', 'Distribution Hierarchy')
        ->first();

    $response = actingAs($user)->get(route('subset.column.search', [
        'subsetDetail' => $subset->id,
        'column' => 'section_name',
        'search' => 'Beach Trivandrum',
    ]));

    $responseData = json_decode($response->getContent(), true);

    $response->assertOk();
    assertCount(1, $responseData);

    expect($responseData[0]['value'])->toBe('Beach Trivandrum');

});

test('subset column search: search for sections with same word in it', function () {
    $factory = app(DistributionHierarchyFactory::class);
    $factory->create();

    $user = User::factory()->create();

    $subset = SubsetDetail::where('name', 'Distribution Hierarchy')
        ->first();

    $response = actingAs($user)->get(route('subset.column.search', [
        'subsetDetail' => $subset->id,
        'column' => 'section_name',
        'search' => 'Beach',
    ]));

    $responseData = json_decode($response->getContent(), true);

    $response->assertOk();
    assertCount(4, $responseData);

});

test('subset column search: search works on subsets using expression', function () {
    $factory = app(DistributionHierarchyFactory::class);
    $factory->create();

    //create a subset with section_name's first and last character as section_name_code
    $dataDetail = DataDetail::where('name', 'Distribution Hierarchy')
        ->withCount('dateFields', 'dimensionFields')
        ->with('dateFields', 'dimensionFields', 'measureFields')
        ->first();

    $subset = SubsetDetail::create([
        'name' => 'Section Codes',
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
        if ($dimensionField->column === 'section_name') {
            SubsetDetailDimension::create([
                'subset_detail_id' => $subset->id,
                'field_id' => $dimensionField->id,
                'subset_column' => $dimensionField->column,
                'subset_field_name' => $dimensionField->field_name,
                'column_expression' => 'CONCAT(SUBSTRING(`section_name_record`.`name`, 1, 1), SUBSTRING(`section_name_record`.`name`, -1))',
            ]);
        }
    }

    $user = User::factory()->create();

    $response = actingAs($user)->get(route('subset.column.search', [
        'subsetDetail' => $subset->id,
        'column' => 'section_name',
        'search' => 'Tm',
    ]));

    $responseData = json_decode($response->getContent(), true);

    $response->assertOk();
    assertCount(1, $responseData);

});
