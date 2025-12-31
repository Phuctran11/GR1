export default function FeatureCard({ Icon, title, desc }) {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-green-600">
            {Icon && (
                <div className="mb-3">
                    <Icon className="text-green-600 text-2xl" />
                </div>
            )}
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    )
}
