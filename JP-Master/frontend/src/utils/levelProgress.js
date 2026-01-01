import { apiFetch } from '../apiClient'

// Gọi API backend mới để lấy tổng số từ và số từ đã nhớ cho từng level
export async function fetchLevelProgress(level) {
    const res = await apiFetch(`/api/flashcard/level-progress?level=${level}`)
    if (!res.ok) throw new Error('Failed to fetch level progress')
    return res.json()
}
