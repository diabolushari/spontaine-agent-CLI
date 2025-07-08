<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigOverviewTableRequest;
use App\Models\Blocks\Block;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlocksConfigOverviewTableUpdateController extends Controller
{

    public function __invoke(Request $request, $id): RedirectResponse
    {
        dd($request->all());
        return redirect()->back()->with('message', 'Block configuration updated.');
    }
}
