import { useState } from 'react';

export default function SpeechUploader() {
  const [transcript, setTranscript] = useState('');

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('http://localhost:3000/api/speech/transcribe', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setTranscript(data.formatted); // 整形済みテキストを表示
    } catch (err) {
      console.error('Upload failed', err);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={e => handleUpload(e.target.files[0])}
      />
      <pre>{transcript}</pre>
    </div>
  );
}
