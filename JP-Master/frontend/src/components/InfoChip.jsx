import React from 'react'

const chipBase = 'px-4 py-2 rounded-full text-sm font-semibold'

const InfoChip = ({ children, className = '' }) => (
  <span className={`${chipBase} ${className}`}>{children}</span>
)

export default InfoChip
