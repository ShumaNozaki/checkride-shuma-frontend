import { useState } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SpeechRecorder() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);

  // マイク録音
  async function recordAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];
    mediaRecorder.ondataavailable = e => chunks.push(e.data);
    mediaRecorder.start();

    // 3秒録音
    await new Promise(resolve => setTimeout(resolve, 3000));
    mediaRecorder.stop();

    return new Promise(resolve => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        resolve(blob);
      };
    });
  }

  // バックエンドに送信
  async function sendAudioToBackend(audioBlob) {
    const formData = new FormData();
    formData.append('audio', audioBlob);

    const response = await fetch(`${API_BASE_URL}/transcribe`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('Transcription failed');

    const data = await response.json();
    return data.transcript;
  }

  const handleRecord = async () => {
    setLoading(true);
    try {
      const audioBlob = await recordAudio();
      const text = await sendAudioToBackend(audioBlob);
      setTranscript(text);
    } catch (err) {
      console.error(err);
      alert('音声認識に失敗しました');
    }
    setLoading(false);
  };

  return (
    <div>
      <button onClick={handleRecord} disabled={loading}>
        {loading ? '認識中...' : '録音して認識'}
      </button>
      <p>{transcript}</p>
    </div>
  );
}
