<?php

namespace Tests\Feature;

use App\Models\LearningActivity;
use App\Models\Module;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModuleNavigationTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_navigate_to_next_module()
    {
        dump(\Illuminate\Support\Facades\Schema::getColumnListing('modules'));

        $module1 = Module::factory()->create([
            'title' => 'Module 1',
            'slug' => 'module-1',
            'sort' => 1,
            'is_active' => true,
        ]);

        $module2 = Module::factory()->create([
            'title' => 'Module 2',
            'slug' => 'module-2',
            'sort' => 2,
            'is_active' => true,
        ]);

        $activity1 = LearningActivity::create([
            'title' => 'Activity 1',
            'slug' => 'activity-1',
            'type' => 'multiple_choices',
            'content' => ['questions' => []],
            'is_active' => true,
        ]);

        $module1->learningActivities()->attach($activity1, ['sort' => 1]);

        $response = $this->get(route('modules.show', $module1));

        $response->assertStatus(200);
        
        // Assert that next_module is present and is module 2
        $response->assertInertia(fn ($page) => $page
            ->component('Module/Show')
            ->where('next_module.id', $module2->id)
            ->where('next_module.slug', $module2->slug)
        );
    }

    public function test_can_navigate_to_previous_module()
    {
        $module1 = Module::factory()->create([
            'title' => 'Module 1',
            'slug' => 'module-1',
            'sort' => 1,
            'is_active' => true,
        ]);

        $module2 = Module::factory()->create([
            'title' => 'Module 2',
            'slug' => 'module-2',
            'sort' => 2,
            'is_active' => true,
        ]);

        $activity2 = LearningActivity::create([
            'title' => 'Activity 2',
            'slug' => 'activity-2',
            'type' => 'multiple_choices',
            'content' => ['questions' => []],
            'is_active' => true,
        ]);

        $module2->learningActivities()->attach($activity2, ['sort' => 1]);

        // We are at module 2, activity 2 (first activity of module 2)
        // Previous activity is null, so it should look for previous module
        $response = $this->get(route('modules.show', $module2));

        $response->assertStatus(200);

        // Assert that prev_module is present and is module 1
        $response->assertInertia(fn ($page) => $page
            ->component('Module/Show')
            ->where('prev_module.id', $module1->id)
            ->where('prev_module.slug', $module1->slug)
        );
    }
    
    public function test_navigation_with_equal_sort_values_uses_id()
    {
        // Create modules with same sort value (0)
        $module1 = Module::factory()->create([
            'title' => 'Module 1',
            'slug' => 'module-1',
            'sort' => 0,
            'is_active' => true,
        ]);
        
        // Ensure module 2 has higher ID
        sleep(1); 
        
        $module2 = Module::factory()->create([
            'title' => 'Module 2',
            'slug' => 'module-2',
            'sort' => 0,
            'is_active' => true,
        ]);

        $activity1 = LearningActivity::create([
            'title' => 'Activity 1',
            'slug' => 'activity-1',
            'type' => 'multiple_choices',
            'content' => ['questions' => []],
            'is_active' => true,
        ]);
        
        $activity2 = LearningActivity::create([
            'title' => 'Activity 2',
            'slug' => 'activity-2',
            'type' => 'multiple_choices',
            'content' => ['questions' => []],
            'is_active' => true,
        ]);

        $module1->learningActivities()->attach($activity1, ['sort' => 1]);
        $module2->learningActivities()->attach($activity2, ['sort' => 1]);

        // Test Next Module from Module 1
        $response = $this->get(route('modules.show', $module1));
        $response->assertInertia(fn ($page) => $page
            ->where('next_module.id', $module2->id)
        );

        // Test Previous Module from Module 2
        $response = $this->get(route('modules.show', $module2));
        $response->assertInertia(fn ($page) => $page
            ->where('prev_module.id', $module1->id)
        );
    }
}
