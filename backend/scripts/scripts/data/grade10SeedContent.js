/**
 * Grade 10 Mathematics — study notes, curated YouTube links, and MCQ stock pool.
 * Topic video IDs are hand-picked from Khan Academy and The Organic Chemistry Tutor (see
 * `TOPIC_YOUTUBE_VIDEO_IDS`). Keep keys `chapterIndex-topicIndex` aligned with grade10MathematicsCurriculum.js (7×5).
 */

const CHAPTER_TAGS = ['rational', 'systems', 'quadratic', 'functions', 'trigonometry', 'plane_geo', 'solids'];

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
  '0-0': 'Example: For (x + 2)/(x − 5), the denominator is zero when x = 5, so the domain excludes 5 even after simplifying.',
  '0-1': 'Example: (x/3) · (6/x²) = 6x/(3x²) = 2/x for x ≠ 0.',
  '0-2': 'Example: 2/x + 3/x = 5/x (x ≠ 0). For 1/(x+1) + 1/(x−1), LCD = (x+1)(x−1); combine numerators carefully.',
  '0-3': 'Example: (1/x)/(2/x²) = (1/x)·(x²/2) = x/2 for x ≠ 0.',
  '0-4': 'Example: Solve 2/(x−3) = 1 ⇒ x = 5. Check: denominator 2 ≠ 0; substitute to verify.',
  '1-0': 'Example: −3x > 6 ⇒ x < −2 (divide by negative, flip inequality).',
  '1-1': 'Example: Two lines with different slopes intersect once — that point satisfies both equations.',
  '1-2': 'Example: y = 2x and x + y = 9 ⇒ x + 2x = 9 ⇒ x = 3, y = 6.',
  '1-3': 'Example: Adding x + y = 5 and x − y = 1 gives 2x = 6 ⇒ x = 3, y = 2.',
  '1-4': 'Example: Two numbers with sum 15 and difference 3: x + y = 15, x − y = 3 ⇒ 2x = 18 ⇒ x = 9, y = 6.',
  '2-0': 'Example: x² − 5x + 6 = (x−2)(x−3) = 0 ⇒ x = 2 or x = 3.',
  '2-1': 'Example: x² + 8x → complete: (x+4)² − 16.',
  '2-2': 'Example: For x² + x + 1, Δ = 1 − 4 = −3 < 0; no real roots.',
  '2-3': 'Example: Rectangle width w, length w+2, area 35 ⇒ w(w+2)=35 ⇒ w=5 (positive root).',
  '2-4': 'Example: With u = x², equation x⁴ − 5x² + 4 becomes u² − 5u + 4 = 0 ⇒ u = 1 or 4 ⇒ x = ±1, ±2.',
  '3-0': 'Example: For {(1,2),(3,4)}, domain is {1,3}; range is {2,4}.',
  '3-1': 'Example: If f(x)=3x−1, then f(2)=5 by substitution.',
  '3-2': 'Example: y = −2x + 7 has slope −2 and y-intercept 7.',
  '3-3': 'Example: y = (x−1)² + 2 has vertex (1,2) and axis x = 1.',
  '3-4': 'Example: y = x² + 5 shifts y = x² upward 5 units.',
  '4-0': 'Example: Legs 6 and 8 ⇒ hypotenuse 10 by 6-8-10 triple.',
  '4-1': 'Example: opposite/hyp = 3/5 ⇒ sin θ = 3/5.',
  '4-2': 'Example: sin θ = opp/hyp; if hyp = 10 and sin θ = 0.6, then opp = 6.',
  '4-3': 'Example: acute θ with tan θ = 1 ⇒ θ = 45°.',
  '4-4': 'Example: Tower height h, distance d, angle of elevation α: tan α = h/d (right triangle).',
  '5-0': 'Example: Pentagon interior sum = (5−2)·180° = 540°.',
  '5-1': 'Example: Side lengths scale k ⇒ areas of similar plane figures scale k².',
  '5-2': 'Example: Two equal angle pairs (with correct correspondence) ⇒ AA similarity.',
  '5-3': 'Example: Central angle 60° ⇔ intercepted arc 60°; inscribed angle on same arc is 30°.',
  '5-4': 'Example: Radius to tangent point is perpendicular to the tangent line.',
  '6-0': 'Example: Cylinder r = 2, h = 3 ⇒ V = πr²h = 12π.',
  '6-1': 'Example: Cone r = 3, h = 4 ⇒ V = (1/3)πr²h = 12π.',
  '6-2': 'Example: Sphere r = 3 ⇒ V = (4/3)πr³ = 36π.',
  '6-3': 'Example: Box 2×3×4 has volume 24 cubic units; composite solids add/subtract such volumes.',
  '6-4': 'Example: 2 m = 200 cm; 1 m³ = 1000 L in common metric teaching.',
};

function formulasPlain(chapterIndex) {
  switch (chapterIndex) {
    case 0:
      return 'Reduce factors (a≠0): (ac)/(bc)=a/b. LCD for a/b+c/d=(ad+bc)/(bd). Complex fraction: multiply top and bottom by LCD of “inner” denominators. Check solutions of rational equations against excluded values.';
    case 1:
      return 'Linear inequality: multiplying/dividing by a negative reverses the inequality. System solutions: intersection of lines (graph), or substitution/elimination algebraically.';
    case 2:
      return 'Quadratic ax²+bx+c=0: factor when possible; complete the square; or x = (−b±√Δ)/(2a), Δ=b²−4ac. Vieta: sum −b/a, product c/a (a≠0).';
    case 3:
      return 'Function notation f(x). Line y=mx+b. Parabola vertex from y=a(x−h)²+k at (h,k). Vertical shift y=f(x)+k; y=−f(x) reflects in x-axis.';
    case 4:
      return 'Right triangle: sin θ=opp/hyp, cos θ=adj/hyp, tan θ=opp/adj. Pythagoras a²+b²=c². For acute θ, sin²θ+cos²θ=1.';
    case 5:
      return 'Convex n-gon interior angle sum: (n−2)·180°. Regular n-gon each interior: ((n−2)·180°)/n. Inscribed angle = ½ intercepted arc; central angle = arc measure.';
    case 6:
      return 'Prism/cylinder V = base×height; cylinder lateral 2πrh. Pyramid/cone V = (1/3) base×height. Sphere V=(4/3)πr³, A=4πr².';
    default:
      return '';
  }
}

const MCQ_STOCK = [
  { tags: ['rational'], title: 'LCD', question: 'LCD of 1/x and 1/(x+1) is:', options: ['x', 'x+1', 'x(x+1)', '1'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['rational'], title: 'Exclude', question: '(x−1)/(x²−1) is undefined for x =', options: ['1 only', '−1 only', '1 and −1', '0 only'], correctAnswer: 2, difficulty: 'Medium' },
  { tags: ['rational'], title: 'Reduce', question: '(x²−4)/(x−2) for x≠2 equals:', options: ['x−2', 'x+2', '2', 'x'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['rational'], title: 'Multiply', question: '(2/x)·(x/4) =', options: ['1/2', '2', 'x/2', '8/x'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['rational'], title: 'Add simple', question: '3/x + 2/x =', options: ['5/x', '5/(2x)', '6/x', '1/x'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['rational'], title: 'Solve', question: '4/x = 2 ⇒ x =', options: ['2', '8', '1/2', '−2'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['rational'], title: 'Reciprocal divide', question: '(a/b) ÷ (c/d) =', options: ['ac/bd', 'ad/bc', '(a+c)/(b+d)', 'a/b'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['systems'], title: 'Intersection', question: 'Solution of a 2×2 linear system from a graph is:', options: ['Intersection of the two lines', 'Midpoint of axes', 'Area between lines', 'Product of slopes'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['systems'], title: 'Parallel system', question: 'Parallel distinct lines imply:', options: ['One solution', 'No solution', 'Many solutions', 'Two solutions'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['systems'], title: 'Substitute', question: 'y = 3x and x + y = 4 gives x =', options: ['1', '2', '3', '4'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['systems'], title: 'Eliminate', question: 'x + y = 6 and x − y = 2 ⇒ x =', options: ['2', '3', '4', '8'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['systems'], title: 'Flip ineq', question: '−x > 3 means:', options: ['x > −3', 'x < −3', 'x > 3', 'x = 3'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['systems'], title: 'Compound', question: '1 ≤ x < 4 includes:', options: ['x = 4', 'x = 1', 'x = 0 only', 'no integers'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['systems'], title: 'Consistent', question: 'Independent consistent system has:', options: ['Infinitely many', 'Exactly one solution', 'No solution', 'Three unknowns'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['quadratic'], title: 'Factor quad', question: 'x² − 7x + 12 = 0 has roots:', options: ['3 and 4', '−3 and −4', '2 and 6', '1 and 12'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['quadratic'], title: 'Discriminant', question: 'Δ < 0 means:', options: ['Two real roots', 'One repeated', 'No real roots', 'Linear only'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['quadratic'], title: 'Formula', question: 'Sum of roots of x² − 5x + 6 = 0:', options: ['5', '−5', '6', '−6'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['quadratic'], title: 'Complete sq', question: '(x + 3)² expands to:', options: ['x² + 9', 'x² + 6x + 9', 'x² + 3x + 9', 'x² + 9x + 9'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['quadratic'], title: 'Vertex', question: 'Vertex of y = (x − 2)² + 1:', options: ['(2,1)', '(−2,1)', '(2,−1)', '(1,2)'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['quadratic'], title: 'Reducible', question: 'With u = x², x⁴ − 10x² + 9 becomes:', options: ['u − 10u + 9', 'u² − 10u + 9', 'u² + 9', '10u²'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['quadratic'], title: 'Quad opens', question: 'y = −x² opens:', options: ['Up', 'Down', 'Left', 'Right'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['functions'], title: 'f(0)', question: 'f(x)=4−x; f(0)=', options: ['4', '0', '−4', '1'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['functions'], title: 'Vertical test', question: 'Fails vertical line test if:', options: ['one x maps to two y', 'one y maps to two x', 'slope 0', 'y-intercept 0'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['functions'], title: 'Domain set', question: 'Domain of {(0,1),(1,2)} is:', options: ['{0,1}', '{1,2}', '{0,2}', 'ℝ'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['functions'], title: 'Slope line', question: 'y = 5x − 2 slope:', options: ['5', '−2', '−5', '2'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['functions'], title: 'Shift up', question: 'y = x² + 4 shifts basic parabola:', options: ['Right 4', 'Up 4', 'Down 4', 'Left 4'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['functions'], title: 'Reflect x-axis', question: 'y = −f(x) reflects graph across:', options: ['y-axis', 'x-axis', 'origin only always', 'y = x always'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['functions'], title: 'Midpoint', question: 'Midpoint of (0,0) and (4,6):', options: ['(2,3)', '(4,6)', '(1,5)', '(3,2)'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['trigonometry'], title: 'sin def', question: 'sin θ =', options: ['opp/hyp', 'adj/hyp', 'opp/adj', 'hyp/opp'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['trigonometry'], title: 'cos def', question: 'cos θ =', options: ['opp/hyp', 'adj/hyp', 'opp/adj', 'hyp/adj'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['trigonometry'], title: 'tan 45', question: 'tan 45° =', options: ['0', '1', '√2', '1/2'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['trigonometry'], title: 'Pythag', question: 'Legs 5,12 hyp =', options: ['13', '17', '7', '25'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['trigonometry'], title: 'Identity', question: 'sin²θ + cos²θ =', options: ['0', '1', 'tan θ', '2'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['trigonometry'], title: 'Angle sum acute', question: 'Two acute angles in right triangle sum to:', options: ['90°', '180°', '45°', '60°'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['trigonometry'], title: 'Elevation', question: 'Angle of elevation is measured from:', options: ['vertical down', 'horizontal up to line of sight', 'tangent line to circle', 'polygon center'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['plane_geo'], title: 'Polygon sum', question: 'Interior sum of hexagon:', options: ['360°', '540°', '720°', '180°'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['plane_geo'], title: 'Regular pent', question: 'Each interior angle regular pentagon:', options: ['72°', '108°', '120°', '90°'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['plane_geo'], title: 'Similar', question: 'Similar triangles have:', options: ['equal angles; proportional sides', 'equal sides always', 'different angles', 'same area always'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['plane_geo'], title: 'Inscribed', question: 'Inscribed angle on arc 100°:', options: ['100°', '50°', '200°', '25°'], correctAnswer: 1, difficulty: 'Medium' },
  { tags: ['plane_geo'], title: 'Tangent', question: 'Radius at point of tangency is ___ to tangent:', options: ['parallel', 'perpendicular', 'skew', 'equal'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['plane_geo'], title: 'Exterior sum', question: 'Convex polygon exterior angles sum:', options: ['180°', '360°', '(n−2)180°', '90°'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['plane_geo'], title: 'Scale area', question: 'Lengths scale k; areas scale:', options: ['k', 'k²', 'k³', '1/k'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['solids'], title: 'Cylinder V', question: 'r=1,h=7 cylinder volume (π):', options: ['7π', '8π', '49π', '2π'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['solids'], title: 'Cone V', question: 'Cone r=3,h=2 volume (π):', options: ['6π', '18π', '9π', '3π'], correctAnswer: 0, difficulty: 'Medium' },
  { tags: ['solids'], title: 'Sphere A', question: 'r=2 sphere surface area:', options: ['4π', '8π', '16π', '32π'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['solids'], title: 'Sphere V', question: 'r=1 sphere volume (π):', options: ['π', '(4/3)π', '4π', '2π'], correctAnswer: 1, difficulty: 'Easy' },
  { tags: ['solids'], title: 'Prism', question: 'Volume right prism:', options: ['base area × height', '½bh', 'πr³', '4πr²'], correctAnswer: 0, difficulty: 'Easy' },
  { tags: ['solids'], title: 'Units', question: '1 m³ ≈ often taught as:', options: ['1 L', '100 L', '1000 L', '10 L'], correctAnswer: 2, difficulty: 'Easy' },
  { tags: ['solids'], title: 'Composite', question: 'Volume of composite solid often found by:', options: ['adding/subtracting simpler volumes', 'averaging', 'squaring only', 'angles only'], correctAnswer: 0, difficulty: 'Easy' },
];

function stripStockForExercise(entry) {
  const { tags: _t, ...rest } = entry;
  return { ...rest };
}

function exercisesForTopic(chapterIndex, topicIndex, topicName, curatedForTopic, targetCount = 7) {
  const tag = CHAPTER_TAGS[chapterIndex] || 'rational';
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
    ? ['Key rules and formulas for this unit (Grade 10).', formulasBlock].join('\n\n')
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
  // Unit 1: Rational expressions and rational equations
  '0-0': '7Uos1ED3KHI',
  '0-1': 'f-wz_ZzSDdg',
  '0-2': 'w7NhLkQynS8',
  '0-3': 'ifDEetTq8bM',
  '0-4': 'bml74_PsfwA',
  // Unit 2: Linear inequalities and systems of linear equations
  '1-0': 'xOxvyeSl0uA',
  '1-1': '5a6zpfl50go',
  '1-2': 'V7H1oUHXPkg',
  '1-3': 'vA-55wZtLeE',
  '1-4': 'z1hz8-Kri1E',
  // Unit 3: Quadratic equations
  '2-0': 'N30tN9158Kc',
  '2-1': 'bNQY0z76M5A',
  '2-2': 'i7idZfS8t8w',
  '2-3': 'HtN86WyZ6zY',
  '2-4': 'hjigR_rHKDI',
  // Unit 4: Relations, functions, and graphs
  '3-0': 'O0uUVH8dRiU',
  '3-1': 'kvGsIo1TmsM',
  '3-2': 'IL3UCuXrUzE',
  '3-3': '7QMoNY6FzvM',
  '3-4': 'ZmVOR6n_fzY',
  // Unit 5: Introduction to trigonometry
  '4-0': 'AA6RfgP-AHU',
  '4-1': 'QuZMXVJNLCo',
  '4-2': 'MyvRxKM0xns',
  '4-3': 'l5VbdqRjTXc',
  '4-4': 'sCyQ9DcDp2E',
  // Unit 6: Plane geometry — polygons, similarity, and circles
  '5-0': 'C_mxfW7Ybb0',
  '5-1': 'OQlMQ0e4AOs',
  '5-2': 'BI-rtfZVXy0',
  '5-3': 'h-_BDon5oes',
  '5-4': '8vFhNhL-zm8',
  // Unit 7: Surface area and volume of solid figures
  '6-0': 'gL3HxBQyeg0',
  '6-1': 'JN3LhO0YXw8',
  '6-2': 'IelS2vg7JO8',
  '6-3': 'xMz9WFvox9g',
  '6-4': 'w0nqd_HXHPQ',
};

const FALLBACK_MATH_VIDEO_IDS = [
  '7Uos1ED3KHI',
  '5a6zpfl50go',
  'N30tN9158Kc',
  'O0uUVH8dRiU',
  'gL3HxBQyeg0',
  'ifDEetTq8bM',
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
