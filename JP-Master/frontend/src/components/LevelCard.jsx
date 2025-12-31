import ProgressBar, { calcProgressPercent } from './ProgressBar';

/**
 * LevelCard Component
 * Displays a lesson level with progress, difficulty, and stats
 * Props: level, title, description, color, Icon, progress, onClick
 */
/**
 * LevelCard
 * Props:
 * - progress: số phần trăm (nếu có)
 * - progressPercent: số phần trăm (nếu có)
 * - progressData: {progress, total} (object, nếu muốn dùng logic chung)
 */
export default function LevelCard({
    level,
    title,
    description,
    color = 'green',
    Icon = null,
    progress = 0,
    progressPercent,
    progressData,
    onClick = () => { },
}) {
    const colorClasses = {
        green: 'from-green-500 to-green-600 border-green-300',
        blue: 'from-blue-500 to-blue-600 border-blue-300',
        purple: 'from-purple-500 to-purple-600 border-purple-300',
        orange: 'from-orange-500 to-orange-600 border-orange-300',
        pink: 'from-pink-500 to-pink-600 border-pink-300',
    }

    const hoverEffects = 'hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer'

    // Debug log để kiểm tra dữ liệu truyền vào ProgressBar
    // ...existing code...
    return (
        <div
            onClick={onClick}
            className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border-2 text-white shadow-lg ${hoverEffects} flex flex-col justify-between h-[320px] min-h-[320px]`}
            style={{ minWidth: '320px', maxWidth: '100%' }}
        >
            {/* Icon & Level Badge */}
            <div>
                <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl">
                        {Icon ? <Icon className="text-white" /> : '📚'}
                    </div>
                    <div className="bg-white bg-opacity-30 px-3 py-1 rounded-full text-sm font-bold">
                        Level {level}
                    </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-white text-opacity-90 text-sm mb-4 line-clamp-2">{description}</p>
            </div>

            {/* Progress Bar */}
            <div>
                {/* Nếu truyền progressData thì dùng logic chung, còn lại fallback percent */}
                <ProgressBar 
                    {...(progressData ? { progressData } : { percent: typeof progressPercent === 'number' ? progressPercent : progress })}
                />
                {/* Action Button */}
                <button className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors mt-4">
                    {progress === 0 ? 'Start Learning' : 'Continue'}
                </button>
            </div>
        </div>
    )
}
