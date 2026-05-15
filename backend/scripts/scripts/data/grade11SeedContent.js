/**
 * Grade 11 Mathematics — study notes, curated YouTube links, and MCQ stock pool.
 * Topic video IDs are hand-picked from Khan Academy and The Organic Chemistry Tutor (see
 * `TOPIC_YOUTUBE_VIDEO_IDS`). Keep keys `chapterIndex-topicIndex` aligned with grade11MathematicsCurriculum.js (7×5).
 */

const CHAPTER_TAGS = ['fn_alg', 'exp_log', 'adv_trig', 'conics', 'complex', 'matrices', 'vectors'];

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
  '0-0': 'Example: If f passes the horizontal line test on a domain, its inverse f⁻¹ is a function; points (a,b) on f become (b,a) on f⁻¹.',
  '0-1': 'Example: If f(x)=x² and g(x)=x+1, then (f∘g)(2)=f(3)=9.',
  '0-2': 'Example: f(x)=x+1 for x<0 and f(x)=2x for x≥0 needs the rule whose interval contains the x you substitute.',
  '0-3': 'Example: y=x² fails the horizontal line test on ℝ; restricting x≥0 makes an invertible branch.',
  '0-4': 'Example: log₂(2⁵)=5 and 2^{log₂ 7}=7 (for 7>0).',
  '1-0': 'Example: P=1000·1.05^t grows 5% per time step from 1000.',
  '1-1': 'Example: Because 2³=8, log₂ 8=3.',
  '1-2': 'Example: ln(3e²)=ln 3 + ln(e²)=ln 3 + 2.',
  '1-3': 'Example: 4^x=8 ⇒ (2²)^x=2³ ⇒ 2x=3 ⇒ x=3/2.',
  '1-4': 'Example: log(x−1)+log 5=log 10 ⇒ log(5(x−1))=log 10 ⇒ 5(x−1)=10, then check x−1>0.',
  '2-0': 'Example: π radians = 180°; π/6 rad = 30°.',
  '2-1': 'Example: θ=π/3 on the unit circle has coordinates (1/2, √3/2).',
  '2-2': 'Example: y=3sin(2x) has amplitude 3 and period π.',
  '2-3': 'Example: arcsin(1/2)=π/6 in the usual principal range for sine inverse.',
  '2-4': 'Example: sec θ=1/cos θ; undefined when cos θ=0.',
  '3-0': 'Example: Distance (0,0) to (3,4) is √(9+16)=5.',
  '3-1': 'Example: (x−1)²+(y+2)²=25 has center (1,−2) and radius 5.',
  '3-2': 'Example: y=2(x−3)²+4 has vertex (3,4), opens up.',
  '3-3': 'Example: x²/25+y²/9=1 meets the x-axis at ±5.',
  '3-4': 'Example: x²−y²=1 has asymptotes y=±x.',
  '4-0': 'Example: (2+3i)+(1−i)=3+2i.',
  '4-1': 'Example: |−4+3i|=√(16+9)=5.',
  '4-2': 'Example: (1+i)²=1+2i+i²=2i.',
  '4-3': 'Example: (3+2i)(3−2i)=9+4=13 (real, nonnegative).',
  '4-4': 'Example: Multiplying by e^{iθ} rotates by θ in polar form.',
  '5-0': 'Example: A 2×2 matrix has four entries arranged in two rows.',
  '5-1': 'Example: If A is 2×3 and B is 3×2, then AB is 2×2.',
  '5-2': 'Example: det[[2,1],[3,4]]=8−3=5.',
  '5-3': 'Example: Inverse of [[1,2],[0,1]] is [[1,−2],[0,1]] (check by multiply).',
  '5-4': 'Example: For 2×2 Cramer’s rule, denominator is determinant of coefficient matrix.',
  '6-0': 'Example: Vector from (1,2) to (4,6) is ⟨3,4⟩.',
  '6-1': 'Example: ⟨1,2⟩+⟨3,−1⟩=⟨4,1⟩.',
  '6-2': 'Example: Unit vector in direction ⟨3,4⟩ is ⟨3/5,4/5⟩.',
  '6-3': 'Example: ⟨1,0⟩·⟨0,1⟩=0 (perpendicular).',
  '6-4': 'Example: Shear matrix [[1,k],[0,1]] maps ⟨x,y⟩ to ⟨x+ky,y⟩.',
};

function formulasPlain(chapterIndex) {
  switch (chapterIndex) {
    case 0:
      return 'Inverse: y=f(x) ⇔ x=f⁻¹(y) on suitable domains. Composition (f∘g)(x)=f(g(x)). Piecewise: interval discipline. One-to One ⇔ horizontal line test passes. exp and log_b are inverses (b>0, b≠1).';
    case 1:
      return 'Exponential b^x; logarithm log_b x. Laws: log(AB)=log A+log B; log(A/B)=log A−log B; log(A^k)=k log A. Solve exponentials by matching bases or applying log. Log equations: check arguments > 0.';
    case 2:
      return 'Radians θ=s/r. Unit circle: (cos θ, sin θ). Graphs: period, amplitude, midline. Inverse trig: restricted domains. Reciprocals: sec, csc, cot; 1+tan²=sec².';
    case 3:
      return 'Distance, midpoint, slope. Circle (x−h)²+(y−k)²=r². Parabola vertex form. Ellipse x²/a²+y²/b²=1. Hyperbola x²/a²−y²/b²=1 style; asymptotes y=±(b/a)x (standard position).';
    case 4:
      return 'i²=−1; z=a+bi. |z|=√(a²+b²). zz̄=|z|². Multiply with FOIL; divide using conjugate. Polar: z=r(cos θ+i sin θ); multiply adds angles.';
    case 5:
      return 'Matrix sizes; AB needs inner dimensions match. det[[a,b],[c,d]]=ad−bc. A⁻¹ exists iff det A≠0 (square). Systems Ax=b; Cramer uses determinants.';
    case 6:
      return 'Vectors in ℝ²: addition component-wise; scalar stretch. Dot product u·v=u₁v₁+u₂v₂; perpendicular iff dot=0. Linear map: v ↦ Mv.';
    default:
      return '';
  }
}

const MCQ_STOCK = [
  { tags: ['fn_alg'], title: 'Inverse idea', question: 'An inverse function swaps:', options: ['inputs and outputs (roles)', 'only signs', 'matrix rows', 'i and −i only'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['fn_alg'], title: 'Composition', question: '(f∘g)(x) means:', options: ['f(g(x))', 'g(f(x))', 'f(x)·g(x)', 'f(x)/g(x)'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['fn_alg'], title: 'HLT', question: 'Horizontal line test checks:', options: ['one-to-one', 'vertical line property', 'circle tangency', 'determinant'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['fn_alg'], title: 'Domain comp', question: 'Domain of f∘g depends on:', options: ['g and f domains compatibly', 'only f', 'only constants', 'i²'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['exp_log'], title: 'Log def', question: 'log_b a = c means:', options: ['b^c=a', 'a^c=b', 'b=a^c', 'c=ab'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['exp_log'], title: 'Log law', question: 'log(AB) same base:', options: ['log A + log B', 'log A - log B', 'log A · log B', '(log A)^B'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['exp_log'], title: 'Solve exp', question: '2^x=64 gives x=', options: ['6', '5', '4', '3'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['exp_log'], title: 'ln e', question: 'ln e =', options: ['1', '0', 'e', '1/e'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['adv_trig'], title: 'Radians', question: 'π rad =', options: ['180°', '90°', '360°', '60°'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['adv_trig'], title: 'Unit circle', question: 'cos 0 =', options: ['1', '0', '−1', '1/2'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['adv_trig'], title: 'Period sin', question: 'Period of sin(x) is:', options: ['2π', 'π', '4π', '1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['adv_trig'], title: 'Identity', question: 'sin²θ+cos²θ=', options: ['1', '0', 'tan θ', 'sec θ'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['conics'], title: 'Circle r', question: 'x²+y²=25 radius:', options: ['5', '25', '√5', '50'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['conics'], title: 'Distance', question: 'Distance (0,0) to (5,12):', options: ['13', '17', '7', '60'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['conics'], title: 'Parabola', question: 'y=(x−2)²+3 vertex:', options: ['(2,3)', '(−2,3)', '(2,−3)', '(3,2)'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['conics'], title: 'Ellipse', question: 'x²/9+y²/4=1 meets x-axis at:', options: ['±3', '±2', '±9', '±4'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['complex'], title: 'i²', question: 'i² =', options: ['−1', '1', 'i', '0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['complex'], title: 'Modulus', question: '|3+4i|=', options: ['5', '7', '12', '25'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['complex'], title: 'Add', question: '(1+i)+(1−i)=', options: ['2', '2i', '0', '1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['complex'], title: 'Conj', question: 'Conjugate of 2−5i is:', options: ['2+5i', '−2−5i', '5−2i', '−2+5i'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['matrices'], title: 'Size', question: '3×2 matrix has how many entries?', options: ['6', '5', '3', '2'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['matrices'], title: 'det 2×2', question: 'det[[1,2],[3,4]]=', options: ['−2', '2', '10', '4'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['matrices'], title: 'I2', question: 'I times A (matching sizes) gives:', options: ['A', '0', 'Aᵀ', 'det A'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['matrices'], title: 'Singular', question: 'det A = 0 ⟹ A is:', options: ['singular', 'always invertible', 'identity', 'orthogonal'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['vectors'], title: 'Length', question: 'Length of ⟨3,4⟩ equals:', options: ['5', '7', '12', '25'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['vectors'], title: 'Sum', question: '⟨1,2⟩+⟨2,3⟩=', options: ['⟨3,5⟩', '⟨2,6⟩', '⟨1,3⟩', '⟨0,0⟩'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['vectors'], title: 'Dot', question: '⟨1,0⟩·⟨0,1⟩=', options: ['0', '1', '−1', 'i'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['vectors'], title: 'Parallel', question: 'Which vector is parallel to ⟨2,4⟩?', options: ['⟨1,2⟩', '⟨2,−4⟩', '⟨0,1⟩', '⟨4,2⟩'], correctAnswer: 0, difficulty: 'Medium' },
];

function stripStockForExercise(entry) {
  const { tags: _t, ...rest } = entry;
  return { ...rest };
}

function exercisesForTopic(chapterIndex, topicIndex, topicName, curatedForTopic, targetCount = 7) {
  const tag = CHAPTER_TAGS[chapterIndex] || 'fn_alg';
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
    ? ['Key rules and formulas for this unit (Grade 11).', formulasBlock].join('\n\n')
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
  // Unit 1: Further relations and functions
  '0-0': '8GEGnSEJA2s',
  '0-1': 'wUNWjd4bMmw',
  '0-2': 'tedzsRH0Jas',
  '0-3': 'nEWYKpTCX-U',
  '0-4': 'DhW9pz5Vfwo',
  // Unit 2: Exponential and logarithmic functions
  '1-0': '6WMZ7J0wwMI',
  '1-1': 'Z5myJ8dg_rM',
  '1-2': 'PupNgv49_WY',
  '1-3': 'etl9KKf6se0',
  '1-4': 'fnhFneOz6n8',
  // Unit 3: Further trigonometric functions
  '2-0': 'axGgnXyuiTg',
  '2-1': '1m9p9iubMLU',
  '2-2': 'SdHwokUU8xI',
  '2-3': '9g0pFXB8PLY',
  '2-4': 'fo_q9mEAFp4',
  // Unit 4: Coordinate geometry and conic sections
  '3-0': 'nyZuite17Pc',
  '3-1': 'iX5UgArMyiI',
  '3-2': 'KYgmOTLbuqE',
  '3-3': 'pae1hExrc5o',
  '3-4': 'Wfpb-fniSSk',
  // Unit 5: Complex numbers
  '4-0': 'ysVcAYo7UPI',
  '4-1': 'SP-YJe7Vldo',
  '4-2': 'MzCS_8Rzja8',
  '4-3': 'EfRRpVB62Ko',
  '4-4': 'CIQmq1wOjnc',
  // Unit 6: Matrices and determinants
  '5-0': '0oGJTQCy4cQ',
  '5-1': 'kT4Mp9EdVqs',
  '5-2': 'GuFvSwriy1Q',
  '5-3': 'r9aTLTN16V4',
  '5-4': '3ROzG6n4yMc',
  // Unit 7: Vectors and transformation of the plane
  '6-0': 'br7tS1t2SFE',
  '6-1': 'Mep0foZMOCg',
  '6-2': 'yFPfO_eHJdY',
  '6-3': 'v8plb6V8BQo',
  '6-4': 'PErhLkQcpZ8',
};

const FALLBACK_MATH_VIDEO_IDS = [
  '8GEGnSEJA2s',
  '6WMZ7J0wwMI',
  '1m9p9iubMLU',
  'iX5UgArMyiI',
  'ysVcAYo7UPI',
  '0oGJTQCy4cQ',
  'br7tS1t2SFE',
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
