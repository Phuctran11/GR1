import Hero from '../components/Hero'
import InfoSection from '../components/InfoSection'
import SectionHeader from '../components/SectionHeader'
import FeatureCard from '../components/FeatureCard'
import { FaBolt, FaBookOpen, FaHeadphonesSimple, FaWandMagicSparkles, FaChartLine } from 'react-icons/fa6'

export default function Features() {
    const features = [
        { title: 'Fast & Effective Learning', desc: 'Make progress quickly with focused, contextual content.', Icon: FaBolt },
        { title: 'Natural Context', desc: 'Stories and dialogues grounded in real situations.', Icon: FaBookOpen },
        { title: 'Native Audio', desc: 'Get used to authentic pronunciation and pace.', Icon: FaHeadphonesSimple },
        { title: 'AI Assistance', desc: 'Example suggestions, nuance explanations, and helpful tips.', Icon: FaWandMagicSparkles },
        { title: 'Progress Tracking', desc: 'Clear charts and metrics to stay motivated.', Icon: FaChartLine },
    ]

    const steps = [
        { step: 1, title: 'Pick vocabulary & goals', Icon: FaBookOpen },
        { step: 2, title: 'Read contextual content', Icon: FaWandMagicSparkles },
        { step: 3, title: 'Listen and repeat', Icon: FaHeadphonesSimple },
        { step: 4, title: 'Quiz and spaced review', Icon: FaChartLine },
    ]

    return (
        <div className="w-full">
            {/* Reuse main Hero */}
            <Hero />

            <div className="page-container section-padding">
                {/* Feature grid */}
                <SectionHeader
                    title="Key Features"
                    subtitle="Everything you need to learn consistently and effectively."
                />
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((f, idx) => (
                        <FeatureCard key={idx} Icon={f.Icon} title={f.title} desc={f.desc} />
                    ))}
                </div>

                {/* How it works - reuse InfoSection with custom steps */}
                <InfoSection title="How It Works" steps={steps} />

                {/* CTA */}
                <div className="text-center mt-16">
                    <a href="/signup" className="btn-primary inline-block">Start Free</a>
                </div>
            </div>
        </div>
    )
}
