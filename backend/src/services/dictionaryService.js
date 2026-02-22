const axios = require('axios');

const fetchPhonetics = async (word) => {
    try {
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
            timeout: 5000 // 5 seconds
        });
        const data = response.data[0];

        // Find phonetic text
        let phonetic = data.phonetic || '';
        if (!phonetic && data.phonetics && data.phonetics.length > 0) {
            const found = data.phonetics.find(p => p.text);
            if (found) phonetic = found.text;
        }

        return phonetic;
    } catch (error) {
        console.error(`Error fetching phonetics for ${word}:`, error.message);
        return '';
    }
};

module.exports = { fetchPhonetics };
