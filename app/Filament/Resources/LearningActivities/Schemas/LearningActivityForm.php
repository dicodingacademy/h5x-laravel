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
                                'multiple_choices' => 'Multiple Choices',
                            ])
                            ->required()
                            ->default('flashcards')
                            ->live(),
                        
                        // Multiple Choices Settings
                        TextInput::make('minimum_score')
                            ->numeric()
                            ->default(70)
                            ->visible(fn (Get $get) => $get('type') === 'multiple_choices')
                            ->required(),
                        \Filament\Forms\Components\Toggle::make('show_wrong_answer')
                            ->default(true)
                            ->visible(fn (Get $get) => $get('type') === 'multiple_choices'),
                    ])->columns(2),

                Section::make('Content')
                    ->schema([
                        // Flashcards Content
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
                                    ->disk('public')
                                    ->directory('h5x-images'),
                            ])
                            ->visible(fn (Get $get) => $get('type') === 'flashcards')
                            ->columnSpanFull(),

                        // Multiple Choices Content
                        Repeater::make('content.questions')
                            ->label('Questions')
                            ->schema([
                                RichEditor::make('question')
                                    ->required()
                                    ->columnSpanFull(),
                                Repeater::make('options')
                                    ->schema([
                                        TextInput::make('text')
                                            ->required(),
                                        \Filament\Forms\Components\Toggle::make('is_correct')
                                            ->label('Correct Answer')
                                            ->fixIndistinctState(),
                                    ])
                                    ->minItems(2)
                                    ->columnSpanFull(),
                            ])
                            ->visible(fn (Get $get) => $get('type') === 'multiple_choices')
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}