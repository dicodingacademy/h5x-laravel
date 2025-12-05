
import { Head, Link } from '@inertiajs/react';
import InteractiveVideoPlayer from '@/Components/Players/InteractiveVideoPlayer';
import MultipleChoicePlayer from '@/Components/Players/MultipleChoicePlayer';
import FillBlankPlayer from '@/Components/Players/FillBlankPlayer';
import FlashcardPlayer from '@/Components/Players/FlashcardPlayer';

export default function Show({ module, activity, prev_activity, next_activity, next_module, prev_module }) {
    const renderContent = () => {
        switch (activity.type) {
            case 'interactive_video':
                return <InteractiveVideoPlayer data={{ ...activity.content, title: activity.title }} />;
            case 'multiple_choices':
                return (
                    <MultipleChoicePlayer 
                        questions={activity.content?.questions || []} 
                        minimum_score={activity.minimum_score}
                        show_wrong_answer={activity.show_wrong_answer}
                    />
                );
            case 'fill_the_blank':
                return <FillBlankPlayer data={activity.content} />;
            case 'flashcards':
                return <FlashcardPlayer cards={activity.content?.cards || []} />;
            default:
                return (
                    <div className="p-8 text-center text-gray-500">
                        Content type "{activity.type}" is not yet supported.
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Head title={`${activity.title} - ${module.title}`} />

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 leading-tight">{module.title}</h1>
                            <p className="text-sm text-gray-500">{activity.title}</p>
                        </div>
                    </div>
                    <div className="text-sm text-gray-500">
                        {/* Progress or other info could go here */}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow">
                <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                        {renderContent()}
                    </div>
                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="bg-white border-t border-gray-200 sticky bottom-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div>
                        {prev_activity ? (
                            <Link
                                href={`/modules/${module.slug}/activities/${prev_activity.id}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Previous
                            </Link>
                        ) : prev_module ? (
                            <Link
                                href={`/modules/${prev_module.slug}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Previous Module: {prev_module.title}
                            </Link>
                        ) : (
                            <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-400 bg-gray-100 cursor-not-allowed">
                                Previous
                            </span>
                        )}
                    </div>

                    <div>
                        {next_activity ? (
                            <Link
                                href={`/modules/${module.slug}/activities/${next_activity.id}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Next
                                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        ) : next_module ? (
                            <Link
                                href={`/modules/${next_module.slug}`}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Next Module: {next_module.title}
                                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        ) : (
                            <Link
                                href="/"
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Finish
                                <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            </Link>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
}
