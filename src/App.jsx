// // // import React, { useMemo, useState } from 'react';
// // // import "./App.css";
// // // import SpeechRecorder from './components/SpeechRecorder';
// // // import { addJapanesePunctuation, highlightAllOccurrences, extractContexts } from './utils/text';

// // // export default function App() {
// // //   const [apiBase] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

// // //   // 入力
// // //   const [keyword, setKeyword] = useState('');
// // //   const [audioFile, setAudioFile] = useState(null);
// // //   const [pickedUrl, setPickedUrl] = useState(null); // 選択ファイルの再生用

// // //   // 出力
// // //   const [rawTranscript, setRawTranscript] = useState('');
// // //   const [punctuated, setPunctuated] = useState(''); // 句読点付き
// // //   const [highlightedHtml, setHighlightedHtml] = useState(''); // <mark>入りHTML
// // //   const [contexts, setContexts] = useState([]); // 前後±5文字

// // //   const handlePickFile = (e) => {
// // //     const f = e.target.files?.[0];
// // //     setAudioFile(f || null);
// // //     if (pickedUrl) URL.revokeObjectURL(pickedUrl);
// // //     if (f) setPickedUrl(URL.createObjectURL(f));
// // //   };

// // //   // SpeechRecorder から受け取る（録音WAV）
// // //   const handleRecorded = (file) => {
// // //     setAudioFile(file);
// // //     if (pickedUrl) URL.revokeObjectURL(pickedUrl);
// // //     setPickedUrl(URL.createObjectURL(file));
// // //   };

// // //   const canSend = useMemo(() => !!audioFile, [audioFile]);

// // //   const send = async () => {
// // //     if (!audioFile) {
// // //       alert('音声ファイルを選択するか録音してください');
// // //       return;
// // //     }
// // //     const form = new FormData();
// // //     form.append('audio', audioFile);
// // //     form.append('keyword', keyword);

// // //     const res = await fetch(`${apiBase}/transcribe`, {
// // //       method: 'POST',
// // //       body: form
// // //     });
// // //     if (!res.ok) {
// // //       alert('変換に失敗しました');
// // //       return;
// // //     }
// // //     const data = await res.json();
// // //     // バックエンドは transcript（空白除去済み）を返すことを想定
// // //     const original = data.transcript || '';

// // //     setRawTranscript(original);

// // //     // 句読点を付与（フロント側）
// // //     const withPunc = addJapanesePunctuation(original);
// // //     setPunctuated(withPunc);

// // //     // ハイライト
// // //     setHighlightedHtml(highlightAllOccurrences(withPunc, keyword));

// // //     // 前後±5文字（句読点付与後のテキストで）
// // //     setContexts(extractContexts(withPunc, keyword, 5));
// // //   };

// // //   return (
// // //     <div className="app-container">
// // //       <header>音声認識デモ（録音→WAV→Watson→句読点→ハイライト）</header>

// // //       {/* 1) 録音（WAV） */}
// // //       <SpeechRecorder onFileReady={handleRecorded} />

// // //       {/* 2) ファイル選択 & 再生 */}
// // //       <div className="input-group">
// // //         <label>音声ファイルを選択</label>
// // //         <input type="file" accept="audio/*" onChange={handlePickFile} />
// // //         {pickedUrl && (
// // //           <div className="player">
// // //             <audio controls src={pickedUrl} />
// // //             <div className="hint">↑ 選択または録音した音声を再生できます</div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* 3) キーワード */}
// // //       <div className="input-group">
// // //         <label>キーワード</label>
// // //         <input
// // //           type="text"
// // //           value={keyword}
// // //           onChange={(e) => setKeyword(e.target.value)}
// // //           placeholder="例）音声"
// // //         />
// // //       </div>

// // //       {/* 4) 送信 */}
// // //       <button className="btn btn--primary" disabled={!canSend} onClick={send}>
// // //         送信（Watsonへ）
// // //       </button>

// // //       <hr />

// // //       {/* 結果表示 */}
// // //       <section>
// // //         <h3>全文（句読点付き）</h3>
// // //         <p className="text-block">{punctuated || '—'}</p>
// // //       </section>

// // //       <section>
// // //         <h3>キーワード・ハイライト（黄色マーカー）</h3>
// // //         <p
// // //           className="text-block"
// // //           dangerouslySetInnerHTML={{ __html: highlightedHtml || (punctuated || '—') }}
// // //         />
// // //       </section>

// // //       <section>
// // //         <h3>キーワード前後（±5文字）</h3>
// // //         {keyword ? (
// // //           contexts.length ? (
// // //             <ul>
// // //               {contexts.map((c, i) => (
// // //                 <li key={i}>{c}</li>
// // //               ))}
// // //             </ul>
// // //           ) : (
// // //             <p>該当なし</p>
// // //           )
// // //         ) : (
// // //           <p>（キーワード未入力）</p>
// // //         )}
// // //       </section>
// // //     </div>
// // //   );
// // // }
// // import React, { useMemo, useState } from 'react';
// // import "./App.css";
// // import SpeechRecorder from './components/SpeechRecorder';
// // import { addJapanesePunctuation, highlightAllOccurrences, extractContexts } from './utils/text';

// // export default function App() {
// //   const [apiBase] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

// //   // 入力
// //   const [keyword, setKeyword] = useState('');
// //   const [audioFile, setAudioFile] = useState(null);
// //   const [pickedUrl, setPickedUrl] = useState(null); // 選択ファイルの再生用

// //   // 出力
// //   const [rawTranscript, setRawTranscript] = useState('');
// //   const [punctuated, setPunctuated] = useState(''); // 句読点付き
// //   const [highlightedHtml, setHighlightedHtml] = useState(''); // <mark>入りHTML
// //   const [contexts, setContexts] = useState([]); // 前後±5文字
// //   const [speakerText, setSpeakerText] = useState({}); // 追加: 話者別テキスト

// //   const handlePickFile = (e) => {
// //     const f = e.target.files?.[0];
// //     setAudioFile(f || null);
// //     if (pickedUrl) URL.revokeObjectURL(pickedUrl);
// //     if (f) setPickedUrl(URL.createObjectURL(f));
// //   };

// //   const handleRecorded = (file) => {
// //     setAudioFile(file);
// //     if (pickedUrl) URL.revokeObjectURL(pickedUrl);
// //     setPickedUrl(URL.createObjectURL(file));
// //   };

// //   const canSend = useMemo(() => !!audioFile, [audioFile]);

// //   const send = async () => {
// //     if (!audioFile) {
// //       alert('音声ファイルを選択するか録音してください');
// //       return;
// //     }

// //     const form = new FormData();
// //     form.append('audio', audioFile);
// //     form.append('keyword', keyword);

// //     const res = await fetch(`${apiBase}/transcribe`, { // 修正: /transcribe に統一
// //       method: 'POST',
// //       body: form
// //     });
// //     if (!res.ok) {
// //       alert('変換に失敗しました');
// //       return;
// //     }

// //     const data = await res.json();

// //     // --- transcript を取得 ---
// //     const original = data.transcript || '';
// //     setRawTranscript(original);

// //     // --- 句読点を付与 ---
// //     const withPunc = addJapanesePunctuation(original);
// //     setPunctuated(withPunc);

// //     // --- ハイライト ---
// //     setHighlightedHtml(highlightAllOccurrences(withPunc, keyword));

// //     // --- 前後±5文字抽出 ---
// //     setContexts(extractContexts(withPunc, keyword, 5));

// //     // --- 追加: 話者ラベル処理 ---
// //     setSpeakerText(data.speakers || {});
// //   };

// //   return (
// //     <div className="app-container">
// //       <header>音声認識デモ</header>

// //       {/* 録音 */}
// //       <SpeechRecorder onFileReady={handleRecorded} />

// //       {/* ファイル選択 & 再生 */}
// //       <div className="input-group">
// //         <label>音声ファイルを選択</label>
// //         <input type="file" accept="audio/*" onChange={handlePickFile} />
// //         {pickedUrl && (
// //           <div className="player">
// //             <audio controls src={pickedUrl} />
// //             <div className="hint">↑ 選択または録音した音声を再生できます</div>
// //           </div>
// //         )}
// //       </div>

// //       {/* キーワード */}
// //       <div className="input-group">
// //         <label>キーワード</label>
// //         <input
// //           type="text"
// //           value={keyword}
// //           onChange={(e) => setKeyword(e.target.value)}
// //           placeholder="例）音声"
// //         />
// //       </div>

// //       {/* 送信 */}
// //       <button className="btn btn--primary" disabled={!canSend} onClick={send}>
// //         送信（Watsonへ）
// //       </button>

// //       <hr />

// //       {/* 結果表示 */}
// //       <section>
// //         <h3>全文</h3>
// //         <p className="text-block">{punctuated || '—'}</p>
// //       </section>

// //       <section>
// //         <h3>キーワード検出</h3>
// //         <p
// //           className="text-block"
// //           dangerouslySetInnerHTML={{ __html: highlightedHtml || (punctuated || '—') }}
// //         />
// //       </section>

// //       <section>
// //         <h3>キーワードの前後5文字を出力</h3>
// //         {keyword ? (
// //           contexts.length ? (
// //             <ul>
// //               {contexts.map((c, i) => (
// //                 <li key={i}>{c}</li>
// //               ))}
// //             </ul>
// //           ) : (
// //             <p>該当なし</p>
// //           )
// //         ) : (
// //           <p>（キーワード未入力）</p>
// //         )}
// //       </section>

// //       {/* 追加: 話者別テキスト表示 */}
// //       <section>
// //         <h3>話者別テキスト</h3>
// //         {Object.entries(speakerText).length ? (
// //           Object.entries(speakerText).map(([spk, text]) => (
// //             <div key={spk}>
// //               <strong>Speaker {spk}:</strong> {text}
// //             </div>
// //           ))
// //         ) : (
// //           <p>認識結果なし</p>
// //         )}
// //       </section>
// //     </div>
// //   );
// // }

// // App.jsx
// import React, { useMemo, useState } from 'react';
// import "./App.css";
// import SpeechRecorder from './components/SpeechRecorder';
// // import { addJapanesePunctuation, highlightAllOccurrences, extractContexts } from './utils/text';
// import SpeechUploader from './components/SpeechUploader';

// export default function App() {
//   const [apiBase] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

//   // 入力
//   const [keyword, setKeyword] = useState('');
//   const [audioFile, setAudioFile] = useState(null);
//   const [pickedUrl, setPickedUrl] = useState(null);

//   // 出力
//   const [punctuated, setPunctuated] = useState('');
//   const [highlightedHtml, setHighlightedHtml] = useState('');
//   const [contexts, setContexts] = useState([]);
//   const [speakerText, setSpeakerText] = useState({});

//   const handlePickFile = (e) => {
//     const f = e.target.files?.[0];
//     setAudioFile(f || null);
//     if (pickedUrl) URL.revokeObjectURL(pickedUrl);
//     if (f) setPickedUrl(URL.createObjectURL(f));
//   };

//   const handleRecorded = (file) => {
//     setAudioFile(file);
//     if (pickedUrl) URL.revokeObjectURL(pickedUrl);
//     setPickedUrl(URL.createObjectURL(file));
//   };



//   const canSend = useMemo(() => !!audioFile, [audioFile]);

//   const send = async () => {
//     if (!audioFile) {
//       alert('音声ファイルを選択するか録音してください');
//       return;
//     }
//     const form = new FormData();
//     form.append('audio', audioFile);
//     form.append('keyword', keyword);

//     const res = await fetch(`${apiBase}/transcribe`, {
//       method: 'POST',
//       body: form
//     });
//     if (!res.ok) {
//       alert('変換に失敗しました');
//       return;
//     }

//     const data = await res.json();
//     const original = data.transcript || '';
//     const withPunc = addJapanesePunctuation(original);
//     setPunctuated(withPunc);
//     setHighlightedHtml(highlightAllOccurrences(withPunc, keyword));
//     setContexts(extractContexts(withPunc, keyword, 5));
//     setSpeakerText(data.speakers || {});
//   };

//   return (
//     <div className="app-container">
//       {/* ===== タイトル ===== */}
//       <header className="app-title">🎙 音声認識</header>
//       {/* ===== 録音 & ファイル選択を横並び ===== */}
//       <div className="file-picker glossy-box">
//         <SpeechRecorder onFileReady={handleRecorded} />

//         <div className="file-picker glossy-box">
//           <label>音声ファイルを選択</label>
//           <input type="file" accept="audio/*" onChange={handlePickFile} />
//           {pickedUrl && (
//             <div className="player">
//               <audio controls src={pickedUrl} />
//               <div className="hint">↑ 選択または録音した音声を再生できます</div>
//             </div>
//           )}
//         </div>

//         <div className="keyword-input glossy-box">
//           <label>キーワード</label>
//           <input
//             type="text"
//             value={keyword}
//             onChange={(e) => setKeyword(e.target.value)}
//             placeholder="例）音声"
//           />
//         </div>

//         <button
//           className="glossy-btn send-btn"
//           disabled={!canSend}
//           onClick={send}
//         >
//           📤 送信
//         </button>
//       </div>

//       {/* ===== 結果表示 ===== */}
//       <div className="results-section">
//         <section>
//           <h3>全文</h3>
//           <p className="text-block">{punctuated || '—'}</p>
//         </section>

//         <section>
//           <h3>キーワード検出</h3>
//           <p
//             className="text-block"
//             dangerouslySetInnerHTML={{
//               __html: highlightedHtml || (punctuated || '—')
//             }}
//           />
//         </section>

//         <section>
//           <h3>キーワードの前後5文字</h3>
//           {keyword ? (
//             contexts.length ? (
//               <ul>{contexts.map((c, i) => <li key={i}>{c}</li>)}</ul>
//             ) : (
//               <p>該当なし</p>
//             )
//           ) : (
//             <p>（キーワード未入力）</p>
//           )}
//         </section>

//         <section>
//           <h3>話者別テキスト</h3>
//           {Object.entries(speakerText).length ? (
//             Object.entries(speakerText).map(([spk, text]) => (
//               <div key={spk}>
//                 <strong>Speaker {spk}:</strong> {text}
//               </div>
//             ))
//           ) : (
//             <p>認識結果なし</p>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }









import React, { useMemo, useState } from 'react';
import "./App.css";
import SpeechRecorder from './components/SpeechRecorder';

// utils/text は不要なのでコメントアウト
// import { addJapanesePunctuation, highlightAllOccurrences, extractContexts } from './utils/text';

export default function App() {
  // バックエンドAPIのベースURL

  const [apiBase] = useState(import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000');

  // 入力状態
  const [keyword, setKeyword] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [pickedUrl, setPickedUrl] = useState(null);

  // 出力状態
  const [punctuated, setPunctuated] = useState('');     // 整形済み全文
  const [highlightedHtml, setHighlightedHtml] = useState(''); // キーワードハイライト済みHTML
  const [contexts, setContexts] = useState([]);         // 前後5文字抽出（今は空配列）
  const [speakerText, setSpeakerText] = useState({});   // 話者別テキスト

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

  // 送信ボタンが有効かどうか
  const canSend = useMemo(() => !!audioFile, [audioFile]);

  // サーバーに音声送信＆文字起こし取得
  // const send = async () => {
  //   if (!audioFile) {
  //     alert('音声ファイルを選択するか録音してください');
  //     return;
  //   }

  //   const form = new FormData();
  //   form.append('audio', audioFile);
  //   form.append('keyword', keyword);

  //   try {
  //     const res = await fetch(`${apiBase}/api/speech/transcribe`, {
  //       method: 'POST',
  //       body: form
  //     });

  //     if (!res.ok) {
  //       alert('変換に失敗しました');
  //       return;
  //     }

  //     const data = await res.json();

  //     // ここからフロント側での最小処理
  //     // すでにサーバーで smartFormatting + speakerLabels を有効化している想定
  //     setPunctuated(data.formatted || data.transcript || '');
  //     setHighlightedHtml(data.formatted || data.transcript || '');
  //     setContexts([]); // 今回はキーワード前後抽出は使わない
  //     setSpeakerText(data.speakers || {});

  //   } catch (err) {
  //     console.error('送信中にエラー', err);
  //     alert('変換中にエラーが発生しました');
  //   }
  // };

    const send = async () => {
      if (!audioFile) {
        alert('音声ファイルを選択するか録音してください');
        return;
      }
      const form = new FormData();
      form.append('audio', audioFile);
      form.append('keyword', keyword);

      const res = await fetch(`http://localhost:3000/transcribe`, {
        method: 'POST',
        body: form
      });
      if (!res.ok) {
        alert('変換に失敗しました');
        return;
      }

      const data = await res.json();
      const original = data.transcript || '';
      const withPunc = addJapanesePunctuation(original);
      setPunctuated(withPunc);
      setHighlightedHtml(highlightAllOccurrences(withPunc, keyword));
      setContexts(extractContexts(withPunc, keyword, 5));
      setSpeakerText(data.speakers || {});
    };

  return (
    <div className="app-container">
      {/* ===== タイトル ===== */}
      <header className="app-title">🎙 音声認識</header>

      {/* ===== 録音 & ファイル選択 ===== */}
      <div className="file-picker glossy-box">
        <SpeechRecorder onFileReady={handleRecorded} />

        <div className="file-picker glossy-box">
          <label>音声ファイルを選択</label>
          <input type="file" accept="audio/*" onChange={handlePickFile} />
          {pickedUrl && (
            <div className="player">
              <audio controls src={pickedUrl} />
              <div className="hint">↑ 選択または録音した音声を再生できます</div>
            </div>
          )}
        </div>

        <div className="keyword-input glossy-box">
          <label>キーワード</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="例）音声"
          />
        </div>

        <button
          className="glossy-btn send-btn"
          disabled={!canSend}
          onClick={send}
        >
          📤 送信
        </button>
      </div>

      {/* ===== 結果表示 ===== */}
      <div className="results-section">
        <section>
          <h3>全文</h3>
          <p className="text-block">{punctuated || '—'}</p>
        </section>

        <section>
          <h3>キーワード検出</h3>
          <p
            className="text-block"
            dangerouslySetInnerHTML={{
              __html: highlightedHtml || (punctuated || '—')
            }}
          />
        </section>

        <section>
          <h3>キーワードの前後5文字</h3>
          <p>（キーワード前後抽出は無効化）</p>
        </section>

        <section>
          <h3>話者別テキスト</h3>
          {Object.entries(speakerText).length ? (
            Object.entries(speakerText).map(([spk, text]) => (
              <div key={spk}>
                <strong>Speaker {spk}:</strong> {text}
              </div>
            ))
          ) : (
            <p>認識結果なし</p>
          )}
        </section>
      </div>
    </div>
  );
}

