import React from 'react'

const Spine = ({ transitioning }) => (
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
      transition: 'opacity 0.3s ease',
    }}
  >
    <div className="absolute inset-0 flex flex-col justify-evenly">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{ height: '1px', background: 'rgba(255,255,255,0.05)', width: '100%' }}
        />
      ))}
    </div>
  </div>
)

export default Spine
