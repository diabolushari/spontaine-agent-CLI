<?php

namespace App\Http\Controllers\ChartData;

use App\Models\DataDetail\DataDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\Controller;
use App\Services\DataTable\QueryDataTable;

class DataDetailDateController extends Controller
{
    public function __invoke(Request $request, int $dataDetailId)
    {
        $dataDetail = DataDetail::with('dateFields')->findOrFail($dataDetailId);
        $queryDataTable = new QueryDataTable();

        // Build the query using the dataDetail model
        $query = $queryDataTable->query($dataDetail);

        // Get the result
        $result = $query->paginate(10);

        return Response::json($result);
    }
}
