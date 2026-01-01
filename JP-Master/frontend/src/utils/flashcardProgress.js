import { apiFetch } from '../apiClient'

// Hàm lấy trạng thái học của user cho 1 level
export async function fetchUserFlashcardProgress(userId, level) {
    const res = await apiFetch(`/api/flashcard/user-progress?level=${level}`)
    if (!res.ok) throw new Error('Lỗi lấy trạng thái học')
    return await res.json() // [{vocab_id, status}, ...]
}
