import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vocabularies';

export const getVocabularies = () => axios.get(API_URL);
export const createVocabulary = (data) => axios.post(API_URL, data);
export const deleteVocabulary = (id) => axios.delete(`${API_URL}/${id}`);
export const importVocabularies = (formData) => axios.post(`${API_URL}/import`, formData, {
    headers: {
        'Content-Type': 'multipart/form-data'
    },
    timeout: 300000 // 5 minutes timeout for large files
});
