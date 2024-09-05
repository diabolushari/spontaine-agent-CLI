<?php

namespace App\Models\DataTable;

use App\Models\Meta\MetaStructure;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class DataTableDimension extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'data_detail_id', 'data_table_field', 'field_name', 'meta_structure_id', 'created_by', 'updated_by',
    ];

    /**
     * @return HasOne<MetaStructure>
     */
    public function structure(): HasOne
    {
        return $this->hasOne(MetaStructure::class, 'id', 'meta_structure_id');
    }
}
