import React, { useState, useEffect } from 'react';
import Flashcard from './components/Flashcard';
import UploadForm from './components/UploadForm';
import VocabularyList from './components/VocabularyList';
import { getVocabularies } from './services/api';
import { BookOpen, Languages, LayoutGrid, Layers } from 'lucide-react';

function App() {
    const [vocabularies, setVocabularies] = useState([]);
    const [activeView, setActiveView] = useState('flashcards');

    const fetchVocabularies = async () => {
        try {
            const response = await getVocabularies();
            setVocabularies(response.data);
        } catch (error) {
            console.error('Error fetching vocabularies:', error);
        }
    };

    useEffect(() => {
        fetchVocabularies();
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200">
            {/* Header */}
            <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-600 rounded-lg shadow-lg shadow-primary-900/40">
                            <Languages className="text-white" size={24} />
                        </div>
                        <h1 className="text-2xl font-black bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent tracking-tight">
                            TOEIC<span className="text-primary-500">Hub</span>
                        </h1>
                    </div>

                    <nav className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setActiveView('flashcards')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'flashcards' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <Layers size={16} />
                            Flashcards
                        </button>
                        <button
                            onClick={() => setActiveView('list')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeView === 'list' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                        >
                            <LayoutGrid size={16} />
                            Word List
                        </button>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Input Form */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-32">
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-white mb-2">Build Your Lexicon</h2>
                                <p className="text-slate-500">Add new words manually or import in bulk to expand your TOEIC and IT vocabulary.</p>
                            </div>
                            <UploadForm onUploadSuccess={fetchVocabularies} />
                        </div>
                    </div>

                    {/* Right Column: Dynamic View */}
                    <div className="lg:col-span-8">
                        <div className="min-h-[600px]">
                            {activeView === 'flashcards' ? (
                                <div className="space-y-12">
                                    <div className="text-center">
                                        <h2 className="text-4xl font-extrabold text-white mb-4">Study Mode</h2>
                                        <p className="text-slate-400 max-w-lg mx-auto">Master these words using our interactive flashcard system. Click to flip, swipe to advance.</p>
                                    </div>
                                    <Flashcard vocabularies={vocabularies} />
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <h2 className="text-3xl font-bold text-white mb-2">Word Management</h2>
                                            <p className="text-slate-500">Review and manage your entire vocabulary collection.</p>
                                        </div>
                                    </div>
                                    <VocabularyList vocabularies={vocabularies} onDeleteSuccess={fetchVocabularies} />
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer Decoration */}
            <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary-600 via-purple-600 to-indigo-600 opacity-50"></div>
        </div>
    );
}

export default App;
