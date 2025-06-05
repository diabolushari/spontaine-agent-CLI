<?php

namespace App\Http\Controllers\ChartData;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class SubsetDetailListController extends Controller
{
    public function getSubsetsByDataDetail($dataDetailId)
    {
        return DB::table('subset_details')
            ->select('id', 'name', 'description')
            ->where('data_detail_id', $dataDetailId)
            ->get();
    }
}
