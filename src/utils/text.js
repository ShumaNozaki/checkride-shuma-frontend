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
export function highlight(text, keywords = []) {
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