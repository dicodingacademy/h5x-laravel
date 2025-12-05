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
            Action::make('save')
                ->label('Save Changes')
                ->action('save'),
            Action::make('cancel')
                ->label('Cancel')
                ->color('gray')
                ->url($this->getResource()::getUrl('index')),
            Action::make('preview')
                ->url(fn () => route('learning-activities.preview', $this->record))
                ->openUrlInNewTab()
                ->color('warning'),
            DeleteAction::make(),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
