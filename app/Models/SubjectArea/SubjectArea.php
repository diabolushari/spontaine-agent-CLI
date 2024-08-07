<?php

namespace App\Models\SubjectArea;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class SubjectArea extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'table_name',
        'is_active',
        'created_by',
        'updated_by',
        'deleted_at',
    ];
}
