<?php

namespace App\Models\Meta;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MetaHierarchyItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'meta_hierarchy_id',
        'parent_id',
        'meta_data_id',
        'level',
    ];

    /**
     * @return BelongsTo<MetaHierarchy, MetaHierarchyItem>
     */
    public function metaHierarchy(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchy::class, 'meta_hierarchy_id', 'id');
    }

    /**
     * @return BelongsTo<MetaHierarchyItem, MetaHierarchyItem>
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(MetaHierarchyItem::class, 'parent_id', 'id');
    }

    /**
     * @return BelongsTo<MetaData, MetaHierarchyItem>
     */
    public function metaData(): BelongsTo
    {
        return $this->belongsTo(MetaData::class, 'meta_data_id', 'id');
    }

    /**
     * @param  Builder<MetaHierarchyItem>  $builder
     * @return Builder<MetaHierarchyItem>
     */
    public function scopeJoinMetaData(Builder $builder): Builder
    {
        return $builder->join('meta_data', 'meta_data.id', '=', 'meta_hierarchy_items.meta_data_id')
            ->join('meta_structures', 'meta_structures.id', '=', 'meta_data.meta_structure_id');
    }
}
