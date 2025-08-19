import { useState } from 'react';

export default function SpeechUploader() {
  // 音声認識結果を保持
  const [transcript, setTranscript] = useState('');
  // エラーメッセージを保持
  const [error, setError] = useState('');

  // フロントからバックエンドへ音声ファイルを送信
  const handleUpload = async (file) => {
    if (!file) {
      setError('音声ファイルを選択してください');
      return;
    }

    setError(''); // 前回のエラーをクリア
    const formData = new FormData();
    formData.append('audio', file);

    try {
      // APIのベースURLは環境変数から取得、未設定時はローカルを使用
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';
      const response = await fetch(`${apiBase}/speech/transcribe`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`APIエラー: ${response.status}`);
      }

      const data = await response.json();
      // バックエンドが返す整形済みテキスト or 全文テキスト
      setTranscript(data.formatted || data.transcript || '');
    } catch (err) {
      console.error('Upload failed', err);
      setError('音声の送信または変換に失敗しました');
    }
  };

  return (
    <div className="speech-uploader">
      <label>音声ファイルを選択</label>
      <input
        type="file"
        accept="audio/*"
        onChange={e => handleUpload(e.target.files?.[0])}
      />
      {error && <div className="error-message" style={{ color: 'red' }}>{error}</div>}
      {transcript && <pre className="transcript">{transcript}</pre>}
    </div>
  );
}
