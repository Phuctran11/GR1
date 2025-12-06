/**
 * Hero Section Component
 * Landing page hero with call-to-action
 */
import { FaBook, FaHeadphones, FaLanguage, FaCircleQuestion } from 'react-icons/fa6'

export default function Hero() {
    return (
        <section className="hero-section">
            <div className="page-container">
                <div className="grid-2-cols">
                    {/* Left: Text Content */}
                    <div className="space-y-6">
                        <h1 className="hero-title">
                            Learn Japanese{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                                The Smart Way
                            </span>
                        </h1>
                        <p className="hero-subtitle">
                            Master Japanese vocabulary through AI-generated contextual lessons. Learn words, read stories, listen to native speakers, and test your understanding — all in one place.
                        </p>

                        {/* Features List */}
                        <div className="space-y-3 pt-4">
                            {[
                                { Icon: FaBook, text: 'AI-Generated Context Stories' },
                                { Icon: FaHeadphones, text: 'Native Japanese Audio' },
                                { Icon: FaLanguage, text: 'Vietnamese Translations' },
                                { Icon: FaCircleQuestion, text: 'Smart Quiz System' },
                            ].map((feature, idx) => (
                                <div key={idx} className="feature-item">
                                    <feature.Icon className="feature-icon text-green-600" />
                                    <span className="font-medium">{feature.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4 pt-6">
                            <button className="btn-primary">
                                Get Started Free
                            </button>
                            <button className="btn-ghost">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Right: Visual Illustration */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-green-400 via-blue-300 to-purple-400 rounded-3xl h-96 md:h-full shadow-2xl opacity-90">
                            <div className="absolute inset-0 flex items-center justify-center text-6xl">
                                📖✨
                            </div>
                        </div>
                        {/* Floating Cards */}
                        <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg border-2 border-green-600 max-w-sm">
                            <p className="text-sm font-semibold text-gray-900">
                                "Finally understand Japanese in real context!"
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
