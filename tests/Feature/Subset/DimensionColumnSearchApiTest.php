<?php

use App\Models\Subset\SubsetDetail;
use App\Models\User;
use Tests\Services\DistributionHierarchyFactory;

use function Pest\Laravel\actingAs;

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

test('subset column search: search for sections staring with letter t', function () {
    $factory = app(DistributionHierarchyFactory::class);
    $factory->create();

    $user = User::factory()->create();

    $subset = SubsetDetail::where('name', 'Distribution Hierarchy')
        ->first();

    $response = actingAs($user)->get(route('subset.column.search', [
        'subsetDetail' => $subset->id,
        'column' => 'section_name',
    ]));

    $responseData = json_decode($response->getContent(), true);

    $response->assertOk();
});
