/**
 * Clean legacy exam question stems (multi-line headers, E.C. prefixes, old paper titles in text).
 * DB values may still contain historical formatting; API responses apply this for clients.
 */

const DISPLAY_EXAM_TITLE = 'University entrance exam';

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

/** [E.C. 2018] or (E.C. 2018) anywhere in the string — common in legacy single-line dumps */
function stripGlobalEcBrackets(s) {
  return String(s ?? '')
    .replace(/\s*\[E\.C\.\s*\d{4}\]\s*/gi, ' ')
    .replace(/\s*\[E\.C\.\d{4}\]\s*/gi, ' ')
    .replace(/\s*\(E\.C\.\s*\d{4}\)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Full legacy header + question in one line; must run before line-based noise removal */
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

function normalizeExamQuestionStem(raw) {
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

function sanitizeExamPaperDoc(doc) {
  if (!doc || typeof doc !== 'object') return doc;
  return {
    ...doc,
    title: DISPLAY_EXAM_TITLE,
  };
}

function displayExamPaperTitle() {
  return DISPLAY_EXAM_TITLE;
}

module.exports = {
  normalizeExamQuestionStem,
  sanitizeExamPaperDoc,
  displayExamPaperTitle,
};
