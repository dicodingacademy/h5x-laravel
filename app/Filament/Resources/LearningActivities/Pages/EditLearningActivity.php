<?php

namespace App\Filament\Resources\LearningActivities\Pages;

use App\Filament\Resources\LearningActivities\LearningActivityResource;
use Filament\Actions\Action;
use Filament\Resources\Pages\EditRecord;
use Filament\Actions\DeleteAction;

class EditLearningActivity extends EditRecord
{
    protected static string $resource = LearningActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('preview')
                ->url(fn () => route('learning-activities.preview', $this->record))
                ->openUrlInNewTab(),
            DeleteAction::make(),
        ];
    }
}
