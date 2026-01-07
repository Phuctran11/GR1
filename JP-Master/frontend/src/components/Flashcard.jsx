import React, { useEffect, useRef, useState } from 'react'

/**
 * Book-like flashcard with page-turn transition
 * - Click to flip (show meaning) when not transitioning
 * - Prev/Next triggers a book page-turn showing both pages
 * - Keyboard: ← / → navigate; Space toggles meaning
 * - Swipe: left/right to navigate; Auto-rotate optional
 */
const Flashcard = ({ vocabList = [], current: propCurrent, setCurrent: propSetCurrent, progress = {} }) => {
  const [showMeaning, setShowMeaning] = useState(false)
  const [paused, setPaused] = useState(false)
  const [autoRotate] = useState(true)
  const [transitioning, setTransitioning] = useState(false)
  const [prevCard, setPrevCard] = useState(null)
  const [nextCard, setNextCard] = useState(null)
  const [prevTheta, setPrevTheta] = useState(0)
  const [nextTheta, setNextTheta] = useState(0)
  const touchStartX = useRef(null)
  const touchDelta = 60
  const containerRef = useRef(null)

  const current = propCurrent ?? 0
  const setCurrent = propSetCurrent ?? (() => {})

  useEffect(() => {
    setShowMeaning(false)
  }, [current])

  if (!vocabList.length) return <div className="text-center text-gray-600">Không có từ vựng.</div>

  const total = vocabList.length
  const currentCard = vocabList[current]
  const remembered = progress[currentCard.vocab_id] === 'remembered'

  const changeIndex = (delta) => {
    if (transitioning || total <= 1) return
    const nextIdx = (current + delta + total) % total

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

  const cardFront = (card) => (
    <div className="text-center">
      <div className="text-7xl font-extrabold text-brand-700 mb-4">{card.word}</div>
      <div className="text-3xl text-brand-500 font-semibold mb-4">{card.kana}</div>
      <div className="text-sm text-gray-400 italic">Nhấn để xem nghĩa</div>
    </div>
  )

  const cardBack = (card) => (
    <div className="text-center text-white">
      <div className="text-4xl font-bold mb-6">{card.meaning}</div>
      <div className="text-lg text-white/90 mb-2">{card.kana}</div>
      <div className="text-sm text-white/80 italic">Nhấn để quay lại</div>
    </div>
  )

const BookPage = ({ card, rotation, zIndex, isLeft }) => {
    const absRotation = Math.abs(rotation)
    const shadowIntensity = Math.min(absRotation / 80, 1) * 0.7
    const lightIntensity = 1 - Math.min(absRotation / 60, 1) * 0.5
    
    return (
      <div
        className="absolute top-0 bottom-0 flex items-center justify-center"
        style={{
          width: '50%',
          left: isLeft ? '0' : '50%',
          transformStyle: 'preserve-3d',
          zIndex
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center p-6 relative"
          style={{
            background: `linear-gradient(135deg, rgba(30,144,255,${0.2 * lightIntensity}), rgba(79,70,229,${0.14 * lightIntensity}))`,
            backdropFilter: 'saturate(140%) blur(10px)',
            transformStyle: 'preserve-3d',
            transformOrigin: isLeft ? 'right center' : 'left center',
            transform: `
              rotateY(${rotation}deg) 
              translateZ(${absRotation > 50 ? 40 : 0}px)
            `,
            transition: 'all 0.75s cubic-bezier(0.25, 0.1, 0.25, 1)',
            opacity: absRotation > 125 ? 0 : 1,
            boxShadow: `
              ${isLeft ? '' : '-'}${shadowIntensity * 20}px 0 ${shadowIntensity * 40}px rgba(15,23,42,${shadowIntensity * 0.4}),
              0 20px 50px rgba(15,23,42,0.2),
              inset ${isLeft ? '-' : ''}${shadowIntensity * 10}px 0 ${shadowIntensity * 25}px rgba(0,0,0,${shadowIntensity * 0.25})
            `,
            borderTopRightRadius: isLeft ? '0' : '24px',
            borderBottomRightRadius: isLeft ? '0' : '24px',
            borderTopLeftRadius: isLeft ? '24px' : '0',
            borderBottomLeftRadius: isLeft ? '24px' : '0',
            borderTop: `2px solid rgba(255,255,255,${0.4 * lightIntensity})`,
            borderBottom: `2px solid rgba(255,255,255,${0.4 * lightIntensity})`,
            borderLeft: isLeft ? `2px solid rgba(255,255,255,${0.4 * lightIntensity})` : `4px solid rgba(99,102,241,${0.7 * lightIntensity})`,
            borderRight: isLeft ? `4px solid rgba(99,102,241,${0.7 * lightIntensity})` : `2px solid rgba(255,255,255,${0.4 * lightIntensity})`
          }}
        >
          {/* Page corner fold effect */}
          <div 
            className="absolute pointer-events-none"
            style={{
              top: '8px',
              [isLeft ? 'left' : 'right']: '8px',
              width: '40px',
              height: '40px',
              background: `linear-gradient(${isLeft ? '135deg' : '225deg'}, rgba(255,255,255,0.1), transparent)`,
              borderTopLeftRadius: isLeft ? '16px' : '0',
              borderTopRightRadius: isLeft ? '0' : '16px',
              opacity: 0.6
            }}
          />
          
          {/* Lighting gradient */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: isLeft
                ? `linear-gradient(to left, rgba(255,255,255,${0.25 * lightIntensity}) 0%, transparent 50%)`
                : `linear-gradient(to right, rgba(255,255,255,${0.25 * lightIntensity}) 0%, transparent 50%)`,
              opacity: absRotation > 15 ? 1 : 0,
              transition: 'opacity 0.3s ease',
              borderTopRightRadius: isLeft ? '0' : '24px',
              borderBottomRightRadius: isLeft ? '0' : '24px',
              borderTopLeftRadius: isLeft ? '24px' : '0',
              borderBottomLeftRadius: isLeft ? '24px' : '0'
            }}
          />
          
          {/* Content */}
          <div className="relative z-10" style={{ transform: 'translateZ(2px)', scale: '0.85' }}>
            {cardFront(card)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-8 px-4">
      <div className="mb-6 flex gap-3 items-center justify-center flex-wrap">
        <span className="px-4 py-2 rounded-full bg-brand-100 text-brand-700 font-semibold text-sm">Level: {currentCard.jlpt_level}</span>
        <span className="px-4 py-2 rounded-full bg-slate-100 text-slate-700 font-semibold text-sm">{currentCard.topic}</span>
        {remembered && <span className="px-4 py-2 rounded-full bg-emerald-500 text-white text-sm font-bold">✓ Đã nhớ</span>}
      </div>

      <div
        ref={containerRef}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="relative w-full max-w-3xl h-[460px] flex items-center justify-center mb-8"
        style={{ 
          perspective: '2000px',
          perspectiveOrigin: 'center center'
        }}
      >
        {/* Book spine/gutter - always visible during transition */}
        <div 
          className="absolute top-0 bottom-0 z-20 pointer-events-none"
          style={{
            left: '50%',
            width: '6px',
            transform: 'translateX(-50%) translateZ(10px)',
            background: 'linear-gradient(to bottom, #475569 0%, #334155 15%, #1e293b 50%, #334155 85%, #475569 100%)',
            boxShadow: `
              -3px 0 12px rgba(0,0,0,0.5),
              3px 0 12px rgba(0,0,0,0.5),
              inset 0 0 8px rgba(255,255,255,0.1),
              0 0 30px rgba(0,0,0,0.3)
            `,
            borderRadius: '1px',
            opacity: transitioning ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          {/* Spine texture lines */}
          <div className="absolute inset-0 flex flex-col justify-evenly">
            {[...Array(12)].map((_, i) => (
              <div 
                key={i}
                style={{
                  height: '1px',
                  background: 'rgba(255,255,255,0.05)',
                  width: '100%'
                }}
              />
            ))}
          </div>
        </div>

        {!transitioning && (
          <div
            onClick={() => setShowMeaning((s) => !s)}
            className="relative w-full h-full cursor-pointer"
            style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s ease, box-shadow 0.3s ease',
              transform: showMeaning ? 'rotateY(180deg)' : 'rotateY(0deg)',
              boxShadow: showMeaning
                ? '0 28px 60px rgba(15,23,42,0.25)'
                : '0 18px 40px rgba(15,23,42,0.18)'
            }}
          >
            <div
              className="absolute inset-0 rounded-3xl backface-hidden flex flex-col items-center justify-center p-8 shadow-2xl border border-white/30"
              style={{ background: 'linear-gradient(135deg, rgba(30,144,255,0.2), rgba(79,70,229,0.14))', backdropFilter: 'saturate(140%) blur(10px)' }}
            >
              {cardFront(currentCard)}
            </div>
            <div
              className="absolute inset-0 rounded-3xl backface-hidden flex flex-col items-center justify-center p-8 shadow-2xl border border-white/30 rotate-y-180"
              style={{ background: 'linear-gradient(135deg, #0f5132, #16a34a)' }}
            >
              {cardBack(currentCard)}
            </div>
          </div>
        )}

        {transitioning && prevCard && nextCard && (
          <>
            <BookPage card={prevCard} rotation={prevTheta} zIndex={prevTheta < 0 ? 3 : 2} isLeft={true} />
            <BookPage card={nextCard} rotation={nextTheta} zIndex={nextTheta > 0 ? 3 : 2} isLeft={false} />
          </>
        )}
      </div>

      <div className="mb-6 text-center">
        <div className="text-sm text-gray-600 mb-2">
          Từ <span className="font-bold text-brand-700">{current + 1}</span> / <span className="font-bold">{total}</span>
        </div>
        <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-brand-500 to-brand-700 transition-all duration-300" style={{ width: `${((current + 1) / total) * 100}%` }} />
        </div>
      </div>

      <div className="flex gap-6 items-center justify-center flex-wrap">
        <button
          aria-label="previous"
          onClick={() => changeIndex(-1)}
          className="px-7 py-3 bg-white/90 hover:bg-white text-brand-700 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={transitioning}
        >
          ← Trước
        </button>

        <button
          aria-label="next"
          onClick={() => changeIndex(1)}
          className="px-7 py-3 bg-brand-500 hover:bg-brand-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={transitioning}
        >
          Tiếp →
        </button>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>⌨️ Bàn phím: ← / → Chuyển | Spacebar Lật | 📱 Vuốt: Trái/Phải Chuyển</p>
      </div>
    </div>
  )
}

export default Flashcard
