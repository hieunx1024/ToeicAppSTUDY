import React from 'react';
import { Trash2 } from 'lucide-react';
import { deleteVocabulary } from '../services/api';

const VocabularyList = ({ vocabularies, onDeleteSuccess }) => {
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this word?')) {
            try {
                await deleteVocabulary(id);
                onDeleteSuccess();
            } catch (error) {
                alert('Failed to delete word');
            }
        }
    };

    return (
        <div className="bg-gray-800 rounded-2xl border border-gray-700 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center bg-gray-900/50">
                <h3 className="text-xl font-bold text-white">Your Vocabulary</h3>
                <span className="bg-primary-900/30 text-primary-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {vocabularies.length} Words
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-900/30 text-gray-500 text-xs uppercase tracking-wider">
                            <th className="px-6 py-4 font-bold">Freq</th>
                            <th className="px-6 py-4 font-bold">Word</th>
                            <th className="px-6 py-4 font-bold">Meaning (VN)</th>
                            <th className="px-6 py-4 font-bold">POS / Từ loại</th>
                            <th className="px-6 py-4 font-bold">Examples</th>
                            <th className="px-6 py-4 font-bold text-right">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                        {vocabularies.map((vocab) => (
                            <tr key={vocab.id} className="hover:bg-gray-700/30 transition-all group">
                                <td className="px-6 py-4 text-gray-500 font-medium">#{vocab.frequency}</td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <span className="text-white font-bold text-lg">{vocab.word}</span>
                                        <span className="text-primary-400/80 text-xs font-medium">{vocab.phonetic || '/ - /'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-300 font-medium">
                                    {vocab.meaning}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-xs px-2 py-0.5 rounded bg-blue-900/30 text-blue-400 border border-blue-800/50 w-fit">
                                            {vocab.part_of_speech || 'N/A'}
                                        </span>
                                        <span className="text-xs text-gray-500 italic">
                                            {vocab.word_type_vietnamese || '-'}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="max-w-xs">
                                        <p className="text-gray-400 text-xs line-clamp-1 italic">"{vocab.example_sentence}"</p>
                                        <p className="text-gray-500 text-[10px] line-clamp-1">{vocab.example_translation}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => handleDelete(vocab.id)}
                                        className="p-2 text-gray-600 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {vocabularies.length === 0 && (
                    <div className="p-12 text-center text-gray-500">No words found.</div>
                )}
            </div>
        </div>
    );
};

export default VocabularyList;
