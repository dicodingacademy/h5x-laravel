<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
});

Route::get('/learning-activities/{learningActivity}/preview', function (\App\Models\LearningActivity $learningActivity) {
    return Inertia::render('Preview', [
        'activity' => $learningActivity,
    ]);
})->name('learning-activities.preview');
