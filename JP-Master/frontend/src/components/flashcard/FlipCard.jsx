import React from 'react'

const glassCard = 'absolute inset-0 rounded-3xl backface-hidden flex flex-col items-center justify-center p-8 shadow-2xl border border-white/30'

const FlipCard = ({ card, showMeaning, onToggle, cardFront, cardBack }) => (
  <div
    onClick={onToggle}
    className="absolute inset-0 cursor-pointer"
    style={{
      transformStyle: 'preserve-3d',
      transition: 'transform 0.6s ease, box-shadow 0.3s ease',
      transform: showMeaning ? 'rotateY(180deg)' : 'rotateY(0deg)',
      boxShadow: showMeaning
        ? '0 28px 60px rgba(15,23,42,0.25)'
        : '0 18px 40px rgba(15,23,42,0.18)',
    }}
  >
    <div
      className={glassCard}
      style={{
        background: 'linear-gradient(135deg, rgba(30,144,255,0.2), rgba(79,70,229,0.14))',
        backdropFilter: 'saturate(140%) blur(10px)',
      }}
    >
      {cardFront(card)}
    </div>
    <div
      className={glassCard}
      style={{ 
        background: 'linear-gradient(135deg, #0f5132, #16a34a)',
        transform: 'rotateY(180deg)'
      }}
    >
      {cardBack(card)}
    </div>
  </div>
)

export default FlipCard
