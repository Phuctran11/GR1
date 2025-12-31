    import express from 'express';

/**
 * Flashcard routes for vocabulary learning
 * @param {express.Application} app
 * @param {pg.Pool} pool
 */
export function setupFlashcardRoutes(app, pool) {
    // API: Lấy tổng số từ và số từ đã nhớ cho từng level (tối ưu 1 query)
    app.get('/api/flashcard/level-progress', async (req, res) => {
        const { user_id, level } = req.query;
        if (!user_id || !level) return res.status(400).json({ error: 'Missing params' });
        try {
            // Lấy tổng số từ, số đã nhớ và danh sách vocab_id đã nhớ
            const result = await pool.query(
                `SELECT v.vocab_id, uf.status
                    FROM Vocabulary v
                    LEFT JOIN UserFlashcards uf ON v.vocab_id = uf.vocab_id AND uf.user_id = $1
                    WHERE v.jlpt_level = $2`,
                [user_id, level]
            );
            const total = result.rows.length;
            const progress = {};
            let remembered = 0;
            result.rows.forEach(row => {
                if (row.status === 'remembered') {
                    progress[row.vocab_id] = 'remembered';
                    remembered++;
                }
            });
            res.json({ total, remembered, progress });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
    // Lấy danh sách từ vựng theo level
    app.get('/api/flashcard/vocab', async (req, res) => {
        const { level } = req.query;
        if (!level) return res.status(400).json({ error: 'Missing level' });
        try {
            const result = await pool.query(
                'SELECT vocab_id, word, kana, meaning, jlpt_level, topic FROM Vocabulary WHERE jlpt_level = $1 ORDER BY vocab_id ASC LIMIT 50',
                [level]
            );
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Lưu trạng thái học flashcard của user
    app.post('/api/flashcard/progress', async (req, res) => {
        const { user_id, vocab_id, status } = req.body;
        if (!user_id || !vocab_id || !status) return res.status(400).json({ error: 'Missing params' });
        try {
            await pool.query(
                `INSERT INTO UserFlashcards (user_id, vocab_id, status, updated_at)
                VALUES ($1, $2, $3, NOW())
                ON CONFLICT (user_id, vocab_id)
                DO UPDATE SET status = $3, updated_at = NOW()`,
                [user_id, vocab_id, status]
            );
            res.json({ success: true });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });

    // Lấy trạng thái học của user cho 1 level
    app.get('/api/flashcard/user-progress', async (req, res) => {
        const { user_id, level } = req.query;
        if (!user_id || !level) return res.status(400).json({ error: 'Missing params' });
        try {
            const result = await pool.query(
                `SELECT uf.vocab_id, uf.status
                FROM UserFlashcards uf
                JOIN Vocabulary v ON uf.vocab_id = v.vocab_id
                WHERE uf.user_id = $1 AND v.jlpt_level = $2`,
                [user_id, level]
            );
            res.json(result.rows);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    });
}
