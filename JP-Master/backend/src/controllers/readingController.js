import { TextGenerationService } from '../services/textGenerationService.js'
import { AudioService } from '../services/audioService.js'
import { QuizService } from '../services/quizService.js'

/**
 * Controller cho reading, audio, quiz endpoints
 * Sử dụng các service riêng biệt
 */
export class ReadingController {
    constructor(pool) {
        this.textService = new TextGenerationService(pool)
        this.audioService = new AudioService()
        this.quizService = new QuizService()
    }

    // ============================================
    // READING ENDPOINTS
    // ============================================

    generateReading = async (req, res) => {
        try {
            const { vocab_ids = [], genre = 'life', length = 'medium', level = 'N5' } = req.body || {}

            if (!Array.isArray(vocab_ids) || vocab_ids.length === 0) {
                return res.status(400).json({ error: 'Cần ít nhất 1 vocab_id' })
            }
            if (!this.textService.allowedGenres.includes(genre)) {
                return res.status(400).json({ error: 'Genre không hợp lệ' })
            }
            if (!this.textService.allowedLengths.includes(length)) {
                return res.status(400).json({ error: 'Length không hợp lệ' })
            }

            const vocabs = await this.textService.getVocabularyByIds(vocab_ids)
            if (vocabs.length === 0) {
                return res.status(404).json({ error: 'Không tìm thấy từ vựng' })
            }

            const parsed = await this.textService.generateReading(vocabs, level, genre, length)

            const reading = await this.textService.saveReadingToDB(
                req.user.user_id,
                parsed.title || 'Untitled',
                parsed.content,
                parsed.translation_vi || null,
                parsed.romaji,
                length,
                genre
            )

            return res.json({ reading, vocab: vocabs })
        } catch (err) {
            console.error('Generate reading error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi server' })
        }
    }

    getReading = async (req, res) => {
        try {
            const readingId = Number(req.params.id)
            if (!readingId) {
                return res.status(400).json({ error: 'ID không hợp lệ' })
            }

            const reading = await this.textService.getReadingById(readingId, req.user.user_id)
            if (!reading) {
                return res.status(404).json({ error: 'Không tìm thấy bài đọc' })
            }

            return res.json({ reading })
        } catch (err) {
            console.error('Fetch reading error:', err)
            return res.status(500).json({ error: 'Lỗi server' })
        }
    }

    // ============================================
    // QUIZ ENDPOINTS
    // ============================================

    generateQuiz = async (req, res) => {
        try {
            const readingId = Number(req.params.id)
            const { count = 3 } = req.body || {}

            if (!readingId) {
                return res.status(400).json({ error: 'ID không hợp lệ' })
            }

            const reading = await this.textService.getReadingById(readingId, req.user.user_id)
            if (!reading) {
                return res.status(404).json({ error: 'Không tìm thấy bài đọc' })
            }

            if (!reading.content || !reading.content.trim()) {
                return res.status(400).json({ error: 'Không có nội dung để tạo quiz' })
            }

            const quiz = await this.quizService.generateQuiz(reading, count)

            return res.json({ quiz })
        } catch (err) {
            console.error('Generate quiz error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi server' })
        }
    }

    // ============================================
    // AUDIO ENDPOINTS
    // ============================================

    generateTTS = async (req, res) => {
        try {
            const readingId = Number(req.params.id)

            if (!readingId) {
                return res.status(400).json({ error: 'ID không hợp lệ' })
            }

            const reading = await this.textService.getReadingById(readingId, req.user.user_id)
            if (!reading) {
                return res.status(404).json({ error: 'Không tìm thấy bài đọc' })
            }

            const text = reading.content
            if (!text || !text.trim()) {
                return res.status(400).json({ error: 'Không có nội dung để đọc' })
            }

            const result = await this.audioService.generateTTS(text)
            return res.json(result)
        } catch (err) {
            console.error('TTS error:', err)
            return res.status(500).json({ error: err.message || 'Lỗi server' })
        }
    }
}
