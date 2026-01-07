import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { apiFetch } from '../apiClient'
import BackButton from '../components/BackButton'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'

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
  const [quizCount, setQuizCount] = useState(3)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn, navigate])

  const forcedWords = useMemo(() => selectedVocab.map(v => v.word), [selectedVocab])

  const selectionPercent = Math.min(100, Math.round((selectedVocab.length / 5) * 100))

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
      <div className="max-w-[1400px] mx-auto px-4 md:px-6">
        <div className="flex items-center mb-6">
          <BackButton className="mr-4" />
          <h1 className="text-2xl font-bold text-blue-800">Tạo bài đọc AI</h1>
        </div>

            <div className="grid md:grid-cols-12 gap-6">
          <div className="md:col-span-2 card-base">
            <h2 className="text-lg font-semibold mb-3">Từ đã chọn ({selectedVocab.length})</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedVocab.map(v => (
                <div key={v.vocab_id} className="rounded-lg p-3 bg-white/40 border border-white/30">
                  <div className="font-bold text-brand-700">{v.word} <span className="text-gray-600">({v.kana})</span></div>
                  <div className="text-gray-600">{v.meaning}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <ProgressBar percent={selectionPercent} label={`Chọn từ (${selectedVocab.length})`} />
              <div className="text-xs text-gray-500 mt-1">Khuyến nghị 3-5 từ để bài đọc cân đối</div>
            </div>
          </div>

          <div className="md:col-span-6 card-base space-y-4">
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
              <Button onClick={handleSubmit} disabled={loading} variant="primary">{loading ? 'Đang tạo...' : 'Tạo bài đọc'}</Button>
              <span className="text-sm text-gray-600">Level: {level}</span>
            </div>

            {error && <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded">{error}</div>}

            {result && (
              <div className="mt-4">
                {/* reading area occupies 2/4 columns on md+ */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-extrabold text-brand-700">{result.reading?.title}</h3>
                    <div className="mt-3 text-gray-800 whitespace-pre-wrap leading-7" dangerouslySetInnerHTML={{ __html: highlight(result.reading?.content, forcedWords) }} />
                  </div>

                  {result.reading?.translation && (
                    <div className="p-3 bg-white/50 border rounded">
                      <div className="text-sm font-semibold text-gray-700 mb-1">Dịch tiếng Việt</div>
                      <div className="text-gray-800 whitespace-pre-wrap">{result.reading.translation}</div>
                    </div>
                  )}

                  <div className="p-3 bg-white/30 border rounded space-y-2 flex flex-col">
                    <div className="flex items-center gap-3">
                      <Button onClick={handleTts} disabled={ttsLoading} variant="ghost">{ttsLoading ? 'Đang tạo audio...' : 'Nghe bài đọc'}</Button>
                      {ttsError && <span className="text-sm text-red-600">{ttsError}</span>}
                    </div>
                    {audioSrc && (
                      <audio controls src={audioSrc} className="w-full rounded" />
                    )}
                  </div>

                  {/* On mobile, show full quiz details below content when user expands */}
                  <div className="mt-4 md:hidden">
                    {quiz?.questions && (
                      <div className="space-y-4">
                        {quiz.questions.map((q) => (
                          <div key={q.id} className="border rounded p-3 bg-white/60">
                            <div className="font-semibold">{q.question}</div>
                            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                              {q.options.map(opt => {
                                const selectedOpt = quizAnswers[q.id] === opt
                                const isCorrectOpt = q.answer === opt
                                let mobileVariant = 'ghost'
                                if (quizResult) {
                                  if (isCorrectOpt) mobileVariant = 'correct'
                                  else if (selectedOpt && !isCorrectOpt) mobileVariant = 'incorrect'
                                } else if (selectedOpt) mobileVariant = 'primary'
                                return (
                                  <Button key={opt} onClick={() => handleAnswer(q.id, opt)} variant={mobileVariant} className="text-left">{opt}</Button>
                                )
                              })}
                            </div>
                            {quizResult && q.explanation && <div className="mt-2 text-sm text-gray-700">Giải thích: {q.explanation}</div>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right-side quiz panel (desktop) */}
          <aside className="md:col-span-4">
            <div className="card-base p-4 md:p-6 md:sticky md:top-24 space-y-4 w-full h-auto">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Quiz đọc hiểu</div>
                <div className="text-sm text-gray-500">{quiz?.questions?.length || 0} câu</div>
              </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Số câu</label>
                          <select value={quizCount} onChange={e => setQuizCount(Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
                            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} câu</option>)}
                          </select>
                        </div>
                        <Button onClick={() => handleQuizGenerate(quizCount)} disabled={quizLoading} variant="outline">{quizLoading ? 'Đang tạo...' : 'Tạo'}</Button>
                      </div>

              {quizError && <div className="text-sm text-red-600">{quizError}</div>}

              {quiz?.questions ? (
                <div className="max-h-[60vh] overflow-y-auto space-y-3">
                  {quiz.questions.map((q, idx) => {
                    const userAns = quizAnswers[q.id]
                    const showResult = !!quizResult
                    return (
                      <div key={q.id} className="p-2 md:p-3 bg-white/60 rounded border">
                        <div className="text-xs md:text-sm muted">Câu {idx + 1} • <span className={`px-2 py-0.5 rounded text-[10px] md:text-xs ${q.difficulty === 'hard' ? 'bg-red-100 text-red-700' : q.difficulty === 'easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>{q.difficulty || 'medium'}</span></div>
                        <div className="font-medium mt-1 text-sm mb-2">{q.question}</div>
                        <div className="grid grid-cols-1 gap-2">
                          {q.options.map(opt => {
                            const selected = userAns === opt
                            const correct = q.answer === opt
                            let variant = 'ghost'
                            if (showResult) {
                              if (correct) variant = 'correct'
                              else if (selected && !correct) variant = 'incorrect'
                            } else if (selected) variant = 'primary'
                            return (
                              <Button key={opt} onClick={() => handleAnswer(q.id, opt)} variant={variant} className="text-left w-full">
                                <div className="flex items-center justify-between w-full">
                                  <span className={`truncate ${selected ? 'font-semibold' : ''}`}>{opt}</span>
                                  {showResult && correct && <span className="text-xs text-white/90 ml-2">Đáp án</span>}
                                </div>
                              </Button>
                            )
                          })}
                        </div>
                        {showResult && q.explanation && <div className="mt-2 text-sm text-gray-700">Giải thích: {q.explanation}</div>}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-sm text-gray-500">Chưa có quiz. Tạo để hiển thị các câu hỏi ở đây.</div>
              )}

              {quiz?.questions && (
                <div className="flex items-center gap-3">
                  <Button onClick={handleSubmitQuiz} variant="primary" disabled={!quiz?.questions?.length}>Chấm điểm</Button>
                  {quizResult && <span className="text-sm font-semibold text-gray-800">{quizResult.score}/{quizResult.total}</span>}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
