<?php

use Illuminate\Support\Facades\Route;

use Inertia\Inertia;

Route::get('/', function () {
    $module = \App\Models\Module::where('is_active', true)->orderBy('sort')->first() ?? \App\Models\Module::where('is_active', true)->first();

    if ($module) {
        return redirect()->route('modules.show', $module);
    }

    return Inertia::render('Home', [
        'modules' => [], // Empty state
    ]);
})->name('home');

Route::get('/modules/{module:slug}', function (\App\Models\Module $module) {
    $module->load('learningActivities');

    $firstActivity = $module->learningActivities->first();

    if (! $firstActivity) {
        return redirect()->route('home');
    }

    $activities = $module->learningActivities;
    $currentIndex = $activities->search(function ($item) use ($firstActivity) {
        return $item->id === $firstActivity->id;
    });

    \Illuminate\Support\Facades\Log::info('Activity Navigation', [
        'module' => $module->slug,
        'current_activity_id' => $firstActivity->id,
        'current_index' => $currentIndex,
        'total_activities' => $activities->count(),
    ]);

    $prev = $currentIndex > 0 ? $activities[$currentIndex - 1] : null;
    $next = $currentIndex !== false && $currentIndex < $activities->count() - 1 ? $activities[$currentIndex + 1] : null;

    if ($next) {
        \Illuminate\Support\Facades\Log::info('Next Activity Found', ['next_id' => $next->id]);
    } else {
        \Illuminate\Support\Facades\Log::info('No Next Activity');
    }

    // If no next activity in current module, check for next module
    $nextModule = null;
    if (! $next) {
        $nextModule = \App\Models\Module::where('is_active', true)
            ->where('id', '!=', $module->id)
            ->where(function ($query) use ($module) {
                $query->where('sort', '>', $module->sort ?? 0)
                      ->orWhere(function ($q) use ($module) {
                          $q->where('sort', '=', $module->sort ?? 0)
                            ->where('id', '>', $module->id);
                      });
            })
            ->orderBy('sort')
            ->orderBy('id')
            ->first();
            
        if ($nextModule) {
            \Illuminate\Support\Facades\Log::info('Next Module Found', ['module' => $nextModule->slug]);
        }
    }

    // If no prev activity in current module, check for prev module
    $prevModule = null;
    if (! $prev) {
        $prevModule = \App\Models\Module::where('is_active', true)
            ->where('id', '!=', $module->id)
            ->where(function ($query) use ($module) {
                $query->where('sort', '<', $module->sort ?? 0)
                      ->orWhere(function ($q) use ($module) {
                          $q->where('sort', '=', $module->sort ?? 0)
                            ->where('id', '<', $module->id);
                      });
            })
            ->orderByDesc('sort')
            ->orderByDesc('id')
            ->first();

        if ($prevModule) {
            \Illuminate\Support\Facades\Log::info('Prev Module Found', ['module' => $prevModule->slug]);
        } else {
             \Illuminate\Support\Facades\Log::info('No Prev Module Found', [
                'current_sort' => $module->sort ?? 0,
                'current_id' => $module->id
            ]);
        }
    }

    return Inertia::render('Module/Show', [
        'module' => $module,
        'activity' => $firstActivity,
        'prev_activity' => null,
        'next_activity' => $next,
        'next_module' => $nextModule,
        'prev_module' => $prevModule,
    ]);
})->name('modules.show');

Route::get('/learning-activities/{learningActivity}/preview', function (\App\Models\LearningActivity $learningActivity) {
    return Inertia::render('Preview', [
        'activity' => $learningActivity,
    ]);
})->name('learning-activities.preview')->middleware('auth');
