<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\GetSubsetData;
use App\Services\Subset\SubsetFindMaxValue;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubsetDataController extends Controller
{
    public function __invoke(
        SubsetDetail $subsetDetail,
        GetSubsetData $getSubsetData,
        SubsetFindMaxValue $findMaxValue,
        Request $request,
    ): JsonResponse {

        $filters = $request->all();
        $latestValue = null;
        if ($request->filled('latest')) {
            $maxValue = $findMaxValue->findMaxValue($subsetDetail, $request->input('latest'));
            if ($maxValue != null && $maxValue->max_value != null) {
                $filters[$request->input('latest')] = $maxValue->max_value;
                $latestValue = $maxValue->max_value;
            }
        }

        $query = $getSubsetData
            ->setFilters($filters)
            ->withSummary(false)
            ->excludeNonMeasurements(false)
            ->withSubsetDetail($subsetDetail->id)
            ->getQuery();

        return response()->json([
            'data' => $query?->get(),
            'latest_value' => $latestValue,
        ]);
    }
}
