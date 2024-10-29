<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use App\Services\DistributionHierarchy\DistributionHierarchy;
use App\Services\TableNames;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;

class SubsetDropdownApiController extends Controller implements HasMiddleware
{
    public static function middleware(): array
    {
        return [
            'auth',
        ];
    }

    public function __invoke(Request $request, DistributionHierarchy $findDistributionLevel, QueryDataTable $queryDataTable): JsonResponse
    {
        $levelInfo = $findDistributionLevel->findAllSection(Auth::user()->office_code);

        if ($levelInfo == null) {
            return response()
                ->json([
                    'level' => null,
                    'record' => null,
                ]);
        }

        $dataDetail = DataDetail::where('name', TableNames::DISTRIBUTION_HIERARCHY)
            ->with('dateFields', 'dimensionFields.structure', 'measureFields', 'subjectArea')
            ->first();

        if ($dataDetail === null || ! Schema::hasTable($dataDetail->table_name)) {
            return response()
                ->json([
                    'level' => null,
                    'record' => null,
                ]);
        }

        $record = $queryDataTable->query($dataDetail)
            ->where($levelInfo['levelField'], Auth::user()->office_code)
            ->first();

        return response()
            ->json([
                'level' => $levelInfo['level'],
                'record' => $record,
            ]);

    }
}
