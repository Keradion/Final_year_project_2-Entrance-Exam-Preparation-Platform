/**
 * Study notes (→ Concept), per-topic YouTube URLs (`TOPIC_YOUTUBE_VIDEO_IDS`), and MCQ templates.
 * Curriculum chapters supply curated exercises[] with topicIndex; this module pads to 7 per topic.
 * Notes are plain text for TopicConcept.jsx (no markdown **).
 */

const CHAPTER_TAGS = ['sets', 'numbers', 'exponents', 'polynomials', 'linear', 'coordinate', 'geometry'];

function hashPair(a, b) {
  const s = `${a}:${b}`;
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

/** Strip accidental markdown / decorative asterisks so the topic UI stays plain text */
function sanitizePlain(s) {
  return String(s || '')
    .replace(/\*{1,2}/g, '')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

/** One concrete example per (chapter, topic) — stays on the mathematics of that lesson only */
const WORKED_EXAMPLES = {
  '0-0': 'Example: Roster form lists elements inside braces, e.g. the set of even digits from the list {0,…,9} can be written B = {0, 2, 4, 6, 8}. Set-builder form names a rule, e.g. C = {x ∈ ℤ | −3 < x < 3} = {−2, −1, 0, 1, 2}.',
  '0-1': 'Example: For A = {1, 2} and B = {1, 2, 3, 4}, every element of A appears in B, so A ⊆ B; because 3 ∈ B but 3 ∉ A, we also write A ⊂ B (proper subset).',
  '0-2': 'Example: With U = {1,…,6}, A = {1, 2, 4}, B = {2, 3, 4}, we get A ∩ B = {2, 4}, A ∪ B = {1, 2, 3, 4}, and A′ = {3, 5, 6} (elements of U not in A).',
  '0-3': 'Example: In one region (“A only”) lie elements in A but not B; in “both” lies A ∩ B; counting students in overlapping clubs matches adding region sizes instead of double-counting the overlap.',
  '0-4': 'Example: If 30 learners take Physics, 22 take Chemistry, and 11 take both, then |P ∪ C| = 30 + 22 − 11 = 41 take at least one of the two subjects.',
  '1-0': 'Example: −12 is an integer and rational (e.g. −12/1), but not a natural number if ℕ starts at 1; 0.4 = 2/5 is rational with a terminating decimal.',
  '1-1': 'Example: √2 is irrational (not a ratio of integers); √16 = 4 is rational. π is irrational; 22/7 is only a rational approximation.',
  '1-2': 'Example: −2.7 < −2.05 because on the number line more negative is farther left. The open interval (1, 5) is all real x with 1 < x < 5.',
  '1-3': 'Example: |−5| = 5 and |3 − 8| = 5. The equation |x| = 4 has solutions x = 4 and x = −4 on ℝ.',
  '1-4': 'Example: Rounding 4.876 to two decimals gives 4.88; to one decimal, 4.9. The number 0.04070 has three significant figures if the last 0 is intentional (4, 0, 7).',
  '2-0': 'Example: x^3 · x^4 = x^7; (y^2)^3 = y^6; (2a)^3 = 8a^3.',
  '2-1': 'Example: 5^(−2) = 1/25; (3x)^(−1) = 1/(3x) (x ≠ 0); a^0 = 1 for a ≠ 0.',
  '2-2': 'Example: √36 = 6 (principal root); √( (−5)^2 ) = √(25) = 5 = |−5|; ³√(27) = 3.',
  '2-3': 'Example: √50 = √(25·2) = 5√2; 1/√7 = √7/7 after rationalizing the denominator.',
  '2-4': 'Example: 6.2×10^3 is 6200; 9×10^(−2) is 0.09. (2×10^4)(3×10^2) = 6×10^6.',
  '3-0': 'Example: In 7x^3 − x + 2, the degree is 3 and the leading coefficient is 7; the constant term is 2.',
  '3-1': 'Example: (4x^2 − 3x + 1) + (x^2 + 5x) = 5x^2 + 2x + 1 after combining like terms.',
  '3-2': 'Example: (x + 2)(x − 3) = x^2 − x − 6 using distributive multiplication.',
  '3-3': 'Example: (2m + 1)^2 = 4m^2 + 4m + 1; (r − 3)(r + 3) = r^2 − 9.',
  '3-4': 'Example: (12x^4 − 6x^2) ÷ (3x^2) = 4x^2 − 2 for x ≠ 0 after dividing each term.',
  '4-0': 'Example: 4x + 5 = 17 gives 4x = 12 and x = 3; check by substitution.',
  '4-1': 'Example: x/3 + 1/2 = 1 clears to 2x + 3 = 6 after multiplying by 6, so x = 1.5.',
  '4-2': 'Example: From V = (1/3)πr^2h, multiply both sides by 3 and divide by πr^2 to isolate h.',
  '4-3': 'Example: −3x < 6 implies x > −2 (flip inequality when dividing by −3).',
  '4-4': 'Example: “A number increased by 9 is 40” → n + 9 = 40 → n = 31.',
  '5-0': 'Example: Point (−4, 5) has x negative, y positive — quadrant II.',
  '5-1': 'Example: Distance from (−1, 2) to (2, 6) is √((3)^2 + (4)^2) = 5.',
  '5-2': 'Example: Midpoint of (−2, 0) and (4, 6) is ((−2+4)/2, (0+6)/2) = (1, 3).',
  '5-3': 'Example: Slope through (1, 1) and (5, 9) is (9−1)/(5−1) = 2.',
  '5-4': 'Example: For y = −x + 4, slope is −1 and y-intercept is 4; x-intercept is (4, 0).',
  '6-0': 'Example: Two supplementary angles 110° and 70° share a common side on a straight line.',
  '6-1': 'Example: Angles 35° and 65° in a triangle leave 180 − 100 = 80° for the third angle.',
  '6-2': 'Example: If ΔABC ≅ ΔDEF with correspondence A↔D, then AB = DE and ∠A = ∠D.',
  '6-3': 'Example: In a parallelogram, opposite sides are parallel and equal; opposite angles are equal.',
  '6-4': 'Example: Triangle base 10 cm, height 6 cm → area = ½·10·6 = 30 cm².',
};

function formulasPlain(chapterIndex) {
  switch (chapterIndex) {
    case 0:
      return 'Finite sets: |A ∪ B| = |A| + |B| − |A ∩ B|. Complement (in U): A′ = {x ∈ U : x ∉ A}. De Morgan laws: (A ∪ B)′ = A′ ∩ B′ and (A ∩ B)′ = A′ ∪ B′.';
    case 1:
      return '|x| is distance from x to 0; |a − b| is distance between a and b. Identities: |xy| = |x||y|; triangle inequality |x + y| ≤ |x| + |y|.';
    case 2:
      return 'Exponent laws: a^m·a^n = a^(m+n), (a^m)^n = a^(mn), (ab)^n = a^n b^n; a^(−n) = 1/a^n (a≠0); a^0 = 1 (a≠0). Scientific notation N = m×10^k with 1 ≤ |m| < 10. For a, b ≥ 0: √(ab) = √a·√b.';
    case 3:
      return '(a+b)^2 = a^2 + 2ab + b^2; (a−b)^2 = a^2 − 2ab + b^2; (a+b)(a−b) = a^2 − b^2. Degree = highest power of the variable with non-zero coefficient.';
    case 4:
      return 'Linear equation ax+b=0 ⇒ x=−b/a (a≠0). Multiplying or dividing an inequality by a negative number reverses the sign. Models: d=rt, A=lw, C=2πr.';
    case 5:
      return 'Distance d = √((x2−x1)²+(y2−y1)². Midpoint M = ((x1+x2)/2,(y1+y2)/2). Slope m = (y2−y1)/(x2−x1). Line: y = mx + b (m slope, b y-intercept).';
    case 6:
      return 'Angles in a triangle sum to 180°. Areas: rectangle A=lw, triangle A=½bh, parallelogram A=bh, trapezoid A=½(b1+b2)h. Circle: A=πr², C=2πr.';
    default:
      return '';
  }
}

/** Stock MCQs: tagged by dominant chapter theme */
const MCQ_STOCK = [
  { tags: ['sets'], title: 'Membership', question: 'If A = {2, 4, 6}, which is true?', options: ['3 ∈ A', '4 ∈ A', '6 ∉ A', 'A has 2 elements'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['sets'], title: 'Roster', question: 'Set of odd digits less than 6:', options: ['{1,3,5}', '{0,1,3,5}', '{1,2,3}', '{2,4}'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['sets'], title: 'Cardinality', question: '|{a, b, c, d}| =', options: ['3', '4', '5', '16'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['sets'], title: 'Empty set', question: 'Which is true about ∅?', options: ['|∅| = 1', '∅ has no elements', '∅ = {0}', '0 ∈ ∅'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['sets'], title: 'Disjoint', question: 'If A ∩ B = ∅, then A and B are:', options: ['Equal', 'Disjoint', 'Subsets', 'Universal'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['sets'], title: 'Union quick', question: '{1,2} ∪ {2,3} =', options: ['{2}', '{1,2,3}', '{1,3}', '{1,2,2,3}'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['sets'], title: 'Intersection', question: '{p,q,r} ∩ {q,s} =', options: ['{q}', '{p,r,s}', '{p,q,r,s}', '∅'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['sets'], title: 'Subset symbol', question: 'If every element of A is in B, we write:', options: ['A ∩ B', 'A ⊆ B', 'A ∪ B', 'A′'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['numbers'], title: 'Rational check', question: 'Which is rational?', options: ['√7', '√25', 'π', '√3+√5'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['numbers'], title: 'Compare', question: 'Which is greatest?', options: ['−1', '−2', '0', '−1/2'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['numbers'], title: 'Absolute', question: '|−9| + |1| =', options: ['8', '10', '−10', '9'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['numbers'], title: 'Inverse mult', question: 'Multiplicative inverse of 4:', options: ['4', '−4', '1/4', '−1/4'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['numbers'], title: 'Number line', question: '−0.25 lies:', options: ['Right of 0', 'Left of 0', 'At 0', 'Cannot place'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['numbers'], title: 'Decimal to fraction', question: '0.125 as a fraction in lowest terms:', options: ['1/4', '1/8', '5/4', '2/5'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['exponents'], title: 'Power product', question: 'k^2 · k^5 (k≠0) =', options: ['k^7', 'k^10', 'k^3', '2k^7'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['exponents'], title: 'Quotient powers', question: 'x^8 / x^2 (x≠0) =', options: ['x^4', 'x^6', 'x^10', 'x^16'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['exponents'], title: 'Zero exp', question: '(−4)^0 =', options: ['0', '1', '−1', '−4'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['exponents'], title: 'Scientific small', question: '0.00009 =', options: ['9×10^4', '9×10^(−5)', '9×10^5', '0.9×10^3'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['exponents'], title: 'Root product', question: '√3 · √3 =', options: ['3', '9', '√9', '6'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['polynomials'], title: 'Degree', question: 'Degree of 9 − x^4 + 2x:', options: ['9', '4', '1', '2'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['polynomials'], title: 'Add poly', question: '(x + 3) + (2x − 1) =', options: ['3x + 2', '3x + 4', 'x + 2', '2x^2 + 2'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['polynomials'], title: 'Subtract', question: '(5t + 2) − (t − 3) =', options: ['4t − 1', '4t + 5', '6t + 5', '4t + 1'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['polynomials'], title: 'Multiply mono', question: '−2x(x − 4) =', options: ['−2x^2 + 8x', '−2x^2 − 8x', '2x^2 + 8x', '−2x − 4'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['polynomials'], title: 'Square binom', question: '(a − 1)^2 =', options: ['a^2 − 1', 'a^2 − 2a + 1', 'a^2 + 1', 'a^2 + 2a + 1'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['linear'], title: 'Solve 1-step', question: 'x + 7 = 12 ⇒ x =', options: ['5', '19', '−5', '7'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['linear'], title: 'Solve multi', question: '3x − 6 = 9 ⇒ x =', options: ['3', '5', '1', '15'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['linear'], title: 'Inequality', question: '2x < 8 ⇒', options: ['x < 4', 'x > 4', 'x = 4', 'x > 8'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['linear'], title: 'Flip sign', question: '−2x ≥ 6 ⇒', options: ['x ≥ −3', 'x ≤ −3', 'x ≥ 3', 'x > 3'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['linear'], title: 'Literal', question: 'P = 2l + 2w ⇒ w =', options: ['(P − 2l)/2', 'P − l', 'P/2 − l', 'Both A and C are common forms'], correctAnswer: 3, difficulty: 'Medium' },
  { tags: ['coordinate'], title: 'Quadrant', question: '(−1, −2) is in quadrant:', options: ['I', 'II', 'III', 'IV'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['coordinate'], title: 'Distance', question: 'Distance (0,0) to (0, 6):', options: ['6', '36', '√6', '12'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['coordinate'], title: 'Midpoint', question: 'Midpoint of (2, 2) and (6, 8):', options: ['(4, 5)', '(8, 10)', '(4, 6)', '(3, 4)'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['coordinate'], title: 'Slope', question: 'Slope through (0,0) and (2, 6):', options: ['2', '3', '1/3', '6'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['coordinate'], title: 'Intercept', question: 'y-intercept of y = 3x − 5:', options: ['5', '−5', '3', '−3'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['geometry'], title: 'Triangle sum', question: 'Two angles 40° and 70°; third =', options: ['60°', '70°', '80°', '110°'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['geometry'], title: 'Right angle', question: 'A right angle measures:', options: ['45°', '90°', '180°', '360°'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['geometry'], title: 'Rectangle area', question: '3 m by 7 m rectangle area:', options: ['20 m²', '21 m²', '10 m²', '49 m²'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['geometry'], title: 'Circle intro', question: 'Radius 5 (use π); area =', options: ['10π', '25π', '5π', '50π'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['geometry'], title: 'Parallel angles', question: 'Corresponding angles with parallel lines are:', options: ['Supplementary', 'Congruent', 'Complementary', 'Unrelated'], correctAnswer: 1, difficulty: 'Easy' },
];

function stripStockForExercise(entry) {
  const { tags: _t, ...rest } = entry;
  return { ...rest };
}

/**
 * Merge curated exercises for one topic with stock MCQs until there are exactly targetCount (default 7).
 */
function exercisesForTopic(chapterIndex, topicIndex, topicName, curatedForTopic, targetCount = 7) {
  const tag = CHAPTER_TAGS[chapterIndex] || 'numbers';
  const pool = MCQ_STOCK.filter((m) => m.tags.includes(tag));
  const allPool = pool.length ? pool : MCQ_STOCK;

  const out = (curatedForTopic || []).map((e) => ({ ...e }));
  const usedQuestions = new Set(out.map((e) => e.question));

  let h = hashPair(chapterIndex, topicIndex);
  let guard = 0;
  while (out.length < targetCount && guard < 500) {
    guard += 1;
    const m = allPool[h % allPool.length];
    h += 1;
    const stripped = stripStockForExercise(m);
    if (usedQuestions.has(stripped.question)) continue;
    usedQuestions.add(stripped.question);
    stripped.title = `${topicName.split(',')[0].slice(0, 28)} — ${stripped.title}`;
    out.push(stripped);
  }

  while (out.length < targetCount) {
    const n = out.length + 1;
    out.push({
      title: `Skill ${n}`,
      question: `In this lesson (“${topicName.slice(0, 48)}”), which option states a valid next step after writing the given information in symbols?`,
      options: [
        'Apply the definition or formula that matches the givens',
        'Ignore definitions and guess',
        'Change the problem to a different unit without reason',
        'Drop one of the givens to simplify',
      ],
      correctAnswer: 0,
      difficulty: 'Easy',
    });
  }

  return out.slice(0, targetCount);
}

/**
 * Plain-text notes: three blocks (topic content, unit formulas, worked example). Topic-only — no study coaching.
 */
function buildTopicStudyNotes({
  topicLabel,
  topicName,
  topicDescription,
  chapterName,
  chapterIndex,
  topicIndex,
  topicObjectives,
}) {
  const name = sanitizePlain(topicName);
  const desc = sanitizePlain(topicDescription);
  const objectivesLines = Array.isArray(topicObjectives)
    ? topicObjectives.map((o, i) => `${i + 1}. ${sanitizePlain(o)}`).filter((line) => line.length > 3)
    : [];

  const key = `${chapterIndex}-${topicIndex}`;
  const worked =
    WORKED_EXAMPLES[key] ||
    `Example: Choose one small case that fits "${name.slice(0, 60)}" (few numbers or a short list), write each step using only the definitions and rules above, and finish with a one-line conclusion.`;

  const pTopic = [
    `${topicLabel}. ${name}`,
    desc,
    chapterName ? `Unit: ${sanitizePlain(chapterName)}.` : '',
    objectivesLines.length ? `Syllabus statements for this topic:\n${objectivesLines.join('\n')}` : '',
  ]
    .map(sanitizePlain)
    .filter(Boolean)
    .join('\n\n');

  const formulasBlock = sanitizePlain(formulasPlain(chapterIndex));
  const pFormulas = formulasBlock
    ? ['Key rules and formulas for this unit (Grade 9).', formulasBlock].join('\n\n')
    : '';

  const pWorked = ['Worked example (this topic only).', sanitizePlain(worked)].join('\n\n');

  return {
    title: `Topic notes — ${topicLabel}`,
    content: [pTopic, pFormulas, pWorked].filter(Boolean).join('\n\n'),
  };
}

/**
 * One `watch?v=` URL per curriculum topic (`chapterIndex` & `topicIndex` match seed order).
 * IDs are hand-picked free lessons (mostly Khan Academy) verified via YouTube oEmbed — no Data API.
 */
const TOPIC_YOUTUBE_VIDEO_IDS = {
  // Unit 1: Sets
  '0-0': 'K_f3c6Q0AhQ',
  '0-1': 'aKZTYRxQChE',
  '0-2': 'En8fI2ixepo',
  '0-3': 'QE2uR6Z-NcU',
  '0-4': 'En8fI2ixepo',
  // Unit 2: Real numbers
  '1-0': '-QHff5pRdM8',
  '1-1': '8XtgKmU4PWo',
  '1-2': 'N4nrdf0yYfM',
  '1-3': 'frBJEYvyd-8',
  '1-4': 'eCJ76hz7jPM',
  // Unit 3: Exponents & radicals
  '2-0': 'CZ5ne_mX5_I',
  '2-1': 'JnpqlXN9Whw',
  '2-2': 'mbc3_e5lWw0',
  '2-3': 'cw3mp8oNASk',
  '2-4': 'trdbaV4TaAo',
  // Unit 4: Polynomials
  '3-0': 'vN0aL-_vIKM',
  '3-1': 'ZGl2ExHwdak',
  '3-2': 'Xy8NKUoyy98',
  '3-3': 'bFtjG45-Udk',
  '3-4': 'TuMV-Zb6A9s',
  // Unit 5: Linear equations & inequalities
  '4-0': '9Ek61w1LxSc',
  '4-1': 'DqeMQHomwAU',
  '4-2': 'fnuIT7EhAvs',
  '4-3': 'FZ2APP6-grU',
  '4-4': 'bAerID24QJ0',
  // Unit 6: Coordinate geometry
  '5-0': 's7NKLWXkEEE',
  '5-1': 'nyZuite17Pc',
  '5-2': 'pzDfd8NXRXk',
  '5-3': 'R948Tsyq4vA',
  '5-4': 'IL3UCuXrUzE',
  // Unit 7: Plane geometry
  '6-0': 'gRKZaojKeP0',
  '6-1': 'hmj3_zbz2eg',
  '6-2': 'CJrVOf_3dN0',
  '6-3': 'dVFp9psjn8c',
  '6-4': '7N5orPxUoGo',
};

const FALLBACK_MATH_VIDEO_IDS = [
  'K_f3c6Q0AhQ',
  'N4nrdf0yYfM',
  '9Ek61w1LxSc',
  'nyZuite17Pc',
  'M7lc1UVf-VE',
];

/**
 * Resolved watch URL for this topic row in the curriculum (stable; not random).
 */
function pickRandomTopicVideo({ chapterIndex, topicIndex, topicName, gradeLevel }) {
  const key = `${chapterIndex}-${topicIndex}`;
  let id = TOPIC_YOUTUBE_VIDEO_IDS[key];
  if (!id) {
    id = FALLBACK_MATH_VIDEO_IDS[Math.floor(Math.random() * FALLBACK_MATH_VIDEO_IDS.length)];
  }
  return {
    videoUrl: `https://www.youtube.com/watch?v=${id}`,
    title: `${topicName} (Grade ${gradeLevel})`,
  };
}

module.exports = {
  CHAPTER_TAGS,
  exercisesForTopic,
  buildTopicStudyNotes,
  pickRandomTopicVideo,
};
