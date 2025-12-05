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
            ->columns(1)
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
                                'interactive_video' => 'Interactive Video',
                                'fill_the_blank' => 'Fill the Blank',
                                'drag_and_reorder' => 'Drag and Reorder', // Added option
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

                        // Interactive Video Content
                        TextInput::make('content.video_url')
                            ->label('Video URL (HLS/m3u8)')
                            ->url()
                            ->placeholder('https://stream.mux.com/...')
                            ->visible(fn (Get $get) => $get('type') === 'interactive_video')
                            ->required(fn (Get $get) => $get('type') === 'interactive_video')
                            ->columnSpanFull(),

                        Section::make('Video Settings')
                            ->schema([
                                \Filament\Forms\Components\Toggle::make('content.settings.prevent_seeking')
                                    ->label('Prevent Seeking')
                                    ->default(false),
                                \Filament\Forms\Components\Toggle::make('content.settings.require_completion')
                                    ->label('Require Completion')
                                    ->default(true),
                                \Filament\Forms\Components\Toggle::make('content.settings.auto_play')
                                    ->label('Auto Play')
                                    ->default(false),
                                \Filament\Forms\Components\Toggle::make('content.settings.show_wrong_answer')
                                    ->label('Show Incorrect Answer')
                                    ->default(true),
                            ])
                            ->visible(fn (Get $get) => $get('type') === 'interactive_video'),

                        Repeater::make('content.interactions')
                            ->label('Time-based Interactions')
                            ->schema([
                                TextInput::make('time')
                                    ->label('Time (seconds)')
                                    ->numeric()
                                    ->required(),
                                Select::make('type')
                                    ->options([
                                        'fact' => 'Fact',
                                        'quiz' => 'Quiz',
                                    ])
                                    ->reactive()
                                    ->required(),
                                
                                // Fact Content
                                \Filament\Schemas\Components\Group::make([
                                    TextInput::make('fact_content.title')
                                        ->label('Fact Title')
                                        ->default('Did you know?'),
                                    RichEditor::make('fact_content.description')
                                        ->label('Description'),
                                ])->visible(fn (Get $get) => $get('type') === 'fact'),

                                // Quiz Content
                                \Filament\Schemas\Components\Group::make([
                                    RichEditor::make('quiz_content.question')
                                        ->label('Question'),
                                    Repeater::make('quiz_content.answers')
                                        ->schema([
                                            TextInput::make('text')->required(),
                                            \Filament\Forms\Components\Toggle::make('is_correct')->default(false),
                                        ])
                                        ->minItems(2)
                                        ->defaultItems(2)
                                ])->visible(fn (Get $get) => $get('type') === 'quiz'),
                            ])
                            ->visible(fn (Get $get) => $get('type') === 'interactive_video')
                            ->defaultItems(0)
                            ->reorderableWithButtons()
                            ->cloneable()
                            ->columnSpanFull(),

                        // Fill the Blank Content
                        \Filament\Forms\Components\Textarea::make('content.text')
                            ->label('Text (Use *asterisks* for blanks)')
                            ->helperText('Example: The *sky* is blue.')
                            ->rows(5)
                            ->visible(fn (Get $get) => $get('type') === 'fill_the_blank')
                            ->required(fn (Get $get) => $get('type') === 'fill_the_blank')
                            ->columnSpanFull(),

                        Repeater::make('content.distractors')
                            ->label('Extra Words (Distractors)')
                            ->schema([
                                TextInput::make('text')->required(),
                            ])
                            ->visible(fn (Get $get) => $get('type') === 'fill_the_blank')
                            ->columnSpanFull(),

                        // Drag and Reorder Content
                        Repeater::make('content.items')
                            ->label('Items (In Correct Order)')
                            ->schema([
                                TextInput::make('text')
                                    ->required()
                                    ->label('Item Text'),
                            ])
                            ->visible(fn (Get $get) => $get('type') === 'drag_and_reorder')
                            ->required(fn (Get $get) => $get('type') === 'drag_and_reorder')
                            ->addActionLabel('Add Item')
                            ->reorderableWithButtons()
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}