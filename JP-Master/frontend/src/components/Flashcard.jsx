import React, { useEffect, useRef, useState, useMemo } from 'react'
import ProgressMini from './ProgressMini'
import NavButton from './NavButton'
import BookPage from './flashcard/BookPage'
import FlipCard from './flashcard/FlipCard'
import FlashcardHeader from './flashcard/FlashcardHeader'
import Spine from './flashcard/Spine'

const Flashcard = ({
  vocabList = [],
  current: propCurrent,
  setCurrent: propSetCurrent,
  progress = {},
  renderHeaderActions,
}) => {
  const [showMeaning, setShowMeaning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [autoRotate] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [prevCard, setPrevCard] = useState(null)
  const [nextCard, setNextCard] = useState(null)
  const [prevTheta, setPrevTheta] = useState(0)
  const [nextTheta, setNextTheta] = useState(0)
  const [turnForward, setTurnForward] = useState(true)
  const touchStartX = useRef(null)
  const touchDelta = 60
  const containerRef = useRef(null)

  const current = propCurrent ?? 0
  const setCurrent = propSetCurrent ?? (() => {})

  useEffect(() => setShowMeaning(false), [current])

  if (!vocabList.length) return <div className="text-center text-gray-600">Không có từ vựng.</div>

  const total = vocabList.length
  const currentCard = vocabList[current]
  const remembered = progress[currentCard.vocab_id] === 'remembered'

  const changeIndex = (delta) => {
    if (transitioning || total <= 1) return
    const nextIdx = (current + delta + total) % total

    setTurnForward(delta >= 0)
    setShowMeaning(false)
    setTransitioning(true)
    setPrevCard(currentCard)
    setNextCard(vocabList[nextIdx])

    const rotateOut = delta >= 0 ? -135 : 135
    const rotateIn = delta >= 0 ? 135 : -135

    setPrevTheta(0)
    setNextTheta(rotateIn)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPrevTheta(rotateOut)
        setNextTheta(0)
      })
    })

    setTimeout(() => {
      setCurrent(nextIdx)
      setTransitioning(false)
      setPrevCard(null)
      setNextCard(null)
      setPrevTheta(0)
      setNextTheta(0)
    }, 750)

    setPaused(true)
    clearTimeout(containerRef.current?._resumeTimer)
    containerRef.current._resumeTimer = setTimeout(() => setPaused(false), 1600)
  }

  const onTouchStart = (e) => {
    setPaused(true)
    touchStartX.current = e.touches?.[0]?.clientX || null
  }

  const onTouchEnd = (e) => {
    const endX = e.changedTouches?.[0]?.clientX || null
    if (touchStartX.current && endX) {
      const diff = endX - touchStartX.current
      if (diff > touchDelta) changeIndex(-1)
      else if (diff < -touchDelta) changeIndex(1)
    }
    touchStartX.current = null
    clearTimeout(containerRef.current?._resumeTimer)
    containerRef.current._resumeTimer = setTimeout(() => setPaused(false), 1200)
  }

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowLeft') changeIndex(-1)
      if (e.key === 'ArrowRight') changeIndex(1)
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        if (!transitioning) setShowMeaning((s) => !s)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [transitioning, total])

  useEffect(() => {
    if (!autoRotate || paused || total <= 1) return
    const id = setInterval(() => changeIndex(1), 5000)
    return () => clearInterval(id)
  }, [autoRotate, paused, total, transitioning])

  const cardFront = useMemo(
    () => (card) => (
      <div className="text-center">
        <div className="text-7xl font-extrabold text-brand-700 mb-4">{card.word}</div>
        <div className="text-3xl text-brand-500 font-semibold mb-4">{card.kana}</div>
        <div className="text-sm text-gray-400 italic">Nhấn để xem nghĩa</div>
      </div>
    ),
    []
  )

  const cardBack = useMemo(
    () => (card) => (
      <div className="text-center text-white">
        <div className="text-4xl font-bold mb-6">{card.meaning}</div>
        <div className="text-lg text-white/90 mb-2">{card.kana}</div>
        <div className="text-sm text-white/80 italic">Nhấn để quay lại</div>
      </div>
    ),
    []
  )

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 px-4">
      <FlashcardHeader currentCard={currentCard} renderHeaderActions={renderHeaderActions} remembered={remembered} />

      <ProgressMini current={current} total={total} />

      <div className="w-full flex items-center justify-center gap-4 sm:gap-6 mb-8">
        <NavButton direction="left" onClick={() => changeIndex(-1)} disabled={transitioning} className="hidden sm:flex" />

        <div
          ref={containerRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          className="relative w-full max-w-2xl h-[420px] flex items-center justify-center"
          style={{ perspective: '2000px', perspectiveOrigin: 'center center' }}
        >
          <Spine transitioning={transitioning} />

          {!transitioning && (
            <FlipCard
              card={currentCard}
              showMeaning={showMeaning}
              onToggle={() => setShowMeaning((s) => !s)}
              cardFront={cardFront}
              cardBack={cardBack}
            />
          )}

          {transitioning && prevCard && nextCard && (
            <>
              <BookPage
                card={prevCard}
                rotation={prevTheta}
                zIndex={prevTheta < 0 ? 3 : 2}
                isLeft={turnForward}
                content={cardFront}
              />
              <BookPage
                card={nextCard}
                rotation={nextTheta}
                zIndex={nextTheta > 0 ? 3 : 2}
                isLeft={!turnForward}
                content={cardFront}
              />
            </>
          )}
        </div>

        <NavButton direction="right" onClick={() => changeIndex(1)} disabled={transitioning} className="hidden sm:flex" />
      </div>

      <div className="flex gap-4 items-center justify-center mb-6 sm:hidden">
        <NavButton direction="left" onClick={() => changeIndex(-1)} disabled={transitioning} className="p-2" size={24} />
        <NavButton direction="right" onClick={() => changeIndex(1)} disabled={transitioning} className="p-2" size={24} />
      </div>
    </div>
  )
}

export default Flashcard

