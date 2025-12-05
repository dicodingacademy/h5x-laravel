import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Preview({ activity }) {
    const { title, type, content } = activity;
    const cards = content?.cards || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const currentCard = cards[currentIndex];

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
            <Head title={`Preview: ${title}`} />
            
            <div className="w-full max-w-2xl">
                <div className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2 uppercase tracking-wide">
                        {type}
                    </span>
                </div>

                {type === 'flashcards' && cards.length > 0 ? (
                    <div className="flex flex-col items-center">
                        {/* Card Container */}
                        <div 
                            className="w-full aspect-video bg-white rounded-xl shadow-xl cursor-pointer perspective-1000 relative transition-all duration-300 hover:shadow-2xl"
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <div className={`w-full h-full flex flex-col items-center justify-center p-8 text-center transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                                {isFlipped ? (
                                    <div className="animate-fade-in">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Answer</h3>
                                        <div 
                                            className="prose prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: currentCard.answer }}
                                        />
                                    </div>
                                ) : (
                                    <div className="animate-fade-in">
                                        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Question</h3>
                                        <div 
                                            className="prose prose-lg max-w-none"
                                            dangerouslySetInnerHTML={{ __html: currentCard.question }}
                                        />
                                        {currentCard.image && (
                                            <img 
                                                src={`/storage/${currentCard.image}`} 
                                                alt="Card image" 
                                                className="mt-4 max-h-48 object-contain mx-auto rounded-lg"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            <div className="absolute bottom-4 right-4 text-gray-400 text-sm">
                                {isFlipped ? 'Click to see question' : 'Click to flip'}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-between w-full mt-8 px-4">
                            <button 
                                onClick={handlePrev}
                                className="px-6 py-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-50 transition-colors font-medium"
                            >
                                &larr; Previous
                            </button>
                            <span className="text-gray-500 font-medium">
                                {currentIndex + 1} / {cards.length}
                            </span>
                            <button 
                                onClick={handleNext}
                                className="px-6 py-2 bg-white text-gray-700 rounded-full shadow hover:bg-gray-50 transition-colors font-medium"
                            >
                                Next &rarr;
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500 italic">No flashcards content available.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
