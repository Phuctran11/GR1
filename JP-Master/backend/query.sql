-- Bảng người dùng
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng từ vựng
CREATE TABLE Vocabulary (
    vocab_id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    kana VARCHAR(50) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    jlpt_level VARCHAR(2) CHECK (jlpt_level IN ('N5','N4','N3','N2','N1')),
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng flashcard lưu trạng thái học từ của người dùng
CREATE TABLE UserFlashcards (
    user_id INT,
    vocab_id INT,
    status VARCHAR(15) CHECK (status IN ('remembered','not_remembered')) DEFAULT 'not_remembered',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vocab_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (vocab_id) REFERENCES Vocabulary(vocab_id)
);

-- Bảng lưu từ vựng người dùng chọn để ôn tập
CREATE TABLE UserSelectedVocab (
    user_id INT,
    vocab_id INT,
    selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, vocab_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (vocab_id) REFERENCES Vocabulary(vocab_id)
);

-- Bảng bài đọc do AI tạo ra
CREATE TABLE Readings (
    reading_id SERIAL PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    content TEXT NOT NULL,
    translation TEXT,
    romaji_enabled BOOLEAN DEFAULT FALSE,
    length VARCHAR(6) CHECK (length IN ('short','medium','long')) DEFAULT 'medium',
    genre VARCHAR(20) CHECK (genre IN ('life','work','school','travel','anime_manga','short_story','simple_news')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Bảng liên kết giữa bài đọc và từ vựng
CREATE TABLE ReadingVocab (
    reading_id INT,
    vocab_id INT,
    PRIMARY KEY (reading_id, vocab_id),
    FOREIGN KEY (reading_id) REFERENCES Readings(reading_id),
    FOREIGN KEY (vocab_id) REFERENCES Vocabulary(vocab_id)
);

-- Bảng lưu audio bài đọc
CREATE TABLE ReadingAudio (
    audio_id SERIAL PRIMARY KEY,
    reading_id INT,
    gender VARCHAR(6) CHECK (gender IN ('male','female')),
    speed VARCHAR(4) CHECK (speed IN ('0.75','1','1.25')) DEFAULT '1',
    audio_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reading_id) REFERENCES Readings(reading_id)
);

-- Bảng quiz đọc hiểu
CREATE TABLE Quizzes (
    quiz_id SERIAL PRIMARY KEY,
    reading_id INT,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    wrong_answers TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reading_id) REFERENCES Readings(reading_id)
);

-- Bảng lưu kết quả quiz người dùng làm
CREATE TABLE UserQuizResults (
    user_id INT,
    quiz_id INT,
    user_answer TEXT,
    is_correct BOOLEAN,
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, quiz_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (quiz_id) REFERENCES Quizzes(quiz_id)
);
