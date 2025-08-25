import React, { useState, useMemo } from 'react';
import "./App.css";
import SpeechRecorder from './components/SpeechRecorder';
import { highlight} from './utils/text';

export default function App() {
  const [apiBase] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

  const [keywords, setKeywords] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [pickedUrl, setPickedUrl] = useState(null);

  const [transcript, setTranscript] = useState('');           // 文字起こし全文
  const [highlightedHtml, setHighlightedHtml] = useState(''); // キーワードハイライト
  const [contexts, setContexts] = useState([]); // 前後5文字や位置情報用
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('ja'); 

  // ファイル選択時の処理
  const handlePickFile = (e) => {
    const f = e.target.files?.[0];
    setAudioFile(f || null);
    if (pickedUrl) URL.revokeObjectURL(pickedUrl);
    if (f) setPickedUrl(URL.createObjectURL(f));
  };

  // 録音完了時の処理
  const handleRecorded = (file) => {
    setAudioFile(file);
    if (pickedUrl) URL.revokeObjectURL(pickedUrl);
    setPickedUrl(URL.createObjectURL(file));
  };

  const canSend = useMemo(() => !!audioFile && !loading, [audioFile, loading]);

  const send = async () => {
    if (!audioFile) {
      alert('音声ファイルを選択するか録音してください');
      return;
    }

    setLoading(true);
    setTranscript('');
    setHighlightedHtml('');
    setContexts([]);

    const form = new FormData();
    form.append('audio', audioFile);
    form.append('keywords', keywords);
    form.append('language', language);


    try {
      const res = await fetch(`${apiBase}/api/speech/transcribe`, {
        method: 'POST',
        body: form
      });

      if (!res.ok) {
        alert('変換に失敗しました');
        setLoading(false);
        return;
      }

      const data = await res.json();
      const original = data.transcript || '';

      setTranscript(original);

      // バックエンドで計算済みの matches を使用
      const kws = data.matches.map(m => m.keyword);
      setHighlightedHtml(highlight(original, kws));
      setContexts(data.matches);

    } catch (err) {
      console.error('送信中にエラー', err);
      alert('変換中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header> 音声認識 DEMO</header>
      <div className="app-grid">
      <aside className="left">

        <div className="file-picker glossy-box">
        <div className="language-picker glossy-box">
          <label>🌏 言語を選択</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="language"
                value="ja"
                checked={language === 'ja'}
                onChange={(e) => setLanguage(e.target.value)}
              />
              日本語
            </label>
            <label>
              <input
                type="radio"
                name="language"
                value="en"
                checked={language === 'en'}
                onChange={(e) => setLanguage(e.target.value)}
              />
              英語
            </label>
          </div>
        </div>

        {/* <div className="file-picker glossy-box"> */}
          <SpeechRecorder onFileReady={handleRecorded} />

          <div className="file-picker glossy-box">
            <label>⇪ 音声ファイルをアップロード</label>
            <input type="file" accept="audio/*" onChange={handlePickFile} />
            {pickedUrl && (
              <div className="player">
                <audio controls src={pickedUrl} />
                <div className="hint">▶︎ 選択または録音した音声を再生できます</div>
              </div>
            )}
          </div>

          {/* <div className="file-picker glossy-box"> */}
          <div className="keyword-input glossy-box">
              <label>🔎 キーワードを検索 (カンマ区切り)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="例) 音声,ディープラーニング"
              />
            </div>

            <button
              className="glossy-btn send-btn"
              disabled={!canSend}
              onClick={send}
            >
              {loading ? '処理中…' : '✓ 送信'}
            </button>
          </div>
        </aside>

        <main className="right">
          <section>
            <h3>全文</h3>
            <p className="text-block">{transcript || '—'}</p>
          </section>

          <section>
            <h3>キーワードハイライト</h3>
            <p
              className="text-block"
              dangerouslySetInnerHTML={{ __html: highlightedHtml || (transcript || '—') }}
            />
          </section>

          <section>
            <h3>キーワード前後5文字</h3>
            {contexts.length ? (
              contexts.map((c, i) => (
                <div key={i}>
                  <strong>{c.keyword}</strong>（{c.startIndex}文字目 / {c.wordPosition}単語目）: {c.snippet}
                </div>
              ))
            ) : (
              <p>—</p>
            )}
          </section>


        </main>
      </div>
    </div>
  );
}
