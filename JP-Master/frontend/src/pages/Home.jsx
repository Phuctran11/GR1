import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import LevelCard from '../components/LevelCard';
import InfoSection from '../components/InfoSection';
import { fetchLevelProgress } from '../utils/levelProgress';
import { FaFont, FaComments, FaChartLine, FaRocket, FaBriefcase, FaBook, FaPen, FaHeadphones, FaCheck } from 'react-icons/fa6'

/**
 * Home Page - Displays lesson levels for user to choose
 */
export default function Home({ isLoggedIn = false, user }) {
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [levelProgress, setLevelProgress] = useState({}); // {N5: {total, remembered}, ...}
    const navigate = useNavigate()

    // Sample level data
    const levels = [
        {
            id: 1,
            level: 1,
            title: 'JLPT N5 Basics',
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
            title: 'JLPT N1 Advanced',
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

    useEffect(() => {
        // ...existing code...
        if (!user?.user_id) return;
        const levels = ['N5', 'N4', 'N3', 'N2', 'N1', 'SP'];
        Promise.all(
            levels.map(lvl => fetchLevelProgress(lvl).catch(() => ({ total: 0, remembered: 0, progress: {} })))
        ).then(results => {
            // Debug log kết quả trả về từ backend
            // ...existing code...
            const progressMap = {};
            results.forEach((obj, idx) => {
                const total = Number(obj.total) || 0;
                const remembered = Number(obj.remembered) || 0;
                const progress = obj.progress || {};
                progressMap[levels[idx]] = { total, remembered, progress };
            });
            setLevelProgress(progressMap);
        });
    }, [user]);

    const handleLevelClick = (levelId) => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        setSelectedLevel(levelId)
        // Không chuyển trang ở đây, chỉ highlight
    }

    // Map id sang level code cho flashcard
    const levelIdToCode = {
        1: 'N5',
        2: 'N4',
        3: 'N3',
        4: 'N2',
        5: 'N1',
        6: 'SP',
    }

    const handleFlashcardClick = (levelId) => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        const code = levelIdToCode[levelId] || 'N5';
        navigate(`/flashcard/${code}`);
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
                            className={`transform transition-all duration-300 ${selectedLevel === level.id ? 'ring-4 ring-green-400' : ''}`}
                        >
                            <LevelCard
                                level={level.level}
                                title={level.title}
                                description={level.description}
                                color={level.color}
                                Icon={level.Icon}
                                progressData={levelIdToCode[level.id] ? {
                                    total: levelProgress[levelIdToCode[level.id]]?.total || 0,
                                    progress: levelProgress[levelIdToCode[level.id]]?.progress || {}
                                } : undefined}
                                onClick={() => {
                                    if (!isLoggedIn) {
                                        navigate('/login');
                                        return;
                                    }
                                    const code = levelIdToCode[level.id] || 'N5';
                                    navigate(`/flashcard/${code}`);
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <InfoSection title="How It Works" />
            </div>
        </div>
    )
}
