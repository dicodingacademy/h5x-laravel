<?php

namespace App\Filament\Resources\LearningActivities\Pages;

use App\Filament\Resources\LearningActivities\LearningActivityResource;
use Filament\Resources\Pages\CreateRecord;

class CreateLearningActivity extends CreateRecord
{
    protected static string $resource = LearningActivityResource::class;

    protected function getHeaderActions(): array
    {
        return [
            \Filament\Actions\Action::make('create')
                ->label('Create Activity')
                ->action('create'),
            \Filament\Actions\Action::make('cancel')
                ->label('Cancel')
                ->color('gray')
                ->url($this->getResource()::getUrl('index')),
        ];
    }

    protected function getFormActions(): array
    {
        return [];
    }
}
