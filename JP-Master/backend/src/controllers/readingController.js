import { ReadingService } from '../services/readingService.js'

/**
 * Controller for reading generation and TTS endpoints
 */
export class ReadingController {
    constructor(pool) {
        this.readingService = new ReadingService(pool)
    }

    generateReading = async (req, res) => {
        try {
            const { vocab_ids = [], genre = 'life', length = 'medium', level = 'N5' } = req.body || {}

            if (!Array.isArray(vocab_ids) || vocab_ids.length === 0) {
                return res.status(400).json({ error: 'Cần ít nhất 1 vocab_id' })
            }
            if (!this.readingService.allowedGenres.includes(genre)) {
                return res.status(400).json({ error: 'Genre không hợp lệ' })
            }
            if (!this.readingService.allowedLengths.includes(length)) {
                return res.status(400).json({ error: 'Length không hợp lệ' })
            }

            const vocabs = await this.readingService.getVocabularyByIds(vocab_ids)
            if (vocabs.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy từ vựng' })
            }

            const prompt = this.readingService.buildReadingPrompt(vocabs, level, genre, length)
            const raw = await this.readingService.callGemini(prompt)
            const parsed = this.readingService.parseJsonSafe(raw)

            if (!parsed || !parsed.content) {
                return res.status(502).json({ error: 'AI trả về dữ liệu không hợp lệ', raw })
            }

            if (!this.readingService.validateForcedWords(parsed.content, vocabs.map(v => v.word))) {
                return res.status(502).json({ error: 'AI chưa chèn đủ từ bắt buộc' })
            }

            const reading = await this.readingService.saveReading(
                req.user.user_id,
                parsed.title || 'Untitled',
                parsed.content,
                parsed.translation_vi || null,
                parsed.romaji,
                length,
                genre,
                vocabs.map(v => v.vocab_id)
            )

            return res.json({ reading, vocab: vocabs })
        } catch (err) {
            console.error('Generate reading error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi server' })
        }
    }

    generateQuiz = async (req, res) => {
        try {
            const readingId = Number(req.params.id)
            const { count = 3 } = req.body || {}

            if (!readingId) {
                return res.status(400).json({ error: 'ID không hợp lệ' })
            }

            const reading = await this.readingService.getReadingById(readingId, req.user.user_id)
            if (!reading) {
                return res.status(404).json({ error: 'Không tìm thấy bài đọc' })
            }
            if (!reading.content || !reading.content.trim()) {
                return res.status(400).json({ error: 'Không có nội dung để tạo quiz' })
            }

            const prompt = this.readingService.buildQuizPrompt(reading, count)
            const raw = await this.readingService.callGemini(prompt)
            const parsed = this.readingService.parseJsonSafe(raw)

            const validationError = this.readingService.validateQuizPayload(parsed)
            if (validationError) {
                return res.status(502).json({ error: validationError, raw })
            }

            return res.json({ quiz: parsed })
        } catch (err) {
            console.error('Generate quiz error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi server' })
        }
    }

    getReading = async (req, res) => {
        try {
            const readingId = Number(req.params.id)

            if (!readingId) {
                return res.status(400).json({ error: 'ID không hợp lệ' })
            }

            const reading = await this.readingService.getReadingById(readingId, req.user.user_id)
            if (!reading) {
                return res.status(404).json({ error: 'Không tìm thấy bài đọc' })
            }

            const vocabRows = await this.readingService.getReadingVocabulary(readingId)

            return res.json({ reading, vocab: vocabRows })
        } catch (err) {
            console.error('Fetch reading error:', err)
            return res.status(500).json({ error: 'Lỗi server' })
        }
    }

    generateTTS = async (req, res) => {
        try {
            const readingId = Number(req.params.id)

            if (!readingId) {
                return res.status(400).json({ error: 'ID không hợp lệ' })
            }

            const reading = await this.readingService.getReadingById(readingId, req.user.user_id)
            if (!reading) {
                return res.status(404).json({ error: 'Không tìm thấy bài đọc' })
            }

            const text = reading.content
            if (!text || !text.trim()) {
                return res.status(400).json({ error: 'Không có nội dung để đọc' })
            }

            const result = await this.readingService.generateTTS(text)
            return res.json(result)
        } catch (err) {
            console.error('TTS error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi TTS' })
        }
    }
}
