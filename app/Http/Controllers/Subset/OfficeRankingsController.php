<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\SubsetGroup\SubsetGroup;
use Illuminate\Routing\Controllers\HasMiddleware;

class OfficeRankingsController extends Controller implements HasMiddleware
{
    public function __invoke(SubsetGroup $subsetGroup)
    {
        return $subsetGroup;
    }
}
