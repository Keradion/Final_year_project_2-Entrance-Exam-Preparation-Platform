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
  { tags: ['seq_series'], title: 'AP term', question: 'In an AP with first term 3 and common difference 4, the 5th term equals', options: ['19', '23', '15', '7'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['seq_series'], title: 'AP diff', question: 'If a₂ = 5 and a₅ = 14 in an AP, then d equals', options: ['3', '9/4', '4', '2'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['seq_series'], title: 'GP sum finite', question: 'For |r| < 1, a + ar + ar² + … converges to', options: ['a/(1−r)', 'a/(1+r)', 'ar', 'a(1−r)'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['seq_series'], title: 'Σ integers', question: '∑_{k=1}^{100} k equals', options: ['5050', '5000', '10000', '4950'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['seq_series'], title: 'GP find r', question: 'In a GP with a₁ = 2 and a₄ = 54, if terms are positive then r equals', options: ['3', '2', '9', '27'], correctAnswer: 0, difficulty: 'Hard' },
  { tags: ['limits'], title: 'Continuity', question: 'Polynomials on ℝ are', options: ['continuous', 'never continuous', 'only at 0', 'only rational x'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['limits'], title: 'Hole', question: 'Canceling (x−a) may remove a', options: ['removable discontinuity', 'vertical asymptote always', 'jump always', 'period'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['limits'], title: 'Rational limit', question: 'lim_{x→1} (x² − 1)/(x − 1) equals', options: ['2', '0', '1', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['limits'], title: 'Seq 1/n', question: 'The sequence a_n = 1/n as n → ∞', options: ['tends to 0', 'tends to 1', 'diverges to ∞', 'oscillates without limit'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['limits'], title: 'One-sided', question: 'lim_{x→0⁺} 1/x is often written as', options: ['+∞ (divergent in extended sense)', '0', '1', '−1'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['limits'], title: 'Cont value', question: 'If f is continuous at a and lim_{x→a} f(x) = L, then', options: ['f(a) = L (under the usual definition)', 'f(a) must be 0', 'L is always ∞', 'f need not be defined at a'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['limits'], title: 'Jump', question: 'A jump discontinuity means left and right limits', options: ['exist but differ (finite)', 'do not exist', 'always equal 0', 'always infinite'], correctAnswer: 0, difficulty: 'Hard' },
  { tags: ['deriv'], title: 'Power', question: 'd/dx x⁶ =', options: ['6x⁵', 'x⁵', '6x⁶', '0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['deriv'], title: 'Constant', question: 'Derivative of −4 is', options: ['0', '−4', 'x', '1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['deriv'], title: 'Exp deriv', question: 'd/dx e^x equals', options: ['e^x', 'e^{x−1}', 'ln x', '0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['deriv'], title: 'Log deriv', question: 'd/dx ln x for x > 0 equals', options: ['1/x', 'ln x', 'x', 'e^x'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['deriv'], title: 'Product', question: 'd/dx [x²·sin x] at a point uses', options: ['product rule: (x²)′sin x + x²(sin x)′', 'only chain rule', 'power rule only', 'quotient rule only'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['deriv'], title: 'Chain', question: 'd/dx sin(3x) equals', options: ['3 cos(3x)', 'cos(3x)', '−3 sin(3x)', 'sin(3)'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['deriv'], title: 'Quotient', question: 'd/dx (x / (x+1)) in lowest form uses', options: ['quotient rule on x and (x+1)', 'only power rule', 'implicit differentiation of y only', 'integration by parts'], correctAnswer: 0, difficulty: 'Hard' },
  { tags: ['appderiv'], title: 'f′>0', question: 'If f′>0 on I, f is', options: ['increasing (typical)', 'decreasing', 'constant', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['appderiv'], title: 'Critical', question: 'Critical numbers of f (intro) include points where', options: ['f′ is 0 or undefined in the domain studied', 'f = 0 only', 'f″ = 0 only', 'x = 0 only'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['appderiv'], title: 'Local max test', question: 'If f′ changes from + to − at c, then typically f has', options: ['a local maximum at c', 'a local minimum at c', 'an inflection at c', 'no extremum'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['appderiv'], title: 'Concave up', question: 'If f″>0 on an interval, the graph is', options: ['concave up there', 'concave down there', 'linear there', 'constant there'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['appderiv'], title: 'Optimize', question: 'To maximize f on [a,b] with f differentiable in (a,b), candidates include', options: ['critical points in (a,b) and endpoints a, b', 'only endpoints', 'only where f″=0', 'only x = 0'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['appderiv'], title: 'Related rates', question: 'Related rates problems usually require', options: ['differentiating a constraint with respect to time t', 'integrating before setup', 'ignoring chain rule', 'fixing all variables first'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['appderiv'], title: 'Mean val', question: 'The Mean Value Theorem (hypotheses met) guarantees a point c where', options: ['f′(c) equals the average rate of change over [a,b]', 'f(c) = 0', 'f″(c) = 0', 'f has a local max'], correctAnswer: 0, difficulty: 'Hard' },
  { tags: ['appderiv'], title: 'Inflection', question: 'An inflection point often occurs where', options: ['concavity changes (often where f″ = 0 or crosses, subject to checks)', 'f′ = 0 always', 'f is undefined always', 'slope is zero only'], correctAnswer: 0, difficulty: 'Hard' },
  { tags: ['integral'], title: 'FTC', question: '∫_a^b g′ equals', options: ['g(b)−g(a)', 'g(a)−g(b)', 'g′(b)', '0 always'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Area', question: 'If f≥g on [p,q], area between is ∫', options: ['(f−g) dx', '(g−f) dx always', 'f+g', '1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Riemann sum', question: 'A Riemann sum for f on [a, b] builds rectangles using', options: ['heights of f at chosen sample points in each subinterval', 'f′ at the left endpoint only', 'only the maximum of f on ℝ', 'Taylor polynomials of f'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Mesh limit', question: 'As mesh (max subinterval width) → 0, Riemann sums for an integrable f approach', options: ['the definite integral ∫_a^b f(x) dx', 'f′(a)', 'always ∞', 'the number of subintervals'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['integral'], title: 'Signed area', question: 'Net signed area between y = f(x) and the x-axis on [a, b] is captured by', options: ['∫_a^b f(x) dx (areas below axis count negative)', '∫_a^b |f(x)| dx always', 'f(b) − f(a)', 'a Riemann sum with only left endpoints'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Constant on interval', question: 'If f(x) = k is constant on [a, b], then ∫_a^b k dx equals', options: ['k(b − a)', 'k', '0', 'b^k − a^k'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Nonnegative f', question: 'If f is continuous and f(x) ≥ 0 on [a, b], then ∫_a^b f(x) dx is', options: ['≥ 0 (area interpretation)', 'always negative', 'always 0', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'LR sums', question: 'Left-endpoint vs right-endpoint Riemann sums differ mainly because', options: ['sample points in each subinterval are chosen differently', 'the limits of integration change', 'one uses derivatives instead of heights', 'only one of them uses a partition'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['integral'], title: 'Additivity', question: '∫_a^c f(x) dx = ∫_a^b f(x) dx + ∫_b^c f(x) dx holds (standard hypotheses) when', options: ['b lies between a and c and f is integrable on [a, c]', 'a = b always', 'f is constant only', 'never'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['integral'], title: 'Above axis', question: 'If f stays above the x-axis on [a, b], net integral and geometric area under the curve', options: ['match (both represented by the same positive ∫)', 'always have opposite signs', 'are unrelated', 'equal −1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Refine partition', question: 'Refining a partition of [a, b] usually means', options: ['subdividing intervals so the mesh gets smaller', 'using fewer rectangles', 'replacing f by f′', 'removing sample points'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['integral'], title: 'Estimates', question: 'Using more (well-chosen) rectangles for a nonnegative f on [a, b] typically', options: ['improves the approximation to ∫_a^b f(x) dx', 'always gives exact area with no limit', 'changes the value of the integral', 'removes the need for a limit'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['space3d'], title: 'Dot zero', question: 'Nonzero u,v with u·v=0 are', options: ['perpendicular', 'parallel', 'identical', 'always 3D only'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['space3d'], title: 'Cross', question: 'u×v is orthogonal to', options: ['both u and v (when nonzero)', 'only u', 'only v', 'neither'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['space3d'], title: 'Dist3D', question: 'Distance from (0,0,0) to (1,2,2) equals', options: ['3', '5', '√3', '9'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['space3d'], title: 'Vec length', question: '‖⟨1,2,2⟩‖ equals', options: ['3', '5', '√5', '9'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['space3d'], title: 'Dot value', question: '⟨1,0,1⟩·⟨2,3,−1⟩ equals', options: ['1', '0', '3', '−1'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['space3d'], title: 'Line param', question: 'A line through (1,0,0) with direction ⟨0,1,0⟩ can be written as', options: ['(1, t, 0)', '(t, 0, 0)', '(0, 1, t)', '(t, t, t)'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['space3d'], title: 'Plane through origin', question: 'Which equation describes a plane through the origin in ℝ³?', options: ['x + y + z = 0', 'x = 1', 'y = 2 and z = 3', 'x² + y² = 1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['space3d'], title: 'Cross area', question: 'For vectors u,v in ℝ³, ‖u×v‖ equals the area of', options: ['the parallelogram spanned by u and v', 'a unit circle', 'the sum ‖u‖+‖v‖', 'u·v'], correctAnswer: 0, difficulty: 'Hard' },
  { tags: ['proof'], title: 'Induction base', question: 'Induction starts by proving', options: ['a base case', 'the inductive step first', 'all cases at once', 'a contradiction'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['proof'], title: 'Negation ∃', question: 'Negation of ∃x P(x) is', options: ['∀x ¬P(x)', '∀x P(x)', '∃x ¬P(x)', 'P(x)'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['proof'], title: 'Contrapos', question: 'The contrapositive of “If P then Q” is', options: ['If not Q then not P', 'If Q then P', 'P and not Q', 'Not P or not Q'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['proof'], title: 'De Morgan ∀', question: 'Negation of “∀x, P(x)” is', options: ['∃x such that ¬P(x)', '∀x, ¬P(x)', '∃x, P(x)', '¬P(x) for all x'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['proof'], title: 'Contradiction', question: 'To prove P by contradiction one assumes', options: ['P is false and derives a logical impossibility', 'P is true immediately', 'an example only', '∀x, x = 0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['proof'], title: 'Even plus even', question: 'The sum of two even integers is', options: ['even', 'odd', 'always prime', 'always 0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['proof'], title: 'Inductive step', question: 'In induction, the inductive step shows', options: ['P(k) ⇒ P(k+1) for the appropriate k', 'P(1) only', 'P(n) for all n without hypothesis', 'the base case twice'], correctAnswer: 0, difficulty: 'Medium' },
];

function stripStockForExercise(entry) {
  const { tags: _t, ...rest } = entry;
  return { ...rest };
}

function normalizeDifficulty(d) {
  const s = String(d || 'Easy').toLowerCase();
  if (s.startsWith('med')) return 'Medium';
  if (s.startsWith('hard')) return 'Hard';
  return 'Easy';
}

function difficultyCounts(exercises) {
  const c = { Easy: 0, Medium: 0, Hard: 0 };
  for (const e of exercises) {
    c[normalizeDifficulty(e.difficulty)] += 1;
  }
  return c;
}

/**
 * Pad with chapter-tagged stock, then full bank (~3 Easy / ~2 Medium / ~2 Hard). No generic fillers.
 */
function exercisesForTopic(chapterIndex, topicIndex, topicName, curatedForTopic, targetCount = 7) {
  const tag = CHAPTER_TAGS[chapterIndex] || 'seq_series';
  const tagPool = MCQ_STOCK.filter((m) => m.tags.includes(tag));

  const wantEasy = 3;
  const wantMed = 2;
  const wantHard = 2;

  const topicShort = topicName.split(',')[0].slice(0, 28);
  const out = (curatedForTopic || []).map((e) => ({ ...e, difficulty: normalizeDifficulty(e.difficulty) }));
  const usedQuestions = new Set(out.map((e) => e.question));

  function preferredTier() {
    const c = difficultyCounts(out);
    const defs = [
      ['Easy', wantEasy - c.Easy],
      ['Medium', wantMed - c.Medium],
      ['Hard', wantHard - c.Hard],
    ]
      .filter(([, d]) => d > 0)
      .sort((a, b) => b[1] - a[1]);
    return defs.length ? defs[0][0] : null;
  }

  function tryAdd(tierPref) {
    const sequences = tierPref
      ? [
          tagPool.filter((m) => normalizeDifficulty(m.difficulty) === tierPref),
          tagPool,
          MCQ_STOCK.filter((m) => normalizeDifficulty(m.difficulty) === tierPref),
          MCQ_STOCK,
        ]
      : [tagPool, MCQ_STOCK];

    const tier = tierPref || 'Easy';
    const start = hashPair(chapterIndex, topicIndex) + out.length * 31 + (tierPref ? tier.length : 0);
    for (const seq of sequences) {
      if (!seq.length) continue;
      for (let step = 0; step < seq.length; step += 1) {
        const m = seq[(start + step) % seq.length];
        if (usedQuestions.has(m.question)) continue;
        const stripped = stripStockForExercise(m);
        stripped.difficulty = normalizeDifficulty(stripped.difficulty);
        usedQuestions.add(stripped.question);
        stripped.title = `${topicShort} — ${stripped.title}`;
        out.push(stripped);
        return true;
      }
    }
    return false;
  }

  let guard = 0;
  while (out.length < targetCount && guard < 8000) {
    guard += 1;
    const pref = preferredTier();
    if (!tryAdd(pref)) {
      if (!tryAdd(null)) break;
    }
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
