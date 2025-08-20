import React, { useState, useRef } from 'react';

/**
 * SpeechRecorderコンポーネント
 * マイクから音声を録音し、録音が完了したら親コンポーネントにFileとして渡す
 */
export default function SpeechRecorder({ onFileReady }) {
  const [recording, setRecording] = useState(false); // 録音中かどうか
  const [mediaRecorder, setMediaRecorder] = useState(null); // MediaRecorderインスタンス
  const audioChunksRef = useRef([]); // 録音データを一時的に保存する配列

  // 録音開始
  const startRecording = async () => {
    if (recording) return; // すでに録音中なら無視
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // マイク取得
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunksRef.current = []; // 録音データ初期化

    // 録音データが利用可能になったとき
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data); // データを配列に追加
    };

    // 録音停止時の処理
    recorder.onstop = () => {
      // Blobを作成（WAV形式を想定）
      const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      // BlobをFileに変換して親に渡す
      const file = new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
      onFileReady(file);
    };

    recorder.start(); // 録音開始
    setRecording(true); // 録音中フラグON
  };

  // 録音停止
  const stopRecording = () => {
    if (!recording || !mediaRecorder) return; // 録音中でなければ無視
    mediaRecorder.stop(); // 録音停止
    setRecording(false); // 録音中フラグOFF
  };

  return (
    <div className="file-picker glossy-box">
      <label>🎙️ 録音する</label>
      <button
        className={`glossy-btn ${recording ? 'recording' : ''}`} // 録音中はボタン見た目変更
        onClick={recording ? stopRecording : startRecording} // クリックで録音開始/停止
      >
        {recording ? '⏸ 停止' : '⏺ 録音開始'}
      </button>
    </div>
  );
}
