/**
 * ProgressBar - Thanh tiến độ học tập tái sử dụng
 * Props:
 * - percent: số phần trăm (0-100) (ưu tiên nếu truyền vào)
 * - progressData: {progress, total, progressMap} (tùy chọn)
 * - label: nhãn bên trái (tùy chọn)
 * - className: style ngoài (tùy chọn)
 */

/**
 * Tính phần trăm tiến độ học
 * @param {Object} params
 *   - progress: object {vocab_id: status}
 *   - total: tổng số từ vựng (number)
 *   - progressMap: object {vocab_id: status} (tùy chọn)
 * @returns {number} phần trăm đã nhớ (0-100)
 */
export function calcProgressPercent({ progress, total, progressMap }) {
    // progress: {vocab_id: status}, total: số từ vựng
    // progressMap: cũng là {vocab_id: status} (tùy nguồn)
    const map = progressMap || progress || {};
    const rememberedCount = Object.values(map).filter(s => s === 'remembered').length;
    if (!total || total === 0) return 0;
    return Math.round((rememberedCount / total) * 100);
}

export default function ProgressBar({ percent, progressData, label = 'Progress', className = '' }) {
    let percentValue = 0;
    if (typeof percent === 'number') {
        percentValue = percent;
    } else if (progressData) {
        percentValue = calcProgressPercent(progressData);
    }
    return (
        <div className={`w-full ${className}`}>
            <div className="flex justify-between text-sm mb-1">
                <span className="font-semibold">{label}</span>
                <span>{percentValue}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 overflow-hidden">
                <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentValue}%` }}
                ></div>
            </div>
        </div>
    );
}
