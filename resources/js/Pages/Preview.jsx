import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Preview({ activity }) {
    const { title, type, content, minimum_score, show_wrong_answer } = activity;
    
    // Flashcards State
    const cards = content?.cards || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    // Multiple Choices State
    const questions = content?.questions || [];
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    // Flashcards Handlers
    const handleNext = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % cards.length);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    };

    const currentCard = cards[currentIndex];

    // Multiple Choices Handlers
    const handleOptionSelect = (questionIndex, optionIndex) => {
        if (showResults) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionIndex]: optionIndex
        }));
    };

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            const selectedOptionIndex = userAnswers[idx];
            if (selectedOptionIndex !== undefined) {
                const selectedOption = q.options[selectedOptionIndex];
                if (selectedOption && selectedOption.is_correct) {
                    correctCount++;
                }
            }
        });

        const finalScore = Math.round((correctCount / questions.length) * 100);
        setScore(finalScore);
        setShowResults(true);
    };

    const handleRetryQuiz = () => {
        setUserAnswers({});
        setShowResults(false);
        setScore(0);
    };

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

                {/* Flashcards UI */}
                {type === 'flashcards' && cards.length > 0 && (
                    <div className="flex flex-col items-center">
                        <div 
                            className="w-full aspect-video bg-white rounded-xl shadow-xl cursor-pointer perspective-1000 relative transition-all duration-300 hover:shadow-2xl max-w-2xl"
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

                        <div className="flex items-center justify-between w-full max-w-2xl mt-8 px-4">
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
                )}

                {/* Multiple Choices UI */}
                {type === 'multiple_choices' && questions.length > 0 && (
                    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                        {!showResults ? (
                            <div className="p-8">
                                <div className="space-y-8">
                                    {questions.map((q, qIdx) => (
                                        <div key={qIdx} className="border-b border-gray-100 pb-8 last:border-0 last:pb-0">
                                            <div className="flex items-start gap-4 mb-4">
                                                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                                    {qIdx + 1}
                                                </span>
                                                <div 
                                                    className="prose prose-lg max-w-none text-gray-800"
                                                    dangerouslySetInnerHTML={{ __html: q.question }}
                                                />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-3 pl-12">
                                                {q.options.map((opt, optIdx) => (
                                                    <button
                                                        key={optIdx}
                                                        onClick={() => handleOptionSelect(qIdx, optIdx)}
                                                        className={`text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                                                            userAnswers[qIdx] === optIdx
                                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {opt.text}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-8 pt-6 border-t flex justify-end">
                                    <button
                                        onClick={handleSubmitQuiz}
                                        disabled={Object.keys(userAnswers).length < questions.length}
                                        className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        Submit Answers
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="mb-8">
                                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                                        score >= (minimum_score || 0) ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                    }`}>
                                        <span className="text-3xl font-bold">{score}%</span>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        {score >= (minimum_score || 0) ? 'Congratulations! 🎉' : 'Keep practicing! 💪'}
                                    </h2>
                                    <p className="text-gray-500">
                                        You scored {score}% (Minimum required: {minimum_score}%)
                                    </p>
                                </div>

                                {show_wrong_answer && (
                                    <div className="text-left space-y-6 mb-8 bg-gray-50 p-6 rounded-lg">
                                        <h3 className="font-bold text-gray-700 border-b pb-2">Review Answers</h3>
                                        {questions.map((q, qIdx) => {
                                            const selectedIdx = userAnswers[qIdx];
                                            const correctIdx = q.options.findIndex(o => o.is_correct);
                                            const isCorrect = selectedIdx === correctIdx;

                                            return (
                                                <div key={qIdx} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {isCorrect ? (
                                                            <span className="text-green-500">✅</span>
                                                        ) : (
                                                            <span className="text-red-500">❌</span>
                                                        )}
                                                        <div 
                                                            className="prose prose-sm"
                                                            dangerouslySetInnerHTML={{ __html: q.question }}
                                                        />
                                                    </div>
                                                    {!isCorrect && (
                                                        <div className="ml-8 text-sm">
                                                            <p className="text-red-600">Your answer: {q.options[selectedIdx]?.text || 'None'}</p>
                                                            <p className="text-green-600 font-medium">Correct answer: {q.options[correctIdx]?.text}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                <button
                                    onClick={handleRetryQuiz}
                                    className="px-8 py-3 bg-gray-800 text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition-all"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {((type === 'flashcards' && cards.length === 0) || (type === 'multiple_choices' && questions.length === 0)) && (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500 italic">No content available for this activity type.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
