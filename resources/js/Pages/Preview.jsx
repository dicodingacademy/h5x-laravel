import { Head } from '@inertiajs/react';
import FlashcardPlayer from "@/Components/Players/FlashcardPlayer";
import MultipleChoicePlayer from "@/Components/Players/MultipleChoicePlayer";
import InteractiveVideoPlayer from "@/Components/Players/InteractiveVideoPlayer";
import FillBlankPlayer from "@/Components/Players/FillBlankPlayer";
import { Activity } from 'lucide-react'; // Assuming Activity icon is needed based on the new JSX

export default function Preview({ activity }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Head title={activity.title} /> {/* Keep Head for title, as it's not explicitly removed from imports */}

            {/* Content */}
            <div className="flex-1 max-w-5xl mx-auto w-full p-6 md:p-8">
                {activity.type === 'flashcards' && (
                    <FlashcardPlayer cards={activity.content?.cards || []} />
                )}

                {activity.type === 'multiple_choices' && (
                    <MultipleChoicePlayer
                        questions={activity.content?.questions || []}
                        minimum_score={activity.minimum_score}
                        show_wrong_answer={activity.show_wrong_answer}
                    />
                )}

                {activity.type === 'interactive_video' && (
                    <InteractiveVideoPlayer
                        data={{
                            video_url: activity.content?.video_url,
                            settings: activity.content?.settings || {},
                            interactions: activity.content?.interactions,
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
