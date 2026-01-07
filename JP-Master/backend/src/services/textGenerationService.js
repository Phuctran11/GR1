import { AIService } from './aiService.js'

/**
 * Service tạo reading text từ vocabulary
 */
export class TextGenerationService {
    constructor(pool) {
        this.pool = pool
        this.aiService = new AIService()
        this.allowedGenres = ['life', 'work', 'school', 'travel', 'anime_manga', 'short_story', 'simple_news']
        this.allowedLengths = ['short', 'medium', 'long']
    }

    async getVocabularyByIds(vocabIds) {
        const result = await this.pool.query(
            'SELECT vocab_id, word, kana, meaning FROM Vocabulary WHERE vocab_id = ANY($1::int[])',
            [vocabIds]
        )
        return result.rows
    }

    buildReadingPrompt(vocabs, level, genre, length) {
        const lengthHint = {
            short: '80-120 chữ',
            medium: '150-220 chữ',
            long: '250-350 chữ',
        }[length] || '150-220 chữ'

        return `Bạn là giáo viên tiếng Nhật. Viết bài đọc TIẾNG NHẬT THUẦN (không markdown, không tiếng Việt/Anh trong title và content) độ dài ~${lengthHint}, thể loại ${genre}, trình độ ${level}.
Bài đọc phải chứa TẤT CẢ các từ sau và giữ nguyên hình thức đã cho (không đổi kana/kanji): ${vocabs.map(v => v.word).join(', ')}.
Chỉ trả về JSON thuần, không thêm giải thích:
{
    "title": "tiếng Nhật",
    "content": "bài đọc tiếng Nhật, giữ nguyên xuống dòng bằng \\n, không romaji",
    "translation_vi": "bản dịch tiếng Việt cho toàn bộ content",
    "romaji": "có thể bỏ trống hoặc để romaji cho toàn bộ content"
}
Quy tắc:
- Không thêm trường khác ngoài schema.
- Title và content PHẢI là tiếng Nhật, không chèn tiếng Việt/Anh.
- Ưu tiên câu ngắn, tự nhiên và chứa đầy đủ từ bắt buộc.
- Không thêm markdown hay ký hiệu dư thừa.`
    }

    validateForcedWords(content, words) {
        return words.every(w => content.includes(w))
    }

    async generateReading(vocabs, level, genre, length) {
        const prompt = this.buildReadingPrompt(vocabs, level, genre, length)
        const raw = await this.aiService.callGemini(prompt)
        const parsed = this.aiService.parseJsonSafe(raw)

        if (!parsed || !parsed.content) {
            throw new Error('AI trả về dữ liệu không hợp lệ')
        }

        if (!this.validateForcedWords(parsed.content, vocabs.map(v => v.word))) {
            throw new Error('AI chưa chèn đủ từ bắt buộc')
        }

        return parsed
    }

    // Lưu reading vào database với is_temporary = true
    // Tự động expire sau 3 ngày
    async saveReadingToDB(userId, title, content, translation, romaji, length, genre) {
        const expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 ngày
        
        const result = await this.pool.query(
            `INSERT INTO Readings (user_id, title, content, translation, romaji_enabled, length, genre, is_temporary, expires_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8)
             RETURNING reading_id, user_id, title, content, translation, romaji_enabled, length, genre, created_at`,
            [userId, title, content, translation, !!romaji, length, genre, expiresAt]
        )
        return result.rows[0]
    }

    // Lấy reading từ database
    async getReadingById(readingId, userId) {
        const result = await this.pool.query(
            'SELECT reading_id, user_id, title, content, translation, romaji_enabled, length, genre, created_at FROM Readings WHERE reading_id = $1 AND user_id = $2',
            [readingId, userId]
        )
        return result.rows[0] || null
    }
}
