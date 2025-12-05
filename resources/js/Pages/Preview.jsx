import { Head } from '@inertiajs/react';
import FlashcardPlayer from '@/Components/Players/FlashcardPlayer';
import MultipleChoicePlayer from '@/Components/Players/MultipleChoicePlayer';
import InteractiveVideoPlayer from '@/Components/Players/InteractiveVideoPlayer';

export default function Preview({ activity }) {
    const content = activity.content || {};
    const type = activity.type;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Head title={activity.title} />
            
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{activity.title}</h1>
                    <p className="text-gray-500 capitalize">{type.replace('_', ' ')} Activity</p>
                </div>

                {/* Flashcards Player */}
                {type === 'flashcards' && (
                    <FlashcardPlayer cards={content.cards || []} />
                )}

                {/* Multiple Choices Player */}
                {type === 'multiple_choices' && (
                    <MultipleChoicePlayer 
                        questions={content.questions || []} 
                        minimum_score={content.minimum_score}
                        show_wrong_answer={content.show_wrong_answer}
                    />
                )}

                {type === 'interactive_video' && (
                    <InteractiveVideoPlayer 
                        data={{
                            video_url: content.video_url,
                            settings: content.settings,
                            interactions: content.interactions,
                            title: activity.title
                        }}
                    />
                )}
            </div>
        </div>
    );
}
