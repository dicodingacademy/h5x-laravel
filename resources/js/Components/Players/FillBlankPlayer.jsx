import { useState, useMemo } from "react";
import {
    DndContext,
    DragOverlay,
    useDraggable,
    useDroppable,
} from "@dnd-kit/core";
import { CheckCircle2, RefreshCw } from "lucide-react";

function Draggable({ id, text, isDropped }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: id,
        disabled: isDropped,
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    } : undefined;

    if (isDropped) return null;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`
                inline-flex items-center justify-center px-4 py-2 
                bg-gray-900 text-white rounded-lg shadow-sm text-sm font-medium 
                cursor-grab active:cursor-grabbing hover:bg-gray-800 transition-colors
                ${isDragging ? "opacity-50" : ""}
            `}
        >
            {text}
        </div>
    );
}

function Droppable({ id, droppedItem, isCorrect, showFeedback }) {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    let borderColor = "border-gray-300";
    let bgColor = isOver ? "bg-blue-50" : "bg-transparent";

    if (showFeedback && droppedItem) {
        if (isCorrect) {
            borderColor = "border-green-500";
            bgColor = "bg-green-50";
        } else {
            borderColor = "border-red-500";
            bgColor = "bg-red-50";
        }
    } else if (droppedItem) {
        bgColor = "bg-gray-100";
    }

    return (
        <div
            ref={setNodeRef}
            className={`
                inline-flex items-center justify-center min-w-[100px] h-9 mx-1.5 
                border-b-2 transition-all duration-200 align-middle
                ${borderColor} ${bgColor}
            `}
        >
            {droppedItem ? (
                <span className={`px-2 text-sm font-medium ${showFeedback && isCorrect ? 'text-green-700' : showFeedback ? 'text-red-700' : 'text-gray-900'}`}>
                    {droppedItem.text}
                </span>
            ) : null}
        </div>
    );
}

export default function FillBlankPlayer({ data }) {
    const [droppedItems, setDroppedItems] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [activeId, setActiveId] = useState(null);

    // Parse text to find blanks *word*
    const { parts, blanks } = useMemo(() => {
        const text = data.text || "";
        const regex = /\*([^*]+)\*/g;
        const parts = [];
        const blanks = [];
        let lastIndex = 0;
        let match;
        let blankIndex = 0;

        while ((match = regex.exec(text)) !== null) {
            // Add text before the blank
            if (match.index > lastIndex) {
                parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
            }

            // Add the blank
            const answer = match[1];
            const id = `blank-${blankIndex}`;
            parts.push({ type: "blank", id, answer });
            blanks.push({ id, answer });
            blankIndex++;

            lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({ type: "text", content: text.substring(lastIndex) });
        }

        return { parts, blanks };
    }, [data.text]);

    // Prepare draggable items (answers + distractors)
    const draggables = useMemo(() => {
        const items = [
            ...blanks.map((b, i) => ({ id: `item-${b.answer}-${i}`, text: b.answer })),
            ...(data.distractors || []).map((d, i) => ({ id: `distractor-${i}`, text: d.text })),
        ];
        // Shuffle items
        return items.sort(() => Math.random() - 0.5);
    }, [blanks, data.distractors]);

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active) {
            const blankId = over.id;
            const item = draggables.find((i) => i.id === active.id);

            if (item) {
                setDroppedItems((prev) => ({
                    ...prev,
                    [blankId]: item,
                }));
            }
        }
    };

    const handleCheck = () => {
        setIsSubmitted(true);
    };

    const handleReset = () => {
        setDroppedItems({});
        setIsSubmitted(false);
    };

    const score = blanks.reduce((acc, blank) => {
        const dropped = droppedItems[blank.id];
        return acc + (dropped && dropped.text === blank.answer ? 1 : 0);
    }, 0);

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="w-full max-w-3xl mx-auto space-y-8">
                {/* Question Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-8 md:p-10 leading-loose text-lg md:text-xl text-gray-800">
                        {parts.map((part, index) => {
                            if (part.type === "text") {
                                return <span key={index}>{part.content}</span>;
                            } else {
                                const isCorrect = droppedItems[part.id]?.text === part.answer;
                                return (
                                    <Droppable
                                        key={part.id}
                                        id={part.id}
                                        droppedItem={droppedItems[part.id]}
                                        isCorrect={isCorrect}
                                        showFeedback={isSubmitted}
                                    />
                                );
                            }
                        })}
                    </div>
                </div>

                {/* Draggable Items Area */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 min-h-[100px] flex flex-col items-center justify-center gap-4">
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Drag words to fill the blanks</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                        {draggables.map((item) => {
                            // Check if item is already dropped
                            const isDropped = Object.values(droppedItems).some((i) => i.id === item.id);
                            return (
                                <Draggable
                                    key={item.id}
                                    id={item.id}
                                    text={item.text}
                                    isDropped={isDropped}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-center">
                    {!isSubmitted ? (
                        <button 
                            onClick={handleCheck} 
                            disabled={Object.keys(droppedItems).length === 0}
                            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            Check Answer
                        </button>
                    ) : (
                        <div className="w-full max-w-md bg-white rounded-xl border border-gray-200 p-6 text-center animate-in fade-in slide-in-from-bottom-4">
                            <div className="mb-4">
                                <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {score} / {blanks.length}
                                </div>
                                <p className="text-gray-500">Correct Answers</p>
                            </div>
                            
                            <button 
                                onClick={handleReset}
                                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Try Again
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            <DragOverlay>
                {activeId ? (
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg shadow-xl text-sm font-medium opacity-90 scale-105 cursor-grabbing">
                        {draggables.find((i) => i.id === activeId)?.text}
                    </div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}
