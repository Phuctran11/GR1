import { useState } from 'react'
import { apiFetch } from '../apiClient'

/**
 * RememberButton - Nút đánh dấu đã nhớ từ vựng, gọi API lưu trạng thái
 * Props:
 * - userId: số user
 * - vocabId: số từ vựng
 * - remembered: boolean (đã nhớ chưa)
 * - onChange: callback(status) khi cập nhật thành công
 */
export default function RememberButton({ userId, vocabId, remembered, onChange, variant = 'solid' }) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleRemember = async () => {
        setLoading(true)
        setError('')
        try {
            const res = await apiFetch('/api/flashcard/progress', {
                method: 'POST',
                body: JSON.stringify({ vocab_id: vocabId, status: remembered ? 'not_remembered' : 'remembered' })
            })
            if (!res.ok) throw new Error('Lỗi cập nhật trạng thái')
            onChange && onChange(!remembered ? 'remembered' : 'not_remembered')
        } catch (e) {
            setError('Lỗi kết nối!')
        } finally {
            setLoading(false)
        }
    }

    const isChip = variant === 'chip'
    const baseClasses = isChip
        ? 'px-3 py-1 rounded-full text-sm font-semibold border flex items-center gap-2 transition-all'
        : 'px-4 py-2 rounded-lg font-semibold shadow transition-all'
    const activeClasses = isChip
        ? 'bg-emerald-100 text-emerald-700 border-emerald-500 hover:bg-emerald-200'
        : 'bg-green-500 text-white hover:bg-green-600'
    const inactiveClasses = isChip
        ? 'bg-white text-gray-700 border-gray-300 hover:border-emerald-400 hover:text-emerald-700'
        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'

    return (
        <div className="flex flex-col items-center">
            <button
                className={`${baseClasses} ${remembered ? activeClasses : inactiveClasses}`}
                onClick={handleRemember}
                disabled={loading}
            >
                {remembered ? 'Đã nhớ' : 'Đánh dấu đã nhớ'}
            </button>
            {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
        </div>
    )
}
