/** Keep in sync with backend/src/utils/examQuestionStem.js */

function stripEcInline(s) {
  let t = String(s ?? '').trim();
  for (let i = 0; i < 8; i += 1) {
    const n = t
      .replace(/^\[E\.C\.\s*\d{4}\]\s*/i, '')
      .replace(/^\[E\.C\.\d{4}\]\s*/i, '')
      .replace(/^\(E\.C\.\s*\d{4}\)\s*/i, '')
      .replace(/^E\.C\.\s*\d{4}\s*[.:—–-]\s*/i, '')
      .replace(/^E\.C\.\s*\d{4}\s+/i, '')
      .trim();
    if (n === t) break;
    t = n;
  }
  return t;
}

function stripGlobalEcBrackets(s) {
  return String(s ?? '')
    .replace(/\s*\[E\.C\.\s*\d{4}\]\s*/gi, ' ')
    .replace(/\s*\[E\.C\.\d{4}\]\s*/gi, ' ')
    .replace(/\s*\(E\.C\.\s*\d{4}\)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function stripLeadingEthiopiaNationalBlock(s) {
  let t = String(s ?? '').trim();
  for (let i = 0; i < 8; i += 1) {
    const n = t
      .replace(/^ethiopia\s+national\s+exit\s+examination[\s\S]*?E\.C\.\s*\d{4}\s*/i, '')
      .replace(/^national\s+exit\s+examination[\s\S]*?E\.C\.\s*\d{4}\s*/i, '')
      .trim();
    if (n === t) break;
    t = n;
  }
  return t;
}

function stripLeadingBareYear(s) {
  return String(s ?? '').replace(/^\d{4}(?:\s+|$)/, '').trim();
}

function isLegacyNoiseLine(line) {
  const t = line.trim();
  if (!t) return true;
  if (/^\d{4}$/.test(t)) return true;
  if (/ethiopia\s+national\s+exit\s+examination/i.test(t)) return true;
  if (/national\s+exit\s+examination/i.test(t) && /mathematics/i.test(t)) return true;
  if (/^mathematics\s*\([^)]*grade\s*9/i.test(t)) return true;
  if (/^—\s*E\.C\.\s*\d{4}\s*$/i.test(t)) return true;
  if (/^E\.C\.\s*\d{4}\s*$/i.test(t)) return true;
  return false;
}

export function normalizeExamQuestionStem(raw) {
  if (raw == null || raw === '') return '';
  let text = String(raw).replace(/\r\n/g, '\n').trim();
  text = stripLeadingEthiopiaNationalBlock(text);
  text = stripGlobalEcBrackets(text);
  text = stripLeadingBareYear(text);
  text = stripGlobalEcBrackets(text);

  const lines = text.split('\n');
  const kept = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (isLegacyNoiseLine(line)) continue;
    const cleaned = stripEcInline(line);
    if (cleaned) kept.push(cleaned);
  }
  let s = kept.join(' ').replace(/\s+/g, ' ').trim();
  for (let k = 0; k < 4; k += 1) {
    const n = s
      .replace(
        /^ethiopia\s+national\s+exit\s+examination[^.?]*?E\.C\.\s*\d{4}\s*[—–-]?\s*/i,
        ''
      )
      .replace(/^ethiopia\s+national\s+exit\s+examination[^.?]*?[.?]\s*/i, '')
      .trim();
    if (n === s) break;
    s = n;
  }
  s = stripGlobalEcBrackets(s);
  return stripEcInline(s);
}
