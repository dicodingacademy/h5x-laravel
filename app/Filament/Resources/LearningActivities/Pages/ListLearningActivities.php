<?php

namespace App\Filament\Resources\LearningActivities\Pages;

use App\Filament\Resources\LearningActivities\LearningActivityResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListLearningActivities extends ListRecords
{
    protected static string $resource = LearningActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
