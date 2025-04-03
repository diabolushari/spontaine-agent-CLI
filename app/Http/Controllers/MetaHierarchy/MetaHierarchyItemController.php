<?php

declare(strict_types=1);

namespace App\Http\Controllers\MetaHierarchy;

use App\Http\Controllers\Controller;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class MetaHierarchyItemController extends Controller
{
    /**
     * Get all hierarchy items for a given meta hierarchy.
     */
    public function __invoke(Request $request, MetaHierarchy $metaHierarchy): JsonResponse
    {
        $items = MetaHierarchyItem::query()
            ->where('meta_hierarchy_items.meta_hierarchy_id', $metaHierarchy->id)
            ->select([
                'meta_hierarchy_items.id',
                'meta_hierarchy_items.parent_id',
                'meta_hierarchy_items.level',
                'primary_meta_data.name as '.$metaHierarchy->primary_column,
                'secondary_meta_data.name as '.$metaHierarchy->secondary_column,
                'meta_hierarchy_level_infos.name as level_name',
            ])
            ->leftJoin('meta_data as primary_meta_data', 'meta_hierarchy_items.primary_field_id', '=', 'primary_meta_data.id')
            ->leftJoin('meta_data as secondary_meta_data', 'meta_hierarchy_items.secondary_field_id', '=', 'secondary_meta_data.id')
            ->leftJoin('meta_hierarchy_level_infos', function ($join) use ($metaHierarchy) {
                $join->on('meta_hierarchy_items.level', '=', 'meta_hierarchy_level_infos.level')
                    ->where('meta_hierarchy_level_infos.meta_hierarchy_id', '=', $metaHierarchy->id);
            })
            ->get();

        return response()->json($items);
    }
}
