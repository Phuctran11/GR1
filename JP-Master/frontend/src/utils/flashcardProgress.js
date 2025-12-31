// Hàm lấy trạng thái học của user cho 1 level
export async function fetchUserFlashcardProgress(userId, level) {
    const res = await fetch(`http://localhost:4000/api/flashcard/user-progress?user_id=${userId}&level=${level}`);
    if (!res.ok) throw new Error('Lỗi lấy trạng thái học');
    return await res.json(); // [{vocab_id, status}, ...]
}
