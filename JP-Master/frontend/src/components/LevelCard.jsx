/**
 * LevelCard Component
 * Displays a lesson level with progress, difficulty, and stats
 * Props: level, title, description, color, Icon, progress, onClick
 */
export default function LevelCard({
    level,
    title,
    description,
    color = 'green',
    Icon = null,
    progress = 0,
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

    return (
        <div
            onClick={onClick}
            className={`bg-gradient-to-br ${colorClasses[color]} rounded-2xl p-6 border-2 text-white shadow-lg ${hoverEffects}`}
        >
            {/* Icon & Level Badge */}
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

            {/* Progress Bar */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">Progress</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>

            {/* Action Button */}
            <button className="w-full bg-white text-gray-900 font-bold py-2 rounded-lg hover:bg-gray-100 transition-colors">
                {progress === 0 ? 'Start Learning' : 'Continue'}
            </button>
        </div>
    )
}
