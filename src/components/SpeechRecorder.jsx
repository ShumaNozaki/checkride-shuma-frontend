// // import React, { useEffect, useRef, useState } from 'react';

// // export default function SpeechRecorder({ onFileReady }) {
// //   const [isRecording, setIsRecording] = useState(false);
// //   const [recordedUrl, setRecordedUrl] = useState(null);

// //   const mediaStreamRef = useRef(null);
// //   const audioCtxRef = useRef(null);
// //   const processorRef = useRef(null);
// //   const chunksRef = useRef([]);

// //   const start = async () => {
// //     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// //     mediaStreamRef.current = stream;

// //     const audioCtx = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 44100 });
// //     audioCtxRef.current = audioCtx;

// //     const source = audioCtx.createMediaStreamSource(stream);
// //     const processor = audioCtx.createScriptProcessor(4096, 1, 1);

// //     processor.onaudioprocess = e => {
// //       const input = e.inputBuffer.getChannelData(0);
// //       chunksRef.current.push(floatTo16BitPCM(input));
// //     };

// //     source.connect(processor);
// //     processor.connect(audioCtx.destination);
// //     processorRef.current = processor;

// //     setIsRecording(true);
// //   };

// //   const stop = () => {
// //     setIsRecording(false);
// //     processorRef.current && processorRef.current.disconnect();
// //     audioCtxRef.current && audioCtxRef.current.close();
// //     mediaStreamRef.current && mediaStreamRef.current.getTracks().forEach(t => t.stop());

// //     const wavBlob = encodeWAVFromChunks(chunksRef.current, 44100);
// //     chunksRef.current = [];
// //     const file = new File([wavBlob], 'recorded.wav', { type: 'audio/wav' });
// //     const url = URL.createObjectURL(file);
// //     setRecordedUrl(url);
// //     onFileReady && onFileReady(file);
// //   };

// //   useEffect(() => () => {
// //     processorRef.current && processorRef.current.disconnect();
// //     audioCtxRef.current && audioCtxRef.current.close();
// //     mediaStreamRef.current && mediaStreamRef.current.getTracks().forEach(t => t.stop());
// //     if (recordedUrl) URL.revokeObjectURL(recordedUrl);
// //   }, [recordedUrl]);

// //   return (
// //     <div className="recorder">
// //       <div className="input-group">
// //         {isRecording ? (
// //           <button onClick={stop}>録音停止</button>
// //         ) : (
// //           <button onClick={start}>録音開始</button>
// //         )}
// //       </div>

// //       {recordedUrl && (
// //         <div className="player">
// //           <audio controls src={recordedUrl} />
// //           <div className="hint">↑ 録音した音声を再生できます</div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// // function floatTo16BitPCM(float32Array) {
// //   const buffer = new ArrayBuffer(float32Array.length * 2);
// //   const view = new DataView(buffer);
// //   for (let i = 0; i < float32Array.length; i++) {
// //     let s = Math.max(-1, Math.min(1, float32Array[i]));
// //     view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
// //   }
// //   return new DataView(buffer);
// // }

// // function encodeWAVFromChunks(chunks, sampleRate) {
// //   const dataLength = chunks.reduce((sum, dv) => sum + dv.byteLength, 0);
// //   const buffer = new ArrayBuffer(44 + dataLength);
// //   const view = new DataView(buffer);

// //   writeString(view, 0, 'RIFF');
// //   view.setUint32(4, 36 + dataLength, true);
// //   writeString(view, 8, 'WAVE');
// //   writeString(view, 12, 'fmt ');
// //   view.setUint32(16, 16, true);
// //   view.setUint16(20, 1, true);
// //   view.setUint16(22, 1, true);
// //   view.setUint32(24, sampleRate, true);
// //   view.setUint32(28, sampleRate * 2, true);
// //   view.setUint16(32, 2, true);
// //   view.setUint16(34, 16, true);
// //   writeString(view, 36, 'data');
// //   view.setUint32(40, dataLength, true);

// //   let offset = 44;
// //   chunks.forEach(dv => {
// //     for (let i = 0; i < dv.byteLength; i++) view.setUint8(offset++, dv.getUint8(i));
// //   });

// //   return new Blob([view], { type: 'audio/wav' });
// // }

// // function writeString(view, offset, str) {
// //   for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
// // }
// // src/components/SpeechRecorder.jsx
// import React, { useState, useRef } from 'react';

// export default function SpeechRecorder({ onFileReady }) {
//   const [recording, setRecording] = useState(false);
//   const [mediaRecorder, setMediaRecorder] = useState(null);
//   const audioChunksRef = useRef([]);

//   const startRecording = async () => {
//     if (recording) return;
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     const recorder = new MediaRecorder(stream);
//     setMediaRecorder(recorder);
//     audioChunksRef.current = [];

//     recorder.ondataavailable = (e) => {
//       if (e.data.size > 0) audioChunksRef.current.push(e.data);
//     };

//     recorder.onstop = () => {
//       const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
//       const file = new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
//       onFileReady(file);
//     };

//     recorder.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     if (!recording || !mediaRecorder) return;
//     mediaRecorder.stop();
//     setRecording(false);
//   };

//   return (
//     <div className="recorder-container">
//       {/* 録音ボタン */}
//       <button
//         className={`glossy-btn ${recording ? 'recording' : ''}`} // 録音中はpulseアニメーション
//         onClick={recording ? stopRecording : startRecording}
//       >
//         {recording ? '⏹ 停止' : '🎙 録音開始'}
//       </button>
//     </div>
//   );
// }
// src/components/SpeechRecorder.jsx





import React, { useState, useRef } from 'react';

export default function SpeechRecorder({ onFileReady }) {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    if (recording) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      const file = new File([blob], `recording_${Date.now()}.wav`, { type: 'audio/wav' });
      onFileReady(file);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (!recording || !mediaRecorder) return;
    mediaRecorder.stop();
    setRecording(false);
  };

  return (
    <div className="input-group">
      <label>録音する</label>
      <button
        className={`glossy-btn ${recording ? 'recording' : ''}`}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? '⏸ 停止' : '⏺ 録音開始'}
      </button>
    </div>
  );
}
