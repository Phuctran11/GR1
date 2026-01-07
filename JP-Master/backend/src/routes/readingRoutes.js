import express from 'express'
import { authRequired } from '../middleware/auth.js'
import { ReadingController } from '../controllers/readingController.js'

const router = express.Router()

export function setupReadingRoutes(app, pool) {
  const readingController = new ReadingController(pool)

  app.post('/api/readings/generate', authRequired, readingController.generateReading)
  app.post('/api/readings/:id/quiz', authRequired, readingController.generateQuiz)
  app.get('/api/readings/:id', authRequired, readingController.getReading)
  app.post('/api/readings/:id/tts', authRequired, readingController.generateTTS)
}

export default router
