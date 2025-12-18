import SectionHeader from '../SectionHeader'

export default function AboutFAQ() {
    const faqs = [
        { q: 'How is this different from a Features page?', a: 'About focuses on our mission, story, values, and team. Features details product capabilities and workflows.' },
        { q: 'Do I need prior Japanese knowledge?', a: 'No. We support beginners to intermediate learners with clear translations and audio.' },
        { q: 'Is there a free plan?', a: 'Yes. You can start for free and upgrade anytime.' },
        { q: 'How do you generate content?', a: 'We combine expert-written material with AI to create varied, contextual examples.' },
    ]

    return (
        <div className="mt-20">
            <SectionHeader title="FAQ" subtitle="Answers to common questions." />
            <div className="grid md:grid-cols-2 gap-6">
                {faqs.map((f, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                        <div className="font-semibold text-gray-900 mb-1">{f.q}</div>
                        <div className="text-gray-600">{f.a}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
