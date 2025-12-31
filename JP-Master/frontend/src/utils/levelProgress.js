// Gọi API backend mới để lấy tổng số từ và số từ đã nhớ cho từng level
export async function fetchLevelProgress(user_id, level) {
    const res = await fetch(`http://localhost:4000/api/flashcard/level-progress?user_id=${user_id}&level=${level}`);
    if (!res.ok) throw new Error('Failed to fetch level progress');
    return res.json();
}
