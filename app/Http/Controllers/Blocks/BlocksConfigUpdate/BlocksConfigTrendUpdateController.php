<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigTrendUpdateRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlocksConfigTrendUpdateController extends Controller
{

    public function __invoke(BlocksConfigTrendUpdateRequest $request, $id): RedirectResponse
    {
        
        return redirect()->back();
    }
}
