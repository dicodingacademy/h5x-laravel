import { useState, useRef, useEffect } from "react";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
    DefaultVideoLayout,
    defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { CheckCircle2, XCircle, Info, Play, RotateCcw } from "lucide-react";

export default function InteractiveVideoPlayer({ data }) {
    const player = useRef(null);
    const [activeInteraction, setActiveInteraction] = useState(null);
    const [processedInteractions, setProcessedInteractions] = useState(new Set());
    const [quizSelected, setQuizSelected] = useState(null);
    const [quizSubmitted, setQuizSubmitted] = useState(false);
    const lastTimeRef = useRef(0);

    // Ensure interactions is an array and sort by time
    const interactions = Array.isArray(data.interactions) 
        ? [...data.interactions].sort((a, b) => parseFloat(a.time) - parseFloat(b.time)) 
        : [];

    const handleTimeUpdate = (detail) => {
        const currentTime = detail.currentTime;

        // Prevent seeking logic
        if (data.settings?.prevent_seeking) {
            // Allow a small buffer (e.g., 1 second) for normal playback progression
            if (currentTime > lastTimeRef.current + 1.5) {
                if (player.current) {
                    player.current.currentTime = lastTimeRef.current;
                }
                return;
            }
            lastTimeRef.current = Math.max(lastTimeRef.current, currentTime);
        }

        // Find an interaction that matches the current time (within 0.5s) and hasn't been processed
        const interaction = interactions.find(
            (i) => Math.abs(parseFloat(i.time) - currentTime) < 0.5 && !processedInteractions.has(i.time)
        );

        if (interaction) {
            player.current?.pause();
            setActiveInteraction(interaction);
            setProcessedInteractions((prev) => new Set(prev).add(interaction.time));
        }
    };

    const handleContinue = () => {
        setActiveInteraction(null);
        setQuizSelected(null);
        setQuizSubmitted(false);
        player.current?.play();
    };

    const handleQuizSubmit = () => {
        setQuizSubmitted(true);
    };

    // Helper to check if quiz answer is correct
    const isCorrect = () => {
        if (activeInteraction?.type !== "quiz" || quizSelected === null) return false;
        
        const answers = activeInteraction.quiz_content?.answers || [];
        const selectedAnswer = answers[quizSelected];
        
        // Handle boolean or string '1'/'0' from database
        return selectedAnswer?.is_correct === true || 
               selectedAnswer?.is_correct === '1' || 
               selectedAnswer?.is_correct === 1;
    };

    const shouldAutoPlay = data.settings?.auto_play === true || data.settings?.auto_play === '1' || data.settings?.auto_play === 1;

    return (
        <div className="w-full max-w-4xl mx-auto space-y-4">
            <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg border border-gray-800">
                <MediaPlayer
                    ref={player}
                    title={data.title || "Interactive Video"}
                    src={data.video_url}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full"
                    autoplay={shouldAutoPlay}
                    muted={shouldAutoPlay}
                    crossOrigin
                >
                    <MediaProvider />
                    <DefaultVideoLayout
                        icons={defaultLayoutIcons}
                        slots={{
                            timeSlider: data.settings?.prevent_seeking ? null : undefined,
                        }}
                    />

                    {/* Interaction Overlay (Modal) */}
                    {activeInteraction && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 p-4 animate-in fade-in duration-300 backdrop-blur-sm">
                            <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                                {/* Header */}
                                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
                                    {activeInteraction.type === "fact" ? (
                                        <div className="p-2 bg-blue-100 text-blue-600 rounded-full">
                                            <Info className="h-5 w-5" />
                                        </div>
                                    ) : (
                                        <div className="p-2 bg-purple-100 text-purple-600 rounded-full">
                                            <CheckCircle2 className="h-5 w-5" />
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-lg text-gray-900">
                                        {activeInteraction.type === "fact"
                                            ? (activeInteraction.fact_content?.title || "Did you know?")
                                            : "Quiz Time!"}
                                    </h3>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-6">
                                    {activeInteraction.type === "fact" && (
                                        <>
                                            <div 
                                                className="prose prose-sm max-w-none text-gray-600"
                                                dangerouslySetInnerHTML={{ __html: activeInteraction.fact_content?.description }}
                                            />
                                            <button 
                                                onClick={handleContinue} 
                                                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                            >
                                                <Play className="w-4 h-4 fill-current" />
                                                Continue Video
                                            </button>
                                        </>
                                    )}

                                    {activeInteraction.type === "quiz" && (
                                        <div className="space-y-6">
                                            <div 
                                                className="text-lg font-medium text-gray-900"
                                                dangerouslySetInnerHTML={{ __html: activeInteraction.quiz_content?.question }}
                                            />
                                            
                                            <div className="grid gap-3">
                                                {activeInteraction.quiz_content?.answers?.map((answer, index) => {
                                                    const isAnswerCorrect = answer.is_correct === true || answer.is_correct === '1' || answer.is_correct === 1;
                                                    
                                                    let buttonStyle = "border-gray-200 hover:bg-gray-50 hover:border-gray-300";
                                                    
                                                    if (quizSelected === index) {
                                                        buttonStyle = "border-blue-500 bg-blue-50 ring-1 ring-blue-500 text-blue-700";
                                                    }
                                                    
                                                    if (quizSubmitted) {
                                                        if (isAnswerCorrect) {
                                                            // Only show green if it's correct OR if show_wrong_answer is enabled
                                                            if (data.settings?.show_wrong_answer !== false || quizSelected === index) {
                                                                buttonStyle = "bg-green-50 border-green-500 text-green-800 ring-1 ring-green-500";
                                                            } else {
                                                                // If hiding wrong answers, don't highlight the correct one if user didn't pick it
                                                                buttonStyle = "opacity-50 border-gray-200";
                                                            }
                                                        } else if (quizSelected === index && !isAnswerCorrect) {
                                                            buttonStyle = "bg-red-50 border-red-500 text-red-800 ring-1 ring-red-500";
                                                        } else {
                                                            buttonStyle = "opacity-50 border-gray-200";
                                                        }
                                                    }

                                                    return (
                                                        <button
                                                            key={index}
                                                            onClick={() => !quizSubmitted && setQuizSelected(index)}
                                                            disabled={quizSubmitted}
                                                            className={`
                                                                w-full text-left p-4 rounded-lg border transition-all flex items-center justify-between group
                                                                ${buttonStyle}
                                                            `}
                                                        >
                                                            <span className="font-medium">{answer.text}</span>
                                                            {quizSubmitted && isAnswerCorrect && (data.settings?.show_wrong_answer !== false || quizSelected === index) && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                                            {quizSubmitted && quizSelected === index && !isAnswerCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {!quizSubmitted ? (
                                                <button
                                                    onClick={handleQuizSubmit}
                                                    disabled={quizSelected === null}
                                                    className="w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Check Answer
                                                </button>
                                            ) : (
                                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                                    {isCorrect() ? (
                                                        <div className="p-4 bg-green-50 border border-green-100 rounded-lg text-center">
                                                            <p className="text-green-800 font-medium flex items-center justify-center gap-2">
                                                                <CheckCircle2 className="w-5 h-5" />
                                                                Correct! Great job.
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-center">
                                                            <p className="text-red-800 font-medium flex items-center justify-center gap-2">
                                                                <XCircle className="w-5 h-5" />
                                                                {data.settings?.show_wrong_answer !== false 
                                                                    ? "Incorrect. Please try again." 
                                                                    : "Incorrect answer."}
                                                            </p>
                                                        </div>
                                                    )}
                                                    
                                                    {isCorrect() ? (
                                                        <button 
                                                            onClick={handleContinue} 
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                                        >
                                                            <Play className="w-4 h-4 fill-current" />
                                                            Continue Video
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => {
                                                                setQuizSubmitted(false);
                                                                setQuizSelected(null);
                                                            }}
                                                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                                        >
                                                            <RotateCcw className="w-4 h-4" />
                                                            Try Again
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </MediaPlayer>
            </div>
        </div >
    );
}
