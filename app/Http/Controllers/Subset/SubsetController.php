<?php

namespace App\Http\Controllers\Subset;

use App\Http\Controllers\Controller;
use App\Models\DataDetail\DataDetail;
use App\Models\Subset\SubsetDetail;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Inertia\Inertia;
use Inertia\Response;

class SubsetController extends Controller implements HasMiddleware
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

    public function __invoke(Request $request): Response
    {

        $subsets = SubsetDetail::whereHas('dataDetail')
            ->when($request->filled('search'), function ($query) use ($request) {
                $query->where('name', 'like', '%'.$request->search.'%');
            })
            ->when($request->filled('type'), function ($query) use ($request) {
                $query->whereHas('dataDetail', function ($query) use ($request) {
                    $query->where('id', $request->type);
                });
            })
            ->when(
                $request->filled('used_for_training_ai') && $request->used_for_training_ai !== 'true',
                function ($query) {
                    $query->where('use_for_training_ai', 0);
                }
            )
            ->when(
                $request->filled('used_for_training_ai') && $request->used_for_training_ai === 'true',
                function ($query) {
                    $query->where('use_for_training_ai', 1);
                }
            )
            ->with('dataDetail:id,name')
            ->paginate(20)
            ->withPath(route('subsets'))
            ->withQueryString();

        $dataDetails = DataDetail::select('id', 'name')
            ->get();

        return Inertia::render('Subset/SubsetIndexPage', [
            'subsets' => $subsets,
            'dataDetails' => $dataDetails,
            'oldType' => $request->type ?? '',
            'oldSearch' => $request->search ?? '',
            'oldUsedForTrainingAI' => $request->used_for_training_ai ?? '',
        ]);

    }
}
