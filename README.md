# TOEIC & IT English Vocabulary App

A web application to manage and learn vocabulary using flashcards.

## Features
- Manual word addition
- Bulk import from Excel, PDF, and Word
- Auto-phonetic fetching from Dictionary API
- Interactive Flashcards
- Word management list

## Setup Instructions

### Backend
1. Go to `backend` directory.
2. Install dependencies: `npm install`
3. Create a MySQL database and run the `database.sql` script.
4. Update `backend/.env` with your database credentials.
5. Start the server: `npm run dev`

### Frontend
1. Go to `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Import Templates
The app supports:
- **XLSX**: Headers should be `word`, `phonetic`, `meaning`, `example_sentence`, `word_type`.
- **PDF/Word**: Format should be `word | meaning | example_sentence` (one per line).
# ToeicAppSTUDY
