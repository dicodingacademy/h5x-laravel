<?php

namespace App\Filament\Resources\LearningActivities\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class LearningActivityForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Metadata')
                    ->schema([
                        TextInput::make('title')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state))),
                        TextInput::make('slug')
                            ->required()
                            ->unique(ignoreRecord: true),
                        Select::make('type')
                            ->options([
                                'flashcards' => 'Flashcards',
                            ])
                            ->required()
                            ->default('flashcards')
                            ->live(),
                    ])->columns(2),

                Section::make('Content')
                    ->schema([
                        Repeater::make('content.cards')
                            ->label('Cards')
                            ->schema([
                                RichEditor::make('question')
                                    ->required()
                                    ->columnSpanFull(),
                                RichEditor::make('answer')
                                    ->required()
                                    ->columnSpanFull(),
                                FileUpload::make('image')
                                    ->image()
                                    ->directory('h5x-images'),
                            ])
                            ->visible(fn (Get $get) => $get('type') === 'flashcards')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}