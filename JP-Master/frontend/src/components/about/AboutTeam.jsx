import SectionHeader from '../SectionHeader'

export default function AboutTeam() {
    const members = [
        { name: 'Minh Nguyen', role: 'Product & Curriculum' },
        { name: 'Lan Pham', role: 'Linguist & QA' },
        { name: 'Khoa Tran', role: 'Engineering' },
    ]

    return (
        <div className="mt-20">
            <SectionHeader
                title="Meet the Team"
                subtitle="A small group of educators, linguists, and engineers passionate about language learning."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((m, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                            {m.name.split(' ').map(s => s[0]).join('').slice(0, 2)}
                        </div>
                        <div>
                            <div className="font-semibold text-gray-900">{m.name}</div>
                            <div className="text-gray-600 text-sm">{m.role}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
