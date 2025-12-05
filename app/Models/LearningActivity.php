<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LearningActivity extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'type',
        'content',
        'is_active',
    ];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
    ];
    //
}
