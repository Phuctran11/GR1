import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Service chung cho AI - Gemini API & JSON parsing
 */
export class AIService {
    constructor() {
        this.defaultModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
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
}
