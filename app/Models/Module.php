<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'slug',
        'description',
        'is_active',
        'sort',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function learningActivities()
    {
        return $this->belongsToMany(LearningActivity::class)->withPivot('sort')->orderByPivot('sort');
    }
}
