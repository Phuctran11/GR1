import { useState } from 'react'
import Button from '../components/Button'
import LevelCard from '../components/LevelCard'
import { FaFont, FaComments, FaChartLine, FaRocket, FaBriefcase, FaBook, FaPen, FaHeadphones, FaCheck } from 'react-icons/fa6'

/**
 * Home Page - Displays lesson levels for user to choose
 */
export default function Home() {
    const [selectedLevel, setSelectedLevel] = useState(null)

    // Sample level data
    const levels = [
        {
            id: 1,
            level: 1,
            title: 'Hiragana & Katakana',
            description: 'Master the two Japanese writing systems through contextual stories.',
            color: 'green',
            Icon: FaFont,
            progress: 45,
        },
        {
            id: 2,
            level: 2,
            title: 'JLPT N4 Basics',
            description: 'Learn essential vocabulary for everyday conversation.',
            color: 'blue',
            Icon: FaComments,
            progress: 30,
        },
        {
            id: 3,
            level: 3,
            title: 'JLPT N3 Intermediate',
            description: 'Expand your vocabulary with intermediate-level words and expressions.',
            color: 'purple',
            Icon: FaChartLine,
            progress: 15,
        },
        {
            id: 4,
            level: 4,
            title: 'JLPT N2 Advanced',
            description: 'Challenge yourself with advanced vocabulary and nuanced meanings.',
            color: 'orange',
            Icon: FaRocket,
            progress: 0,
        },
        {
            id: 5,
            level: 5,
            title: 'Business Japanese',
            description: 'Learn professional and formal Japanese for workplace contexts.',
            color: 'pink',
            Icon: FaBriefcase,
            progress: 0,
        },
        {
            id: 6,
            level: 6,
            title: 'Literary Japanese',
            description: 'Dive into classical and literary Japanese texts.',
            color: 'green',
            Icon: FaBook,
            progress: 0,
        },
    ]

    const handleLevelClick = (levelId) => {
        setSelectedLevel(levelId)
        // Navigate or open modal in real app
        console.log(`Selected level: ${levelId}`)
    }

    return (
        <div className="full-page page-gradient section-padding">
            <div className="page-container">
                {/* Header */}
                <div className="text-center section-mb">
                    <h1 className="section-title">
                        Choose Your Learning Path
                    </h1>
                    <p className="section-subtitle">
                        Select a level that matches your Japanese proficiency. Each level is packed with AI-generated stories, authentic audio, and interactive quizzes.
                    </p>
                </div>

                {/* Level Grid */}
                <div className="grid-3-cols mb-12">
                    {levels.map((level) => (
                        <div
                            key={level.id}
                            onClick={() => handleLevelClick(level.id)}
                            className={`transform transition-all duration-300 ${selectedLevel === level.id ? 'ring-4 ring-green-400' : ''
                                }`}
                        >
                            <LevelCard
                                level={level.level}
                                title={level.title}
                                description={level.description}
                                color={level.color}
                                Icon={level.Icon}
                                progress={level.progress}
                                onClick={() => handleLevelClick(level.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* Call to Action */}
                {selectedLevel && (
                    <div className="text-center space-y-4">
                        <p className="text-lg text-gray-700">
                            Ready to start learning?
                        </p>
                        <Button size="lg" className="mx-auto">
                            Start Level {levels.find((l) => l.id === selectedLevel)?.level || 1}
                        </Button>
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-20 bg-white rounded-2xl p-8 shadow-lg border-l-4 border-green-600">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <div className="grid-4-cols">
                        {[
                            { step: 1, title: 'Choose Words', Icon: FaPen },
                            { step: 2, title: 'Read Stories', Icon: FaBook },
                            { step: 3, title: 'Listen & Learn', Icon: FaHeadphones },
                            { step: 4, title: 'Take Quiz', Icon: FaCheck },
                        ].map((item) => (
                            <div key={item.step} className="text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                    <item.Icon className="text-2xl text-green-600" />
                                </div>
                                <p className="font-semibold text-gray-900">{item.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
