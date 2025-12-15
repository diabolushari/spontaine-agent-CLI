<?php

namespace App\Http\Controllers\WidgetsEditor;

use App\Http\Controllers\Controller;
use App\Models\WidgetEditor\WidgetCollection;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WidgetCollectionSearchController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $query = WidgetCollection::query()
            ->when($request->filled('search'), function (Builder $builder) use ($request) {
                $searchTerm = strtolower($request->input('search'));

                $builder->where(function ($q) use ($searchTerm) {
                    $q->whereRaw('LOWER(name) LIKE ?', ["%{$searchTerm}%"])
                        ->orWhereRaw('LOWER(description) LIKE ?', ["%{$searchTerm}%"]);
                });
            })
            ->orderBy('updated_at', 'desc');

        $collections = $query
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        return response()->json($collections);
    }
}
