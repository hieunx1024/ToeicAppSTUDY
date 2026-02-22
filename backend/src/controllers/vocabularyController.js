const vocabularyService = require('../services/vocabularyService');
const fileService = require('../services/fileService');
const path = require('path');
const fs = require('fs');

const createVocabulary = async (req, res) => {
    try {
        const id = await vocabularyService.addVocabulary(req.body);
        res.status(201).json({ message: 'Vocabulary added successfully', id });
    } catch (error) {
        console.error('Error in createVocabulary:', error);
        res.status(500).json({ error: error.message });
    }
};

const getVocabularies = async (req, res) => {
    try {
        const vocabularies = await vocabularyService.getAllVocabularies();
        res.json(vocabularies);
    } catch (error) {
        console.error('Error in getVocabularies:', error);
        res.status(500).json({ error: error.message });
    }
};

const importVocabularies = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const filePath = req.file.path;
        const extension = path.extname(req.file.originalname).toLowerCase();
        let vocabList = [];

        if (extension === '.xlsx' || extension === '.xls') {
            vocabList = await fileService.parseExcel(filePath);
        } else if (extension === '.pdf') {
            vocabList = await fileService.parsePDF(filePath);
        } else if (extension === '.docx') {
            vocabList = await fileService.parseWord(filePath);
        } else {
            return res.status(400).json({ error: 'Unsupported file format' });
        }

        if (vocabList.length === 0) {
            fs.unlinkSync(filePath);
            return res.status(400).json({
                error: 'No vocabulary items found in file. Please check the file format or column headers.'
            });
        }

        const results = await vocabularyService.bulkAddVocabulary(vocabList);
        const successCount = results.filter(r => r.status === 'success').length;

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.json({
            message: `Import completed: ${successCount} words added.`,
            total: vocabList.length,
            successCount,
            results
        });
    } catch (error) {
        console.error('Error in importVocabularies:', error);
        res.status(500).json({ error: error.message });
    }
};

const removeVocabulary = async (req, res) => {
    try {
        await vocabularyService.deleteVocabulary(req.params.id);
        res.json({ message: 'Vocabulary deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createVocabulary, getVocabularies, importVocabularies, removeVocabulary };
