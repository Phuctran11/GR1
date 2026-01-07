import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Flashcard from '../components/Flashcard';
import BackButton from '../components/BackButton';
import RememberButton from '../components/RememberButton';
import ProgressBar, { calcProgressPercent } from '../components/ProgressBar';
import Button from '../components/Button';
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
    const [ctaError, setCtaError] = useState('');

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
        setCtaError('')
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
            setCtaError('Hãy chọn ít nhất 1 từ để tạo bài đọc AI')
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
                <div className="mb-4 w-full max-w-md card-base p-4">
                    <ProgressBar
                        progressData={{ progress, total }}
                        label="Tiến độ đã nhớ"
                        barClass="bg-gradient-to-r from-sky-400 to-blue-600"
                        trackClass="bg-slate-200"
                    />
                </div>
                {loading ? (
                    <div className="text-blue-500">Đang tải dữ liệu...</div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : (
                    <>
                        <div className="w-full flex items-center justify-center min-h-[60vh]">
                            <Flashcard
                                vocabList={vocabList}
                                current={current}
                                setCurrent={setCurrent}
                                progress={progress}
                                renderHeaderActions={({ currentCard, remembered }) => (
                                  <RememberButton
                                    userId={user?.user_id}
                                    vocabId={currentCard?.vocab_id}
                                    remembered={remembered}
                                    onChange={handleRememberChange}
                                    variant="chip"
                                  />
                                )}
                            />
                        </div>

                        {vocabList.length > 0 && (
                            <div className="mt-6 w-full max-w-3xl card-base p-4 flex flex-col gap-3">
                                <div className="flex flex-wrap items-center gap-3 justify-between">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">Đã chọn {selectedVocab.length} từ</span>
                                        <span className="text-sm text-gray-600">Chọn 3-5 từ để AI viết hợp lý</span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <Button
                                            onClick={toggleSelectCurrent}
                                            variant={selectedVocab.some(v => v.vocab_id === vocabList[current]?.vocab_id) ? 'secondary' : 'ghost'}
                                        >
                                            {selectedVocab.some(v => v.vocab_id === vocabList[current]?.vocab_id) ? 'Bỏ chọn từ này' : 'Chọn từ này để tạo bài đọc'}
                                        </Button>
                                        <Button onClick={goToGenerate} variant="primary">Tạo bài đọc AI</Button>
                                    </div>
                                </div>
                                {ctaError && <div className="text-sm text-red-600">{ctaError}</div>}
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FlashcardPage;
