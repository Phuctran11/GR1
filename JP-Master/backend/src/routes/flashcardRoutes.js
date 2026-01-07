import express from 'express'
import { authRequired } from '../middleware/auth.js'
import { FlashcardController } from '../controllers/flashcardController.js'

const router = express.Router()

export function setupFlashcardRoutes(app, pool) {
  const flashcardController = new FlashcardController(pool)

  app.get('/api/flashcard/level-progress', authRequired, flashcardController.getLevelProgress)
  app.get('/api/flashcard/vocab', flashcardController.getVocabulary)
  app.post('/api/flashcard/progress', authRequired, flashcardController.saveProgress)
  app.get('/api/flashcard/user-progress', authRequired, flashcardController.getUserProgress)
}

export default router
