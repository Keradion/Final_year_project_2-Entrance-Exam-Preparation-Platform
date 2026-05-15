/**
 * Grade 11 Mathematics — Natural stream:
 * further functions, exponentials & logs, further trigonometry, conics, complex numbers,
 * matrices & determinants, vectors & transformations.
 *
 * Same seed pattern as Grade 9/10: 7 MCQ exercises per topic (curated + pad), one quiz per topic (7 problems),
 * five entrance-exam-style MCQs per topic from grade11ExamQuestions.js.
 */

const letters = ['A', 'B', 'C', 'D'];

function quizChoices(opts) {
  return opts.map((text, i) => ({ text, value: letters[i] }));
}

function Q(questionText, opts, correctLetter, answerExplanation = '') {
  return {
    questionText,
    choices: quizChoices(opts),
    correctAnswer: correctLetter,
    answerExplanation,
  };
}

module.exports = {
  gradeLevel: '11',
  subjectName: 'Mathematics',
  stream: 'Natural',
  subjectDescription:
    'Grade 11 Mathematics (Natural stream): from function structure to vectors.',

  chapters: [
    // ─── Unit 1 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 1: Further relations and functions',
      chapterDescription: 'Inverses, composition, piecewise definitions, and invertibility.',
      topics: [
        {
          topicName: 'Inverse functions and their graphs',
          topicDescription: 'Swap inputs and outputs; reflect across y = x when axes use equal scales.',
          topicObjectives: [
            'Relate points on y = f(x) to points on y = f⁻¹(x) and interpret reflection across y = x.',
            'Explain how domain/range swap between a function and its inverse on suitable domains.',
          ],
        },
        {
          topicName: 'Composition of functions (f ∘ g)',
          topicDescription: 'Apply the inner function first; track domain restrictions.',
          topicObjectives: [
            'Evaluate (f ∘ g)(x) = f(g(x)) numerically and symbolically, respecting domain of g and f.',
            'Compare (f ∘ g)(x) and (g ∘ f)(x) in examples where they differ.',
          ],
        },
        {
          topicName: 'Piecewise-defined functions',
          topicDescription: 'Different rules on different intervals; watch endpoints.',
          topicObjectives: [
            'Select the correct formula on each interval and handle boundary points carefully.',
            'Sketch or interpret piecewise graphs (jumps/corners) from algebraic rules.',
          ],
        },
        {
          topicName: 'One-to-one functions and invertibility',
          topicDescription: 'Horizontal line test; inverse is a function only when f is one-to-one.',
          topicObjectives: [
            'Use the horizontal line test to decide if an inverse relation is a function.',
            'Restrict domains to produce a one-to-one branch with an invertible inverse.',
          ],
        },
        {
          topicName: 'Exponential–logarithmic inverse models',
          topicDescription: 'b^x and log_b x undo each other on suitable domains.',
          topicObjectives: [
            'Apply identities b^{log_b x} = x (x>0) and log_b(b^y) = y on valid domains.',
            'Translate between exponential and logarithmic statements with correct bases and arguments.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Inverse value', question: 'If f(3) = 7, then f⁻¹(7) equals', options: ['3', '7', '1/7', '10'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Composition', question: 'If f(x) = 2x and g(x) = x + 1, then (f ∘ g)(0) =', options: ['1', '2', '0', '4'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Piecewise', question: 'If f(x) = x for x < 1 and f(x) = 2 for x ≥ 1, then f(1) =', options: ['1', '2', '3', 'undefined'], correctAnswer: 1, difficulty: 'Medium' },
        { topicIndex: 3, title: 'HLT', question: 'On ℝ, which fails the horizontal line test?', options: ['y = x³', 'y = x²', 'y = 2x + 1', 'y = √x (x ≥ 0)'], correctAnswer: 1, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Log inverse', question: 'log₂(8) equals', options: ['2', '4', '3', '8'], correctAnswer: 2, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Point swap', question: '(2, 5) on y = f(x) implies which point on y = f⁻¹(x)?', options: ['(5, 2)', '(2, 5)', '(−5, 2)', '(2, −5)'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Strictly increasing', question: 'A strictly increasing function on an interval is', options: ['always one-to-one on that interval', 'never one-to-one', 'never a function', 'always even'], correctAnswer: 0, difficulty: 'Medium' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 1 Quiz 1 — Inverse graphs', problems: [
          Q('The graph of y = f⁻¹(x) is obtained from y = f(x) by reflecting across', ['y = x', 'the x-axis', 'the y-axis', 'y = −x'], 'A'),
          Q('If (2, 5) lies on y = f(x), then a point on y = f⁻¹(x) is', ['(5, 2)', '(2, 5)', '(−2, 5)', '(2, −5)'], 'A'),
          Q('If f(4) = −1, then f⁻¹(−1) equals', ['4', '−1', '3', '−4'], 'A'),
          Q('The domain of f⁻¹ matches the ___ of f (when the inverse is a function).', ['range', 'domain', 'vertex', 'period'], 'A'),
          Q('To find f⁻¹ from y = f(x) algebraically, you usually', ['solve for x in terms of y', 'differentiate y', 'add 1 to both sides only', 'square y only'], 'A'),
          Q('For invertible f, f(f⁻¹(x)) simplifies to x when', ['both compositions are defined on the stated domains', 'x = 0 only', 'never', 'only if f is linear'], 'A'),
          Q('Points on y = f and y = f⁻¹ are symmetric about', ['y = x', 'the origin only', 'x = 1 only', 'y = 0 only'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 1 Quiz 2 — Composition', problems: [
          Q('(f ∘ g)(x) means', ['f(g(x))', 'g(f(x))', 'f(x) · g(x)', 'f(x) + g(x)'], 'A'),
          Q('If g(2) = 7 and f(7) = −3, then (f ∘ g)(2) =', ['−3', '7', '2', '4'], 'A'),
          Q('For f(x) = x² and g(x) = x + 1, (f ∘ g)(1) =', ['4', '2', '1', '0'], 'A'),
          Q('The domain of f ∘ g is most constrained by', ['where g is defined and g(x) lies in the domain of f', 'only constants', 'only f', 'only trigonometry'], 'A'),
          Q('In general, f ∘ g and g ∘ f are', ['not always equal', 'always equal', 'undefined', 'only equal at 0'], 'A'),
          Q('Composition applies the ___ function first.', ['inner', 'outer', 'larger', 'constant'], 'A'),
          Q('If f(x) = 2x + 1 and g(x) = 3x, (g ∘ f)(0) =', ['3', '1', '0', '6'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 1 Quiz 3 — Piecewise', problems: [
          Q('At a breakpoint between two rules, you evaluate using', ['the rule whose interval contains that x', 'always the first rule', 'the average', 'zero always'], 'A'),
          Q('A piecewise definition is useful when', ['the rule changes at thresholds', 'all models are global polynomials', 'never in applications', 'only for circles'], 'A'),
          Q('Let f(x) = x + 2 if x < 0 and f(x) = 2 if x ≥ 0. Then f(0) =', ['2', '0', '−2', '3'], 'A'),
          Q('The graph of a piecewise linear function can show', ['corners or jumps', 'only smooth curves', 'only hyperbolas', 'no segments'], 'A'),
          Q('The domain of a piecewise function is typically', ['the union of intervals where pieces are defined', 'only x > 0', '{0}', 'empty'], 'A'),
          Q('If two rules agree at an endpoint, the function can still be', ['continuous at that point', 'automatically undefined', 'never drawable', 'odd only'], 'A'),
          Q('Piecewise models often arise when', ['cost or rate changes after a limit', 'everything is quadratic', 'only with matrices', 'only in complex numbers'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 1 Quiz 4 — One-to-one', problems: [
          Q('The horizontal line test determines whether the graph represents a', ['one-to-one function', 'vertical asymptote', 'circle', 'system of equations'], 'A'),
          Q('If some horizontal line hits the graph twice, then f is', ['not one-to-one', 'strictly increasing', 'invertible without restriction', 'odd'], 'A'),
          Q('Restricting y = x² to x ≥ 0 makes the function', ['one-to-one on that domain', 'not a function', 'periodic', 'undefined'], 'A'),
          Q('The vertical line test checks whether a graph is', ['a function of x', 'one-to-one', 'invertible', 'continuous'], 'A'),
          Q('A strictly increasing function on an interval is', ['one-to-one on that interval', 'never one-to-one', 'always even', 'constant'], 'A'),
          Q('Without a one-to-one restriction, the “inverse” as a relation', ['may fail to be a function', 'is always linear', 'is always empty', 'is always quadratic'], 'A'),
          Q('A function that passes the HLT on its domain has', ['an inverse that is also a function (on matching ranges)', 'no inverse', 'only a complex inverse', 'determinant zero'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 1 Quiz 5 — Exp–log inverses', problems: [
          Q('For b > 0, b ≠ 1: log_b(b⁵) equals', ['5', 'b⁵', 'b', '1/5'], 'A'),
          Q('2^{log₂ 9} simplifies (for 9 in domain) to', ['9', '2', 'log₂ 2', '18'], 'A'),
          Q('log_5 1 equals', ['0', '1', '5', 'undefined always'], 'A'),
          Q('The natural logarithm ln x is log base', ['e', '10', '2', 'π'], 'A'),
          Q('If log₃ x = 2, then x equals', ['9', '6', '8', '3'], 'A'),
          Q('Exponential y = b^x and y = log_b x are', ['inverses on suitable domains', 'identical graphs', 'always parallel lines', 'unrelated'], 'A'),
          Q('For x > 0, e^{ln x} simplifies to', ['x', 'ln(e^x)', '0', '1/x'], 'A'),
        ]},
      ],
    },
    // ─── Unit 2 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 2: Exponential and logarithmic functions',
      chapterDescription: 'Laws, graphs, and equations with exponentials and logarithms.',
      topics: [
        {
          topicName: 'Exponential growth and decay',
          topicDescription: 'Base b > 0, b ≠ 1; initial value and multiplicative factor per step.',
          topicObjectives: [
            'Model quantities with P(t) = P₀·a^t and interpret a as growth/decay factor per unit time.',
            'Sketch qualitative behavior (increase vs decrease) using base size and initial value.',
          ],
        },
        {
          topicName: 'Logarithms: definition and meaning',
          topicDescription: 'log_b a is the exponent on b that produces a.',
          topicObjectives: [
            'Convert between logarithmic and exponential forms: b^c = a ⇔ log_b a = c.',
            'Evaluate basic logarithms and recognize domains that keep arguments positive.',
          ],
        },
        {
          topicName: 'Properties of logarithms',
          topicDescription: 'Product, quotient, power rules; change of base.',
          topicObjectives: [
            'Expand or combine logs using product, quotient, and power rules on valid domains.',
            'Use change-of-base when evaluating logs that do not simplify by inspection.',
          ],
        },
        {
          topicName: 'Solving exponential equations',
          topicDescription: 'Common bases; logarithms when bases differ.',
          topicObjectives: [
            'Match bases or take logs to solve equations like b^{kx} = c with positivity checks.',
            'Identify extraneous roots when domain restrictions are violated.',
          ],
        },
        {
          topicName: 'Solving logarithmic equations',
          topicDescription: 'Isolate the log; check arguments are positive.',
          topicObjectives: [
            'Combine logs, exponentiate, and verify every candidate satisfies argument > 0.',
            'Explain why squaring or exponentiating can introduce extraneous solutions.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Growth factor', question: 'In P = 1000·1.05^t, the factor per unit t is', options: ['0.05', '1.05', '1000', '5000'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Log meaning', question: 'log₃ 81 equals', options: ['3', '4', '9', '27'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Power law', question: 'log₂(x⁴) equals', options: ['4 log₂ x', 'log₂ x − 4', '(log₂ x)⁴', 'x log₂ 4'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Solve 2^x', question: '2^x = 32 gives x =', options: ['4', '5', '6', '3'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Domain', question: 'log(x − 2) is defined when', options: ['x > 2', 'x > 0', 'x < 2', 'all real x'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Quotient law', question: 'ln(a/b) equals', options: ['ln a − ln b', 'ln a + ln b', 'ln a / ln b', '(ln a)(ln b)'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Match bases', question: '9^x = 27 is usefully rewritten with base', options: ['3', '9', '2', '10'], correctAnswer: 0, difficulty: 'Medium' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 2 Quiz 1 — Growth & decay', problems: [
          Q('In growth P = P₀·a^t with a > 1, increasing t makes P', ['increase', 'decrease', 'stay constant', 'oscillate'], 'A'),
          Q('If a is between 0 and 1 in P = P₀·a^t, the model shows', ['exponential decay', 'exponential growth', 'linear growth always', 'no meaning'], 'A'),
          Q('5^N = 125 implies N =', ['3', '2', '4', '5'], 'A'),
          Q('As t → ∞, 0.9^t tends toward', ['0', '∞', '1', '−∞'], 'A'),
          Q('The initial value in P = 200·1.02^t is', ['200', '1.02', 't', '0.02'], 'A'),
          Q('Doubling time ideas pair naturally with', ['exponential growth', 'only quadratic decay', 'only trigonometric graphs', 'matrix inverses'], 'A'),
          Q('If b > 1, the graph y = b^x is', ['increasing', 'decreasing', 'constant', 'zero always'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 2 Quiz 2 — Log definition', problems: [
          Q('log_b a = c means', ['b^c = a', 'a^c = b', 'b = a^c', 'c = ab'], 'A'),
          Q('log_b 1 equals', ['0', '1', 'b', 'undefined always'], 'A'),
          Q('log_b b equals', ['1', '0', 'b²', '−1'], 'A'),
          Q('If b^x = c with b,c > 0 and b ≠ 1, then x =', ['log_b c', 'b^c', 'c/b', '1/c'], 'A'),
          Q('log₂ 8 equals', ['3', '2', '4', '1/3'], 'A'),
          Q('A logarithm answers which question?', ['power on base to reach the argument', 'slope of a line', 'radius of a circle', 'determinant of A'], 'A'),
          Q('The argument of log_b x must satisfy', ['x > 0', 'x ≠ 0 only', 'x < 0', 'no restriction'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 2 Quiz 3 — Log properties', problems: [
          Q('log₂(AB) equals', ['log₂ A + log₂ B', 'log₂ A · log₂ B', 'log₂(A+B)', 'log₂ A − log₂ B'], 'A'),
          Q('log₃(x⁵) equals', ['5 log₃ x', 'x log₃ 5', '(log₃ x)⁵', 'log₃ x − 5'], 'A'),
          Q('ln(x/y) equals', ['ln x − ln y', 'ln x + ln y', 'ln x / ln y', '(ln x)(ln y)'], 'A'),
          Q('Change-of-base: log_a x can be written as', ['ln x / ln a', 'ln a / ln x', 'ln(ax)', 'ln x · ln a'], 'A'),
          Q('log₄ 2 equals', ['1/2', '2', '4', '√2'], 'A'),
          Q('log_b(A^k) simplifies to', ['k log_b A', 'log_b A + k', '(log_b A)^k', 'k^A'], 'A'),
          Q('Combining log A + log B yields log of', ['AB', 'A+B', 'A/B', 'A^B'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 2 Quiz 4 — Exponential equations', problems: [
          Q('If 2^x = 32, then x =', ['5', '4', '6', '3'], 'A'),
          Q('If 9^x = 27, express both sides as powers of', ['3', '9', '2', '27'], 'A'),
          Q('If e^{2t} = 7, then 2t =', ['ln 7', 'e⁷', '7e', 'log₁₀ 2'], 'A'),
          Q('3^{2x−1} = 3⁴ implies', ['2x − 1 = 4', '2x = 4 only', 'x = 4 only', 'no relation'], 'A'),
          Q('Taking logarithms helps when', ['bases do not match cleanly', 'only lines appear', 'never', 'only for circles'], 'A'),
          Q('A solution making b^x negative with b > 0 is', ['impossible in ℝ', 'always valid', 'always x = 0', 'always x = 1'], 'A'),
          Q('If 4^x = 16, then x =', ['2', '4', '8', '1/2'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 2 Quiz 5 — Log equations', problems: [
          Q('log₅(x−4) requires', ['x − 4 > 0', 'x > 0 only', 'x < 4', 'no restriction'], 'A'),
          Q('If log x + log(x−3) = log 10, combine to log of', ['x(x−3)', 'x+(x−3)', '10x', '3x'], 'A'),
          Q('Exponentiating both sides can introduce', ['extraneous roots if domain was ignored', 'no issues ever', 'only imaginary answers', 'only matrix errors'], 'A'),
          Q('If ln(3m) = 2, then m equals', ['e²/3', 'e²', '3e²', '2/3'], 'A'),
          Q('A candidate making a log argument zero is', ['invalid', 'always best', 'always e', 'always 1'], 'A'),
          Q('If log₂(x−1) = 3, then x =', ['9', '8', '7', '4'], 'A'),
          Q('After solving log equations, you should', ['check every solution in the original', 'never check', 'only graph', 'assume all positive'], 'A'),
        ]},
      ],
    },
    // ─── Unit 3 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 3: Further trigonometric functions',
      chapterDescription: 'Radians, unit circle, graphs, inverse trig, reciprocal ratios (Natural stream).',
      topics: [
        {
          topicName: 'Radian measure and arc length',
          topicDescription: 'θ = s/r; convert degrees and radians.',
          topicObjectives: [
            'Convert between degrees and radians and use s = rθ in simple arc-length problems.',
            'Interpret radian measure as a ratio of arc length to radius on a circle.',
          ],
        },
        {
          topicName: 'Unit-circle sine and cosine',
          topicDescription: 'Coordinates on x² + y² = 1; reference angles.',
          topicObjectives: [
            'Read (cos θ, sin θ) from the unit circle using symmetry and reference angles.',
            'Evaluate sine and cosine at common angles in radians and degrees.',
          ],
        },
        {
          topicName: 'Graphing sine and cosine',
          topicDescription: 'Amplitude, period, midline; phase shift awareness.',
          topicObjectives: [
            'Identify amplitude, period, and midline for y = A sin(Bx + C) + D style graphs.',
            'Predict how parameters stretch, compress, or shift sinusoidal graphs.',
          ],
        },
        {
          topicName: 'Inverse trigonometric functions',
          topicDescription: 'Restricted domains; principal values.',
          topicObjectives: [
            'Apply arcsin / arccos / arctan on their principal ranges to solve basic equations.',
            'Recognize domain restrictions needed so inverse trig is a function.',
          ],
        },
        {
          topicName: 'Secant, cosecant, cotangent',
          topicDescription: 'Reciprocal ratios; basic identities.',
          topicObjectives: [
            'Express sec, csc, cot as reciprocals and locate where each is undefined.',
            'Use reciprocal and Pythagorean identities starting from sin²θ + cos²θ = 1.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Radians', question: 'π radians equals', options: ['90°', '180°', '360°', '60°'], correctAnswer: 1, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Unit circle', question: 'cos(π) equals', options: ['0', '1', '−1', '1/2'], correctAnswer: 2, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Period', question: 'Period of sin(2x) is', options: ['π', '2π', '4π', '1'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 3, title: 'arcsin', question: 'arcsin(1/2) in principal range is', options: ['π/6', 'π/3', 'π/4', 'π/2'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'sec', question: 'sec θ equals', options: ['1/cos θ', '1/sin θ', 'sin θ/cos θ', 'cos θ/sin θ'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'sin π/2', question: 'sin(π/2) =', options: ['1', '0', '−1', '1/2'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Amplitude', question: 'Amplitude of y = 5 cos x is', options: ['5', '10', '2π', '1'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 3 Quiz 1 — Radians & arcs', problems: [
          Q('π radians equals', ['180°', '90°', '360°', '60°'], 'A'),
          Q('Arc length with radius r and angle θ (radians) satisfies', ['s = rθ', 's = r/θ', 's = θ/r', 's = r²θ'], 'A'),
          Q('30° in radians is', ['π/6', 'π/4', 'π/3', 'π/2'], 'A'),
          Q('One complete revolution in radians is', ['2π', 'π', '4π', '1'], 'A'),
          Q('π/2 radians equals', ['90°', '45°', '180°', '30°'], 'A'),
          Q('If r = 4 and θ = π/2, arc length s equals', ['2π', 'π', '4π', '8'], 'A'),
          Q('60° in radians is', ['π/3', 'π/6', 'π/4', '2π'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 3 Quiz 2 — Unit circle', problems: [
          Q('On the unit circle, coordinates of angle θ are', ['(cos θ, sin θ)', '(sin θ, cos θ)', '(tan θ, sec θ)', '(θ, θ)'], 'A'),
          Q('cos(0) equals', ['1', '0', '−1', '1/2'], 'A'),
          Q('sin(π/2) equals', ['1', '0', '−1', '1/2'], 'A'),
          Q('For θ in QI, the reference angle equals', ['θ', 'π − θ', 'θ − π', '2π − θ'], 'A'),
          Q('cos(π/3) equals', ['1/2', '√3/2', '√2/2', '1'], 'A'),
          Q('sin(π) equals', ['0', '1', '−1', '1/2'], 'A'),
          Q('sin²θ + cos²θ equals', ['1', '0', 'tan θ', 'sec θ'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 3 Quiz 3 — Graphs', problems: [
          Q('Period of sin(x) is', ['2π', 'π', '4π', '1'], 'A'),
          Q('Amplitude of y = 3 sin x is', ['3', '6', '2π', '1'], 'A'),
          Q('Period of sin(4x) is', ['π/2', '2π', '4π', '8π'], 'A'),
          Q('Midline of y = 2 sin x + 5 is', ['y = 5', 'y = 2', 'y = 0', 'y = 7'], 'A'),
          Q('Compared with sin x, sin(x − π/4) is shifted', ['right π/4', 'left π/4', 'up π/4', 'down π/4'], 'A'),
          Q('The graph y = cos x starts at height', ['1', '0', '−1', 'π'], 'A'),
          Q('As period increases, frequency', ['decreases', 'increases', 'stays fixed always', 'becomes imaginary'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 3 Quiz 4 — Inverse trig', problems: [
          Q('arcsin(x) outputs an angle whose sine is', ['x (on the principal range)', 'always π/2', '1 always', 'undefined'], 'A'),
          Q('A common principal range for arcsin is', ['[−π/2, π/2]', '[0, π]', '[0, 2π]', 'all ℝ'], 'A'),
          Q('arccos(0) equals', ['π/2', '0', 'π', '−π/2'], 'A'),
          Q('If sin θ = 1/2 and θ is the principal arcsin value, θ =', ['π/6', '5π/6', 'π/3', 'π/4'], 'A'),
          Q('arctan is often defined on the open interval', ['(−π/2, π/2)', '[0, π]', '[−π, π]', 'all ℝ'], 'A'),
          Q('sin(arcsin x) equals x when', ['x is in [−1, 1]', 'always', 'never', 'only for x > 1'], 'A'),
          Q('Domain of y = arcsin x is', ['[−1, 1]', 'ℝ', '(0, ∞)', '(−∞, 0)'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 3 Quiz 5 — Reciprocal trig', problems: [
          Q('sec θ equals', ['1/cos θ', '1/sin θ', 'sin θ/cos θ', 'cos θ/sin θ'], 'A'),
          Q('csc θ equals', ['1/sin θ', '1/cos θ', 'sin θ/cos θ', 'cos θ/sin θ'], 'A'),
          Q('cot θ equals', ['cos θ/sin θ', 'sin θ/cos θ', '1/sin θ', '1/cos θ'], 'A'),
          Q('sec θ is undefined when', ['cos θ = 0', 'sin θ = 0', 'tan θ = 0', 'never'], 'A'),
          Q('Identity: 1 + tan²θ equals', ['sec²θ', 'csc²θ', 'cot²θ', 'sin²θ'], 'A'),
          Q('cot θ is undefined when', ['sin θ = 0', 'cos θ = 0', 'tan θ = 0', 'never'], 'A'),
          Q('If cos θ = 1/2 with acute θ, sec θ =', ['2', '1/2', '√3/2', '√3'], 'A'),
        ]},
      ],
    },
    // ─── Unit 4 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 4: Coordinate geometry and conic sections',
      chapterDescription: 'Circle, parabola, ellipse, hyperbola.',
      topics: [
        {
          topicName: 'Distance, midpoint, and line tools',
          topicDescription: 'Set up coordinates for conic problems.',
          topicObjectives: [
            'Use distance and midpoint formulas to set up standard conic equations.',
            'Relate slope and perpendicularity to axis alignment in coordinate proofs.',
          ],
        },
        {
          topicName: 'The circle',
          topicDescription: 'Standard form (x − h)² + (y − k)² = r².',
          topicObjectives: [
            'Read center and radius from standard form and convert by completing the square when needed.',
            'Check geometric constraints (radius positive, real center) in problem setups.',
          ],
        },
        {
          topicName: 'The parabola',
          topicDescription: 'Vertex form; focus and directrix ideas.',
          topicObjectives: [
            'Identify vertex and opening direction from vertex form y = a(x − h)² + k or x = a(y − k)² + h.',
            'Connect focal width ideas to the coefficient a at an introductory level.',
          ],
        },
        {
          topicName: 'The ellipse',
          topicDescription: 'Major/minor axes; standard form essentials.',
          topicObjectives: [
            'Identify semi-major and semi-minor axes from x²/a² + y²/b² = 1 (axis-aligned case).',
            'Locate x- and y-intercepts from the standard equation.',
          ],
        },
        {
          topicName: 'The hyperbola',
          topicDescription: 'x² − y² = 1 model; asymptote intuition.',
          topicObjectives: [
            'Recognize standard form x²/a² − y²/b² = 1 and asymptote lines y = ±(b/a)x (intro).',
            'Distinguish hyperbola from ellipse by sign pattern in the quadratic terms.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Distance', question: 'Distance from (0,0) to (3,4) equals', options: ['5', '7', '12', '25'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Circle radius', question: 'x² + y² = 49 has radius', options: ['7', '49', '√7', '14'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Parabola vertex', question: 'Vertex of y = (x − 2)² + 3 is', options: ['(2, 3)', '(−2, 3)', '(2, −3)', '(3, 2)'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Ellipse intercepts', question: 'x²/9 + y²/4 = 1 meets the x-axis at', options: ['±3', '±2', '±9', '±4'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Hyperbola asymptotes', question: 'For x²/4 − y²/9 = 1, asymptotes include y =', options: ['(3/2)x', '(2/3)x', '4x/9', '±9/4'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 0, title: 'Midpoint', question: 'Midpoint of (0,0) and (4,6) is', options: ['(2, 3)', '(4, 6)', '(3, 2)', '(6, 4)'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Center', question: '(x − 1)² + (y + 2)² = 25 has center', options: ['(1, −2)', '(−1, 2)', '(1, 2)', '(−1, −2)'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 4 Quiz 1 — Distance & lines', problems: [
          Q('Distance from (1, 2) to (4, 6) equals', ['5', '7', '10', '25'], 'A'),
          Q('Midpoint of (−2, 4) and (4, 0) is', ['(1, 2)', '(3, 4)', '(0, 2)', '(6, −4)'], 'A'),
          Q('Slope of the line through (0, 0) and (2, 8) is', ['4', '1/4', '8', '2'], 'A'),
          Q('Two non-vertical lines are perpendicular when slopes multiply to', ['−1', '1', '0', '2'], 'A'),
          Q('The distance formula uses', ['square root of (Δx)² + (Δy)²', 'Δx + Δy', 'Δx·Δy', 'only Δx'], 'A'),
          Q('If three points are collinear, triangle “area” from coordinates is often', ['0', 'positive always', 'always 1', 'undefined only'], 'A'),
          Q('Point-slope form captures', ['a line through a point with known slope', 'a circle center', 'parabola focus only', 'matrix rank'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 4 Quiz 2 — Circles', problems: [
          Q('(x − 3)² + (y + 1)² = 16 has radius', ['4', '16', '√16 if misread as 4²', '8'], 'A'),
          Q('x² + y² = 100 has center', ['(0, 0)', '(10, 0)', '(0, 10)', '(10, 10)'], 'A'),
          Q('To write x² + y² + 6x in standard circle form, you often', ['complete the square in x', 'factor y only', 'differentiate', 'assume r = 0'], 'A'),
          Q('A radius must be', ['positive (real circle)', 'negative preferred', 'imaginary', 'zero always'], 'A'),
          Q('Circle (x − h)² + (y − k)² = r² has center', ['(h, k)', '(−h, −k)', '(r, r)', '(0, r)'], 'A'),
          Q('If (x − 2)² + (y − 5)² = 0, the “circle” degenerates to', ['the point (2, 5)', 'a line', 'empty', 'radius 2'], 'A'),
          Q('Distance from center to a point on the circle equals', ['the radius', 'the diameter always', 'π', 'area'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 4 Quiz 3 — Parabolas', problems: [
          Q('y = (x − 1)² + 7 has vertex', ['(1, 7)', '(−1, 7)', '(1, −7)', '(7, 1)'], 'A'),
          Q('If a > 0 in y = a(x − h)² + k, the parabola opens', ['up', 'down', 'left', 'right always'], 'A'),
          Q('x = (y − 2)² + 3 opens to the', ['right', 'left', 'up', 'down'], 'A'),
          Q('Vertex form makes the vertex visible as', ['(h, k)', '(a, b) from FOIL mistake', '(0, 0) always', '(r, 0)'], 'A'),
          Q('Compared to y = x², y = 4x² is', ['narrower', 'wider', 'identical always', 'not a parabola'], 'A'),
          Q('The axis of symmetry of y = a(x − h)² + k is', ['x = h', 'y = k', 'y = x', 'x = 0 always'], 'A'),
          Q('Expanding vertex form is useful when', ['you need standard polynomial form', 'you need radius', 'finding log domain', 'inverting matrices only'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 4 Quiz 4 — Ellipses', problems: [
          Q('For x²/25 + y²/9 = 1, x-intercepts are at', ['±5', '±3', '±25', '±9'], 'A'),
          Q('For x²/a² + y²/b² = 1 with a > b > 0, major axis lies along', ['the x-axis', 'the y-axis always', 'y = x', 'none'], 'A'),
          Q('Sum of distances definition characterizes', ['an ellipse (two foci)', 'a hyperbola', 'a parabola only', 'a line'], 'A'),
          Q('On x²/16 + y²/4 = 1, y² cannot exceed', ['4', '16', '0', '64'], 'A'),
          Q('Compared with a circle, a (non-circular) ellipse has', ['two distinct semi-axis lengths', 'always one focus', 'no equation', 'infinite radius'], 'A'),
          Q('If denominators were equal in x²/A + y²/A = 1, you get', ['a circle', 'a hyperbola always', 'parallel lines', 'no graph'], 'A'),
          Q('The numbers a and b describe', ['half-axis lengths (axis-aligned form)', 'slopes only', 'log bases only', 'matrix rank'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 4 Quiz 5 — Hyperbolas', problems: [
          Q('x²/4 − y²/9 = 1 opens left–right with transverse axis on', ['the x-axis', 'the y-axis', 'y = x', 'origin only'], 'A'),
          Q('Asymptotes of x²/a² − y²/b² = 1 include', ['y = ±(b/a)x', 'y = ±(a/b)x always wrong ordering', 'y = ±abx', 'y = 0 only'], 'A'),
          Q('Compared with an ellipse, hyperbola standard form has', ['a minus between squared terms', 'only plus signs', 'no squared terms', 'only one variable'], 'A'),
          Q('The curve xy = k (k ≠ 0) is also a hyperbola in rotated position — still', ['a conic section', 'always a circle', 'always an ellipse', 'not algebraic'], 'A'),
          Q('For hyperbola x²/a² − y²/b² = 1, foci satisfy (with c > 0)', ['c² = a² + b²', 'c² = a² − b²', 'c = a + b always', 'c = ab'], 'A'),
          Q('Branches of x²/a² − y²/b² = 1 approach', ['the asymptote lines', 'the origin only', 'y-axis only', 'no lines'], 'A'),
          Q('Hyperbola x²/1 − y²/1 = 1 has asymptotes', ['y = ±x', 'y = ±2x', 'y = 0', 'x = 0 only'], 'A'),
        ]},
      ],
    },
    // ─── Unit 5 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 5: Complex numbers',
      chapterDescription: 'ℂ: operations, conjugate, modulus, Argand plane, polar view.',
      topics: [
        {
          topicName: 'Imaginary unit and a + bi',
          topicDescription: 'i² = −1; real and imaginary parts.',
          topicObjectives: [
            'Perform arithmetic with i and write results in standard form a + bi.',
            'Simplify powers of i using the repeating cycle i, −1, −i, 1.',
          ],
        },
        {
          topicName: 'Argand diagram and modulus',
          topicDescription: 'Plot a + bi; |z| = √(a² + b²).',
          topicObjectives: [
            'Plot complex numbers and interpret |z| as distance from the origin.',
            'Use modulus to reason about magnitudes in multiplication (intro).',
          ],
        },
        {
          topicName: 'Addition and multiplication',
          topicDescription: 'Like parts; expand with i² = −1.',
          topicObjectives: [
            'Add/subtract by combining real and imaginary parts.',
            'Multiply by expanding and replacing i² with −1.',
          ],
        },
        {
          topicName: 'Conjugate and division',
          topicDescription: 'a − bi; rationalize denominators.',
          topicObjectives: [
            'Use z̄ to compute |z|² and rationalize denominators in complex fractions.',
            'Verify (a + bi)(a − bi) is real and nonnegative.',
          ],
        },
        {
          topicName: 'Polar form and rotation (intro)',
          topicDescription: 're^{iθ}; multiply rotates and scales.',
          topicObjectives: [
            'Represent z = a + bi in polar form r(cos θ + i sin θ) in basic cases.',
            'Interpret multiplication by e^{iθ} as rotation by θ (conceptual link).',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'i²', question: 'i² equals', options: ['−1', '1', 'i', '0'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: '|z|', question: '|3 + 4i| equals', options: ['5', '7', '12', '25'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Multiply', question: '(1 + i)² equals', options: ['2i', '2', '−2i', '0'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Conjugate', question: 'Conjugate of 2 − 5i is', options: ['2 + 5i', '−2 − 5i', '5 − 2i', '−2 + 5i'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Polar r', question: 'For z = 1 + i, |z| equals', options: ['√2', '2', '1', '√3'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 0, title: 'Add', question: '(2 + i) + (1 − 3i) =', options: ['3 − 2i', '3 + 2i', '1 − 2i', '1 + 4i'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'i³', question: 'i³ equals', options: ['−i', 'i', '1', '−1'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 5 Quiz 1 — Imaginary unit', problems: [
          Q('i² equals', ['−1', '1', 'i', '0'], 'A'),
          Q('i⁴ equals', ['1', '−1', 'i', '−i'], 'A'),
          Q('Real part of 7 − 3i is', ['7', '−3', '3', 'i'], 'A'),
          Q('Imaginary part of 7 − 3i is', ['−3', '7', '3', '7i'], 'A'),
          Q('Standard form groups as', ['a + bi', 'only bi', 'only a', '(a, b) vector only always'], 'A'),
          Q('Powers of i repeat every', ['4', '2', '3', '∞'], 'A'),
          Q('5i is', ['pure imaginary', 'pure real', 'zero', 'undefined'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 5 Quiz 2 — Modulus & Argand', problems: [
          Q('|a + bi| equals', ['√(a² + b²)', 'a + b', 'a² + b²', '|a| + |b| always'], 'A'),
          Q('|−5| as a complex number equals', ['5', '−5', '0', '25'], 'A'),
          Q('Point (a, b) in ℝ² matches complex', ['a + bi', 'b + ai always', 'ai only', 'a − bi always'], 'A'),
          Q('|z| is distance from z to', ['0', '1', 'i', '∞'], 'A'),
          Q('|zw| relates to |z| and |w| by', ['|z| · |w|', '|z| + |w| always', 'max(|z|, |w|)', '|z| − |w| always'], 'A'),
          Q('If |z| = 0 then z', ['must be 0', 'must be 1', 'must be i', 'is undefined'], 'A'),
          Q('Quadrant of 2 − 3i in Argand plane is', ['IV', 'I', 'II', 'III'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 5 Quiz 3 — Operations', problems: [
          Q('(1 + i)(1 − i) equals', ['2', '0', '1', '2i'], 'A'),
          Q('(2 + 3i) + (4 − i) equals', ['6 + 2i', '6 − 2i', '2 + 4i', '8 + 4i'], 'A'),
          Q('Multiply: i(5 − i) equals', ['1 + 5i', '5i − 1', '5i + 1', '−1 + 5i'], 'A'),
          Q('To FOIL (a + bi)(c + di) you use', ['distributive property twice', 'only matrix multiply', 'only trig', 'only logs'], 'A'),
          Q('After multiplying, always replace i² with', ['−1', '1', 'i', '0'], 'A'),
          Q('(3i)(−2i) equals', ['6', '−6', '6i', '−6i'], 'A'),
          Q('Real times complex keeps', ['both components scaled sensibly', 'only imaginary part', 'always zero', 'undefined'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 5 Quiz 4 — Conjugate & division', problems: [
          Q('Conjugate of x + iy is', ['x − iy', '−x + iy', 'y + ix', '−x − iy'], 'A'),
          Q('z · z̄ equals', ['|z|² (real)', '2 Re(z)', 'Im(z)', 'i|z|'], 'A'),
          Q('To divide by a + bi, multiply top and bottom by', ['a − bi (conjugate)', 'a + bi again', 'i only', 'zero'], 'A'),
          Q('If denominator is real, division', ['splits real and imaginary parts', 'impossible', 'always gives 0', 'requires logs'], 'A'),
          Q('Conjugate of a product satisfies (zw)̄ =', ['z̄ · w̄', 'z̄ + w̄', 'z/w̄', 'z̄ − w̄'], 'A'),
          Q('1/i simplifies (multiply by i/i) to', ['−i', 'i', '1', '−1'], 'A'),
          Q('Rationalizing avoids', ['imaginary denominators in standard form', 'real numerators', 'modulus', 'Argand plot'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 5 Quiz 5 — Polar & rotation', problems: [
          Q('Polar form r(cos θ + i sin θ) has modulus', ['r', 'θ', 'rθ', 'cos θ'], 'A'),
          Q('Multiplying two complex numbers in polar form multiplies moduli and', ['adds angles', 'subtracts angles always', 'multiplies angles', 'ignores angles'], 'A'),
          Q('For z on the unit circle, |z| equals', ['1', '0', 'θ', 'π'], 'A'),
          Q('e^{iθ} is a convenient notation for', ['unit-magnitude complex on angle θ', 'only real θ', 'matrix exponential only here', 'log base e only'], 'A'),
          Q('Rotation by 90° counterclockwise multiplies by', ['i', '−i', '1', '−1'], 'A'),
          Q('De Moivre ideas connect polar form to', ['powers and roots of complex numbers', 'only circles in ℝ²', 'only determinants', 'only vectors'], 'A'),
          Q('If z = r e^{iθ}, then |z| =', ['r', 'e^r', 'θ', 'rθ'], 'A'),
        ]},
      ],
    },
    // ─── Unit 6 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 6: Matrices and determinants',
      chapterDescription: 'Operations, determinants, inverses, systems.',
      topics: [
        {
          topicName: 'Matrices: terminology',
          topicDescription: 'Rows, columns, dimensions, equality.',
          topicObjectives: [
            'Read off dimensions m×n and locate entries a_{ij} in small examples.',
            'Identify when two matrices can be equal (matching size and all entries).',
          ],
        },
        {
          topicName: 'Matrix multiplication',
          topicDescription: 'Inner dimensions must match; AB ≠ BA in general.',
          topicObjectives: [
            'Multiply compatible matrices using row-by-column dot products.',
            'Explain why commutativity fails with a simple 2×2 counterexample.',
          ],
        },
        {
          topicName: 'Determinants',
          topicDescription: '2×2: ad − bc; 3×3 expansion patterns.',
          topicObjectives: [
            'Compute 2×2 determinants and interpret det A = 0 as singularity (intro).',
            'Set up 3×3 expansion along a chosen row or column when required.',
          ],
        },
        {
          topicName: 'Inverse of a square matrix',
          topicDescription: 'AA⁻¹ = I when det A ≠ 0.',
          topicObjectives: [
            'State invertibility in terms of nonzero determinant for small cases.',
            'Verify proposed inverses by checking AA⁻¹ = I.',
          ],
        },
        {
          topicName: 'Systems and determinant methods',
          topicDescription: 'Inverse matrix method; Cramer-style setup.',
          topicObjectives: [
            'Write a linear system as Ax = b and interpret solution via inverse when it exists.',
            'Recognize Cramer’s rule setup replacing columns for each unknown (intro).',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Size', question: 'A 3×2 matrix has how many entries?', options: ['6', '5', '3', '2'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Multiply sizes', question: 'If A is 2×3 and B is 3×2, AB is', options: ['2×2', '3×3', '2×3', 'undefined'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 2, title: 'det 2×2', question: 'det[[1, 2], [3, 4]] =', options: ['−2', '2', '10', '4'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Inverse', question: 'Inverse of [[1, 2], [0, 1]] is', options: ['[[1, −2], [0, 1]]', '[[1, 2], [0, 1]]', '[[−1, 2], [0, −1]]', '[[1, 0], [2, 1]]'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'System', question: 'If det A ≠ 0 for square A, then Ax = b has', options: ['a unique solution (for invertible A)', 'no solution always', 'infinitely many always', 'only x = 0'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 2, title: 'Singular', question: 'det A = 0 means A is', options: ['singular (non-invertible)', 'always invertible', 'identity', 'orthogonal'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'I×A', question: 'For matching sizes, I·A =', options: ['A', '0', 'Aᵀ', 'det A'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 6 Quiz 1 — Terminology', problems: [
          Q('A row vector can be viewed as a', ['1×n matrix', 'n×1 matrix always', 'scalar only', '3×3 matrix'], 'A'),
          Q('Entry a₂₃ sits in row', ['2', '3', '23', '5'], 'A'),
          Q('A square matrix has', ['equal number of rows and columns', 'always two rows', 'zero rows', 'no diagonal'], 'A'),
          Q('Matrix addition requires', ['same dimensions', 'only same number of rows', 'only same number of columns', 'no requirements'], 'A'),
          Q('Zero matrix of same size as A satisfies A + 0 =', ['A', '0 only', 'I', 'det A'], 'A'),
          Q('Transpose swaps', ['rows and columns', 'signs only', 'determinants only', 'nothing'], 'A'),
          Q('Identity Iₙ has ones on', ['main diagonal', 'anti-diagonal only', 'every entry', 'last row only'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 6 Quiz 2 — Multiplication', problems: [
          Q('If A is m×n and B is n×p, then AB is', ['m×p', 'n×n', 'm×n', 'p×m'], 'A'),
          Q('(AB)_{ij} is computed with dot product of row i of A and', ['column j of B', 'row j of B', 'full matrix B', 'vector b'], 'A'),
          Q('In general AB and BA are', ['not always equal', 'always equal', 'always undefined', 'always zero'], 'A'),
          Q('If inner dimensions mismatch, product AB is', ['undefined', 'always defined', 'always I', 'always zero'], 'A'),
          Q('Scalar multiplication multiplies', ['every entry', 'only diagonal', 'only first row', 'determinant only'], 'A'),
          Q('Matrix multiplication distributes over addition when', ['dimensions line up legally', 'never', 'always without checks', 'only for vectors'], 'A'),
          Q('If A is 2×3 and B is 2×3, AB', ['is undefined', 'is 2×2', 'is 3×3', 'equals BA'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 6 Quiz 3 — Determinants', problems: [
          Q('For [[a,b],[c,d]], determinant is', ['ad − bc', 'ad + bc', 'a+d', 'ab − cd'], 'A'),
          Q('If det A = 0 for square A, then A is', ['singular', 'invertible', 'orthogonal', 'always I'], 'A'),
          Q('det([[2,0],[0,3]]) equals', ['6', '5', '0', '1'], 'A'),
          Q('Swapping two rows typically', ['changes sign of determinant', 'leaves determinant unchanged always', 'always makes det 0', 'only affects trace'], 'A'),
          Q('det(I) for n×n I equals', ['1', 'n', '0', '−1'], 'A'),
          Q('If a row is all zeros, determinant is', ['0', '1', 'undefined', 'equal to trace'], 'A'),
          Q('For 3×3 det, expansion uses', ['2×2 minors (Laplace idea)', 'only summing diagonals blindly', 'only eigenvalues', 'no pattern'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 6 Quiz 4 — Inverse', problems: [
          Q('If A⁻¹ exists, then A A⁻¹ =', ['I', '0', 'A', 'Aᵀ'], 'A'),
          Q('A 2×2 inverse exists exactly when determinant is', ['nonzero', 'zero', '1 only', '2 only'], 'A'),
          Q('If AB = I and BA = I for square matrices, then', ['B is A⁻¹', 'A must be zero', 'A is not square', 'det A = 0'], 'A'),
          Q('Inverse interacts with product by (AB)⁻¹ =', ['B⁻¹A⁻¹', 'A⁻¹B⁻¹ always', 'AB', 'BA'], 'A'),
          Q('Elementary row operations connect to inverses by', ['representing reversible steps', 'only changing trace', 'only scaling det without meaning', 'removing rank'], 'A'),
          Q('Solving Ax = b with inverse uses', ['x = A⁻¹b', 'x = bA⁻¹ always', 'x = det b', 'x = Aᵀb only'], 'A'),
          Q('If det A = 0, then A⁻¹', ['does not exist', 'always exists', 'equals I', 'equals 0'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 6 Quiz 5 — Systems', problems: [
          Q('Ax = b is linear because unknowns appear', ['to first power without products xᵢxⱼ', 'as exponentials', 'inside logs', 'as reciprocals only'], 'A'),
          Q('If A invertible, unique solution x =', ['A⁻¹b', 'bA⁻¹', 'det(A)·b', 'Ab'], 'A'),
          Q('Cramer’s rule replaces columns in', ['the coefficient matrix pattern', 'only vector b alone', 'identity matrix only', 'zero matrix'], 'A'),
          Q('Homogeneous Ax = 0 always has', ['at least the trivial solution x = 0', 'no solutions', 'unique nontrivial always', 'imaginary solutions only'], 'A'),
          Q('If det A = 0, Ax = 0 can have', ['infinitely many solutions (non-trivial nullspace)', 'only trivial', 'no solutions always', 'unique nonzero'], 'A'),
          Q('A system is consistent when', ['there is at least one solution', 'det = 0 only', 'always inconsistent', 'rank is zero'], 'A'),
          Q('Matrix method packages many equations into', ['one compact matrix equation', 'only parabolas', 'only trig', 'only complex division'], 'A'),
        ]},
      ],
    },
    // ─── Unit 7 ─────────────────────────────────────────────────────────────
    {
      chapterName: 'Unit 7: Vectors and transformation of the plane',
      chapterDescription: 'Components, dot product, matrix view of transformations (Natural stream).',
      topics: [
        {
          topicName: 'Vectors and components',
          topicDescription: 'Geometric vector ↔ ⟨v₁, v₂⟩.',
          topicObjectives: [
            'Switch between arrow pictures and component notation ⟨v₁, v₂⟩.',
            'Compute displacement vectors from coordinates of endpoints.',
          ],
        },
        {
          topicName: 'Vector addition',
          topicDescription: 'Parallelogram and head-to-tail; component sum.',
          topicObjectives: [
            'Add vectors component-wise and interpret geometrically (parallelogram / head-to-tail).',
            'Model net effects (e.g., combined displacements) as vector sums.',
          ],
        },
        {
          topicName: 'Scalar multiplication and unit vectors',
          topicDescription: 'Scale length; direction vectors.',
          topicObjectives: [
            'Stretch or reverse a vector by scalar multiplication and relate |cv| to |v|.',
            'Produce unit vectors in a chosen direction when v ≠ 0.',
          ],
        },
        {
          topicName: 'Dot product',
          topicDescription: 'u · v and geometric meaning.',
          topicObjectives: [
            'Compute u · v from components and interpret sign in terms of angle (acute/obtuse).',
            'Use u · v = 0 as a perpendicularity test for nonzero plane vectors.',
          ],
        },
        {
          topicName: 'Linear transformations (intro)',
          topicDescription: 'Matrix × vector; examples on the plane.',
          topicObjectives: [
            'Apply a 2×2 matrix to a column vector and read off the image coordinates.',
            'Recognize basic examples: rotation, reflection, shear as matrix actions.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Components', question: 'Vector from (1, 2) to (4, 6) is', options: ['⟨3, 4⟩', '⟨4, 6⟩', '⟨5, 8⟩', '⟨−3, −4⟩'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Add', question: '⟨1, 2⟩ + ⟨3, −1⟩ =', options: ['⟨4, 1⟩', '⟨2, 3⟩', '⟨4, −1⟩', '⟨3, 1⟩'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Scalar', question: '3⟨2, −1⟩ =', options: ['⟨6, −3⟩', '⟨5, 2⟩', '⟨2, −3⟩', '⟨6, 3⟩'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Dot', question: '⟨1, 0⟩ · ⟨0, 1⟩ =', options: ['0', '1', '−1', 'i'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Map', question: '[[0, −1], [1, 0]] · [1, 0] equals column', options: ['[0, 1]', '[1, 0]', '[−1, 0]', '[0, −1]'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 0, title: 'Length', question: 'Length of ⟨3, 4⟩ equals', options: ['5', '7', '12', '25'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Unit', question: 'Unit vector in direction ⟨3, 4⟩ is', options: ['⟨3/5, 4/5⟩', '⟨3, 4⟩', '⟨4/5, 3/5⟩', '⟨1/3, 1/4⟩'], correctAnswer: 0, difficulty: 'Medium' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 7 Quiz 1 — Components', problems: [
          Q('A vector in the plane can be written as', ['⟨v₁, v₂⟩', 'only a single number', 'only a matrix', 'only i'], 'A'),
          Q('Displacement from P to Q uses', ['coordinates of Q minus P', 'P plus Q always', 'only distance formula squaring wrong order', 'cross product'], 'A'),
          Q('Standard basis vector in x-direction is often', ['⟨1, 0⟩', '⟨0, 1⟩', '⟨1, 1⟩', '⟨0, 0⟩'], 'A'),
          Q('Vectors that differ by a positive scalar multiple have', ['same direction (opposite if scalar negative)', 'always equal', 'always perpendicular', 'zero length'], 'A'),
          Q('The zero vector has length', ['0', '1', 'undefined', 'i'], 'A'),
          Q('Column form [v₁, v₂] matches', ['⟨v₁, v₂⟩ in common textbooks', 'only row vectors', 'only 3D', 'only complex'], 'A'),
          Q('Translating a segment by vector v adds', ['v to every point', 'only first point', 'det v', 'length only'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 7 Quiz 2 — Addition', problems: [
          Q('⟨a, b⟩ + ⟨c, d⟩ equals', ['⟨a+c, b+d⟩', '⟨ac, bd⟩', '⟨a−c, b−d⟩', '⟨a+d, b+c⟩'], 'A'),
          Q('Head-to-tail addition closes when', ['the sum reaches the final head', 'always fails', 'only for 3D', 'only if det = 0'], 'A'),
          Q('Parallelogram rule builds sum from', ['adjacent sides as vectors', 'circle diameter only', 'matrix inverse only', 'complex conjugate'], 'A'),
          Q('Vector subtraction u − v equals', ['u + (−1)v', 'v − u always', 'u · v', '|u − v| only'], 'A'),
          Q('Associativity of vector addition is', ['true', 'false', 'only in 1D', 'only for unit vectors'], 'A'),
          Q('Commutativity u + v = v + u is', ['true', 'false', 'only if perpendicular', 'only for zero'], 'A'),
          Q('The opposite of ⟨3, −2⟩ is', ['⟨−3, 2⟩', '⟨3, 2⟩', '⟨−3, −2⟩', '⟨2, −3⟩'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 7 Quiz 3 — Scalars & unit vectors', problems: [
          Q('|k v| for real k scales length by', ['|k| · |v|', 'k + |v|', 'k^|v|', 'always 1'], 'A'),
          Q('If k < 0, k v points', ['opposite to v', 'same as v', 'perpendicular always', 'zero always'], 'A'),
          Q('A unit vector has length', ['1', '0', '√2 always', 'undefined'], 'A'),
          Q('To unitize v ≠ 0, divide v by', ['|v|', 'det v', 'trace v', 'v·v mistake as length'], 'A'),
          Q('2v doubles', ['the length of v', 'only angle', 'dot product with itself only', 'matrix rank'], 'A'),
          Q('Parallel vectors satisfy v = t u for some', ['scalar t', 'matrix t always', 'complex t only', 'never'], 'A'),
          Q('0·v equals', ['zero vector', 'v', 'unit vector', 'undefined'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 7 Quiz 4 — Dot product', problems: [
          Q('u · v for u=⟨u₁,u₂⟩, v=⟨v₁,v₂⟩ equals', ['u₁v₁ + u₂v₂', 'u₁v₂ + u₂v₁ always', 'u₁+v₁', 'det(u,v)'], 'A'),
          Q('If u · v = 0 for nonzero plane vectors, they are', ['perpendicular', 'parallel always', 'identical', 'undefined'], 'A'),
          Q('u · u equals', ['|u|²', '|u|', '0', 'det u'], 'A'),
          Q('Dot product is commutative: u · v =', ['v · u', '− v · u', 'u × v', 'det(u,v)'], 'A'),
          Q('For angle θ between u and v, u·v relates to cos θ by', ['|u||v| cos θ', '|u||v| sin θ', 'tan θ', 'sec θ'], 'A'),
          Q('Projection concept uses dot product to measure', ['component of one vector along another', 'only cross area', 'only complex parts', 'determinant only'], 'A'),
          Q('⟨1,2⟩·⟨−2,1⟩ equals', ['0', '4', '−4', '5'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 7 Quiz 5 — Linear maps', problems: [
          Q('Applying 2×2 matrix M to vector v means computing', ['M v (matrix times column)', 'v M always', 'det(Mv)', 'M + v'], 'A'),
          Q('The origin is fixed by a linear map represented by M because', ['M0 = 0', 'M is I always', 'det M = 0', 'maps never fix origin'], 'A'),
          Q('A shear matrix [[1,k],[0,1]] maps ⟨x,y⟩ to', ['⟨x+ky, y⟩', '⟨x, y+kx⟩ always wrong unless transpose view', '⟨kx, y⟩', '⟨x, ky⟩'], 'A'),
          Q('Rotation matrices preserve', ['lengths of vectors (orthogonal matrices)', 'always areas negatively only', 'nothing', 'only parallel lines to x-axis'], 'A'),
          Q('Reflection across x-axis uses matrix approximately', ['[[1,0],[0,−1]]', '[[−1,0],[0,1]]', '[[0,1],[1,0]]', '[[0,0],[0,0]]'], 'A'),
          Q('Composition of maps corresponds to', ['matrix multiplication order carefully', 'matrix addition', 'dot only', 'complex conjugation'], 'A'),
          Q('Linear maps send lines through the origin to', ['lines through the origin', 'circles always', 'parabolas', 'empty sets'], 'A'),
        ]},
      ],
    },
  ],
};
