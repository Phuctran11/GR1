export default function AboutStory() {
    const items = [
        { date: '2023', title: 'Idea & Prototype', desc: 'We started with a simple goal: make Japanese vocabulary stick through context and audio.' },
        { date: '2024', title: 'Private Beta', desc: 'Piloted with early learners, iterated on content quality and review flow.' },
        { date: '2025', title: 'AI-Powered Context', desc: 'Introduced AI to generate varied contexts and nuanced explanations.' },
    ]

    return (
        <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-6">
                {items.map((item, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                        <div className="shrink-0 w-20 text-right">
                            <div className="text-sm font-bold text-green-700">{item.date}</div>
                        </div>
                        <div className="flex-1">
                            <div className="font-semibold text-gray-900">{item.title}</div>
                            <div className="text-gray-600">{item.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
