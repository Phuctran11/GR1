import React, { useState } from 'react';

/**
 * Flashcard component for vocabulary learning
 * Props:
 * - vocabList: Array of { word, kana, meaning, jlpt_level, topic }
 * - current: số thứ tự card hiện tại
 * - setCurrent: hàm set số thứ tự card
 * - progress: {vocab_id: status}
 */
const Flashcard = ({ vocabList = [], current: propCurrent, setCurrent: propSetCurrent, progress = {} }) => {
    const [showMeaning, setShowMeaning] = useState(false);
    const [flip, setFlip] = useState(false);
    const [slide, setSlide] = useState('');

    const current = propCurrent ?? 0;
    const setCurrent = propSetCurrent ?? (() => { });

    if (!vocabList.length) return <div className="text-center">Không có từ vựng.</div>;

    const card = vocabList[current];
    const remembered = progress[card.vocab_id] === 'remembered';

    const nextCard = () => {
        setSlide('slide-left');
        setTimeout(() => {
            setShowMeaning(false);
            setFlip(false);
            setCurrent((prev) => (prev + 1) % vocabList.length);
            setSlide('');
        }, 350);
    };

    const prevCard = () => {
        setSlide('slide-right');
        setTimeout(() => {
            setShowMeaning(false);
            setFlip(false);
            setCurrent((prev) => (prev - 1 + vocabList.length) % vocabList.length);
            setSlide('');
        }, 350);
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-lg mx-auto p-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 rounded-2xl shadow-2xl border border-blue-200">
            <div className="mb-4 text-gray-500 text-sm tracking-wide flex gap-2 items-center">
                <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-semibold">Level: {card.jlpt_level}</span>
                <span className="px-2 py-1 rounded bg-green-100 text-green-700 font-semibold">{card.topic}</span>
                {remembered && <span className="ml-2 px-2 py-1 rounded bg-green-500 text-white text-xs font-bold">Đã nhớ</span>}
            </div>
            <div
                className={`relative w-80 h-56 mb-6 perspective`}
                onClick={() => { setFlip(f => !f); setShowMeaning(s => !s); }}
                title="Nhấn để lật thẻ"
            >
                <div className={`absolute w-full h-full transition-transform duration-500 transform-style-preserve-3d ${flip ? 'rotate-y-180' : ''} ${slide}`}
                    style={{ willChange: 'transform' }}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 to-blue-400 rounded-xl shadow-lg backface-hidden border-2 border-blue-300 cursor-pointer select-none">
                        <div className="text-5xl font-extrabold text-blue-800 mb-2 drop-shadow-lg">{card.word}</div>
                        <div className="text-2xl text-blue-600 mb-2 font-semibold">{card.kana}</div>
                        <div className="text-gray-400 text-base italic">(Nhấn để xem nghĩa)</div>
                    </div>
                    {/* Back */}
                    <div className="absolute w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-green-400 rounded-xl shadow-lg backface-hidden border-2 border-green-300 cursor-pointer select-none rotate-y-180">
                        <div className="text-4xl font-bold text-green-800 mb-2 drop-shadow-lg">{card.meaning}</div>
                        <div className="text-lg text-green-600 mt-2">{card.kana}</div>
                        <div className="text-gray-400 text-base italic">(Nhấn để quay lại)</div>
                    </div>
                </div>
            </div>
            <div className="flex gap-6 mt-2">
                <button
                    onClick={prevCard}
                    className="px-6 py-2 bg-white border border-blue-300 text-blue-700 rounded-lg shadow hover:bg-blue-50 transition-all font-semibold text-lg"
                >
                    ← Trước
                </button>
                <button
                    onClick={nextCard}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-semibold text-lg"
                >
                    Tiếp →
                </button>
            </div>
            <div className="mt-4 text-base text-gray-500 tracking-wide font-medium">
                {current + 1} / {vocabList.length}
            </div>
        </div>
    );
};

export default Flashcard;
