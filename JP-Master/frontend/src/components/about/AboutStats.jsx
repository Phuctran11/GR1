import StatCard from '../StatCard'

export default function AboutStats() {
    return (
        <div className="mt-12 grid md:grid-cols-3 gap-6">
            <StatCard value="95%" label="Memory retention after 4 weeks" />
            <StatCard value="1,000+" label="Topic-based vocabulary" />
            <StatCard value="N3 → N2" label="Clear JLPT-aligned roadmap" />
        </div>
    )
}
