import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, Volume2 } from 'lucide-react';

const Flashcard = ({ vocabularies }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);

    if (!vocabularies || vocabularies.length === 0) {
        return (
            <div className="flex items-center justify-center p-12 bg-gray-800 rounded-xl border border-gray-700">
                <p className="text-gray-400">No vocabulary available.</p>
            </div>
        );
    }

    const current = vocabularies[currentIndex];

    const nextCard = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev + 1) % vocabularies.length);
    };

    const prevCard = () => {
        setFlipped(false);
        setCurrentIndex((prev) => (prev - 1 + vocabularies.length) % vocabularies.length);
    };

    const handleFlip = () => setFlipped(!flipped);

    return (
        <div className="flex flex-col items-center gap-8 py-8">
            <div className="relative w-full max-w-md h-96 perspective-1000 group cursor-pointer" onClick={handleFlip}>
                <motion.div
                    className="relative w-full h-full duration-500 transition-transform flex items-center justify-center rounded-2xl shadow-2xl border-2 border-primary-500/30"
                    initial={false}
                    animate={{ rotateY: flipped ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 bg-gray-900 rounded-xl">
                        <div className="absolute top-4 left-6 text-gray-600 font-bold text-sm">#{current.frequency}</div>
                        <span className="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-4">
                            {current.part_of_speech || 'Vocabulary'}
                        </span>
                        <h2 className="text-5xl font-bold mb-4 text-white text-center">
                            {current.word}
                        </h2>
                        <div className="flex items-center gap-2 text-primary-300">
                            <span className="text-xl font-light">{current.phonetic || '/ - /'}</span>
                        </div>
                        <div className="mt-8 text-gray-600 text-sm italic">Click to flip</div>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-gray-800 rounded-xl">
                        <span className="text-sm font-semibold text-primary-400 uppercase tracking-widest mb-4">
                            {current.word_type_vietnamese || 'Meaning'}
                        </span>
                        <h3 className={`font-bold mb-6 text-white text-center leading-tight ${current.meaning.length > 50 ? 'text-lg' : current.meaning.length > 30 ? 'text-xl' : 'text-3xl'
                            }`}>
                            {current.meaning}
                        </h3>

                        {(current.example_sentence || current.example_translation) && (
                            <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 w-full space-y-3">
                                {current.example_sentence && (
                                    <p className="text-gray-200 italic text-sm text-center">
                                        "{current.example_sentence}"
                                    </p>
                                )}
                                {current.example_translation && (
                                    <p className="text-primary-400/80 text-xs text-center border-t border-gray-700/50 pt-2">
                                        {current.example_translation}
                                    </p>
                                )}
                            </div>
                        )}
                        <div className="mt-8 text-gray-500 text-sm italic">Click to flip back</div>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={(e) => { e.stopPropagation(); prevCard(); }}
                    className="p-3 rounded-full bg-gray-800 text-white hover:bg-primary-600 transition-all border border-gray-700"
                >
                    <ChevronLeft size={24} />
                </button>
                <div className="text-gray-400 font-medium font-mono">
                    {currentIndex + 1} / {vocabularies.length}
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); nextCard(); }}
                    className="p-3 rounded-full bg-gray-800 text-white hover:bg-primary-600 transition-all border border-gray-700"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
};

export default Flashcard;
