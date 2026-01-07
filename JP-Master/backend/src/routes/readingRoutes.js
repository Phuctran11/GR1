import express from 'express'
import { GoogleGenerativeAI } from '@google/generative-ai'
import googleTTS from 'google-tts-api'
import { authRequired } from '../middleware/auth.js'

const router = express.Router()

const allowedGenres = ['life', 'work', 'school', 'travel', 'anime_manga', 'short_story', 'simple_news']
const allowedLengths = ['short', 'medium', 'long']
const defaultModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

function buildPrompt(vocabs, level, genre, length) {
        const forcedWords = vocabs.map(v => `${v.word} (${v.kana}) -> ${v.meaning}`).join('\n')
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

async function callGemini(prompt) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY is not set')
    }
    console.log('Using model:', defaultModel)
    console.log('API Key set:', !!process.env.GEMINI_API_KEY)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ 
        model: defaultModel,
        safetySettings: [
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ]
    })
    const result = await model.generateContent(prompt)
    console.log('Response candidates:', result.response.candidates?.length)
    console.log('Block reason:', result.response.promptFeedback?.blockReason)
    const text = result.response.text()
    console.log('Generated text length:', text?.length)
    return text
}

function parseJsonSafe(text) {
    if (!text) return null

    // Extract first JSON block if model wrapped with prose
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

function validateForcedWords(content, words) {
    return words.every(w => content.includes(w))
}

function buildQuizPrompt(reading, count) {
    // Allow 1-6 questions as requested by frontend
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

function validateQuizPayload(body) {
        if (!body || !Array.isArray(body.questions)) return 'Thiếu danh sách câu hỏi'
        if (body.questions.length === 0) return 'Không có câu hỏi'
        for (const q of body.questions) {
                if (!q.question || !Array.isArray(q.options) || q.options.length !== 4) return 'Câu hỏi thiếu dữ liệu hoặc không đủ 4 lựa chọn'
                if (!q.answer || !q.options.includes(q.answer)) return 'Đáp án không khớp lựa chọn'
                if (q.options.some(o => typeof o !== 'string' || o.length > 120)) return 'Lựa chọn quá dài hoặc không hợp lệ'
        }
        return null
}

export function setupReadingRoutes(app, pool) {
    app.post('/api/readings/generate', authRequired, async (req, res) => {
        try {
            const { vocab_ids = [], genre = 'life', length = 'medium', level = 'N5' } = req.body || {}

            if (!Array.isArray(vocab_ids) || vocab_ids.length === 0) {
                return res.status(400).json({ error: 'Cần ít nhất 1 vocab_id' })
            }
            if (!allowedGenres.includes(genre)) {
                return res.status(400).json({ error: 'Genre không hợp lệ' })
            }
            if (!allowedLengths.includes(length)) {
                return res.status(400).json({ error: 'Length không hợp lệ' })
            }

            const { rows: vocabs } = await pool.query(
                'SELECT vocab_id, word, kana, meaning FROM Vocabulary WHERE vocab_id = ANY($1::int[])',
                [vocab_ids]
            )
            if (vocabs.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy từ vựng' })
            }

            const prompt = buildPrompt(vocabs, level, genre, length)
            const raw = await callGemini(prompt)
            const parsed = parseJsonSafe(raw)
            if (!parsed || !parsed.content) {
                return res.status(502).json({ error: 'AI trả về dữ liệu không hợp lệ', raw })
            }

            if (!validateForcedWords(parsed.content, vocabs.map(v => v.word))) {
                return res.status(502).json({ error: 'AI chưa chèn đủ từ bắt buộc' })
            }

            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                const insertReading = await client.query(
                    `INSERT INTO Readings (user_id, title, content, translation, romaji_enabled, length, genre)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     RETURNING reading_id, user_id, title, content, translation, romaji_enabled, length, genre, created_at`,
                    [req.user.user_id, parsed.title || 'Untitled', parsed.content, parsed.translation_vi || null, !!parsed.romaji, length, genre]
                )
                const reading = insertReading.rows[0]

                const values = vocabs.map(v => `(${reading.reading_id}, ${v.vocab_id})`).join(',')
                if (values.length > 0) {
                    await client.query(`INSERT INTO ReadingVocab (reading_id, vocab_id) VALUES ${values}`)
                }

                await client.query('COMMIT')
                return res.json({ reading, vocab: vocabs })
            } catch (err) {
                await client.query('ROLLBACK')
                console.error('Reading insert failed:', err)
                return res.status(500).json({ error: 'Lưu bài đọc thất bại' })
            } finally {
                client.release()
            }
        } catch (err) {
            console.error('Generate reading error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi server' })
        }
    })

    // Generate comprehension quiz (no DB persistence)
    app.post('/api/readings/:id/quiz', authRequired, async (req, res) => {
        try {
            const readingId = Number(req.params.id)
            const { count = 3 } = req.body || {}
            if (!readingId) return res.status(400).json({ error: 'ID không hợp lệ' })

            const { rows: readings } = await pool.query(
                `SELECT reading_id, user_id, title, content, translation
                 FROM Readings WHERE reading_id = $1 AND user_id = $2`,
                [readingId, req.user.user_id]
            )
            if (readings.length === 0) return res.status(404).json({ error: 'Không tìm thấy bài đọc' })

            const reading = readings[0]
            if (!reading.content || !reading.content.trim()) return res.status(400).json({ error: 'Không có nội dung để tạo quiz' })

            const prompt = buildQuizPrompt(reading, count)
            const raw = await callGemini(prompt)
            const parsed = parseJsonSafe(raw)
            const validationError = validateQuizPayload(parsed)
            if (validationError) return res.status(502).json({ error: validationError, raw })

            return res.json({ quiz: parsed })
        } catch (err) {
            console.error('Generate quiz error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi server' })
        }
    })

    app.get('/api/readings/:id', authRequired, async (req, res) => {
        try {
            const readingId = Number(req.params.id)
            if (!readingId) return res.status(400).json({ error: 'ID không hợp lệ' })

            const { rows: readings } = await pool.query(
                `SELECT reading_id, user_id, title, content, translation, romaji_enabled, length, genre, created_at
                 FROM Readings WHERE reading_id = $1 AND user_id = $2`,
                [readingId, req.user.user_id]
            )
            if (readings.length === 0) return res.status(404).json({ error: 'Không tìm thấy bài đọc' })

            const { rows: vocabRows } = await pool.query(
                `SELECT v.vocab_id, v.word, v.kana, v.meaning, v.jlpt_level, v.topic
                 FROM ReadingVocab rv
                 JOIN Vocabulary v ON rv.vocab_id = v.vocab_id
                 WHERE rv.reading_id = $1`,
                [readingId]
            )

            return res.json({ reading: readings[0], vocab: vocabRows })
        } catch (err) {
            console.error('Fetch reading error:', err)
            return res.status(500).json({ error: 'Lỗi server' })
        }
    })

    // Text-to-speech for a reading (Japanese)
    app.post('/api/readings/:id/tts', authRequired, async (req, res) => {
        try {
            const readingId = Number(req.params.id)
            if (!readingId) return res.status(400).json({ error: 'ID không hợp lệ' })

            const { rows: readings } = await pool.query(
                `SELECT reading_id, user_id, content FROM Readings WHERE reading_id = $1 AND user_id = $2`,
                [readingId, req.user.user_id]
            )
            if (readings.length === 0) return res.status(404).json({ error: 'Không tìm thấy bài đọc' })

            const text = readings[0].content
            if (!text || !text.trim()) return res.status(400).json({ error: 'Không có nội dung để đọc' })

            // Generate MP3 using google-tts-api (free, rate-limited)
            // For long texts (>200 chars) use getAllAudioBase64 and concat parts into one MP3
            const ttsOptions = { lang: 'ja', slow: false, host: 'https://translate.google.com' }
            try {
                if (text.length <= 200) {
                    const base64 = await googleTTS.getAudioBase64(text, ttsOptions)
                    return res.json({ mime: 'audio/mpeg', audioBase64: base64 })
                } else {
                    // getAllAudioBase64 returns an array of base64-encoded mp3 parts
                    const parts = await googleTTS.getAllAudioBase64(text, ttsOptions)
                    // parts may be strings (base64) or objects { base64: '...' } depending on version
                    const bufs = []
                    for (const p of parts) {
                        if (typeof p === 'string') {
                            bufs.push(Buffer.from(p, 'base64'))
                        } else if (p && typeof p === 'object') {
                            if (typeof p.base64 === 'string') bufs.push(Buffer.from(p.base64, 'base64'))
                            else if (typeof p.audioBase64 === 'string') bufs.push(Buffer.from(p.audioBase64, 'base64'))
                            else if (typeof p.data === 'string') bufs.push(Buffer.from(p.data, 'base64'))
                            else if (typeof p.content === 'string') bufs.push(Buffer.from(p.content, 'base64'))
                            else {
                                console.error('Unknown TTS part format:', p)
                            }
                        } else {
                            console.error('Unsupported TTS part:', typeof p, p)
                        }
                    }
                    if (bufs.length === 0) {
                        console.error('No valid TTS parts produced', parts)
                        return res.status(500).json({ error: 'TTS returned no audio parts' })
                    }
                    const combined = Buffer.concat(bufs)
                    return res.json({ mime: 'audio/mpeg', audioBase64: combined.toString('base64') })
                }
            } catch (ttsErr) {
                console.error('TTS generation failed:', ttsErr)
                return res.status(500).json({ error: 'TTS failed', details: ttsErr.message })
            }
        } catch (err) {
            console.error('TTS error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi TTS' })
        }
    })
}

export default router