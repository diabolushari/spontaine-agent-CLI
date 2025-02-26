<?php

namespace App\Services\MetaData\Hierarchy;

use App\Models\Meta\MetaHierarchyItem;
use Illuminate\Database\Eloquent\Builder;
use InvalidArgumentException;

trait FlattenHierarchyAtLevel
{
    /**
     * @return Builder<MetaHierarchyItem>
     */
    private function flatten(int $hierarchyId, int $level): Builder
    {
        if ($level < 1) {
            throw new InvalidArgumentException('Level must be greater than 0');
        }

        return $this->recursiveJoin($hierarchyId, $level);
    }

    /**
     * @return Builder<MetaHierarchyItem>
     */
    private function recursiveJoin(int $hierarchyId, int $level): Builder
    {

        if ($level === 1) {
            return MetaHierarchyItem::query()
                ->where('meta_hierarchy_id', $hierarchyId)
                ->selectRaw(
                    "meta_hierarchy_items.id as lvl_{$level}_id,"
                    ."meta_hierarchy_items.level as lvl_{$level}_level,"
                    ."meta_hierarchy_items.primary_field_id as lvl_{$level}_primary_field,"
                    ."meta_hierarchy_items.secondary_field_id as lvl_{$level}_secondary_field,"
                    ."meta_hierarchy_items.parent_id as lvl_{$level}_parent_id"
                );
        }

        $prevLvl = $level - 1;
        $subQuery = $this->recursiveJoin($hierarchyId, $prevLvl);

        $prevSelectStatement = '';

        for ($i = $prevLvl; $i >= 1; $i--) {
            $prevSelectStatement = $prevSelectStatement
                ."parent.lvl_{$i}_id,"
                ."parent.lvl_{$i}_level,"
                ."parent.lvl_{$i}_primary_field,"
                ."parent.lvl_{$i}_secondary_field,"
                ."parent.lvl_{$i}_parent_id,";
        }

        return MetaHierarchyItem::query()
            ->where('meta_hierarchy_id', $hierarchyId)
            ->leftJoinSub($subQuery, 'parent', "parent.lvl_{$prevLvl}_id", '=', 'meta_hierarchy_items.parent_id')
            ->where('level', $level)
            ->selectRaw(
                $prevSelectStatement
                ."meta_hierarchy_items.level as lvl_{$level}_level,"
                ."meta_hierarchy_items.parent_id as lvl_{$level}_parent_id,"
                ."meta_hierarchy_items.primary_field_id as lvl_{$level}_primary_field,"
                ."meta_hierarchy_items.secondary_field_id as lvl_{$level}_secondary_field,"
                ."meta_hierarchy_items.id as lvl_{$level}_id"
            );
    }
}
