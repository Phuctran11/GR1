import React from 'react'

const BookPage = ({ card, rotation, zIndex, isLeft, content }) => {
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
        zIndex,
      }}
    >
      <div
        className="w-full h-full flex items-center justify-center p-6 relative"
        style={{
          background: `linear-gradient(135deg, rgba(30,144,255,${0.2 * lightIntensity}), rgba(79,70,229,${0.14 * lightIntensity}))`,
          backdropFilter: 'saturate(140%) blur(10px)',
          transformStyle: 'preserve-3d',
          transformOrigin: isLeft ? 'right center' : 'left center',
          transform: `rotateY(${rotation}deg) translateZ(${absRotation > 50 ? 40 : 0}px)`,
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
          borderRight: isLeft ? `4px solid rgba(99,102,241,${0.7 * lightIntensity})` : `2px solid rgba(255,255,255,${0.4 * lightIntensity})`,
        }}
      >
        {/* Corner fold effect */}
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
            opacity: 0.6,
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
            borderBottomLeftRadius: isLeft ? '24px' : '0',
          }}
        />

        {/* Content */}
        <div className="relative z-10" style={{ transform: 'translateZ(2px)', scale: '0.85' }}>
          {content(card)}
        </div>
      </div>
    </div>
  )
}

export default BookPage
