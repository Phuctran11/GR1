import Hero from '../components/Hero'
import SectionHeader from '../components/SectionHeader'
import AboutValues from '../components/about/AboutValues'
import AboutStats from '../components/about/AboutStats'
import AboutStory from '../components/about/AboutStory'
import AboutTeam from '../components/about/AboutTeam'
import AboutFAQ from '../components/about/AboutFAQ'
import AboutCTA from '../components/about/AboutCTA'

export default function About() {
    return (
        <div className="w-full">
            {/* Reuse main Hero */}
            <Hero />

            {/* About content */}
            <div className="page-container section-padding">
                <SectionHeader
                    title="Our Mission"
                    subtitle="Empower Vietnamese learners to master Japanese through contextual learning, native audio, and a personalized, data-driven practice path."
                />

                {/* Values */}
                <AboutValues />

                {/* Stats */}
                <AboutStats />

                {/* Our Story (Timeline) */}
                <AboutStory />

                {/* Team */}
                <AboutTeam />

                {/* FAQ */}
                <AboutFAQ />

                {/* CTA */}
                <AboutCTA />
            </div>
        </div>
    )
}
