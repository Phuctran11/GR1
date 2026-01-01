import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import BackButton from '../components/BackButton';
import RememberButton from '../components/RememberButton';
import ProgressBar, { calcProgressPercent } from '../components/ProgressBar';
import { fetchUserFlashcardProgress } from '../utils/flashcardProgress';
import { apiFetch } from '../apiClient'

const levelNames = {
    N5: 'JLPT N5',
    N4: 'JLPT N4',
    N3: 'JLPT N3',
    N2: 'JLPT N2',
    N1: 'JLPT N1',
    SP: 'Chuyên ngành',
};

const FlashcardPage = ({ isLoggedIn, user, onLogout }) => {
    const { level = 'N5' } = useParams();
    const navigate = useNavigate();
    const [vocabList, setVocabList] = useState([]);
    const [progress, setProgress] = useState({}); // {vocab_id: status}
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [current, setCurrent] = useState(0);
    const [selectedVocab, setSelectedVocab] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError('');
        apiFetch(`/api/flashcard/vocab?level=${level}`)
            .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
            .then(data => setVocabList(data))
            .catch(() => setError('Không lấy được dữ liệu từ vựng!'))
            .finally(() => setLoading(false));
    }, [level]);

    useEffect(() => {
        if (user?.user_id) {
            fetchUserFlashcardProgress(user.user_id, level)
                .then(arr => {
                    const map = {};
                    arr.forEach(item => { map[item.vocab_id] = item.status; });
                    setProgress(map);
                })
                .catch(() => setProgress({}));
        }
    }, [user, level]);

    const handleRememberChange = (status) => {
        if (!vocabList.length) return;
        const vocabId = vocabList[current]?.vocab_id;
        setProgress(prev => ({ ...prev, [vocabId]: status }));
    };

    const toggleSelectCurrent = () => {
        const vocab = vocabList[current]
        if (!vocab) return
        setSelectedVocab(prev => {
            const exists = prev.find(v => v.vocab_id === vocab.vocab_id)
            if (exists) return prev.filter(v => v.vocab_id !== vocab.vocab_id)
            return [...prev, vocab]
        })
    }

    const goToGenerate = () => {
        if (!isLoggedIn) {
            navigate('/login')
            return
        }
        if (!selectedVocab.length) {
            setError('Hãy chọn ít nhất 1 từ để tạo bài đọc AI')
            return
        }
        navigate('/reading/generate', { state: { selectedVocab, level } })
    }

    // Không cần logic riêng, chỉ dùng ProgressBar
    const total = vocabList.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
            <div className="flex flex-col items-center justify-center py-8">
                <div className="w-full max-w-lg mb-4 flex items-center">
                    <BackButton className="mr-auto" />
                </div>
                <h2 className="text-2xl font-bold mb-6 text-blue-700">Flashcard: {levelNames[level] || level}</h2>
                <div className="mb-4 w-full max-w-md">
                    <ProgressBar progressData={{ progress, total }} label="Tiến độ đã nhớ" />
                </div>
                {loading ? <div className="text-blue-500">Đang tải dữ liệu...</div> : error ? <div className="text-red-500">{error}</div> : (
                    <>
                        <Flashcard
                            vocabList={vocabList}
                            current={current}
                            setCurrent={setCurrent}
                            progress={progress}
                        />
                        {vocabList.length > 0 && (
                            <div className="mt-4">
                                <RememberButton
                                    userId={user?.user_id}
                                    vocabId={vocabList[current]?.vocab_id}
                                    remembered={progress[vocabList[current]?.vocab_id] === 'remembered'}
                                    onChange={handleRememberChange}
                                />
                                <div className="mt-4 flex flex-col items-center gap-3">
                                    <button
                                        onClick={toggleSelectCurrent}
                                        className={`px-4 py-2 rounded-lg font-semibold shadow transition-all ${selectedVocab.some(v => v.vocab_id === vocabList[current]?.vocab_id) ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-white border border-purple-300 text-purple-700 hover:bg-purple-50'}`}
                                    >
                                        {selectedVocab.some(v => v.vocab_id === vocabList[current]?.vocab_id) ? 'Bỏ chọn từ này' : 'Chọn từ này để tạo bài đọc'}
                                    </button>
                                    <div className="text-sm text-gray-600">Đã chọn {selectedVocab.length} từ</div>
                                    <button
                                        onClick={goToGenerate}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition-all"
                                    >
                                        Tạo bài đọc AI
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FlashcardPage;
