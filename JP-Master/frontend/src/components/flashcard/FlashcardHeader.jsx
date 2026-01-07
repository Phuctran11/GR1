import React from 'react'
import InfoChip from '../InfoChip'

const FlashcardHeader = ({ currentCard, renderHeaderActions, remembered }) => (
  <div className="mb-6 flex gap-3 items-center justify-center flex-wrap">
    <InfoChip className="bg-brand-100 text-brand-700">Level: {currentCard.jlpt_level}</InfoChip>
    <InfoChip className="bg-slate-100 text-slate-700">{currentCard.topic}</InfoChip>
    {renderHeaderActions && (
      <div className="flex items-center gap-2">
        {renderHeaderActions({ currentCard, remembered })}
      </div>
    )}
  </div>
)

export default FlashcardHeader
