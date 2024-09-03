<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataDetail\DataTableFieldRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\Meta\MetaStructure;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DataTableFieldsInfoController extends Controller
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

    public function create(Request $request): Response
    {
        $detail = DataDetail::findOrFail($request->detail_id);

        $structures = MetaStructure::select(['id', 'structure_name'])->get();

        return Inertia::render('DataTableFieldInfo/InitDataTableInfoPage', [
            'detail' => $detail,
            'structures' => $structures,
        ]);
    }

    public function store(DataTableFieldRequest $request): RedirectResponse
    {
        $createdBy = request()->user()->id;

        $dates = $request->dates;
        foreach ($dates as &$data) {
            $data['data_detail_id'] = $request->detailId;
            $data['updated_by'] = $createdBy;
            $data['created_by'] = $createdBy;
        }

        $dimensions = $request->dimensions;
        foreach ($dimensions as &$date) {
            $date['data_detail_id'] = $request->detailId;
            $date['updated_by'] = $createdBy;
            $date['created_by'] = $createdBy;
        }

        $measures = $request->measures;

        foreach ($measures as &$data) {
            $data['data_detail_id'] = $request->detailId;
            $data['updated_by'] = $createdBy;
            $data['created_by'] = $createdBy;
        }

        try {
            DataTableDate::insert($dates);
            DataTableDimension::insert($dimensions);
            DataTableMeasure::insert($measures);
        } catch (Exception $e) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()->route('data-detail.show', $request->detailId)
            ->with([
                'message' => 'Data Table Fields Info has been created successfully',
            ]);

    }
}
