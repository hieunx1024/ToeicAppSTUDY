import React, { useState } from 'react';
import { Plus, Upload, X, Loader2, CheckCircle2 } from 'lucide-react';
import { createVocabulary, importVocabularies } from '../services/api';

const UploadForm = ({ onUploadSuccess }) => {
    const [activeTab, setActiveTab] = useState('manual');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);

    // Manual state updated with new fields
    const [manualData, setManualData] = useState({
        frequency: '',
        word: '',
        meaning: '',
        part_of_speech: '',
        word_type_vietnamese: '',
        phonetic: '',
        example_sentence: '',
        example_translation: ''
    });

    const [file, setFile] = useState(null);

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);
        try {
            await createVocabulary(manualData);
            setManualData({
                frequency: '', word: '', meaning: '', part_of_speech: '',
                word_type_vietnamese: '', phonetic: '', example_sentence: '', example_translation: ''
            });
            setStatus({ type: 'success', message: 'Word added successfully!' });
            onUploadSuccess();
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to add word.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsLoading(true);
        setStatus(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            await importVocabularies(formData);
            setFile(null);
            setStatus({ type: 'success', message: 'Import successful!' });
            onUploadSuccess();
        } catch (error) {
            setStatus({ type: 'error', message: 'Failed to import file.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="flex border-b border-gray-700">
                <button
                    className={`flex-1 py-4 text-sm font-semibold transition-all ${activeTab === 'manual' ? 'bg-primary-600/10 text-primary-400 border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('manual')}
                >
                    Manual Input
                </button>
                <button
                    className={`flex-1 py-4 text-sm font-semibold transition-all ${activeTab === 'file' ? 'bg-primary-600/10 text-primary-400 border-b-2 border-primary-500' : 'text-gray-400 hover:text-gray-200'}`}
                    onClick={() => setActiveTab('file')}
                >
                    Bulk Import
                </button>
            </div>

            <div className="p-6">
                {status && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                        {status.type === 'success' ? <CheckCircle2 size={18} /> : <X size={18} />}
                        <span className="text-sm font-medium">{status.message}</span>
                    </div>
                )}

                {activeTab === 'manual' ? (
                    <form onSubmit={handleManualSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Word</label>
                                <input
                                    type="text" required
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                                    value={manualData.word}
                                    onChange={(e) => setManualData({ ...manualData, word: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Frequency</label>
                                <input
                                    type="number"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                                    value={manualData.frequency}
                                    onChange={(e) => setManualData({ ...manualData, frequency: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Part of Speech</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                                    placeholder="e.g. verb, noun"
                                    value={manualData.part_of_speech}
                                    onChange={(e) => setManualData({ ...manualData, part_of_speech: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Từ loại (VN)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                                    placeholder="e.g. động từ"
                                    value={manualData.word_type_vietnamese}
                                    onChange={(e) => setManualData({ ...manualData, word_type_vietnamese: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Vietnamese (Meaning)</label>
                            <input
                                type="text" required
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                                value={manualData.meaning}
                                onChange={(e) => setManualData({ ...manualData, meaning: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Phonetic</label>
                            <input
                                type="text"
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none"
                                value={manualData.phonetic}
                                onChange={(e) => setManualData({ ...manualData, phonetic: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Example (EN)</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none h-20"
                                value={manualData.example_sentence}
                                onChange={(e) => setManualData({ ...manualData, example_sentence: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs uppercase tracking-wider text-gray-500 font-bold">Example Translation (VN)</label>
                            <textarea
                                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none h-20"
                                value={manualData.example_translation}
                                onChange={(e) => setManualData({ ...manualData, example_translation: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit" disabled={isLoading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                            Add Word
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleFileSubmit} className="space-y-6">
                        <div className="p-8 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center gap-4 bg-gray-900/30">
                            <Upload size={32} className="text-primary-400" />
                            <div className="text-center">
                                <p className="text-white font-semibold">Click to upload spreadsheet</p>
                                <p className="text-gray-500 text-xs">Matching headers: Frequency, Word, Vietnamese, Part of Speech, Từ loại, Phonetic, Example, Dịch ví dụ</p>
                            </div>
                            <input
                                type="file" accept=".xlsx,.xls,.pdf,.docx"
                                className="hidden" id="fileInput"
                                onChange={(e) => setFile(e.target.files[0])}
                            />
                            <button
                                type="button" onClick={() => document.getElementById('fileInput').click()}
                                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
                            >
                                Select File
                            </button>
                            {file && <div className="text-primary-400 text-sm font-medium">{file.name}</div>}
                        </div>
                        <button
                            type="submit" disabled={!file || isLoading}
                            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                            Start Import
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UploadForm;
