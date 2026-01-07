/**
 * Service layer for flashcard/vocabulary operations
 */
export class FlashcardService {
    constructor(pool) {
        this.pool = pool
    }

    async getVocabularyByLevel(level, limit = 50) {
        const result = await this.pool.query(
            'SELECT vocab_id, word, kana, meaning, jlpt_level, topic FROM Vocabulary WHERE jlpt_level = $1 ORDER BY vocab_id ASC LIMIT $2',
            [level, limit]
        )
        return result.rows
    }

    async getUserProgressByLevel(userId, level) {
        const result = await this.pool.query(
            `SELECT v.vocab_id, uf.status
       FROM Vocabulary v
       LEFT JOIN UserFlashcards uf ON v.vocab_id = uf.vocab_id AND uf.user_id = $1
       WHERE v.jlpt_level = $2`,
            [userId, level]
        )

        const total = result.rows.length
        const progress = {}
        let remembered = 0

        result.rows.forEach(row => {
            if (row.status === 'remembered') {
                progress[row.vocab_id] = 'remembered'
                remembered++
            }
        })

        return { total, remembered, progress }
    }

    async getUserProgressList(userId, level) {
        const result = await this.pool.query(
            `SELECT uf.vocab_id, uf.status
       FROM UserFlashcards uf
       JOIN Vocabulary v ON uf.vocab_id = v.vocab_id
       WHERE uf.user_id = $1 AND v.jlpt_level = $2`,
            [userId, level]
        )
        return result.rows
    }

    async saveUserProgress(userId, vocabId, status) {
        await this.pool.query(
            `INSERT INTO UserFlashcards (user_id, vocab_id, status, updated_at)
       VALUES ($1, $2, $3, NOW())
       ON CONFLICT (user_id, vocab_id)
       DO UPDATE SET status = $3, updated_at = NOW()`,
            [userId, vocabId, status]
        )
    }
}
