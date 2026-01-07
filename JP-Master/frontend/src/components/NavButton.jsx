import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

const navButtonBase = 'p-3 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg'

const NavButton = ({ direction = 'left', onClick, disabled, className = '', size = 28 }) => {
  const Icon = direction === 'left' ? FaChevronLeft : FaChevronRight
  const title = direction === 'left' ? 'Trước (← hoặc swipe phải)' : 'Tiếp (→ hoặc swipe trái)'
  return (
    <button
      aria-label={direction === 'left' ? 'previous' : 'next'}
      onClick={onClick}
      className={`${navButtonBase} ${className}`}
      disabled={disabled}
      title={title}
    >
      <Icon size={size} className="text-brand-600" />
    </button>
  )
}

export default NavButton
