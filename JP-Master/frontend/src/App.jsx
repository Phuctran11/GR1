import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <header className="flex items-center gap-6 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </header>

      <h1 className="text-3xl font-bold mb-4">Vite + React + Tailwind</h1>

      <div className="card bg-white p-6 rounded-lg shadow-md">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setCount((c) => c + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-sm text-gray-600">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <div className="mt-6 p-4 bg-white shadow rounded flex items-center gap-3">
        <span className="text-sm">Tailwind test:</span>
        <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded">OK</span>
      </div>

      <p className="read-the-docs mt-6 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
