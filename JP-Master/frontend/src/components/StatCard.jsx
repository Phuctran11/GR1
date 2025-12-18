export default function StatCard({ value, label }) {
    return (
        <div className="bg-white rounded-2xl p-6 text-center shadow-md">
            <div className="text-4xl font-extrabold text-green-600">{value}</div>
            <div className="text-gray-600">{label}</div>
        </div>
    )
}
