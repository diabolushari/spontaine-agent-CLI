<?php

namespace App\Models\DataDetail;

use App\Models\DataTable\DataTableDate;
use App\Models\DataTable\DataTableDimension;
use App\Models\DataTable\DataTableMeasure;
use App\Models\SubjectArea\SubjectArea;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataDetail extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'type',
        'subject_area_id',
        'created_by',
        'updated_by',
    ];

    /**
     * @return HasMany<DataTableDate>
     */
    public function dateFields(): HasMany
    {
        return $this->hasMany(DataTableDate::class, 'data_detail_id', 'id');
    }

    /**
     * @return HasMany<DataTableDimension>
     */
    public function dimensionFields(): HasMany
    {
        return $this->hasMany(DataTableDimension::class, 'data_detail_id', 'id');
    }

    /**
     * @return HasMany<DataTableMeasure>
     */
    public function measureFields(): HasMany
    {
        return $this->hasMany(DataTableMeasure::class, 'data_detail_id', 'id');
    }

    /**
     * @return BelongsTo<DataDetail, SubjectArea>
     */
    public function subjectArea(): BelongsTo
    {
        return $this->belongsTo(SubjectArea::class, 'subject_area_id', 'id');
    }
}
