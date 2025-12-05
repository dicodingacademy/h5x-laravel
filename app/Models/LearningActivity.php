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
        'minimum_score',
        'show_wrong_answer',
        'is_active',
    ];

    protected $casts = [
        'content' => 'array',
        'is_active' => 'boolean',
        'minimum_score' => 'integer',
        'show_wrong_answer' => 'boolean',
    ];
    public function modules()
    {
        return $this->belongsToMany(Module::class)->withPivot('sort');
    }
}
