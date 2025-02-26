<?php

namespace App\Services\MetaData\Hierarchy;

use App\Models\DataDetail\DataDetail;
use App\Models\Meta\MetaHierarchy;
use App\Models\Meta\MetaHierarchyItem;
use App\Models\Subset\SubsetDetailDimension;
use Illuminate\Database\Query\Builder;

trait HierarchySubQuery
{
    /**
     * @param  string[]  $groupingColumns[]
     * @param  string[]  $selectColumns[]
     */
    private function addHierarchyToQuery(
        MetaHierarchy $hierarchy,
        Builder $query,
        SubsetDetailDimension $dimension,
        DataDetail $detail,
        int $groupData,
        array &$groupingColumns,
        array &$selectColumns
    ): void {
        $hierarchySubQuery = MetaHierarchyItem::query()
            ->where('meta_hierarchy_id', $hierarchy->id)
            ->leftJoin(
                'meta_data as primary_field_record',
                'meta_hierarchy_items.primary_field_id',
                '=',
                'primary_field_record.id'
            )
            ->leftJoin(
                'meta_data as secondary_field_record',
                'meta_hierarchy_items.secondary_field_id',
                '=',
                'secondary_field_record.id'
            )
            ->groupByRaw(
                '`primary_field_id`, `primary_field_record`.`name`, `secondary_field_record`.`name`'
            )
            ->selectRaw(
                '`primary_field_id` as primary_field_id, '.
                '`primary_field_record`.`name` as '.$hierarchy->primary_column.','.
                '`secondary_field_record`.`name` as '.$hierarchy->secondary_column
            );

        $query->leftJoinSub($hierarchySubQuery, 'hierarchy', function ($join) use ($detail, $dimension) {
            $join->on(
                "$detail->table_name.$dimension->subset_column",
                '=',
                'hierarchy.primary_field_id'
            );
        });

        if ($dimension->subset_column != $hierarchy->primary_column) {
            $selectColumns[] = "hierarchy.$hierarchy->primary_column as $hierarchy->primary_column";
            if ($groupData == 1) {
                $groupingColumns[] = "hierarchy.$hierarchy->primary_column";
            }
        }

        if ($hierarchy->secondary_column != null) {
            $selectColumns[] = "hierarchy.$hierarchy->secondary_column as $hierarchy->secondary_column";
            if ($groupData == 1) {
                $groupingColumns[] = "hierarchy.$hierarchy->secondary_column";
            }
        }
    }
}
