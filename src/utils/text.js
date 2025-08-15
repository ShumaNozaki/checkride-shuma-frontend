export function addJapanesePunctuation(text) {
  if (!text) return '';

  let t = text.replace(/\s+/g, ''); // 空白を削除

  // 文末に句点をつけたい語尾
  const endings = [
    'です','ます','でした','ました','ません',
    'でしょう','でしょうか','ですね','ですよ',
    'だろう','だった','である', 'だろうか','ですか', 'ではありません'
  ];

  // 文末句点付与
  endings.forEach(end => {
    const re = new RegExp(`(${end})(?![。！？])`, 'g');
    t = t.replace(re, '$1。');
  });

  // 「か」「ね」「よ」の後に句点
  t = t.replace(/(か|ね|よ)(?![。！？])/g, '$1。');

  // 文末に句点がなければ補完
  if (!/[。！？]$/.test(t)) t += '。';

  // 長すぎる文にだけ読点を挿入（15文字以上で区切る）
  t = t.split('。').map(sentence => {
    if (!sentence) return '';
    if (sentence.length < 15) return sentence;
    // 「、」を入れても自然な場所は「、」「や」「そして」「または」などの接続前
    return sentence.replace(/(そして|または|例えば)/g, '、$1');
  }).join('。');

  // 「はい」「ええ」の前に読点
  t = t.replace(/。(?=(はい|ええ))/g, '。$1、');

  return t;
}







export function highlightAllOccurrences(text, keyword) {
  if (!text || !keyword) return text;

  const escapeHtml = s =>
    s.replace(/&/g, '&amp;')
     .replace(/</g, '&lt;')
     .replace(/>/g, '&gt;');

  // 正規化関数（全角半角/カタカナひらがな変換）
  const normalize = s => s
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)) // 全角英数→半角
    .replace(/[ァ-ン]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60)) // カタカナ→ひらがな
    .toLowerCase();

  const normText = normalize(text);
  const normKey = normalize(keyword);

  let result = '';
  let i = 0;
  while (i < text.length) {
    const segmentNorm = normalize(text.slice(i, i + normKey.length));
    if (segmentNorm === normKey) {
      result += `<mark>${escapeHtml(text.slice(i, i + keyword.length))}</mark>`;
      i += keyword.length;
    } else {
      result += escapeHtml(text[i]);
      i++;
    }
  }
  return result;
}


export function extractContexts(text, keyword, pad = 5) {
  if (!text || !keyword) return [];

  const normalize = s => s
    .replace(/[Ａ-Ｚａ-ｚ０-９]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0))
    .replace(/[ァ-ン]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60))
    .toLowerCase();

  const normText = normalize(text);
  const normKey = normalize(keyword);

  const contexts = new Set();
  let index = normText.indexOf(normKey);
  while (index !== -1) {
    const start = Math.max(0, index - pad);
    const end   = Math.min(text.length, index + keyword.length + pad);
    contexts.add(text.substring(start, end));
    index = normText.indexOf(normKey, index + 1);
  }

  return Array.from(contexts);
}

