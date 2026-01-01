import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

async function test() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
        const result = await model.generateContent('Xin chào')
        console.log('✅ Thành công:', result.response.text())
    } catch (err) {
        console.error('❌ Lỗi:', err.message)
        console.error('Status:', err.status)
        console.error('Details:', err.errorDetails)
    }
}

test()