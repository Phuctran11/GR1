import { FlashcardService } from '../services/flashcardService.js'

/**
 * Controller for flashcard/vocabulary endpoints
 */
export class FlashcardController {
    constructor(pool) {
        this.flashcardService = new FlashcardService(pool)
    }

    getLevelProgress = async (req, res) => {
        const { level } = req.query
        const userId = req.user?.user_id

        if (!userId || !level) {
            return res.status(400).json({ error: 'Missing params' })
        }

        try {
            const result = await this.flashcardService.getUserProgressByLevel(userId, level)
            res.json(result)
        } catch (err) {
            console.error('Get level progress error:', err)
            res.status(500).json({ error: err.message })
        }
    }

    getVocabulary = async (req, res) => {
        const { level } = req.query

        if (!level) {
            return res.status(400).json({ error: 'Missing level' })
        }

        try {
            const vocab = await this.flashcardService.getVocabularyByLevel(level)
            res.json(vocab)
        } catch (err) {
            console.error('Get vocabulary error:', err)
            res.status(500).json({ error: err.message })
        }
    }

    saveProgress = async (req, res) => {
        const { vocab_id, status } = req.body
        const userId = req.user?.user_id

        if (!userId || !vocab_id || !status) {
            return res.status(400).json({ error: 'Missing params' })
        }

        try {
            await this.flashcardService.saveUserProgress(userId, vocab_id, status)
            res.json({ success: true })
        } catch (err) {
            console.error('Save progress error:', err)
            res.status(500).json({ error: err.message })
        }
    }

    getUserProgress = async (req, res) => {
        const { level } = req.query
        const userId = req.user?.user_id

        if (!userId || !level) {
            return res.status(400).json({ error: 'Missing params' })
        }

        try {
            const progress = await this.flashcardService.getUserProgressList(userId, level)
            res.json(progress)
        } catch (err) {
            console.error('Get user progress error:', err)
            res.status(500).json({ error: err.message })
        }
    }
}
