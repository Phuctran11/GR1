import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch } from '../apiClient'
import BackButton from '../components/BackButton'

const genres = [
  { value: 'life', label: 'Đời sống' },
  { value: 'work', label: 'Công việc' },
  { value: 'school', label: 'Trường học' },
  { value: 'travel', label: 'Du lịch' },
  { value: 'anime_manga', label: 'Anime / Manga' },
  { value: 'short_story', label: 'Câu chuyện ngắn' },
  { value: 'simple_news', label: 'Tin tức đơn giản' },
]

const lengths = [
  { value: 'short', label: 'Ngắn' },
  { value: 'medium', label: 'Vừa' },
  { value: 'long', label: 'Dài' },
]

function highlight(content, words) {
  if (!content) return ''
  return words.reduce((acc, w) => acc.replaceAll(w, `<mark class="bg-yellow-200 px-1">${w}</mark>`), content)
}

export default function ReadingGenerate({ isLoggedIn, user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const selectedVocab = location.state?.selectedVocab || []
  const level = location.state?.level || 'N5'

  const [genre, setGenre] = useState('life')
  const [length, setLength] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [ttsLoading, setTtsLoading] = useState(false)
  const [ttsError, setTtsError] = useState('')
  const [audioSrc, setAudioSrc] = useState('')
  const [quiz, setQuiz] = useState(null)
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizError, setQuizError] = useState('')
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  const forcedWords = useMemo(() => selectedVocab.map(v => v.word), [selectedVocab])

  const handleSubmit = async () => {
    if (!selectedVocab.length) {
      setError('Bạn chưa chọn từ nào từ trang flashcard')
      return
    }
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await apiFetch('/api/readings/generate', {
        method: 'POST',
        body: JSON.stringify({
          vocab_ids: selectedVocab.map(v => v.vocab_id),
          genre,
          length,
          level,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Không tạo được bài đọc')
        return
      }
      setResult(data)
      setAudioSrc('')
      setTtsError('')
      setQuiz(null)
      setQuizError('')
      setQuizAnswers({})
      setQuizResult(null)
    } catch (err) {
      setError(err.message || 'Lỗi kết nối')
    } finally {
      setLoading(false)
    }
  }

  const handleTts = async () => {
    if (!result?.reading?.reading_id) {
      setTtsError('Chưa có bài đọc để đọc thành tiếng')
      return
    }
    setTtsLoading(true)
    setTtsError('')
    setAudioSrc('')
    try {
      const res = await apiFetch(`/api/readings/${result.reading.reading_id}/tts`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setTtsError(data.error || 'Không tạo được audio')
        return
      }
      if (!data.audioBase64) {
        setTtsError('Không nhận được audio')
        return
      }
      setAudioSrc(`data:${data.mime || 'audio/mpeg'};base64,${data.audioBase64}`)
    } catch (err) {
      setTtsError(err.message || 'Lỗi kết nối TTS')
    } finally {
      setTtsLoading(false)
    }
  }

  const handleQuizGenerate = async (count = 3) => {
    if (!result?.reading?.reading_id) {
      setQuizError('Chưa có bài đọc để tạo quiz')
      return
    }
    setQuizLoading(true)
    setQuizError('')
    setQuiz(null)
    setQuizAnswers({})
    setQuizResult(null)
    try {
      const res = await apiFetch(`/api/readings/${result.reading.reading_id}/quiz`, {
        method: 'POST',
        body: JSON.stringify({ count }),
      })
      const data = await res.json()
      if (!res.ok) {
        setQuizError(data.error || 'Không tạo được quiz')
        return
      }
      setQuiz(data.quiz)
    } catch (err) {
      setQuizError(err.message || 'Lỗi kết nối quiz')
    } finally {
      setQuizLoading(false)
    }
  }

  const handleAnswer = (qid, option) => {
    setQuizAnswers(prev => ({ ...prev, [qid]: option }))
  }

  const handleSubmitQuiz = () => {
    if (!quiz?.questions) return
    let correct = 0
    quiz.questions.forEach(q => {
      if (quizAnswers[q.id] && quizAnswers[q.id] === q.answer) correct += 1
    })
    setQuizResult({ score: correct, total: quiz.questions.length })
  }

  if (!selectedVocab.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full text-center space-y-4">
          <p className="text-lg text-gray-700">Bạn cần chọn từ trong trang Flashcard trước.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Quay lại Flashcard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-6">
          <BackButton className="mr-4" />
          <h1 className="text-2xl font-bold text-blue-800">Tạo bài đọc AI</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-semibold mb-3">Từ đã chọn ({selectedVocab.length})</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {selectedVocab.map(v => (
                <div key={v.vocab_id} className="border border-gray-200 rounded-lg p-2 text-sm">
                  <div className="font-bold text-blue-700">{v.word} <span className="text-gray-600">({v.kana})</span></div>
                  <div className="text-gray-600">{v.meaning}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white rounded-xl shadow p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Thể loại</label>
                <select className="w-full border rounded-lg p-2" value={genre} onChange={e => setGenre(e.target.value)}>
                  {genres.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Độ dài</label>
                <select className="w-full border rounded-lg p-2" value={length} onChange={e => setLength(e.target.value)}>
                  {lengths.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60"
              >
                {loading ? 'Đang tạo...' : 'Tạo bài đọc'}
              </button>
              <span className="text-sm text-gray-600">Level: {level}</span>
            </div>

            {error && <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded">{error}</div>}

            {result && (
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-800">{result.reading?.title}</h3>
                  <div className="mt-3 text-gray-800 whitespace-pre-wrap leading-7" dangerouslySetInnerHTML={{ __html: highlight(result.reading?.content, forcedWords) }} />
                </div>
                {result.reading?.translation && (
                  <div className="p-3 bg-gray-50 border rounded">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Dịch tiếng Việt</div>
                    <div className="text-gray-800 whitespace-pre-wrap">{result.reading.translation}</div>
                  </div>
                )}
                <div className="p-3 bg-white border rounded space-y-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleTts}
                      disabled={ttsLoading}
                      className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60"
                    >
                      {ttsLoading ? 'Đang tạo audio...' : 'Nghe bài đọc'}
                    </button>
                    {ttsError && <span className="text-sm text-red-600">{ttsError}</span>}
                  </div>
                  {audioSrc && (
                    <audio controls src={audioSrc} className="w-full" />
                  )}
                </div>

                <div className="p-4 bg-white border rounded space-y-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuizGenerate(4)}
                      disabled={quizLoading}
                      className="px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-60"
                    >
                      {quizLoading ? 'Đang tạo quiz...' : 'Tạo quiz đọc hiểu'}
                    </button>
                    {quizError && <span className="text-sm text-red-600">{quizError}</span>}
                  </div>

                  {quiz?.questions && (
                    <div className="space-y-4">
                      {quiz.questions.map((q, idx) => {
                        const userAns = quizAnswers[q.id]
                        const isCorrect = userAns && userAns === q.answer
                        return (
                          <div key={q.id} className="border rounded p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-sm text-gray-500">Câu {idx + 1} • {q.difficulty || 'medium'}</div>
                                <div className="font-semibold text-gray-900 mt-1">{q.question}</div>
                              </div>
                              {userAns && (
                                <span className={`text-xs px-2 py-1 rounded ${isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                  {isCorrect ? 'Đúng' : 'Sai'}
                                </span>
                              )}
                            </div>
                            <div className="mt-2 space-y-2">
                              {q.options.map(opt => {
                                const selected = userAns === opt
                                const correct = q.answer === opt
                                return (
                                  <label key={opt} className={`flex items-center gap-2 p-2 border rounded cursor-pointer ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                    <input
                                      type="radio"
                                      name={q.id}
                                      className="accent-indigo-600"
                                      checked={selected}
                                      onChange={() => handleAnswer(q.id, opt)}
                                    />
                                    <span className="text-gray-800">{opt}</span>
                                    {quizResult && correct && <span className="text-xs text-emerald-700 ml-2">Đáp án</span>}
                                  </label>
                                )
                              })}
                            </div>
                            {quizResult && q.explanation && (
                              <div className="mt-2 text-sm text-gray-700">Giải thích: {q.explanation}</div>
                            )}
                          </div>
                        )
                      })}

                      <div className="flex items-center gap-3">
                        <button
                          onClick={handleSubmitQuiz}
                          className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                          disabled={!quiz?.questions?.length}
                        >
                          Chấm điểm
                        </button>
                        {quizResult && (
                          <span className="text-sm font-semibold text-gray-800">Kết quả: {quizResult.score}/{quizResult.total}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
