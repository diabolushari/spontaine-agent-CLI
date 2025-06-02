<?php

namespace App\Models\PageBuilder;

use App\Models\Blocks\Blocks;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property \Illuminate\Database\Eloquent\Collection|\App\Models\Blocks\Blocks[] $blocks
 */
class PageBuilder extends Model
{
    use HasFactory;


    protected $table = 'pages';

    protected $fillable = [
        'title',
        'url',
        'description',
        'published_at',
    ];

    protected $dates = [
        'published_at',
    ];
    public function blocks()
    {
        return $this->hasMany(Blocks::class, 'page_id');
    }
}
