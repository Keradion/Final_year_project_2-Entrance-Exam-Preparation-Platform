/**
 * Grade 12 Mathematics — study notes, curated YouTube links, and MCQ stock pool.
 * Curriculum keys `chapterIndex-topicIndex` align with grade12MathematicsCurriculum.js (7×5).
 *
 * `TOPIC_YOUTUBE_VIDEO_IDS` lists one hand-picked free lesson per topic (Khan Academy or
 * The Organic Chemistry Tutor). Each id was checked with `youtube.com/oembed` (no Data API).
 */

const CHAPTER_TAGS = ['seq_series', 'limits', 'deriv', 'appderiv', 'integral', 'space3d', 'proof'];

function hashPair(a, b) {
  const s = `${a}:${b}`;
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function sanitizePlain(s) {
  return String(s || '')
    .replace(/\*{1,2}/g, '')
    .replace(/[ \t]+$/gm, '')
    .trim();
}

const WORKED_EXAMPLES = {
  '0-0': 'Example: AP with a₁ = 5, d = 3 → a₄ = 5 + 3·3 = 14.',
  '0-1': 'Example: Sum 1…100 = 100·101/2 = 5050 (Gauss pairing).',
  '0-2': 'Example: GP 2, 6, 18 has r = 3, so a₅ = 2·3⁴ = 162.',
  '0-3': 'Example: ∑_{k=0}^∞ (1/2)^k = 1/(1−1/2) = 2.',
  '0-4': 'Example: ∑_{i=1}^{4} i² = 1 + 4 + 9 + 16 = 30.',
  '1-0': 'Example: Terms 1/n shrink toward 0 as n grows.',
  '1-1': 'Example: lim_{x→2} (x²−4)/(x−2) = lim_{x→2} (x+2) = 4.',
  '1-2': 'Example: Polynomials are continuous everywhere on ℝ.',
  '1-3': 'Example: Reduce (x²−1)/(x−1) to x+1 for x≠1; hole at x=1.',
  '1-4': 'Example: Floor function jumps at integers — compare left vs right limits.',
  '2-0': 'Example: Average rate of f(x)=x² on [1,3] is (9−1)/(3−1)=4.',
  '2-1': 'Example: If f(x)=mx+b then f′(x)=m everywhere.',
  '2-2': 'Example: d/dx (x⁴) = 4x³.',
  '2-3': 'Example: (x·e^x)′ = e^x + x e^x by product rule.',
  '2-4': 'Example: d/dx sin(3x) = 3 cos(3x) (chain).',
  '3-0': 'Example: f(x)=x³−3x has f′=3(x−1)(x+1); sign chart shows max/min pattern.',
  '3-1': 'Example: f(x)=x² has local (global) min at x=0.',
  '3-2': 'Example: Fix perimeter rectangle → area max when square (in symmetric setup).',
  '3-3': 'Example: If f″>0, graph bends up (concave up).',
  '3-4': 'Example: Expand circle A=πr² ⇒ dA/dt = 2πr dr/dt.',
  '4-0': 'Example: ∫ 3x² dx = x³ + C; check by derivative.',
  '4-1': 'Example: ∫₀¹ x dx = 1/2 (triangle area).',
  '4-2': 'Example: ∫₀² 2x dx = [x²]₀² = 4 (FTC).',
  '4-3': 'Example: ∫ 2x e^{x²} dx with u=x² ⇒ e^u + C.',
  '4-4': 'Example: Area between y=x and y=x² on [0,1] = ∫₀¹ (x−x²) dx = 1/6.',
  '5-0': 'Example: ‖⟨1,2,2⟩‖ = √(1+4+4)=3.',
  '5-1': 'Example: ⟨1,0,1⟩ + ⟨2,3,−1⟩ = ⟨3,3,0⟩.',
  '5-2': 'Example: ⟨1,1,1⟩·⟨1,−1,0⟩ = 0 ⇒ perpendicular.',
  '5-3': 'Example: i×j = k with right-hand rule.',
  '5-4': 'Example: Line r(t) = (1,0,0) + t⟨0,1,0⟩ stays in plane z=0.',
  '6-0': 'Example: Negation of “∀x, x²≥0” needs a counterexample only if false—but here statement true; negation is “∃x with x²<0” (impossible in ℝ).',
  '6-1': 'Example: Sum of even integers 2a+2b = 2(a+b) (even).',
  '6-2': 'Example: Classic contradiction: assume √2 rational, derive a/b lowest terms contradiction.',
  '6-3': 'Example: ∑_{i=1}^n i = n(n+1)/2: base n=1 OK; inductive step adds (k+1).',
  '6-4': 'Example: Show 3 | (4^n−1) by factoring 4^{k+1}−1 = 4(4^k−1)+3 after IH.',
};

function formulasPlain(chapterIndex) {
  switch (chapterIndex) {
    case 0:
      return 'AP: aₙ = a₁ + (n−1)d; Sₙ = n/2(a₁+aₙ). GP: aₙ = a₁ r^{n−1}; Sₙ = a₁(1−r^n)/(1−r); |r|<1 ⇒ S∞ = a₁/(1−r). Σ sum linearity.';
    case 1:
      return 'Limit idea: approach notation; continuity: lim f = f(a). Rational limits: factor/cancel. One-sided limits from graphs/piecewise.';
    case 2:
      return "f′(a)=lim (f(a+h)−f(a))/h; power rule; (uv)′=u′v+uv′; (u/v)′=(u′v−uv′)/v²; chain: dy/dx = dy/du · du/dx.";
    case 3:
      return "Critical: f′=0 or undefined (domain); first derivative test; optimization lists critical+endpoints; f″ for concavity; related rates: differentiate constraints wrt t.";
    case 4:
      return 'Antiderivative + C; definite integral as limit/area; FTC: d/dx ∫_a^x f = f(x) and ∫_a^b F′ = F(b)−F(a); substitution; area between curves ∫(top−bottom).';
    case 5:
      return 'ℝ³ distance √((Δx)²+(Δy)²+(Δz)²); dot u·v = ‖u‖‖v‖cosθ; cross × perpendicular; line r=r₀+tv; plane n·(r−r₀)=0.';
    case 6:
      return 'Logic: De Morgan; contrapositive. Induction: base + P(k)⇒P(k+1). Contradiction: assume ¬claim, derive nonsense.';
    default:
      return '';
  }
}

const MCQ_STOCK = [
  { tags: ['seq_series'], title: 'AP step', question: 'In an AP, consecutive terms differ by', options: ['a constant d', 'a ratio r', 'a square', 'random'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['seq_series'], title: 'GP ratio', question: 'In a GP (nonzero terms), a_{n+1}/a_n is', options: ['constant r', 'always 0', 'n', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['seq_series'], title: 'Σ index', question: '∑_{k=1}^{n} 1 equals', options: ['n', '1', 'n²', '0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['limits'], title: 'Continuity', question: 'Polynomials on ℝ are', options: ['continuous', 'never continuous', 'only at 0', 'only rational x'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['limits'], title: 'Hole', question: 'Canceling (x−a) may remove a', options: ['removable discontinuity', 'vertical asymptote always', 'jump always', 'period'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['deriv'], title: 'Power', question: 'd/dx x⁶ =', options: ['6x⁵', 'x⁵', '6x⁶', '0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['deriv'], title: 'Constant', question: 'Derivative of −4 is', options: ['0', '−4', 'x', '1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['appderiv'], title: 'f′>0', question: 'If f′>0 on I, f is', options: ['increasing (typical)', 'decreasing', 'constant', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'FTC', question: '∫_a^b g′ equals', options: ['g(b)−g(a)', 'g(a)−g(b)', 'g′(b)', '0 always'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Area', question: 'If f≥g on [p,q], area between is ∫', options: ['(f−g) dx', '(g−f) dx always', 'f+g', '1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['space3d'], title: 'Dot zero', question: 'Nonzero u,v with u·v=0 are', options: ['perpendicular', 'parallel', 'identical', 'always 3D only'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['space3d'], title: 'Cross', question: 'u×v is orthogonal to', options: ['both u and v (when nonzero)', 'only u', 'only v', 'neither'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['proof'], title: 'Induction base', question: 'Induction starts by proving', options: ['a base case', 'the inductive step first', 'all cases at once', 'a contradiction'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['proof'], title: 'Negation ∃', question: 'Negation of ∃x P(x) is', options: ['∀x ¬P(x)', '∀x P(x)', '∃x ¬P(x)', 'P(x)'], correctAnswer: 0, difficulty: 'Medium' },
];

function stripStockForExercise(entry) {
  const { tags: _t, ...rest } = entry;
  return { ...rest };
}

function exercisesForTopic(chapterIndex, topicIndex, topicName, curatedForTopic, targetCount = 7) {
  const tag = CHAPTER_TAGS[chapterIndex] || 'seq_series';
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
      question: `In “${topicName.slice(0, 48)}”, which option describes a valid next symbolic step from the givens?`,
      options: [
        'Apply the definition or theorem that matches the setup',
        'Drop hypotheses silently',
        'Change variables without adjusting differentials',
        'Assume conclusions before they are proved',
      ],
      correctAnswer: 0,
      difficulty: 'Easy',
    });
  }

  return out.slice(0, targetCount);
}

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
    `Example: For “${name.slice(0, 60)}”, pick one numeric or small symbolic case, show each step from definitions, then state the conclusion in one line.`;

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
    ? ['Key rules and formulas for this unit (Grade 12).', formulasBlock].join('\n\n')
    : '';
  const pWorked = ['Worked example (this topic only).', sanitizePlain(worked)].join('\n\n');

  return {
    title: `Topic notes — ${topicLabel}`,
    content: [pTopic, pFormulas, pWorked].filter(Boolean).join('\n\n'),
  };
}

/**
 * One `watch?v=` URL per curriculum topic (`chapterIndex` & `topicIndex` match seed order).
 * IDs are hand-picked free lessons (Khan Academy and The Organic Chemistry Tutor) checked with
 * YouTube oEmbed — no Data API.
 */
const TOPIC_YOUTUBE_VIDEO_IDS = {
  // Unit 1: Sequences and series
  '0-0': '_cooC3yG_p0',
  '0-1': 'RM644gFKo_g',
  '0-2': 'a37pYSmcU7c',
  '0-3': 'Sify7Bp7BmI',
  '0-4': '5jwXThH6fg4',
  // Unit 2: Limits and continuity
  '1-0': 'muqyereWEh4',
  '1-1': 'YNstP0ESndU',
  '1-2': 'WT7oxiiFYt8',
  '1-3': 'M2BgBG2Su94',
  '1-4': 'JrYmEo6hoiU',
  // Unit 3: Derivatives
  '2-0': '0z_MDIWMBwU',
  '2-1': '5yfh5cf4-0w',
  '2-2': 'IvLpN1G1Ncg',
  '2-3': 'WqzY3xibFL8',
  '2-4': 'HaHsqDjWMLU',
  // Unit 4: Applications of differential calculus
  '3-0': 'lFQ4kMcODzU',
  '3-1': 'WCq3sRzsJfs',
  '3-2': 'lx8RcYcYVuU',
  '3-3': '15awMHeP1Yc',
  '3-4': 'Xe6YlrCgkIo',
  // Unit 5: Integral calculus
  '4-0': 'MMv-027KEqU',
  '4-1': 'CXCtqBlEZ7g',
  '4-2': 'C7ducZoLKgw',
  '4-3': 'b76wePnIBdU',
  '4-4': 'aaCRnT8o-Ng',
  // Unit 6: Solid geometry and vectors in space
  '5-0': '0c6cP2zLC2c',
  '5-1': '2_21erD-nBg',
  '5-2': 'VzX8KJKFhlM',
  '5-3': 'YbZmAqGUkqc',
  '5-4': 'MkjazYnvNP8',
  // Unit 7: Proof and mathematical induction
  '6-0': 'KRFiAlo7t1E',
  '6-1': 'P7G7F3NzPw0',
  '6-2': 'joewRl1CTL8',
  '6-3': 'wblW_M_HVQ8',
  '6-4': 'Kjli0Gunkds',
};

const FALLBACK_MATH_VIDEO_IDS = [
  '_cooC3yG_p0',
  'YNstP0ESndU',
  '5yfh5cf4-0w',
  'lFQ4kMcODzU',
  'MMv-027KEqU',
  '2_21erD-nBg',
  'wblW_M_HVQ8',
];

function pickRandomTopicVideo({ chapterIndex, topicIndex, topicName, gradeLevel }) {
  const key = `${chapterIndex}-${topicIndex}`;
  let id = TOPIC_YOUTUBE_VIDEO_IDS[key];
  if (!id) {
    id = FALLBACK_MATH_VIDEO_IDS[hashPair(chapterIndex, topicIndex) % FALLBACK_MATH_VIDEO_IDS.length];
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
