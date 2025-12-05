import { useState } from 'react';
import { CheckCircle2, XCircle, ChevronRight, ChevronLeft, RotateCcw, Trophy } from "lucide-react";

export default function MultipleChoicePlayer({ questions, minimum_score, show_wrong_answer }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);

    const handleOptionSelect = (optionIndex) => {
        if (showResults) return;
        setUserAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmitQuiz();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitQuiz = () => {
        let correctCount = 0;
        questions.forEach((q, idx) => {
            const selectedOptionIndex = userAnswers[idx];
            if (selectedOptionIndex !== undefined) {
                const selectedOption = q.options[selectedOptionIndex];
                const isCorrect = selectedOption.is_correct === true || 
                                selectedOption.is_correct === '1' || 
                                selectedOption.is_correct === 1;
                
                if (selectedOption && isCorrect) {
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
        setCurrentQuestionIndex(0);
    };
    
    const minScore = parseInt(minimum_score) || 0;
    const isPassed = score >= minScore;
    
    // Calculate progress based on answered questions
    const answeredCount = Object.keys(userAnswers).length;
    const progress = (answeredCount / questions.length) * 100;

    if (!questions || questions.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border p-8 text-center max-w-md mx-auto">
                <p className="text-gray-500 italic">No questions available.</p>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    const hasAnsweredCurrent = userAnswers[currentQuestionIndex] !== undefined;
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!showResults ? (
                <div className="space-y-6">
                    {/* Progress Header */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                        <span className="font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
                        <span>{Math.round(progress)}% Completed</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-blue-600 transition-all duration-500 ease-out"
                            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                        />
                    </div>

                    {/* Question Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 md:p-8">
                            <div 
                                className="prose prose-lg max-w-none text-gray-900 mb-8 font-medium"
                                dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
                            />
                            
                            <div className="space-y-3">
                                {currentQuestion.options.map((opt, optIdx) => (
                                    <button
                                        key={optIdx}
                                        onClick={() => handleOptionSelect(optIdx)}
                                        className={`
                                            w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between group
                                            ${userAnswers[currentQuestionIndex] === optIdx
                                                ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-sm'
                                                : 'border-gray-200 hover:border-blue-400 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                                w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium transition-colors
                                                ${userAnswers[currentQuestionIndex] === optIdx
                                                    ? 'border-blue-600 bg-blue-600 text-white'
                                                    : 'border-gray-300 text-gray-500 group-hover:border-blue-400'
                                                }
                                            `}>
                                                {String.fromCharCode(65 + optIdx)}
                                            </div>
                                            <span className={`font-medium ${userAnswers[currentQuestionIndex] === optIdx ? 'text-blue-900' : 'text-gray-700'}`}>
                                                {opt.text}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Footer Controls */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                            <button
                                onClick={handlePrev}
                                disabled={currentQuestionIndex === 0}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${currentQuestionIndex === 0 
                                        ? 'text-gray-300 cursor-not-allowed' 
                                        : 'text-gray-600 hover:bg-white hover:shadow-sm hover:text-gray-900'
                                    }
                                `}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <button
                                onClick={handleNext}
                                disabled={!hasAnsweredCurrent}
                                className={`
                                    flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all
                                    ${!hasAnsweredCurrent
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5'
                                    }
                                `}
                            >
                                {isLastQuestion ? 'Finish Quiz' : 'Next Question'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-8 animate-fade-in">
                    {/* Result Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                        <div className="flex flex-col items-center justify-center space-y-6">
                            <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center mb-2
                                ${isPassed ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
                            `}>
                                {isPassed ? <Trophy className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                            </div>

                            <div className="space-y-1">
                                <h2 className="text-xl font-semibold text-gray-900">
                                    {isPassed ? "Quiz Completed" : "Quiz Completed"}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {isPassed 
                                        ? "You have passed this activity." 
                                        : "You did not reach the minimum score."}
                                </p>
                            </div>
                            
                            <div className="flex flex-col items-center">
                                <span className={`text-4xl font-bold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                                    {score}%
                                </span>
                                <span className="text-xs text-gray-400 font-medium uppercase tracking-wider mt-1">Final Score</span>
                            </div>

                            <button
                                onClick={handleRetryQuiz}
                                className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Retry Quiz
                            </button>
                        </div>
                    </div>

                    {/* Review Section */}
                    {show_wrong_answer && (
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-600 rounded-full"></span>
                                Review Answers
                            </h3>
                            <div className="grid gap-4">
                                {questions.map((q, qIdx) => {
                                    const selectedIdx = userAnswers[qIdx];
                                    const correctIdx = q.options.findIndex(o => o.is_correct === true || o.is_correct === '1' || o.is_correct === 1);
                                    const isCorrect = selectedIdx === correctIdx;

                                    return (
                                        <div 
                                            key={qIdx} 
                                            className={`
                                                bg-white rounded-lg border p-5 transition-all
                                                ${isCorrect ? 'border-gray-200' : 'border-red-100 bg-red-50/10'}
                                            `}
                                        >
                                            <div className="flex items-start gap-3 mb-4">
                                                <span className={`
                                                    flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5
                                                    ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}
                                                `}>
                                                    {qIdx + 1}
                                                </span>
                                                <div className="flex-1">
                                                    <div 
                                                        className="prose prose-sm max-w-none text-gray-800 font-medium"
                                                        dangerouslySetInnerHTML={{ __html: q.question }}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="pl-9 space-y-2">
                                                {q.options.map((opt, optIdx) => {
                                                    const isSelected = selectedIdx === optIdx;
                                                    const isAnswerCorrect = optIdx === correctIdx;
                                                    
                                                    if (!isSelected && !isAnswerCorrect) return null;

                                                    return (
                                                        <div
                                                            key={optIdx}
                                                            className={`
                                                                flex items-center gap-3 p-3 rounded-md text-sm border
                                                                ${isAnswerCorrect 
                                                                    ? 'bg-green-50 border-green-200 text-green-800' 
                                                                    : 'bg-red-50 border-red-200 text-red-800'
                                                                }
                                                            `}
                                                        >
                                                            {isAnswerCorrect ? (
                                                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                                            ) : (
                                                                <XCircle className="w-4 h-4 shrink-0" />
                                                            )}
                                                            <span className="font-medium">{opt.text}</span>
                                                            {isAnswerCorrect && <span className="ml-auto text-xs uppercase tracking-wider font-bold opacity-70">Correct Answer</span>}
                                                            {isSelected && !isAnswerCorrect && <span className="ml-auto text-xs uppercase tracking-wider font-bold opacity-70">Your Answer</span>}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
