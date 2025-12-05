<?php

namespace App\Filament\Resources\LearningActivities;

use App\Filament\Resources\LearningActivities\Pages\CreateLearningActivity;
use App\Filament\Resources\LearningActivities\Pages\EditLearningActivity;
use App\Filament\Resources\LearningActivities\Pages\ListLearningActivities;
use App\Filament\Resources\LearningActivities\Schemas\LearningActivityForm;
use App\Filament\Resources\LearningActivities\Tables\LearningActivitiesTable;
use App\Models\LearningActivity;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class LearningActivityResource extends Resource
{
    protected static ?string $model = LearningActivity::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return LearningActivityForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return LearningActivitiesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListLearningActivities::route('/'),
            'create' => CreateLearningActivity::route('/create'),
            'edit' => EditLearningActivity::route('/{record}/edit'),
        ];
    }
}
