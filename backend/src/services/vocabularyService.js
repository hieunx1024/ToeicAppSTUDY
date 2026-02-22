const db = require('../config/db');
const { fetchPhonetics } = require('./dictionaryService');

const addVocabulary = async (vocabData) => {
    let {
        frequency,
        word,
        phonetic,
        meaning,
        part_of_speech,
        word_type_vietnamese,
        example_sentence,
        example_translation
    } = vocabData;

    if (!phonetic && word) {
        phonetic = await fetchPhonetics(word);
    }

    const [result] = await db.execute(
        `INSERT INTO vocabularies 
        (frequency, word, phonetic, meaning, part_of_speech, word_type_vietnamese, example_sentence, example_translation) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            frequency || 0,
            word,
            phonetic,
            meaning,
            part_of_speech,
            word_type_vietnamese,
            example_sentence,
            example_translation
        ]
    );
    return result.insertId;
};

const bulkAddVocabulary = async (vocabList) => {
    const results = [];
    const query = `INSERT INTO vocabularies 
        (frequency, word, phonetic, meaning, part_of_speech, word_type_vietnamese, example_sentence, example_translation) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    for (const vocab of vocabList) {
        try {
            const [result] = await db.execute(query, [
                vocab.frequency || 0,
                vocab.word,
                vocab.phonetic || '',
                vocab.meaning,
                vocab.part_of_speech || '',
                vocab.word_type_vietnamese || '',
                vocab.example_sentence || '',
                vocab.example_translation || ''
            ]);
            results.push({ word: vocab.word, status: 'success', id: result.insertId });
        } catch (error) {
            results.push({ word: vocab.word, status: 'error', error: error.message });
        }
    }
    return results;
};

const getAllVocabularies = async () => {
    const [rows] = await db.execute('SELECT * FROM vocabularies ORDER BY frequency ASC, created_at DESC');
    return rows;
};

const deleteVocabulary = async (id) => {
    await db.execute('DELETE FROM vocabularies WHERE id = ?', [id]);
};

module.exports = { addVocabulary, bulkAddVocabulary, getAllVocabularies, deleteVocabulary };
