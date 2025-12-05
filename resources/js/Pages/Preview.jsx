import { Head } from '@inertiajs/react';
import FlashcardPlayer from '@/Components/Players/FlashcardPlayer';
import MultipleChoicePlayer from '@/Components/Players/MultipleChoicePlayer';

export default function Preview({ activity }) {
    const { title, type, content, minimum_score, show_wrong_answer } = activity;

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Head title={`Preview: ${title}`} />
            
            <div className="w-full max-w-3xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2 uppercase tracking-wide">
                        {type.replace('_', ' ')}
                    </span>
                </div>

                {/* Flashcards Player */}
                {type === 'flashcards' && (
                    <FlashcardPlayer cards={content?.cards || []} />
                )}

                {/* Multiple Choices Player */}
                {type === 'multiple_choices' && (
                    <MultipleChoicePlayer 
                        questions={content?.questions || []} 
                        minimum_score={minimum_score}
                        show_wrong_answer={show_wrong_answer}
                    />
                )}
            </div>
        </div>
    );
}
