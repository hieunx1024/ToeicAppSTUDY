const xlsx = require('xlsx');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');
const fs = require('fs');

const parseExcel = async (filePath) => {
    const workbook = xlsx.readFile(filePath);
    let allData = [];

    // Duyệt qua tất cả các sheet có trong file
    workbook.SheetNames.forEach(sheetName => {
        const datasheet = workbook.Sheets[sheetName];

        // 1. Tìm dòng chứa tiêu đề để bỏ qua rác ở đầu file (do convert từ PDF)
        const rows = xlsx.utils.sheet_to_json(datasheet, { header: 1 });
        let headerRowIndex = -1;
        for (let i = 0; i < Math.min(rows.length, 20); i++) {
            const row = rows[i];
            if (row && row.some(cell => cell && (cell.toString().toLowerCase().includes('word') || cell.toString().toLowerCase().includes('vocabulary') || cell.toString().toLowerCase().includes('từ vựng')))) {
                headerRowIndex = i;
                break;
            }
        }

        // Parse lại từ dòng tiêu đề tìm được
        const data = xlsx.utils.sheet_to_json(datasheet, {
            range: headerRowIndex === -1 ? 0 : headerRowIndex,
            defval: ""
        });

        if (data.length === 0) return;

        console.log(`Sheet "${sheetName}": Bắt đầu từ dòng ${headerRowIndex + 1}. Tìm thấy ${data.length} hàng.`);

        // 2. Thử mapping chuẩn
        const mappedData = data.map(item => {
            const cleanItem = {};
            Object.keys(item).forEach(k => cleanItem[k.toString().trim()] = item[k]);

            const word = (cleanItem['Word'] || cleanItem['word'] || cleanItem['Vocabulary'] || cleanItem['Từ vựng'] || cleanItem['Từ'] || "").toString().trim();
            // Bỏ qua chính dòng tiêu đề rác nếu bị parse nhầm
            if (!word || word.toLowerCase().includes('word') || word.toLowerCase().includes('vocabulary')) return null;

            return {
                frequency: cleanItem['Frequency'] || cleanItem['frequency'] || cleanItem['No'] || cleanItem['STT'] || cleanItem['No.'] || 0,
                word: word,
                meaning: cleanItem['Vietnamese'] || cleanItem['vietnamese'] || cleanItem['Meaning'] || cleanItem['Nghĩa'] || cleanItem['Dịch'] || cleanItem['Nghĩa tiếng Việt'] || '',
                part_of_speech: cleanItem['Part of Speech'] || cleanItem['part_of_speech'] || cleanItem['Type'] || cleanItem['Loại từ'] || cleanItem['Từ loại'] || '',
                word_type_vietnamese: cleanItem['Từ loại'] || cleanItem['tu_loai'] || cleanItem['VN Type'] || '',
                phonetic: cleanItem['Phonetic'] || cleanItem['phonetic'] || cleanItem['Pronunciation'] || cleanItem['Phiên âm'] || '',
                example_sentence: cleanItem['Example'] || cleanItem['example'] || cleanItem['Context'] || cleanItem['Ví dụ'] || cleanItem['Câu ví dụ'] || '',
                example_translation: cleanItem['Dịch ví dụ'] || cleanItem['dich_vi_du'] || cleanItem['Example Translation'] || cleanItem['Bản dịch'] || ''
            };
        }).filter(item => item !== null);

        if (mappedData.length > 0) {
            allData = [...allData, ...mappedData];
        } else {
            // 2. Fallback: Parse "Siêu cấp" dùng Regex (Dành cho file lỗi cột do scan)
            console.log(`Sheet "${sheetName}": Không tìm thấy cột chuẩn, kích hoạt Parser Regex...`);

            data.forEach(row => {
                const rowString = Object.values(row).join("  ");

                // Mẫu mở rộng: Thêm preposition, article, v.v. để không bị lẫn vào Meaning
                const posPattern = "verb|noun|adj|adv|pronoun|prep|preposition|conj|conjunction|det|determiner|article|exclamation|interjection|động từ|danh từ|tính từ|trạng từ|giới từ|liên từ|mạo từ|thán từ";
                const regex = new RegExp(`(\\d{1,4})\\s+([a-zA-Z\\s\\-]{2,})\\s+([\\u00C0-\\u1EF9a-zA-Z\\s,;]{2,})\\s+(${posPattern})\\s+([\\u00C0-\\u1EF9a-zA-Z\\s,;]+?)\\s+(\\/.*?\\/)`, "gi");

                let foundAnyInRow = false;
                let match;
                while ((match = regex.exec(rowString)) !== null) {
                    allData.push({
                        frequency: match[1],
                        word: match[2].trim(),
                        meaning: match[3].trim(),
                        part_of_speech: match[4].trim(),
                        word_type_vietnamese: match[5].trim(),
                        phonetic: match[6].trim(),
                        example_sentence: "", example_translation: ""
                    });
                    foundAnyInRow = true;
                }

                // Nếu mẫu dài không khớp, thử tìm mẫu ngắn hơn nhưng có POS
                if (!foundAnyInRow) {
                    const midRegex = new RegExp(`(\\d{1,4})\\s+([a-zA-Z\\-]{2,})\\s+([\\u00C0-\\u1EF9a-zA-Z\\s,;]{2,})\\s+(${posPattern})`, "gi");
                    let mMatch;
                    while ((mMatch = midRegex.exec(rowString)) !== null) {
                        allData.push({
                            frequency: mMatch[1],
                            word: mMatch[2].trim(),
                            meaning: mMatch[3].trim(),
                            part_of_speech: mMatch[4].trim(),
                            word_type_vietnamese: "", phonetic: "",
                            example_sentence: "", example_translation: ""
                        });
                        foundAnyInRow = true;
                    }
                }

                // Dự phòng cuối cùng: [Số] [Từ Anh] [Nghĩa Việt] 
                if (!foundAnyInRow) {
                    const simpleRegex = /(\d{1,4})\s+([a-zA-Z\-]{2,})\s+([\u00C0-\u1EF9a-zA-Z\s,;]{2,})/gi;
                    let sMatch;
                    while ((sMatch = simpleRegex.exec(rowString)) !== null) {
                        allData.push({
                            frequency: sMatch[1],
                            word: sMatch[2].trim(),
                            meaning: sMatch[3].trim(),
                            part_of_speech: "", word_type_vietnamese: "", phonetic: "",
                            example_sentence: "", example_translation: ""
                        });
                    }
                }
            });
        }
    });

    console.log(`Excel import process finished. Total valid vocabularies found: ${allData.length}`);
    return allData;
};

const parsePDF = async (filePath) => {
    console.log(`Starting PDF parse for: ${filePath}`);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    const text = data.text;

    const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);
    console.log(`PDF text extracted. Found ${lines.length} non-empty lines.`);

    const vocabularies = [];
    for (const line of lines) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2 && parts[0].length > 0) {
            vocabularies.push({
                word: parts[0],
                meaning: parts[1],
                example_sentence: parts[2] || '',
                example_translation: parts[3] || '',
                frequency: 0,
                phonetic: '',
                part_of_speech: '',
                word_type_vietnamese: ''
            });
        }
    }
    console.log(`Parsed ${vocabularies.length} vocabulary items from PDF.`);
    return vocabularies;
};

const parseWord = async (filePath) => {
    const result = await mammoth.extractRawText({ path: filePath });
    const text = result.value;
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const vocabularies = [];

    for (const line of lines) {
        const parts = line.split('|').map(p => p.trim());
        if (parts.length >= 2) {
            vocabularies.push({
                word: parts[0],
                meaning: parts[1],
                example_sentence: parts[2] || '',
                example_translation: parts[3] || '',
                frequency: 0,
                phonetic: '',
                part_of_speech: '',
                word_type_vietnamese: ''
            });
        }
    }
    return vocabularies;
};

module.exports = { parseExcel, parsePDF, parseWord };
