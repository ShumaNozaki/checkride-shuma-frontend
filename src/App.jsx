import React, { useState, useRef } from 'react'
import './App.css'

function App() {
  const [audioFile, setAudioFile] = useState(null)     // 音声ファイル（録音 or 選択）
  const [keyword, setKeyword] = useState('')           // 検索キーワード
  const [transcript, setTranscript] = useState('')     // 文字起こし結果
  const [matchSnippet, setMatchSnippet] = useState('') // キーワード前後のテキスト

  const [isRecording, setIsRecording] = useState(false) // 録音中かどうか
  const mediaRecorderRef = useRef(null)                 // MediaRecorder保持用
  const recordedChunks = useRef([])                     // 録音データ一時保存用

  // ファイル選択時
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0])
  }

  // キーワード入力時
  const handleKeywordChange = (e) => {
    setKeyword(e.target.value)
  }

  // 録音開始
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      recordedChunks.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunks.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(recordedChunks.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], 'recorded_audio.webm', { type: 'audio/webm' })
        setAudioFile(audioFile)
      }

      mediaRecorder.start()
      mediaRecorderRef.current = mediaRecorder
      setIsRecording(true)
    } catch (err) {
      console.error('録音エラー:', err)
      alert('マイクの使用が許可されていません')
    }
  }

  // 録音停止
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // 送信ボタン押下時
  const handleSubmit = async () => {
    if (!audioFile || !keyword) {
      alert('音声ファイルまたは録音と、キーワードを入力してください')
      return
    }

    const formData = new FormData()
    formData.append('audio', audioFile)
    formData.append('keyword', keyword)

    try {
      const res = await fetch('http://localhost:3000/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      setTranscript(data.transcript || '')

      const index = data.transcript.indexOf(keyword)
      if (index !== -1) {
        const start = Math.max(0, index - 5)
        const end = index + keyword.length + 5
        setMatchSnippet(data.transcript.substring(start, end))
      } else {
        setMatchSnippet('該当なし')
      }
    } catch (err) {
      console.error('サーバーエラー:', err)
      alert('変換に失敗しました')
    }
  }

return (
  <div className="app-container">
    <header>音声認識アプリ</header>

    {/* 音声ファイル選択 */}
    <div className="input-group">
      <label>音声ファイルを選択</label>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
    </div>

    {/* マイク録音 */}
    <div className="input-group">
      <label>マイクで録音</label>
      {isRecording ? (
        <button onClick={stopRecording} className="btn btn--blue">録音停止</button>
      ) : (
        <button onClick={startRecording} className="btn btn--blue">録音開始</button>
      )}
    </div>

    {/* キーワード入力 */}
    <div className="input-group">
      <label>検索キーワード</label>
      <input type="text" value={keyword} onChange={handleKeywordChange} />
    </div>

    {/* 送信ボタン */}
    <button onClick={handleSubmit} className="btn btn--blue">送信</button>

    <hr />

    {/* 結果表示 */}
    <div className="result-box">
      <h3>全文（文字起こし）</h3>
      <p>{transcript}</p>
    </div>

    <div className="result-box">
      <h3>キーワード前後（±5文字）</h3>
      <p>{matchSnippet}</p>
    </div>
  </div>
)

}

export default App
