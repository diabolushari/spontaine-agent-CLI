<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Http\Requests\Subset\SubsetFormRequest;
use App\Models\Subset\SubsetDetail;
use App\Models\Subset\SubsetDetailDate;
use App\Models\Subset\SubsetDetailDimension;
use App\Models\Subset\SubsetDetailMeasure;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Support\Facades\DB;
use Throwable;

class SubsetUpdateController extends Controller implements HasMiddleware
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

    /**
     * @throws Throwable
     */
    public function __invoke(
        SubsetDetail $subsetDetail,
        SubsetFormRequest $request
    ): RedirectResponse {
        DB::transaction(function () use ($subsetDetail, $request) {

            $subsetDetail->update(
                $request->except('dates', 'dimensions', 'measures')->toArray()
            );

            $subsetDetail->dates()->delete();
            $subsetDetail->dimensions()->delete();
            $subsetDetail->measures()->delete();

            $user = request()->user()?->id;

            $dates = array_map(function ($date) use ($subsetDetail, $user) {
                return [
                    'subset_detail_id' => $subsetDetail->id,
                    'created_by' => $user,
                    'updated_by' => $user,
                    ...$date->toArray(),
                ];
            }, $request->dates ?? []);

            $dimensions = array_map(function ($dimension) use ($subsetDetail, $user) {
                return [
                    'subset_detail_id' => $subsetDetail->id,
                    'created_by' => $user,
                    'updated_by' => $user,
                    ...$dimension->toArray(),
                ];
            }, $request->dimensions ?? []);

            $measures = array_map(function ($measure) use ($subsetDetail, $user) {
                return [
                    'subset_detail_id' => $subsetDetail->id,
                    'created_by' => $user,
                    'updated_by' => $user,
                    ...$measure->toArray(),
                ];
            }, $request->measures ?? []);

            if (! empty($dates)) {
                SubsetDetailDate::insert($dates);
            }
            if (! empty($measures)) {
                SubsetDetailMeasure::insert($measures);
            }
            if (! empty($dimensions)) {
                foreach ($dimensions as $dimension) {
                    SubsetDetailDimension::create($dimension);
                }
            }
        });

        return redirect()
            ->route('subset.preview', $subsetDetail->id)
            ->with([
                'message' => 'Subset updated successfully',
            ]);
    }
}
