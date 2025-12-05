import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableItem(props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="bg-white p-4 rounded-lg shadow border border-gray-200 mb-2 cursor-grab active:cursor-grabbing hover:bg-gray-50 flex items-center">
            <div className="mr-3 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
            </div>
            <span className="text-gray-800 font-medium">{props.text}</span>
        </div>
    );
}

export default function DragReorderPlayer({ items = [] }) {
    const [shuffledItems, setShuffledItems] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        if (items && items.length > 0) {
            // Create items with unique IDs for dnd-kit
            const initialItems = items.map((item, index) => ({
                id: `item-${index}`,
                originalIndex: index,
                text: item.text,
            }));

            // Shuffle items
            const shuffled = [...initialItems].sort(() => Math.random() - 0.5);
            setShuffledItems(shuffled);
        }
    }, [items]);

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setShuffledItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const checkAnswer = () => {
        setHasSubmitted(true);
        
        // Check if the current order matches the original order (0, 1, 2, ...)
        const currentOrder = shuffledItems.map(item => item.originalIndex);
        const isOrderCorrect = currentOrder.every((val, index) => val === index);

        setIsCorrect(isOrderCorrect);
    };

    const reset = () => {
        setHasSubmitted(false);
        setIsCorrect(null);
        // Reshuffle
        const shuffled = [...shuffledItems].sort(() => Math.random() - 0.5);
        setShuffledItems(shuffled);
    };

    if (!items || items.length === 0) {
        return <div className="text-center p-8 text-gray-500">No items to reorder.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Reorder the items</h2>
                <p className="text-gray-600">Drag and drop the items below to arrange them in the correct order.</p>
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={shuffledItems} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                        {shuffledItems.map((item) => (
                            <SortableItem key={item.id} id={item.id} text={item.text} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <div className="mt-8 flex flex-col items-center">
                {!hasSubmitted ? (
                    <button
                        onClick={checkAnswer}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-200 transform hover:scale-105"
                    >
                        Check Answer
                    </button>
                ) : (
                    <div className="text-center animate-fade-in-up">
                        {isCorrect ? (
                            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg border border-green-200 flex items-center justify-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="font-bold text-lg">Correct! Well done.</span>
                            </div>
                        ) : (
                            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg border border-red-200 flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    <span className="font-bold text-lg">Incorrect. Try again!</span>
                                </div>
                                <button 
                                    onClick={reset}
                                    className="mt-2 text-sm underline text-red-700 hover:text-red-900"
                                >
                                    Try Again
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
