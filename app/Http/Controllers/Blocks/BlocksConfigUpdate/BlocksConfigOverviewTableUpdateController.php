<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Models\Blocks\Block;
use Illuminate\Http\Request;

class BlocksConfigOverviewTableUpdateController extends Controller
{

    public function __invoke(Request $request, $id)
    {
        $block = Block::findOrFail($id);
        $blockData = $block->data ?? [];
        $existingTables = $blockData['overview']['overview_table'] ?? [];
        $existingTables[] = $request->overview_table;
        $blockData['overview']['overview_table'] = $existingTables;
        $block->data = $blockData;

        $block->save();

        return redirect()->back();
    }
}
