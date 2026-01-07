-- ============================================================
-- Migration: Insert Sample Vocabulary Data
-- Description: Load 60 sample vocabulary items for all JLPT levels
-- Date: 2025-01-07
-- ============================================================

BEGIN;

-- Level N5 (Beginner)
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
('木', 'き', 'cây', 'N5', 'Nature')
ON CONFLICT DO NOTHING;

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
('連絡', 'れんらく', 'liên lạc', 'N4', 'General')
ON CONFLICT DO NOTHING;

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
('可能', 'かのう', 'khả năng', 'N3', 'General')
ON CONFLICT DO NOTHING;

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
('適用', 'てきよう', 'áp dụng', 'N2', 'General')
ON CONFLICT DO NOTHING;

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
('網羅', 'もうら', 'bao quát', 'N1', 'General')
ON CONFLICT DO NOTHING;

-- Level SP (Specialized - IT)
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
('障害', 'しょうがい', 'sự cố', 'SP', 'IT')
ON CONFLICT DO NOTHING;

-- Record this migration
INSERT INTO migrations_history (migration_name, description)
VALUES ('003_insert_sample_vocabulary', 'Insert 60 sample vocabulary items for all JLPT levels')
ON CONFLICT (migration_name) DO NOTHING;

COMMIT;
