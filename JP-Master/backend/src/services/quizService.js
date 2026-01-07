import { AIService } from './aiService.js'

/**
 * Service tạo quiz từ reading
 */
export class QuizService {
    constructor() {
        this.aiService = new AIService()
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

    async generateQuiz(reading, count) {
        const prompt = this.buildQuizPrompt(reading, count)
        const raw = await this.aiService.callGemini(prompt)
        const parsed = this.aiService.parseJsonSafe(raw)

        const validationError = this.validateQuizPayload(parsed)
        if (validationError) {
            throw new Error(validationError)
        }

        return parsed
    }
}
