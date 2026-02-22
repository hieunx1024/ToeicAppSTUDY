const express = require('express');
const router = express.Router();
const vocabularyController = require('../controllers/vocabularyController');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

router.get('/', vocabularyController.getVocabularies);
router.post('/', vocabularyController.createVocabulary);
router.post('/import', upload.single('file'), vocabularyController.importVocabularies);
router.delete('/:id', vocabularyController.removeVocabulary);

module.exports = router;
