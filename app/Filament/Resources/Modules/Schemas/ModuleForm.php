<?php

namespace App\Filament\Resources\Modules\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ModuleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255)
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                TextInput::make('slug')
                    ->required()
                    ->maxLength(255)
                    ->unique(ignoreRecord: true),
                Textarea::make('description')
                    ->columnSpanFull(),
                Select::make('learningActivities')
                    ->relationship('learningActivities', 'title')
                    ->multiple()
                    ->preload()
                    ->searchable()
                    ->columnSpanFull(),
                Toggle::make('is_active')
                    ->required()
                    ->default(true),
                TextInput::make('sort')
                    ->numeric()
                    ->default(0),
            ]);
    }
}
