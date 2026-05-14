/**
 * UI-only cleanup for topic titles and bodies when legacy rows contain
 * stray id-like tokens (never mutate API data here).
 */

function stripInlineIdTokens(line) {
  return String(line)
    .replace(/\*{1,2}/g, '')
    .replace(/\b[0-9a-f]{24}\b/gi, '')
    .replace(/\b(?![0-9]{6}\b)[0-9a-f]{6}\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Single-line labels (topic names, nav, breadcrumbs) */
export function formatTopicTitleDisplay(s) {
  if (s == null || s === '') return '';
  const merged = String(s)
    .split(/\r\n|\n|\r/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .filter((l) => !/^[0-9a-f]{6}$/i.test(l) && !/^[0-9a-f]{24}$/i.test(l))
    .join(' ')
    .trim();
  return stripInlineIdTokens(merged);
}

/** Objectives, descriptions, concept notes — preserve paragraph breaks */
export function formatTopicBodyText(s) {
  if (s == null || s === '') return '';
  const lines = String(s).split(/\r\n|\n|\r/);
  const kept = [];
  for (const line of lines) {
    const t = line.trim();
    if (!t) {
      kept.push('');
      continue;
    }
    if (/^[0-9a-f]{6}$/i.test(t) || /^[0-9a-f]{24}$/i.test(t)) continue;
    const cleaned = stripInlineIdTokens(t);
    if (cleaned) kept.push(cleaned);
  }
  return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
