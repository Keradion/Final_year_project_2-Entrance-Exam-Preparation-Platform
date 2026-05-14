/**
 * Remove lines that are only hex (accidental id fragments). `joiner` merges kept lines.
 */
function stripStandaloneHexLines(s, joiner = ' ') {
  if (s == null || typeof s !== 'string') return s;
  const lines = s.split(/\r\n|\n|\r/);
  const kept = lines
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .filter((l) => !/^[0-9a-f]{6}$/i.test(l) && !/^[0-9a-f]{24}$/i.test(l));
  let out = kept.join(joiner).trim();
  if (joiner === '\n') out = out.replace(/\n{3,}/g, '\n\n');
  else out = out.replace(/\s{2,}/g, ' ');
  return out;
}

/** Topic titles: one display line */
function stripEmbeddedHexIdLines(s) {
  return stripStandaloneHexLines(s, ' ');
}

/** Descriptions / notes: keep paragraph breaks */
function stripEmbeddedHexIdLinesMultiline(s) {
  return stripStandaloneHexLines(s, '\n');
}

module.exports = {
  stripEmbeddedHexIdLines,
  stripEmbeddedHexIdLinesMultiline,
  stripStandaloneHexLines,
};
