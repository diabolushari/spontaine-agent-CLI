<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Models\Blocks\Block;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigGeneralUpdateRequest;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigRankingUpdateRequest;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class BlocksConfigRankingUpdateController extends Controller
{

    public function __invoke(Request $request, $id): RedirectResponse
    {
        $block = Block::findOrFail($id);

        $blockData = $block->data ?? [];
        $blockData['title'] = $request->title;
        $blockData['description'] = $request->description;
        $blockData['data_table_id'] = $request->data_table_id; 
        $blockData['subset_group_id'] = $request->subset_group_id; 
        $blockData['ranking'] = $request->ranking;
        $blockData['trend'] = $request->trend;
        $blockData['default_date'] = '202501';

        $block->data = $blockData;

        $block->save();

        return redirect()->back()->with('message', 'Block updated successfully!');
    }
}
