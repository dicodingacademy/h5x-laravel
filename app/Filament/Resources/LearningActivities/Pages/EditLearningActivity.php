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
            Action::make('preview')
                ->modalContent(fn ($record) => new \Illuminate\Support\HtmlString('
                    <iframe src="' . route('learning-activities.preview', $record) . '" width="100%" height="800px" style="border:none; border-radius: 8px;"></iframe>
                '))
                ->modalSubmitAction(false)
                ->modalCancelAction(false)
                ->modalWidth('7xl'),
            DeleteAction::make(),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
