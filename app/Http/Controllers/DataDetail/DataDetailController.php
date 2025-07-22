<?php

namespace App\Http\Controllers\DataDetail;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataDetail\DataDetailFormRequest;
use App\Libs\ExceptionMessage;
use App\Models\DataDetail\DataDetail;
use App\Models\DataLoader\DataLoaderJob;
use App\Models\ReferenceData\ReferenceData;
use App\Models\SubjectArea\SubjectArea;
use App\Models\Subset\SubsetDetail;
use App\Services\DataTable\DeleteDataTable;
use App\Services\DataTable\QueryDataTable;
use App\Services\DataTable\SetupDataTable;
use Exception;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DataDetailController extends Controller implements HasMiddleware
{
    /**
     * @return string[]
     */
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function index(Request $request): Response
    {

        $details = DataDetail::when($request->filled('search'), function (Builder $builder) use ($request) {
            $builder->where('name', 'like', '%'.$request->input('search').'%');
        })->when($request->filled('type'), function (Builder $builder) use ($request) {
            $builder->where('subject_area', $request->type);
        })
            ->paginate(20)
            ->withPath(route('data-detail.index'))
            ->withQueryString();

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('DataDetail/DataDetailIndex', [
            'details' => $details,
            'types' => $referenceData,
            'oldValues' => $request->all(),
        ]);
    }

    public function create(): Response
    {

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('DataDetail/DataDetailCreate', [
            'types' => $referenceData,
        ]);
    }

    public function edit(DataDetail $dataDetail): Response
    {

        $subjectAreas = SubjectArea::select(['id', 'name'])
            ->get();

        $referenceData = ReferenceData::fullData()
            ->where('domain', 'Data Detail')
            ->where('parameter', 'Type')
            ->get();

        return Inertia::render('DataDetail/DataDetailEdit', [
            'subjectAreas' => $subjectAreas,
            'types' => $referenceData,
            'dataDetail' => $dataDetail,
        ]);
    }

    public function store(
        DataDetailFormRequest $request,
        SetupDataTable $setupDataTable
    ): RedirectResponse {

        try {
            $result = $setupDataTable->setup($request);
        } catch (Exception $e) {

            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        if ($result->error) {

            return back()->with([
                'error' => $result->message,
            ]);
        }

        return redirect()
            ->route('data-detail.show', $result->message);
    }

    public function update(
        DataDetail $dataDetail,
        DataDetailFormRequest $request
    ): RedirectResponse {
        try {
            $dataDetail->update([
                ...$request->all(),
                'updated_by' => Auth::user()?->id,
            ]);
        } catch (Exception $e) {
            return back()->with([
                'error' => ExceptionMessage::getMessage($e),
            ]);
        }

        return redirect()
            ->route('data-detail.show', $dataDetail->id);
    }

    public function show(DataDetail $dataDetail, QueryDataTable $queryDataTable, Request $request): RedirectResponse|Response
    {

        $dataDetail->load(
            'dateFields',
            'dimensionFields.structure',
            'measureFields',
            'relationFields.relatedTable',
            'textFields'
        );

        $query = $queryDataTable->query($dataDetail);
        $this->applyFilters($query, $request, $dataDetail);

        $dataTable = $query->paginate(50)
            ->withPath(route('data-detail.show', $dataDetail->id))
            ->withQueryString();

        $jobs = DataLoaderJob::where('data_detail_id', $dataDetail->id)
            ->with('lastStatus', 'loaderQuery', 'latest')
            ->get();

        return Inertia::render('DataDetail/DataDetailShow', [
            'detail' => $dataDetail,
            'dataTableItems' => $dataTable,
            'jobs' => $jobs,
            'tab' => $request->input('tab', 'data'),
            'subsets' => SubsetDetail::where('data_detail_id', $dataDetail->id)->get(),
            'filters' => request()->all(),
        ]);
    }

    /**
     * Applies filters to the query based on request params.
     */
    protected function applyFilters(
        \Illuminate\Database\Query\Builder $query,
        Request $request,
        DataDetail $dataDetail
    ): void {
        // Get all valid fields (mirroring useAvailableFiltersFromDataDetail in frontend)
        $validDimensions = $dataDetail->dimensionFields->pluck('column')->toArray();
        $validDates = $dataDetail->dateFields->pluck('column')->toArray();
        $validMeasures = $dataDetail->measureFields->pluck('column')->toArray();

        // Loop over all query params (flat, like 'section_code_in' => 'val1,val2')
        foreach ($request->query() as $key => $value) {
            $value = trim((string) $value);
            if (empty($value)) {
                continue;
            }

            // Parse key into field and operator suffix (e.g., 'section_code_in' -> field='section_code', op='_in')
            preg_match('/^([a-zA-Z0-9_]+)(_[a-z]+)?$/', $key, $matches);
            if (count($matches) < 2) {
                continue; // Invalid key format
            }

            $field = $matches[1];
            $operatorSuffix = $matches[2] ?? ''; // Default to '' (implies '=')

            // Determine if it's a dimension (joined) or raw column
            $isDimension = in_array($field, $validDimensions);
            $column = $isDimension ? "{$field}_record.name" : "{$dataDetail->table_name}.{$field}";

            // Validate field existence (skip invalid)
            if (
                ! in_array($field, $validDimensions) &&
                ! in_array($field, $validDates) &&
                ! in_array($field, $validMeasures)
            ) {
                continue;
            }

            // Handle operators based on suffix
            switch ($operatorSuffix) {
                case '': // Exact match (=)
                    $query->where($column, '=', $value);
                    break;
                case '_not': // Not equal (!=)
                    $query->where($column, '!=', $value);
                    break;
                case '_in': // IN (split comma-separated)
                    $values = explode(',', $value);
                    $query->whereIn($column, $values);
                    break;
                case '_not_in': // NOT IN
                    $values = explode(',', $value);
                    $query->whereNotIn($column, $values);
                    break;
                case '_gt': // >
                    $query->where($column, '>', $value);
                    break;
                case '_gte': // >=
                    $query->where($column, '>=', $value);
                    break;
                case '_lt': // <
                    $query->where($column, '<', $value);
                    break;
                case '_lte': // <=
                    $query->where($column, '<=', $value);
                    break;
                case '_like': // LIKE %value%
                    $query->where($column, 'LIKE', '%'.$value.'%');
                    break;
                default:
                    break;
            }
        }
    }

    public function destroy(DataDetail $dataDetail, DeleteDataTable $deleteDataTable): RedirectResponse
    {
        try {
            $deleteDataTable->delete($dataDetail);
        } catch (Exception $exception) {

            return back()->with([
                'error' => ExceptionMessage::getMessage($exception),
            ]);
        }

        return redirect()
            ->route('data-detail.index')
            ->with([
                'message' => "Data Detail $dataDetail->name deleted successfully.",
            ]);
    }
}
