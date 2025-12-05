import { useState } from 'react';
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

export default function FlashcardPlayer({ cards }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % cards.length);
        }, 300); // Wait for flip back
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
        }, 300);
    };

    const currentCard = cards[currentIndex];

    if (!cards || cards.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center max-w-md mx-auto">
                <p className="text-gray-500 italic">No flashcards available.</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto flex flex-col items-center gap-4">
            {/* Progress */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Card {currentIndex + 1} / {cards.length}
            </div>

            {/* 3D Card Container */}
            <div className="w-full [perspective:1000px]">
                <div
                    className={`relative w-full aspect-[4/3] transition-all duration-500 [transform-style:preserve-3d] cursor-pointer`}
                    onClick={() => setIsFlipped(!isFlipped)}
                    style={{ transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center p-6 text-center group">
                        <div className="space-y-4 w-full">
                            {currentCard.image && (
                                <img
                                    src={`/storage/${currentCard.image}`}
                                    alt="Question"
                                    className="w-24 h-24 object-contain mx-auto rounded-md"
                                />
                            )}
                            <div 
                                className="prose prose-lg max-w-none text-gray-800 font-medium"
                                dangerouslySetInnerHTML={{ __html: currentCard.question }}
                            />
                            <p className="text-xs text-gray-300 mt-4 group-hover:text-blue-400 transition-colors">Click to flip</p>
                        </div>
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 w-full h-full [backface-visibility:hidden] bg-gray-900 text-white rounded-xl border border-gray-900 shadow-lg flex flex-col items-center justify-center p-6 text-center"
                        style={{ transform: "rotateY(180deg)" }}
                    >
                        <div className="prose prose-lg max-w-none prose-invert text-gray-100">
                            <div dangerouslySetInnerHTML={{ __html: currentCard.answer }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-2">
                <button
                    onClick={handlePrev}
                    className="p-2 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-700 transition-all"
                    title="Previous Card"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={() => setIsFlipped(false)}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-xs font-semibold text-gray-600 transition-colors"
                >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                </button>

                <button
                    onClick={handleNext}
                    className="p-2 rounded-full hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-200 text-gray-400 hover:text-gray-700 transition-all"
                    title="Next Card"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
