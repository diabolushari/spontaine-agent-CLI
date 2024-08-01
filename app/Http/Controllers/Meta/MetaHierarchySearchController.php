<?php

namespace App\Http\Controllers\Meta;

use App\Http\Controllers\Controller;
use App\Http\Requests\Meta\MetaDataSearchRequest;
use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\JsonResponse;

class MetaHierarchySearchController extends Controller
{
    public static function middleware(): array
    {
        return ['auth'];
    }

    public function __invoke(MetaDataSearchRequest $request): JsonResponse
    {
        if ($request->search == null) {
            return response()
                ->json();
        }

        $hierarchy = MetaHierarchyItem::joinMetaData()
            ->when($request->hierarchy != null, fn (Builder $query) => $query->where('meta_hierarchy_items.id', $request->hierarchy))
            ->where('meta_data.name', 'like', "%$request->search%")
            ->select(['meta_hierarchy_items.id', 'meta_data.name as name', 'meta_data.id as meta_data_id', 'meta_structures.structure_name'])
            ->limit(10)
            ->get();

        return response()
            ->json($hierarchy);
    }
}
