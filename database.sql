CREATE DATABASE IF NOT EXISTS toeic_vocab_db;
USE toeic_vocab_db;

DROP TABLE IF EXISTS vocabularies;

CREATE TABLE vocabularies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    frequency INT DEFAULT 0,
    word VARCHAR(100) NOT NULL,
    phonetic VARCHAR(100),
    meaning TEXT NOT NULL,
    part_of_speech VARCHAR(100),
    word_type_vietnamese VARCHAR(100),
    example_sentence TEXT,
    example_translation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX (word)
);
