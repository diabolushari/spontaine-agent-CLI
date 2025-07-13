<?php

namespace App\Http\Controllers\Blocks\BlocksConfigUpdate;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blocks\BlocksConfigUpdate\BlocksConfigGeneralUpdateRequest;
use App\Models\Blocks\Block;
use App\Models\DataDetail\DataDetail;
use App\Services\DataTable\QueryDataTable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Request;

class BlocksConfigGeneralUpdateController extends Controller
{

    public function __invoke(BlocksConfigGeneralUpdateRequest $request, $id): RedirectResponse
    {
        $dataDetail = DataDetail::findOrFail($request->dataTableId);
        $queryDataTable = new QueryDataTable();
        $builder = $queryDataTable->query($dataDetail);

        try {
            $latest = $builder
                ->select('month_year_record.name as month_year')
                ->orderBy('month_year_record.name', 'desc')
                ->value('month_year');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors([
                'data_table_id' => 'Date field not exist in the current table. Please choose another data table for the date field.',
            ]);
        }

        $block = Block::findOrFail($id);
        $existingData = $block->data ?? [];

        // Check for subset group change
        $subsetGroupChanged = isset($existingData['subset_group_id']) &&
            $existingData['subset_group_id'] != $request->subsetGroupId;

        // Prepare updated data
        $updatedData = $existingData;

        // Always update these fields
        $updatedData['title'] = $request->title;
        $updatedData['description'] = $request->description;
        $updatedData['data_table_id'] = $request->dataTableId;
        $updatedData['subset_group_id'] = $request->subsetGroupId;
        $updatedData['default_view'] = $request->defaultView;
        $updatedData['trend_selected'] = $request->trendSelected;
        $updatedData['ranking_selected'] = $request->rankingSelected;
        $updatedData['overview_selected'] = $request->overviewSelected;

        $overviewArray = is_array($request->overview) ? $request->overview : $request->overview->toArray();

        if (!empty($existingData['overview']) && !empty($overviewArray)) {
            if (
                isset($existingData['overview']['card_type']) &&
                $existingData['overview']['card_type'] !== ($overviewArray['card_type'] ?? null)
            ) {
                $updatedData['overview'] = $overviewArray;
            } else {
                // Only update the title
                $updatedData['overview']['title'] = $overviewArray['title'] ?? '';
            }
        } else {
            $updatedData['overview'] = $overviewArray;
        }


        // === TREND ===
        if ($subsetGroupChanged && isset($updatedData['trend'])) {
            unset($updatedData['trend']);
        }

        // === RANKING ===
        if ($subsetGroupChanged && isset($updatedData['ranking'])) {
            unset($updatedData['ranking']);
        }

        // Save updated block data
        $block->data = $updatedData;
        $block->save();

        return redirect()->back();
    }
}
