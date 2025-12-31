
-- Bảng người dùng
CREATE TABLE Users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Vocabulary (
    vocab_id SERIAL PRIMARY KEY,
    word VARCHAR(50) NOT NULL,
    kana VARCHAR(50) NOT NULL,
    meaning VARCHAR(255) NOT NULL,
    jlpt_level VARCHAR(2) CHECK (jlpt_level IN ('N5','N4','N3','N2','N1','SP')),
    topic VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Thêm 10 từ vựng cho mỗi level (N5, N4, N3, N2, N1, SP)
-- Level N5
INSERT INTO Vocabulary (word, kana, meaning, jlpt_level, topic) VALUES
('水', 'みず', 'nước', 'N5', 'Nature'),
('火', 'ひ', 'lửa', 'N5', 'Nature'),
('山', 'やま', 'núi', 'N5', 'Nature'),
('川', 'かわ', 'sông', 'N5', 'Nature'),
('犬', 'いぬ', 'chó', 'N5', 'Animal'),
('猫', 'ねこ', 'mèo', 'N5', 'Animal'),
('人', 'ひと', 'người', 'N5', 'General'),
('日', 'ひ', 'ngày/mặt trời', 'N5', 'Time'),
('月', 'つき', 'mặt trăng/tháng', 'N5', 'Time'),
('木', 'き', 'cây', 'N5', 'Nature');

-- Level N4
INSERT INTO Vocabulary (word, kana, meaning, jlpt_level, topic) VALUES
('必要', 'ひつよう', 'cần thiết', 'N4', 'General'),
('特別', 'とくべつ', 'đặc biệt', 'N4', 'General'),
('場合', 'ばあい', 'trường hợp', 'N4', 'General'),
('最近', 'さいきん', 'gần đây', 'N4', 'Time'),
('経験', 'けいけん', 'kinh nghiệm', 'N4', 'General'),
('準備', 'じゅんび', 'chuẩn bị', 'N4', 'General'),
('安心', 'あんしん', 'an tâm', 'N4', 'Feeling'),
('大事', 'だいじ', 'quan trọng', 'N4', 'General'),
('約束', 'やくそく', 'hứa hẹn', 'N4', 'General'),
('連絡', 'れんらく', 'liên lạc', 'N4', 'General');

-- Level N3
INSERT INTO Vocabulary (word, kana, meaning, jlpt_level, topic) VALUES
('影響', 'えいきょう', 'ảnh hưởng', 'N3', 'General'),
('状況', 'じょうきょう', 'tình trạng', 'N3', 'General'),
('管理', 'かんり', 'quản lý', 'N3', 'Business'),
('詳細', 'しょうさい', 'chi tiết', 'N3', 'General'),
('報告', 'ほうこく', 'báo cáo', 'N3', 'Business'),
('判断', 'はんだん', 'phán đoán', 'N3', 'General'),
('責任', 'せきにん', 'trách nhiệm', 'N3', 'General'),
('条件', 'じょうけん', 'điều kiện', 'N3', 'General'),
('結果', 'けっか', 'kết quả', 'N3', 'General'),
('可能', 'かのう', 'khả năng', 'N3', 'General');

-- Level N2
INSERT INTO Vocabulary (word, kana, meaning, jlpt_level, topic) VALUES
('実施', 'じっし', 'thực thi', 'N2', 'Business'),
('提案', 'ていあん', 'đề xuất', 'N2', 'Business'),
('解決', 'かいけつ', 'giải quyết', 'N2', 'General'),
('維持', 'いじ', 'duy trì', 'N2', 'General'),
('発展', 'はってん', 'phát triển', 'N2', 'General'),
('支援', 'しえん', 'hỗ trợ', 'N2', 'General'),
('調整', 'ちょうせい', 'điều chỉnh', 'N2', 'General'),
('確保', 'かくほ', 'đảm bảo', 'N2', 'General'),
('分析', 'ぶんせき', 'phân tích', 'N2', 'General'),
('適用', 'てきよう', 'áp dụng', 'N2', 'General');

-- Level N1
INSERT INTO Vocabulary (word, kana, meaning, jlpt_level, topic) VALUES
('概念', 'がいねん', 'khái niệm', 'N1', 'General'),
('認識', 'にんしき', 'nhận thức', 'N1', 'General'),
('促進', 'そくしん', 'thúc đẩy', 'N1', 'General'),
('徹底', 'てってい', 'triệt để', 'N1', 'General'),
('把握', 'はあく', 'nắm bắt', 'N1', 'General'),
('遂行', 'すいこう', 'thực hiện', 'N1', 'General'),
('遵守', 'じゅんしゅ', 'tuân thủ', 'N1', 'General'),
('緩和', 'かんわ', 'nới lỏng', 'N1', 'General'),
('排除', 'はいじょ', 'loại bỏ', 'N1', 'General'),
('網羅', 'もうら', 'bao quát', 'N1', 'General');

-- Level SP (Chuyên ngành)
INSERT INTO Vocabulary (word, kana, meaning, jlpt_level, topic) VALUES
('解析', 'かいせき', 'phân tích (kỹ thuật)', 'SP', 'IT'),
('設計', 'せっけい', 'thiết kế', 'SP', 'IT'),
('開発', 'かいはつ', 'phát triển (phần mềm)', 'SP', 'IT'),
('運用', 'うんよう', 'vận hành', 'SP', 'IT'),
('保守', 'ほしゅ', 'bảo trì', 'SP', 'IT'),
('要件', 'ようけん', 'yêu cầu', 'SP', 'IT'),
('仕様', 'しよう', 'đặc tả', 'SP', 'IT'),
('検証', 'けんしょう', 'kiểm chứng', 'SP', 'IT'),
('導入', 'どうにゅう', 'triển khai', 'SP', 'IT'),
('障害', 'しょうがい', 'sự cố', 'SP', 'IT');

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
