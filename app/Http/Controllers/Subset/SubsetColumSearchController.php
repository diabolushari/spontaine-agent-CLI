<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\Subset\SubsetDetail;
use App\Services\Subset\SubsetGroupedByColumn;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;

class SubsetColumSearchController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(SubsetDetail $subsetDetail, SubsetGroupedByColumn $groupedByColumn, Request $request): JsonResponse
    {

        $subsetDetail->load('measures.info', 'dates.info', 'dimensions.info', 'measures.weightInfo');

        if (! $request->filled('column')) {
            return response()
                ->json();
        }

        $data = $groupedByColumn->getQuery(
            $subsetDetail,
            $request->input('column'),
        )->get();

        return response()
            ->json($data);
    }
}
