import { GoogleGenerativeAI } from '@google/generative-ai'
import googleTTS from 'google-tts-api'

/**
 * Service for AI reading generation and quiz creation
 */
export class ReadingService {
    constructor(pool) {
        this.pool = pool
        this.allowedGenres = ['life', 'work', 'school', 'travel', 'anime_manga', 'short_story', 'simple_news']
        this.allowedLengths = ['short', 'medium', 'long']
        this.defaultModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
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

    buildQuizPrompt(reading, count) {
        const capped = Math.max(1, Math.min(count || 3, 6))
        return `Bạn là giáo viên tiếng Nhật. Tạo ${capped} câu hỏi trắc nghiệm đọc hiểu dựa trên bài đọc tiếng Nhật dưới đây.
BÀI ĐỌC (JA):
${reading.content}

Bản dịch VI (chỉ để tham khảo ngữ cảnh, KHÔNG được sao chép tiếng Việt vào câu hỏi/options):
${reading.translation || 'N/A'}

Yêu cầu:
- Toàn bộ "question" và "options" PHẢI viết bằng tiếng Nhật (hiragana/katakana/kanji), không dùng tiếng Việt/Anh/romaji.
- Mỗi câu hỏi 4 phương án khác nhau, ngắn gọn (< 60 ký tự), tránh trùng lặp nội dung.
- answer phải khớp chính xác một trong các options.
- explanation bằng tiếng Việt, ngắn gọn, nêu lý do đáp án đúng.
- difficulty: easy | medium | hard, phân bố hợp lý.
- Không dùng markdown hay văn bản thừa. Chỉ trả JSON đúng schema.
- id lần lượt q1, q2, q3...
Schema JSON:
{
    "questions": [
        {
            "id": "q1",
            "question": "...",
            "options": ["...","...","...","..."],
            "answer": "...",
            "explanation": "...",
            "difficulty": "easy|medium|hard"
        }
    ]
}`
    }

    async callGemini(prompt) {
        if (!process.env.GEMINI_API_KEY) {
            throw new Error('GEMINI_API_KEY is not set')
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({
            model: this.defaultModel,
            safetySettings: [
                { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            ]
        })
        const result = await model.generateContent(prompt)
        return result.response.text()
    }

    parseJsonSafe(text) {
        if (!text) return null
        const match = text.match(/\{[\s\S]*\}/)
        const candidate = match ? match[0] : text
        const variants = [candidate, candidate.replace(/^```json\n?|```$/g, '').replace(/```/g, '')]

        for (const body of variants) {
            try {
                return JSON.parse(body.trim())
            } catch (err) {
                continue
            }
        }
        return null
    }

    validateForcedWords(content, words) {
        return words.every(w => content.includes(w))
    }

    validateQuizPayload(body) {
        if (!body || !Array.isArray(body.questions)) return 'Thiếu danh sách câu hỏi'
        if (body.questions.length === 0) return 'Không có câu hỏi'
        for (const q of body.questions) {
            if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) {
                return 'Câu hỏi thiếu dữ liệu hoặc không đủ 4 lựa chọn'
            }
            if (!q.answer || !q.options.includes(q.answer)) {
                return 'Đáp án không khớp lựa chọn'
            }
            if (q.options.some(o => typeof o !== 'string' || o.length > 120)) {
                return 'Lựa chọn quá dài hoặc không hợp lệ'
            }
        }
        return null
    }

    async saveReading(userId, title, content, translation, romaji, length, genre, vocabIds) {
        const client = await this.pool.connect()
        try {
            await client.query('BEGIN')
            const insertReading = await client.query(
                `INSERT INTO Readings (user_id, title, content, translation, romaji_enabled, length, genre)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING reading_id, user_id, title, content, translation, romaji_enabled, length, genre, created_at`,
                [userId, title, content, translation, !!romaji, length, genre]
            )
            const reading = insertReading.rows[0]

            if (vocabIds && vocabIds.length > 0) {
                const values = vocabIds.map(id => `(${reading.reading_id}, ${id})`).join(',')
                await client.query(`INSERT INTO ReadingVocab (reading_id, vocab_id) VALUES ${values}`)
            }

            await client.query('COMMIT')
            return reading
        } catch (err) {
            await client.query('ROLLBACK')
            throw err
        } finally {
            client.release()
        }
    }

    async getReadingById(readingId, userId) {
        const result = await this.pool.query(
            `SELECT reading_id, user_id, title, content, translation, romaji_enabled, length, genre, created_at
       FROM Readings WHERE reading_id = $1 AND user_id = $2`,
            [readingId, userId]
        )
        return result.rows[0] || null
    }

    async getReadingVocabulary(readingId) {
        const result = await this.pool.query(
            `SELECT v.vocab_id, v.word, v.kana, v.meaning, v.jlpt_level, v.topic
       FROM ReadingVocab rv
       JOIN Vocabulary v ON rv.vocab_id = v.vocab_id
       WHERE rv.reading_id = $1`,
            [readingId]
        )
        return result.rows
    }

    async generateTTS(text) {
        const ttsOptions = { lang: 'ja', slow: false, host: 'https://translate.google.com' }

        if (text.length <= 200) {
            const base64 = await googleTTS.getAudioBase64(text, ttsOptions)
            return { mime: 'audio/mpeg', audioBase64: base64 }
        }

        const parts = await googleTTS.getAllAudioBase64(text, ttsOptions)
        const bufs = []
        for (const p of parts) {
            if (typeof p === 'string') {
                bufs.push(Buffer.from(p, 'base64'))
            } else if (p && typeof p === 'object') {
                const b64 = p.base64 || p.audioBase64 || p.data || p.content
                if (typeof b64 === 'string') bufs.push(Buffer.from(b64, 'base64'))
            }
        }

        if (bufs.length === 0) {
            throw new Error('TTS returned no audio parts')
        }

        const combined = Buffer.concat(bufs)
        return { mime: 'audio/mpeg', audioBase64: combined.toString('base64') }
    }
}
