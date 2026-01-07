import React from 'react'

const ProgressMini = ({ current, total }) => {
  const percent = total ? ((current + 1) / total) * 100 : 0
  return (
    <div className="mb-6 text-center">
      <div className="text-sm text-gray-600 mb-3">
        Từ <span className="font-bold text-brand-700">{current + 1}</span> / <span className="font-bold">{total}</span>
      </div>
      <div className="w-64 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-sky-400 to-blue-600 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressMini
