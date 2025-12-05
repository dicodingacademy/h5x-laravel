import { Head } from '@inertiajs/react';
import FlashcardPlayer from "@/Components/Players/FlashcardPlayer";
import MultipleChoicePlayer from "@/Components/Players/MultipleChoicePlayer";
import InteractiveVideoPlayer from "@/Components/Players/InteractiveVideoPlayer";
import FillBlankPlayer from "@/Components/Players/FillBlankPlayer";
import { Activity } from 'lucide-react'; // Assuming Activity icon is needed based on the new JSX

export default function Preview({ activity }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={activity.title} /> {/* Keep Head for title, as it's not explicitly removed from imports */}
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        {/* Assuming Activity icon is available, otherwise this line might cause an error */}
                        <Activity className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">{activity.title}</h1>
                        <p className="text-sm text-gray-500 capitalize">{activity.type.replace(/_/g, ' ')}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8">
                {activity.type === 'flashcards' && (
                    <FlashcardPlayer cards={activity.content.cards || []} />
                )}

                {activity.type === 'multiple_choices' && (
                    <MultipleChoicePlayer
                        questions={activity.content.questions || []}
                        minimum_score={activity.minimum_score}
                        show_wrong_answer={activity.show_wrong_answer}
                    />
                )}

                {activity.type === 'interactive_video' && (
                    <InteractiveVideoPlayer
                        data={{
                            video_url: activity.content.video_url,
                            settings: activity.content.settings || {},
                            interactions: activity.content.interactions,
                            title: activity.title
                        }}
                    />
                )}

                {activity.type === 'fill_the_blank' && (
                    <FillBlankPlayer data={activity.content} />
                )}
            </div>
        </div>
    );
}
