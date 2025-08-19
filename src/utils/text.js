// ----------------------------
// HTMLエスケープ
// ----------------------------
const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;");

// ----------------------------
// 正規化（空白除去・全角→半角・カタカナ→ひらがな・小文字化）
// ----------------------------
const normalize = (s) =>
  s.replace(/\s+/g, "")
   .replace(/[Ａ-Ｚａ-ｚ０-９]/g, (ch) =>
     String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
   )
   .replace(/[ァ-ン]/g, (ch) =>
     String.fromCharCode(ch.charCodeAt(0) - 0x60)
   )
   .toLowerCase();

// ----------------------------
// 複数キーワードを正しくハイライト
// ----------------------------
export function highlightMultipleKeywords(text, keywords = []) {
  if (!text || !keywords.length) return text;

  let result = "";
  let i = 0;

  while (i < text.length) {
    let matched = false;

    for (const kw of keywords) {
      if (!kw) continue;

      const rawKw = kw;
      const normKw = normalize(rawKw);

      // 今の位置から残りテキスト
      const rest = text.slice(i);
      const normRest = normalize(rest);

      if (normRest.startsWith(normKw)) {
        // キーワードに対応する部分を復元
        let buffer = "";
        let j = 0;
        while (
          j < rest.length &&
          normalize(buffer) !== normKw &&
          normalize(buffer).length <= normKw.length
        ) {
          buffer += rest[j];
          j++;
        }

        result += `<mark>${escapeHtml(buffer)}</mark>`;
        i += buffer.length;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result += escapeHtml(text[i]);
      i++;
    }
  }

  return result;
}

// ----------------------------
// 複数キーワードの前後N文字抽出（空白無視でカウント）＋ 何文字目 / 何単語目
// ----------------------------
export function extractContextsIgnoreSpaces(text, keywords = [], pad = 5) {
  if (!text || !keywords.length) return [];

  const normText = normalize(text);
  const contexts = [];

  // 単語リスト（空白区切り）
  const words = text.split(/\s+/).filter(Boolean);

  // 各文字が何文字目・何単語目に対応するかマッピング
  let charPos = 0;   // 空白を除いた文字数カウント
  let wordPos = 0;   // 単語インデックス
  const charToPos = []; // textの各インデックス → {charIndex, wordIndex}

  for (let i = 0; i < text.length; i++) {
    if (text[i] !== " ") {
      charPos++;
    }
    if (i === 0 || (text[i - 1] === " " && text[i] !== " ")) {
      wordPos++;
    }
    charToPos[i] = { charIndex: charPos, wordIndex: wordPos };
  }

  keywords.forEach((kw) => {
    if (!kw) return;
    const normKw = normalize(kw);
    let searchIdx = 0;

    while (searchIdx < normText.length) {
      const matchPos = normText.indexOf(normKw, searchIdx);
      if (matchPos === -1) break;

      const matchEnd = matchPos + normKw.length;

      // --- 元テキスト上でキーワード位置を探す ---
      let charCount = 0;
      let startIdx = -1;
      let endIdx = -1;
      for (let i = 0; i < text.length; i++) {
        if (text[i] !== " ") {
          if (charCount === matchPos) startIdx = i;
          charCount++;
        }
        if (charCount === matchEnd) {
          endIdx = i + 1;
          break;
        }
      }
      if (startIdx === -1 || endIdx === -1) {
        searchIdx = matchPos + normKw.length;
        continue;
      }

      // --- 何文字目 / 何単語目か ---
      const position = charToPos[startIdx].charIndex;
      const wordPosition = charToPos[startIdx].wordIndex;

      // --- 前後pad文字（空白無視でカウント） ---
      const snippetStartPos = Math.max(1, position - pad);
      const snippetEndPos = position + (matchEnd - matchPos) + pad - 1; 
      // ↑ キーワード長も考慮しつつ、ちょうど pad+kw+pad になるように調整

      let snippet = "";
      for (let i = 0; i < text.length; i++) {
        const pos = charToPos[i]?.charIndex;
        if (pos >= snippetStartPos && pos <= snippetEndPos) {
          snippet += text[i];
        }
      }

      contexts.push({
        keyword: kw,
        position,       // 何文字目
        wordPosition,   // 何単語目
        snippet: snippet.trim(),
      });

      searchIdx = matchEnd;
    }
  });

  return contexts;
}
