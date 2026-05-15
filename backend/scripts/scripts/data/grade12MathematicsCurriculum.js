/**
 * Grade 12 Mathematics — Natural stream:
 * sequences & series; limits & continuity; derivatives & applications; integral calculus;
 * vectors & solid geometry in space; proof & mathematical induction.
 *
 * Same seed pattern as Grades 9–11: curated chapter exercises, one quiz per topic (7 problems),
 * five entrance-exam-style MCQs per topic from grade12ExamQuestions.js.
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
  gradeLevel: '12',
  subjectName: 'Mathematics',
  stream: 'Natural',
  subjectDescription:
    'Grade 12 Mathematics (Natural stream): precalculus finishing with introductory calculus & proof.',

  chapters: [
    {
      chapterName: 'Unit 1: Sequences and series',
      chapterDescription: 'Arithmetic and geometric patterns, partial sums, sigma notation, convergence preview.',
      topics: [
        {
          topicName: 'Arithmetic sequences (nth term)',
          topicDescription: 'Common difference d; aₙ = a₁ + (n−1)d.',
          topicObjectives: [
            'Find terms and common difference from data; compute any term index n.',
            'Translate word problems into linear-step sequence models.',
          ],
        },
        {
          topicName: 'Arithmetic series (partial sums)',
          topicDescription: 'Sum Sₙ = n/2 (a₁ + aₙ) and equivalent forms.',
          topicObjectives: [
            'Compute partial sums using first/last term or first term with d.',
            'Relate series sums to area intuition for evenly spaced steps (intro).',
          ],
        },
        {
          topicName: 'Geometric sequences (nth term)',
          topicDescription: 'Common ratio r; aₙ = a₁ r^{n−1}.',
          topicObjectives: [
            'Identify ratio, recover terms, and solve for unknown indices when possible.',
            'Connect geometric growth/decay language to ratio size |r|.',
          ],
        },
        {
          topicName: 'Geometric series & infinite sums (|r| < 1)',
          topicDescription: 'Finite sum formula; infinite geometric series sum.',
          topicObjectives: [
            'Use Sₙ = a₁(1−r^n)/(1−r) (r≠1) and infinite sum a₁/(1−r) when |r|<1.',
            'Decide convergence of infinite geometric series from r.',
          ],
        },
        {
          topicName: 'Sigma notation & recursive models (intro)',
          topicDescription: 'Σ-index manipulation; simple recursive specifications.',
          topicObjectives: [
            'Expand and collapse simple sigma expressions with constant bounds.',
            'Read basic recursive definitions and compare to closed forms (intro).',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'AP term', question: 'In 3, 7, 11, … the 10th term is', options: ['39', '35', '43', '47'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'AP sum', question: 'Sum of first 20 positives 1+2+…+20 equals', options: ['210', '200', '420', '190'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 2, title: 'GP term', question: 'In 2, 6, 18, … the 5th term is', options: ['162', '54', '486', '108'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Infinite GP', question: 'Sum 4 + 2 + 1 + … (|r|<1) equals', options: ['8', '4', '7', '∞'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Sigma', question: '∑_{k=1}^{3} k² equals', options: ['14', '9', '6', '13'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Difference', question: 'If a₅ = 17 and a₁ = 1 in an AP, then d equals', options: ['4', '3', '5', '16'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 2, title: 'Ratio', question: 'GP first term 5, third term 45 implies |r| can be', options: ['3', '9', '15', '1/3'], correctAnswer: 0, difficulty: 'Medium' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 1 Quiz 1 — AP nth term', problems: [
          Q('Formula aₙ = a₁ + (n−1)d is', ['linear in n', 'exponential always', 'constant only', 'undefined'], 'A'),
          Q('Common difference is', ['a_{n+1} − aₙ (constant in AP)', 'aₙ/a_{n−1}', 'n itself', 'sum of terms'], 'A'),
          Q('If a₁ = 4 and d = −3, a₃ equals', ['−2', '4', '1', '7'], 'A'),
          Q('AP graphs (n, aₙ) lie on', ['a line when n treated continuously', 'a circle', 'hyperbola only', 'no pattern'], 'A'),
          Q('If two terms differ by 5 steps and 20 in value, |d| could be', ['4 if change is 20 over 5', '100', '0', '25'], 'A'),
          Q('Finding n from aₙ needs', ['invert linear relation unless degenerate', 'only guessing', 'derivatives', 'complex division'], 'A'),
          Q('Negative differences mean the sequence', ['decreases when n increases', 'must increase', 'is geometric', 'has no terms'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 1 Quiz 2 — AP sums', problems: [
          Q('Sₙ = n/2 (a₁ + aₙ) pairs', ['first and last term counts', 'only middle terms', 'only odd n', 'only r<1'], 'A'),
          Q('Sum of first n odds 1+3+…+(2n−1) equals', ['n²', '2n', 'n', 'n³'], 'A'),
          Q('If a₁ = 5 and a₁₀ = 50, S₁₀ equals', ['275', '55', '450', '500'], 'A'),
          Q('Alternative arithmetic series formula uses', ['a₁, d, n together', 'only geometric ratio', 'only integrals', 'cross product'], 'A'),
          Q('Series differs from sequence by', ['adding terms vs listing terms', 'being identical always', 'only notation Σ without meaning', 'using matrices'], 'A'),
          Q('If d = 0, Sₙ equals', ['n a₁', '0 always', 'a₁^n', '∞'], 'A'),
          Q('Average of first and last term times n/2 matches', ['pairing terms symmetrically', 'only circles', 'only trig', 'determinant'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 1 Quiz 3 — GP terms', problems: [
          Q('Geometric sequences satisfy', ['a_{n+1}/aₙ constant (nonzero terms)', 'differences constant', 'no ratio', 'sums always finite'], 'A'),
          Q('If a₁ = 3 and r = −2, a₄ equals', ['−24', '24', '6', '−6'], 'A'),
          Q('Alternating signs in GP often indicate', ['negative ratio', 'always AP', 'always infinite sum', 'no ratio'], 'A'),
          Q('aₙ = a₁ r^{n−1} has exponent on r that depends on', ['index shift by 1', 'always n²', 'log base 10 only', 'vector length'], 'A'),
          Q('If terms double each step, r equals', ['2', '1/2', '0', '−2'], 'A'),
          Q('Zero cannot be a term in a GP with finite r if', ['we divide by previous term to define r consistently in simple treatment', 'always allowed', 'only if r=1', 'never matters'], 'A'),
          Q('If r = 1, the sequence is', ['constant (GP degenerate AP)', 'always zero', 'undefined', 'always alternating'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 1 Quiz 4 — GP series', problems: [
          Q('Finite GS sum with r≠1: Sₙ =', ['a₁(1−r^n)/(1−r)', 'n a₁ always', 'a₁/(1−r) always', 'r^n only'], 'A'),
          Q('Infinite geometric sum converges if', ['|r| < 1 (real intro class)', '|r| > 1 only', 'r = 1 always', 'never'], 'A'),
          Q('Sum ∑_{k=0}^∞ (1/3)^k equals', ['3/2', '1/3', '∞', '9/2'], 'A'),
          Q('If |r| ≥ 1 with nonzero terms, partial sums', ['may grow without bound (generic warning)', 'always converge', 'always equal 0', 'never defined'], 'A'),
          Q('Repeating decimals link to', ['infinite geometric series', 'only AP', 'matrix traces', 'cross products'], 'A'),
          Q('Using S∞ = a₁/(1−r) needs', ['r in (−1,1) here', 'r = 2', 'a₁ = 0 always', 'n specified'], 'A'),
          Q('Finite vs infinite formulas differ by', ['keeping r^n term vs limit as n → ∞', 'nothing', 'sign only', 'always doubling'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 1 Quiz 5 — Sigma & recursion', problems: [
          Q('∑_{k=1}^{n} c equals', ['n c', 'c', 'c^n', '0'], 'A'),
          Q('Index shift rewrites ∑_{k=2}^{5} a_k as ∑_{j=1}^{4} ___ ', ['a_{j+1}', 'a_j', 'a_{j-1}', 'a_{2j}'], 'A'),
          Q('Σ is shorthand for', ['a specified sum over an index range', 'product only', 'integral always', 'matrix multiply'], 'A'),
          Q('aₙ = 2a_{n−1} + 1 is', ['recursive specification', 'always closed', 'only arithmetic', 'only geometric without work'], 'A'),
          Q('Σ (a_k + b_k) splits as', ['Σ a_k + Σ b_k with same bounds', 'Σ a_k · Σ b_k always', 'max(Σ a_k, Σ b_k)', 'undefined'], 'A'),
          Q('Telelescope intuition removes', ['intermediate cancellations in structured sums', 'all terms always', 'only constants', 'only GP'], 'A'),
          Q('Closed form vs recursive: closed form gives aₙ directly from', ['n (often preferred)', 'only previous terms always public', 'only matrices', 'only integrals'], 'A'),
        ]},
      ],
    },
    {
      chapterName: 'Unit 2: Limits and continuity',
      chapterDescription: 'Informal limits of sequences and functions; continuity; one-sided limits.',
      topics: [
        {
          topicName: 'Limit of a sequence (informal)',
          topicDescription: 'Long-run behavior; convergence idea without ε–δ.',
          topicObjectives: [
            'Describe whether terms appear to approach a single value as n grows.',
            'Connect bounded monotonic intuition to simple convergence stories.',
          ],
        },
        {
          topicName: 'Limit of a function at a point',
          topicDescription: 'lim_x→a f(x) as “approach” language and graph reading.',
          topicObjectives: [
            'Estimate limits from tables, graphs, and algebraic simplification when continuous.',
            'Distinguish value at a from limit at a when they differ.',
          ],
        },
        {
          topicName: 'Continuity and discontinuity',
          topicDescription: 'Definition at a point; removable, jump, asymptotic behavior.',
          topicObjectives: [
            'Test continuity as lim f = f(a) with three-part checklist.',
            'Classify discontinuity type in basic piecewise/rational sketches.',
          ],
        },
        {
          topicName: 'Limits of rational functions (algebra)',
          topicDescription: 'Cancel common factors; watch domain holes.',
          topicObjectives: [
            'Remove removable discontinuities by factoring and canceling (x − a).',
            'Identify vertical asymptotes when denominator → 0 after simplification.',
          ],
        },
        {
          topicName: 'One-sided limits & piecewise rules',
          topicDescription: 'x → a⁺ vs x → a⁻; match rules to intervals.',
          topicObjectives: [
            'Compute left and right limits for step/piecewise definitions.',
            'Decide two-sided limit existence from matching one-sided values.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 1, title: 'Polynomial', question: 'lim_{x→2} (x² − 4)/(x − 2) equals', options: ['4', '0', '2', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Continuity', question: 'If f is polynomial, f is continuous on', options: ['ℝ', '(0, ∞) only', 'rational x only', 'nowhere'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Sequence', question: '1/n as n→∞ approaches', options: ['0', '1', '∞', '−1'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Hole', question: '(x² − 1)/(x − 1) at x=1 simplified equals', options: ['2', '1', '0', 'undefined after cancel not applied'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Piece', question: 'If f(x)=2 for x<1 and f(x)=5 for x≥1, left limit at 1 is', options: ['2', '5', '3.5', 'DNE'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Const', question: 'lim_{x→3} 7 equals', options: ['7', '3', '0', '21'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Match', question: 'Two-sided limit exists if one-sided limits', options: ['exist and agree', 'always differ', 'never exist', 'use complex i'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 2 Quiz 1 — Sequence limits', problems: [
          Q('If terms settle near L as n grows, we say informally', ['the sequence approaches L', 'the sequence is a derivative', 'n is complex', 'terms stop at finite n'], 'A'),
          Q('(−1)^n oscillates and typically', ['does not converge to one value in basic sense', 'converges to 1', 'converges to 0', 'converges to −1 only'], 'A'),
          Q('Monotone bounded sequences (intro story) often', ['suggest a finite limit in calculus extension', 'always diverge', 'always equal 0', 'cannot be graphed'], 'A'),
          Q('1/√n tends to', ['0', '∞', '1', 'oscillates'], 'A'),
          Q('Convergence asks about', ['long-run behavior', 'only n = 1', 'only even n', 'determinant'], 'A'),
          Q('Sequence graph uses', ['discrete n', 'continuous x without gaps thought erroneously', 'matrix entries', 'polar angles only'], 'A'),
          Q('If aₙ = 3 + 1/n, limit intuition is', ['3', '0', '4', '∞'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 2 Quiz 2 — Function limits', problems: [
          Q('lim_x→a f(x) cares about', ['values near a, not only f(a)', 'only f(a)', 'only distant domain', 'only a = 0'], 'A'),
          Q('If f matches a continuous expression near a, often lim =', ['substitute a after continuity check', 'always 0', 'always ∞', 'cannot tell'], 'A'),
          Q('lim_x→0 sin(x)/x (guiding memory) is', ['1 (standard)', '0', '∞', 'does not exist'], 'A'),
          Q('Limits can fail to exist with', ['wild oscillation or mismatch', 'continuity always', 'polynomials always', 'only integers'], 'A'),
          Q('Graph reading: approaching height from left/right helps', ['one-sided limits', 'only derivatives', 'cross product', 'logs only'], 'A'),
          Q('lim constant c equals', ['c', '0', 'x', 'a'], 'A'),
          Q('Limit laws (sum) require', ['individual limits to exist (intro assumptions)', 'never hold', 'f = g', 'only rationals'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 2 Quiz 3 — Continuity', problems: [
          Q('Three-part continuity at a: defined, limit exists, and', ['limit equals value', 'limit differs always', 'always use derivative', 'a must be 0'], 'A'),
          Q('Removable discontinuity often has', ['a hole fillable by redefinition', 'jump always', 'asymptote always', 'no limit'], 'A'),
          Q('Jump discontinuity shows', ['different finite one-sided limits', 'same one-sided limits', 'polynomial only', 'always vertical asymptote'], 'A'),
          Q('f(x) = 1/x has issue at', ['0 (not continuous there)', 'every x', 'only x = 1', 'no issues'], 'A'),
          Q('Continuity on an interval means', ['continuous at each interior point and appropriate one-sided at ends', 'only endpoints', 'only integers', 'impossible for curves'], 'A'),
          Q('Intermediate Value Theorem needs', ['continuity on interval + between values story', 'discontinuous everywhere', 'only parabolas', 'only vectors'], 'A'),
          Q('A polynomial is continuous', ['on all ℝ (standard)', 'only positive x', 'never on [0,1]', 'only degree < 2'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 2 Quiz 4 — Rational limits', problems: [
          Q('0/0 indeterminate suggests', ['algebraic simplification may find limit', 'answer is 0 always', 'answer is 1 always', 'never continue'], 'A'),
          Q('Factor x² − a² as', ['(x−a)(x+a)', '(x+a)²', '(x−a)²', 'x−a only'], 'A'),
          Q('After canceling (x−a), evaluate limit by', ['substituting a into simplified expression if domain allows', 'always ∞', 'never substitute', 'divide by zero'], 'A'),
          Q('Vertical asymptote idea comes from denominator → 0 while numerator nonzero', ['after simplification', 'never', 'only if numerator 0', 'only linear'], 'A'),
          Q('lim 1/(x−2) as x→2⁺ with positive small side can blow to', ['+∞ in simple cases', '0', '−∞ always', 'finite always'], 'A'),
          Q('Rational functions continuous on', ['their domain (where denominator ≠ 0)', 'ℝ always', 'empty set', '(0,1) only'], 'A'),
          Q('Hole vs asymptote: hole if factor cancels', ['completely in reduced form with remaining nonzero denominator limit', 'never', 'always asymptote', 'only trig'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 2 Quiz 5 — One-sided limits', problems: [
          Q('x → a⁺ means x approaches a from the', ['right (greater values)', 'left', 'complex plane', 'negative infinity only'], 'A'),
          Q('Two-sided limit exists iff', ['left and right exist and match', 'only left exists', 'only right exists', 'never'], 'A'),
          Q('⌊x⌋ (floor) often has', ['jump discontinuities at integers', 'no discontinuities', 'holes only', 'is a polynomial'], 'A'),
          Q('Piecewise: first identify which branch contains the', ['approach side', 'origin only', 'maximum only', 'zero only'], 'A'),
          Q('Matching value f(a) may still differ from', ['limits if piece mismatch', 'always equals limit', 'never matters', 'only for lines'], 'A'),
          Q('Graph corners can still allow', ['two-sided limit existence while derivative fails later', 'no limits ever', 'only asymptotes', 'only infinite limits'], 'A'),
          Q('Sign of (x−a) near a⁺ is', ['positive for linear factor', 'always negative', 'zero always', 'undefined'], 'A'),
        ]},
      ],
    },
    {
      chapterName: 'Unit 3: Derivatives',
      chapterDescription: 'Derivative as limit; differentiation rules including chain rule.',
      topics: [
        {
          topicName: 'Average vs instantaneous rate',
          topicDescription: 'Difference quotients; secant vs tangent story.',
          topicObjectives: [
            'Compute average rates Δy/Δx and interpret units in context.',
            'Connect shrinking Δx to instantaneous rate viewpoint.',
          ],
        },
        {
          topicName: 'Derivative as a limit',
          topicDescription: 'f′(a) = lim_{h→0} (f(a+h)−f(a))/h.',
          topicObjectives: [
            'Set up and evaluate derivative limits for simple polynomials piecewise away from seams.',
            'Recognize when a derivative fails to exist (corner/cusp/discontinuity).',
          ],
        },
        {
          topicName: 'Linearity and power rule',
          topicDescription: 'constants, sums, scalar multiples, x^n.',
          topicObjectives: [
            'Differentiate linear combinations of powers efficiently.',
            'Rewrite radicals and reciprocals as powers before differentiating.',
          ],
        },
        {
          topicName: 'Product and quotient rules',
          topicDescription: '(uv)′ and (u/v)′ with care at v=0.',
          topicObjectives: [
            'Apply product and quotient rules without confusing them with “multiply derivatives”.',
            'Simplify algebra after differentiation when helpful.',
          ],
        },
        {
          topicName: 'Chain rule',
          topicDescription: 'Composite functions; outside·inside rates.',
          topicObjectives: [
            'Decompose compositions and apply chain rule with correct factors.',
            'Handle multilayer compositions with deliberate labeling (u substitution style).',
          ],
        },
      ],
      exercises: [
        { topicIndex: 2, title: 'Power', question: 'Derivative of x⁵ is', options: ['5x⁴', 'x⁴', '5x⁵', 'x⁵/5'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Product', question: 'If f=x and g=x², (fg)′ at 1 equals', options: ['3', '2', '1', '4'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Chain', question: 'd/dx (3x + 1)⁴ at x=0 equals', options: ['36', '12', '81', '4'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Const', question: 'Derivative of 9 is', options: ['0', '9', 'x', '1'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Avg rate', question: 'For f(x)=x², avg rate on [1,3] is', options: ['4', '5', '6', '2'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 2, title: 'Line', question: 'Derivative of 7x + 2 is', options: ['7', '9', '7x', '2'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Quotient', question: 'd/dx (x²/x) for x≠0 simplifies treatment gives', options: ['1', '0', '2x', 'x'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 3 Quiz 1 — Rates', problems: [
          Q('Average rate on [a,b] for f is', ['(f(b)−f(a))/(b−a)', 'f′(a) always', 'f(b)+f(a)', '(b−a)/Δf'], 'A'),
          Q('Instantaneous rate at x is limit of average rates as interval shrinks to', ['that x', '∞', '0 always wrongly', 'only endpoints'], 'A'),
          Q('Units of derivative are output units per', ['input unit', 'output squared', 'always 1', 'radian only'], 'A'),
          Q('Secant line uses', ['two points on graph', 'one point only', 'origin only', 'axis only'], 'A'),
          Q('Tangent line touches locally in', ['derivative-defined smooth cases', 'always two crossings', 'never exists', 'only circles'], 'A'),
          Q('Average velocity uses', ['Δposition/Δtime', 'acceleration always', 'only at t=0', 'random sum'], 'A'),
          Q('If f increasing on interval, derivative typically', ['≥ 0 (smooth cases; watch exceptions in pathologies)', 'always negative', 'zero always', 'undefined always'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 3 Quiz 2 — Limit definition', problems: [
          Q('f′(a) uses limit of', ['difference quotient', 'function value only', 'integral', 'determinant'], 'A'),
          Q('If limit of quotient fails, derivative', ['may not exist', 'always 0', 'always 1', 'equals f(a)'], 'A'),
          Q('|x| at 0 classically', ['has no two-sided derivative (corner)', 'derivative 1', 'derivative 0', 'derivative ∞'], 'A'),
          Q('Differentiable ⇒', ['continuous (at that point standard proof)', 'continuous ⇒ differentiable always', 'always has cusp', 'always polynomial'], 'A'),
          Q('h in quotient can approach 0 from', ['either side for two-sided derivative', 'only right for all', 'only left for all', 'never'], 'A'),
          Q('Linear f(x)=mx+b has derivative', ['m', 'mx', 'b', '0'], 'A'),
          Q('Derivative at a is slope of', ['tangent line (when exists)', 'secant through arbitrary far points always', 'normal always vertical', 'area under curve'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 3 Quiz 3 — Power & linearity', problems: [
          Q('d/dx x^n (integer n power rule intro) is', ['n x^{n−1}', 'x^n', 'n x^{n+1}', '0'], 'A'),
          Q('Derivative of sum is', ['sum of derivatives', 'product of derivatives', 'quotient', 'chain only'], 'A'),
          Q('Constant multiple rule: d/dx [c f] =', ['c f′', 'c + f′', 'f + c', '0'], 'A'),
          Q('√x = x^{1/2} so derivative behaves like', ['(1/2)x^{-1/2} (domain x>0)', 'x', '1/√x wrongly without 1/2', '0'], 'A'),
          Q('1/x = x^{-1} gives derivative', ['−x^{-2}', 'x^{-2}', 'ln x', '1'], 'A'),
          Q('Linearity fails if you apply rules to', ['non-differentiable pieces silently', 'sums of smooth', 'scalar multiples of smooth', 'constants'], 'A'),
          Q('Polynomials differentiate term-by-term because of', ['sum and constant-multiple rules', 'only chain', 'only product', 'integration'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 3 Quiz 4 — Product / quotient', problems: [
          Q('Product rule: (uv)′ =', ['u′v + uv′', 'u′v′', 'u+v′', '(u+v)′'], 'A'),
          Q('Quotient rule remembers as', ['(low d high − high d low) / low^2 (mnemonic)', '(u/v)′ = u′/v′', 'u′ + v′', 'uv'], 'A'),
          Q('For (x·e^x)′ one needs', ['product rule (e^x basics assumed)', 'only power', 'only chain alone', 'quotient only'], 'A'),
          Q('Quotient rule domain excludes where', ['denominator = 0', 'numerator = 0', 'always everywhere', 'only x=0'], 'A'),
          Q('Can expand product before derivative as', ['algebra check sometimes simpler', 'never legal', 'always required', 'only for vectors'], 'A'),
          Q('If v=1, quotient rule reduces toward', ['derivative of u alone scaled', 'always 0', 'always ∞', 'product mistake'], 'A'),
          Q('Logarithmic differentiation appears later but hints at', ['handling products by log transform (preview)', 'removing chain rule', 'removing sums', 'using integrals only'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 3 Quiz 5 — Chain rule', problems: [
          Q('If y = f(u) and u = g(x), dy/dx =', ['f′(g(x))·g′(x)', 'f′ + g′', 'f·g only', 'f/g'], 'A'),
          Q('Derivative of sin(3x) includes factor', ['3 from inner derivative (intro trig)', 'cos only without 3', '−sin', '0'], 'A'),
          Q('Layers mean', ['compose from inside out for bookkeeping', 'ignore inner', 'differentiate outer only', 'always multiply by 0'], 'A'),
          Q('d/dx (x²+1)^5 uses', ['chain with u = x²+1', 'power only without chain', 'quotient', 'implicit only'], 'A'),
          Q('Forgotten inner derivative typically', ['mis-scales the rate', 'fixes everything', 'removes constants', 'creates exact answer'], 'A'),
          Q('Repeated chain (three layers) applies rule', ['iteratively', 'once only always', 'never', 'only polynomials'], 'A'),
          Q('Related rates (later unit) will chain with', ['time derivatives implicitly', 'only integrals', 'sequences only', 'matrices only'], 'A'),
        ]},
      ],
    },
    {
      chapterName: 'Unit 4: Applications of differential calculus',
      chapterDescription: 'Monotonicity, extrema, optimization, concavity, related rates (intro).',
      topics: [
        {
          topicName: 'Critical numbers & first derivative test',
          topicDescription: 'Where f′ is 0 or undefined; sign chart.',
          topicObjectives: [
            'Locate critical points and classify intervals of increase/decrease.',
            'Support conclusions with a first derivative sign chart.',
          ],
        },
        {
          topicName: 'Local extrema',
          topicDescription: 'Interior max/min; endpoint awareness.',
          topicObjectives: [
            'Apply first derivative test for local extrema at interior critical points.',
            'Compare local vs global and keep endpoints in applied domains.',
          ],
        },
        {
          topicName: 'Optimization (intro)',
          topicDescription: 'Constraint modeling; single-variable reduction.',
          topicObjectives: [
            'Translate word problems into differentiable models on chosen intervals.',
            'Justify max/min candidate list (critical + endpoints).',
          ],
        },
        {
          topicName: 'Concavity & second derivative (intro)',
          topicDescription: 'f″ sign; inflection intuition.',
          topicObjectives: [
            'Interpret f″ > 0 / f″ < 0 as bend direction; locate inflection candidates.',
            'Connect concavity to tangent line position (curve above/below).',
          ],
        },
        {
          topicName: 'Related rates (intro)',
          topicDescription: 'Linked time derivatives via chain rule.',
          topicObjectives: [
            'Draw diagrams assigning variables and geometric constraints.',
            'Differentiate constraint with respect to t and substitute known rates.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Critical', question: 'For f(x)=x³−3x, critical points in ℝ include x=', options: ['±1', '0 only', '±3', '1 only'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Min', question: 'f(x)=x² has global min at x=', options: ['0', '1', '−1', 'none'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Fence', question: 'Rectangular fence with fixed perimeter P, max area when sides equal — width equals', options: ['P/4 for a square if two equal pairs', 'P/2', '0', 'P'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 3, title: 'Concave', question: 'If f″>0, f is', options: ['concave up', 'concave down', 'linear', 'constant'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Ladder', question: 'If x²+y²=L² and dx/dt given, relate dy/dt via', options: ['implicit differentiation w.r.t. t', 'only product rule', 'integrate first', 'ignore chain'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 0, title: 'Inc', question: 'If f′>0 on interval, f is', options: ['increasing there (smooth)', 'decreasing', 'constant', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Infl', question: 'Inflection candidates often where', options: ["f″ changes sign or f″=0 where meaningful", 'f=0 only', 'f′=0 only', 'only endpoints'], correctAnswer: 0, difficulty: 'Medium' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 4 Quiz 1 — First derivative test', problems: [
          Q('Critical numbers include where f′ is', ['0 or undefined in domain', 'always ∞', 'only positive', 'only at endpoints always'], 'A'),
          Q('If f′ switches + to − at c, local', ['max often (first derivative test)', 'min always', 'inflection', 'no meaning'], 'A'),
          Q('Sign chart needs test points in', ['intervals between critical numbers', 'only one point globally', 'only complex', 'only integers'], 'A'),
          Q('f′ = 0 does not guarantee', ['max or min without sign check', 'anything', 'always max', 'always min'], 'A'),
          Q('Monotone on [a,b] if derivative sign', ['does not change (with continuity assumptions)', 'always zero', 'always undefined', 'always positive only'], 'A'),
          Q('Endpoints are not “critical” in some textbooks but still', ['matter for global extrema', 'never matter', 'always critical numbers', 'cannot be extrema'], 'A'),
          Q('If f′ always positive on interval, f is', ['strictly increasing (differentiable case)', 'decreasing', 'constant', 'unbounded always'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 4 Quiz 2 — Local extrema', problems: [
          Q('Local minimum value is smallest', ['nearby compared to neighbors', 'on whole ℝ always', 'always at ∞', 'always 0'], 'A'),
          Q('Global min is', ['≤ all values in whole stated domain', 'only local idea', 'only endpoints', 'never unique'], 'A'),
          Q('f(x)=cos x has infinitely many local maxes — global max on ℝ is', ['1 (attained pattern)', '0', 'π', 'does not exist'], 'A'),
          Q('Second derivative test later says if f′(c)=0 and f″(c)>0 then', ['local min (standard concavity)', 'local max', 'inflection', 'undefined'], 'A'),
          Q('Extreme value theorem on [a,b] needs', ['continuity on closed interval', 'no continuity', 'open interval only', 'differentiability on edges'], 'A'),
          Q('Corner like |x| at 0 has', ['local min but no derivative there', 'smooth min', 'local max', 'no extremum'], 'A'),
          Q('Candidate theorem: list', ['critical + endpoints (+ singular domain checks)', 'only zeros of f', 'only f″ zeros', 'random'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 4 Quiz 3 — Optimization', problems: [
          Q('First step in word optimization often', ['draw and label variables', 'differentiate blindly', 'integrate', 'assume infinite domain'], 'A'),
          Q('Constraint reduces', ['degrees of freedom to one variable often', 'always to zero', 'never helps', 'only in vectors'], 'A'),
          Q('Check endpoints of feasible interval because', ['extrema can occur there', 'never occur', 'derivatives ignore endpoints', 'only max not min'], 'A'),
          Q('If model not differentiable on interior, need', ['careful case analysis', 'ignore', 'multiply by 0', 'use complex i'], 'A'),
          Q('Negative physical lengths are', ['usually invalid interpretations', 'always allowed', 'optimal always', 'required'], 'A'),
          Q('Interpret answer with', ['units of the quantity optimized', 'no units', 'only radians', 'matrix'], 'A'),
          Q('Single-variable calculus optimization avoids', ['Lagrange intro (later) but uses reduction', 'all geometry', 'derivatives', 'algebra'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 4 Quiz 4 — Concavity', problems: [
          Q('Concave up means graph bends', ['“holding water” / tangent below curve locally in smooth cases', '“spilling water”', 'like line', 'undefined'], 'A'),
          Q('If f″<0, concave', ['down', 'up', 'linear', 'constant'], 'A'),
          Q('Inflection: concavity', ['changes', 'never changes', 'always up', 'always down'], 'A'),
          Q('f″(c)=0 is', ['not sufficient alone for inflection without sign change thought', 'always inflection', 'never', 'always max'], 'A'),
          Q('Second derivative links to acceleration in motion as', ['derivative of velocity (standard)', 'velocity itself', 'position only', 'jerk only'], 'A'),
          Q('If f″ always 0 on interval, f is', ['linear (affine)', 'quadratic', 'cubic', 'exponential'], 'A'),
          Q('Graphing combines f′ for slopes and f″ for', ['bend information', 'only intercepts', 'only asymptotes', 'only period'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 4 Quiz 5 — Related rates', problems: [
          Q('Related rates equations come from', ['geometry linking variables over time', 'ignoring time', 'only integrals', 'only series'], 'A'),
          Q('Differentiate with respect to', ['t usually', 'x only always', 'never', 'θ only'], 'A'),
          Q('Chain rule appears because', ['variables are functions of t', 'never', 'only polynomials', 'only vectors'], 'A'),
          Q('Substitute known values', ['after differentiation generally (avoid early substitution traps)', 'before setup', 'never', 'only at endpoints'], 'A'),
          Q('Expanding circle A = π r² gives dA/dt =', ['2π r dr/dt', 'π dr/dt', '2πr', '0'], 'A'),
          Q('Units check helps catch', ['missing chain factors', 'nothing ever', 'only spelling', 'only limits'], 'A'),
          Q('Pythagoras setups common with', ['ladder/slide problems', 'only linear cost', 'matrix multiply', 'complex only'], 'A'),
        ]},
      ],
    },
    {
      chapterName: 'Unit 5: Integral calculus',
      chapterDescription: 'Antiderivatives, definite integrals, FTC, substitution, area between curves.',
      topics: [
        {
          topicName: 'Antiderivatives & indefinite integrals',
          topicDescription: '∫ f(x) dx as family F + C.',
          topicObjectives: [
            'Reverse basic derivatives (powers, etc.) including +C awareness.',
            'Check antiderivatives by differentiation.',
          ],
        },
        {
          topicName: 'Definite integral & area (Riemann idea)',
          topicDescription: 'Signed area; partitions intuition.',
          topicObjectives: [
            'Interpret ∫_a^b f as limit of sums and signed area above axis.',
            'Connect average value idea conceptually.',
          ],
        },
        {
          topicName: 'Fundamental Theorem of Calculus',
          topicDescription: 'd/dx ∫_a^x f = f(x); evaluation with antiderivative.',
          topicObjectives: [
            'Use FTC Part 1 for accumulation rates; Part 2 to evaluate definite integrals.',
            'Distinguish antiderivative from definite integral value.',
          ],
        },
        {
          topicName: 'Substitution (intro)',
          topicDescription: 'u du replacement reversing chain rule.',
          topicObjectives: [
            'Choose u to simplify inner function and track du.',
            'Adjust limits or back-substitute in definite integrals.',
          ],
        },
        {
          topicName: 'Area between curves (intro)',
          topicDescription: '∫ (top − bottom) dx on intervals.',
          topicObjectives: [
            'Find intersection bounds and set up ∫ |f − g| sensibly with sign checks.',
            'Interpret area as geometric quantity, not signed net if using absolute care.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Anti', question: '∫ 2x dx =', options: ['x² + C', '2 + C', 'x + C', '2x² + C'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'FTC', question: '∫₀² 2x dx =', options: ['4', '2', '8', '0'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Sub', question: '∫ 2x e^{x²} dx with u=x² gives du =', options: ['2x dx', 'x dx', 'dx', 'e^x dx'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 4, title: 'Between', question: 'Area between y=x and y=x² on [0,1] setup ∫₀¹', options: ['(x − x²) dx', '(x² − x) dx', 'x dx only', '1 dx'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Sign', question: 'If f negative on [a,b], net integral', options: ['negative (sign counts)', 'always positive', 'always 0', 'undefined'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Partition', question: 'A partition of [a, b] for Riemann sums splits the interval into', options: ['subintervals that cover [a, b] end to end', 'random unrelated points', 'only tangent lines', 'values of f′ only'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Mesh', question: 'The mesh (norm) of a partition is the', options: ['maximum length among its subintervals', 'minimum rectangle height', 'value of ∫_a^b f always', 'average of f(a) and f(b)'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Avg val', question: 'Average value of f on [a, b] equals', options: ['(1/(b−a)) ∫_a^b f(x) dx', 'f((a+b)/2) always', '∫_a^b f without dividing by length', '(f(b)−f(a))/(b−a) always'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Rectangles', question: 'Each term f(x_i^*)·Δx_i in a Riemann sum is the area of', options: ['one rectangle over a subinterval', 'a full circle', 'the whole integral always', 'a derivative'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Const', question: '∫ 0 dx =', options: ['C', '0', 'x', 'x + C'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Avg', question: 'Average of f on [a,b] is', options: ['1/(b−a) ∫_a^b f', '∫_a^b f', 'f(b)−f(a)', '(f(b)+f(a))/2 always'], correctAnswer: 0, difficulty: 'Medium' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 5 Quiz 1 — Antiderivatives', problems: [
          Q('Indefinite integral includes', ['+ C family', 'no constant ever', 'only integers', 'limits always'], 'A'),
          Q('Verify ∫ f dx by', ['differentiating your answer', 'integrating again only', 'subtraction only', 'matrix inverse'], 'A'),
          Q('For n ≠ −1, ∫ x^n dx equals', ['x^{n+1}/(n+1) + C', 'n x^{n−1} + C', 'x^n + C', '0'], 'A'),
          Q('∫ cos x dx is', ['sin x + C', '−sin x + C', 'cos x + C', 'tan x + C'], 'A'),
          Q('Linearity ∫ (f+g) =', ['∫ f + ∫ g', '∫ f · ∫ g', 'max(∫f, ∫g)', 'undefined'], 'A'),
          Q('Antiderivative of e^x is', ['e^x + C', 'x e^x always', 'ln x + C', '0'], 'A'),
          Q('Polynomial antiderivative raises degree by', ['1 (except −1 power case)', '−1 always', '0', '2'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 5 Quiz 2 — Definite integral', problems: [
          Q('∫_a^b f is a', ['number (when exists)', 'function always', 'matrix', 'sequence always'], 'A'),
          Q('Reversing limits flips sign:', ['∫_a^b = − ∫_b^a', 'same always', 'doubles', 'zero'], 'A'),
          Q('Riemann sum approximates', ['area / net accumulation', 'derivative', 'Taylor always', 'cross product'], 'A'),
          Q('If f ≥ 0 on [a,b], ∫_a^b f is', ['≥ 0 (area sense)', '≤ 0 always', '0', 'undefined'], 'A'),
          Q('Average value times interval length equals', ['integral (standard)', 'derivative', 'product of endpoints', 'zero'], 'A'),
          Q('Integrable nicely on [a,b] in intro classes often for', ['continuous f', 'only discontinuous everywhere', 'only unbounded without care', 'only trig'], 'A'),
          Q('Partition refinement idea makes sums approach', ['definite integral under hypotheses', 'always ∞', 'always 0', 'derivative'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 5 Quiz 3 — FTC', problems: [
          Q('FTC part 2: if F′=f, ∫_a^b f =', ['F(b)−F(a)', 'F(a)−F(b)', 'F(b)+F(a)', 'F′(b)'], 'A'),
          Q('FTC part 1: d/dx ∫_a^x f(t) dt =', ['f(x) (nice f)', 'f(a)', 'F(x) always', '0'], 'A'),
          Q('Accumulation from a fixed lower limit differentiates to', ['instantaneous rate f(x)', 'always 0', 'integral again', 'a'], 'A'),
          Q('Constant lower limit a in ∫_a^x avoids', ['extra chain from moving bottom in full versions', 'nothing', 'all issues', 'only trig'], 'A'),
          Q('Antiderivative existence for continuous f on interval: FTC assures', ['evaluation tool', 'never exists', 'only polynomials', 'only rational'], 'A'),
          Q('If you forget +C in indefinite but use FTC evaluation,', ['limits still find definite answer', 'always wrong', 'must add +C inside', 'cannot evaluate'], 'A'),
          Q('Net change viewpoint: ∫_a^b F′ =', ['F(b)−F(a)', 'F(a) only', 'F′(b) only', '0'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 5 Quiz 4 — Substitution', problems: [
          Q('Substitution reverses', ['chain rule', 'product only', 'quotient only', 'FTC only'], 'A'),
          Q('du must account for', ['all x parts or adjust constants', 'nothing', 'only cos', 'only limits'], 'A'),
          Q('Definite u-sub can change limits to', ['u-values at endpoints', 'keep x limits always wrong unless careful', 'always 0,pi', 'never'], 'A'),
          Q('If extra constant factor remains, you may', ['absorb into du with scalar adjust', 'ignore always', 'differentiate instead', 'integrate twice'], 'A'),
          Q('∫ x e^{x²} dx suggests u =', ['x²', 'x', 'e^x', 'ln x'], 'A'),
          Q('After integrating in u, back-substitute when', ['using original x limits without change', 'never', 'only indefinite', 'only trig'], 'A'),
          Q('Bad u choice often leaves', ['x terms you cannot express from du alone', 'perfect simplification', 'always e^x', 'always polynomial'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 5 Quiz 5 — Area between curves', problems: [
          Q('Top minus bottom integrand assumes', ['f ≥ g on the chosen interval after comparing', 'always f below', 'always equal', 'never check'], 'A'),
          Q('Intersections set', ['bounds where graphs cross', 'always 0,1', 'never needed', 'only maximum'], 'A'),
          Q('Absolute area may need', ['splitting where graphs cross', 'never', 'only one integral', 'complex numbers'], 'A'),
          Q('If curves cross once between a and b, you might need', ['two integrals with swapped roles', 'one blindly', 'never integrate', 'differentiate area'], 'A'),
          Q('Area is geometric and typically', ['non-negative if set up with absolute/splits', 'can be negative if blindly ∫(f−g)', 'always zero', 'always infinite'], 'A'),
          Q('Vertical strips integrate', ['w.r.t. x (standard setup)', 'w.r.t. y always', 'never', 'only polar'], 'A'),
          Q('Between y=0 and y=f(x) for f≥0, area is', ['∫ f', '∫ −f', '0', 'f(b)'], 'A'),
        ]},
      ],
    },
    {
      chapterName: 'Unit 6: Solid geometry and vectors in space',
      chapterDescription: 'ℝ³ coordinates, space vectors, dot & cross products, lines and planes (intro).',
      topics: [
        {
          topicName: 'Coordinates & distance in ℝ³',
          topicDescription: '(x, y, z); distance formula extension.',
          topicObjectives: [
            'Plot points and compute distances and midpoints in space.',
            'Recognize planes parallel to coordinate planes from equations x=k, y=k, z=k.',
          ],
        },
        {
          topicName: 'Vectors in space',
          topicDescription: 'Components ⟨a, b, c⟩; magnitude.',
          topicObjectives: [
            'Perform vector addition and scalar multiplication component-wise in ℝ³.',
            'Compute ‖v‖ and interpret direction vectors for lines.',
          ],
        },
        {
          topicName: 'Dot product in ℝ³',
          topicDescription: 'u·v; angle between vectors.',
          topicObjectives: [
            'Calculate dot products and use u·v = ‖u‖‖v‖cos θ in ℝ³.',
            'Test orthogonality with zero dot product for nonzero vectors.',
          ],
        },
        {
          topicName: 'Cross product (intro)',
          topicDescription: 'u×v perpendicular to both; area parallelogram.',
          topicObjectives: [
            'Compute symbolic cross products using determinant mnemonic (2×3 setup).',
            'Relate ‖u×v‖ to parallelogram area spanned by u and v.',
          ],
        },
        {
          topicName: 'Lines & planes (vector form, intro)',
          topicDescription: 'r(t)=r0 + t v; plane normal n.',
          topicObjectives: [
            'Write line parametrics from a point and direction vector.',
            'Connect plane equation n·(r−r0)=0 to normal intuition.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 0, title: 'Dist3D', question: 'Distance from (0,0,0) to (1,2,2) equals', options: ['3', '5', '√5', '9'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Add3', question: '⟨1,0,2⟩ + ⟨3,1,−1⟩ =', options: ['⟨4,1,1⟩', '⟨2,1,3⟩', '⟨3,0,2⟩', '⟨1,1,1⟩'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Dot3', question: '⟨1,2,3⟩·⟨3,−1,1⟩ =', options: ['4', '10', '0', '−4'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'Cross', question: 'i×j in standard basis equals', options: ['k', '−k', '0', 'i'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Line', question: 'Line through (1,0,0) direction ⟨0,1,0⟩ can be', options: ['(1, t, 0)', '(t,0,0)', '(1,0,t)', '(t,t,t)'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Len', question: '‖⟨3,4,0⟩‖ =', options: ['5', '7', '12', '25'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 2, title: 'Ortho', question: '⟨1,1,1⟩·⟨1,−1,0⟩ =', options: ['0', '1', '2', '−1'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 6 Quiz 1 — ℝ³ basics', problems: [
          Q('Distance √((Δx)²+(dy)²+(Δz)²) extends', ['Pythagoras twice idea', 'only 2D', 'only circles', 'only matrices'], 'A'),
          Q('Midpoint averages', ['each coordinate separately', 'only x', 'only length', 'angles'], 'A'),
          Q('z = 3 describes', ['plane parallel to xy-plane', 'line along z', 'sphere', 'point only'], 'A'),
          Q('Octants partition space by', ['signs of x,y,z', 'only x', 'only radius', 'only angles'], 'A'),
          Q('Vector from P to Q is', ['Q − P componentwise', 'P + Q always', 'P×Q', 'P·Q'], 'A'),
          Q('‖PQ‖ is', ['length of displacement vector', 'always 1', 'dot product', 'cross product'], 'A'),
          Q('R³ models physical', ['3D space maps', 'only complex plane', 'only sequences', 'only polynomials'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 6 Quiz 2 — Space vectors', problems: [
          Q('⟨a1,b1,c1⟩ + ⟨a2,b2,c2⟩ =', ['⟨a1+a2, b1+b2, c1+c2⟩', '⟨a1a2,…⟩', 'dot', 'cross only'], 'A'),
          Q('Scalar k scales', ['each component', 'only first', 'only magnitude without direction', 'never'], 'A'),
          Q('Direction vector for line can be', ['any nonzero parallel vector', 'only unit', 'only zero', 'only i'], 'A'),
          Q('Parallel vectors are', ['scalar multiples (one nonzero)', 'always perpendicular', 'always unit', 'always three-dimensional only'], 'A'),
          Q('Zero vector has property v+0 =', ['v', '0', '2v', '−v'], 'A'),
          Q('Geometrically, vector ties displacement not', ['absolute point without origin context', 'everything', 'coordinate axes', 'planes'], 'A'),
          Q('3D vectors still obey', ['head-to-tail addition', 'only 2D parallelogram forbidden', 'non-commutative addition', 'strange loops'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 6 Quiz 3 — Dot in ℝ³', problems: [
          Q('u·v = u₁v₁ + u₂v₂ + u₃v₃ is', ['scalar', 'vector', 'matrix', 'never defined'], 'A'),
          Q('If u·v = 0 with nonzero vectors, angle is', ['90° (perpendicular)', '0°', '180° always', 'undefined'], 'A'),
          Q('u·v = ‖u‖‖v‖ cos θ implies cos θ =', ['(u·v)/(‖u‖‖v‖)', '‖u×v‖', '‖u+v‖', 'det'], 'A'),
          Q('Dot distributes over', ['vector addition', 'cross product directly without care', 'division', 'matrix inverse'], 'A'),
          Q('Projection length along u direction magnitude uses', ['|u·v|/‖u‖ component story', 'cross only', 'sum of lengths', 'none'], 'A'),
          Q('Work-as-dot in physics if force constant direction colinear path snippet links to', ['dot product motivation', 'cross only', 'curl only', 'sequences'], 'A'),
          Q('u·u equals', ['‖u‖²', '‖u‖', '0', 'u×u'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 6 Quiz 4 — Cross product', problems: [
          Q('u×v is', ['vector perpendicular to both (when nonzero)', 'scalar', 'parallel to both always', 'always 0'], 'A'),
          Q('‖u×v‖ equals parallelogram area when vectors are from', ['same tail', 'opposite origins forbidden?', 'only 2D', 'only unit'], 'A'),
          Q('i×j =', ['k with right-hand rule set', '0', 'i', '−k (if left-hand mistakenly) — standard is k'], 'A'),
          Q('u×u =', ['0', '‖u‖²', 'u', '2u'], 'A'),
          Q('Anti-commutativity: u×v =', ['− v×u', 'v×u', 'u·v', 'u+v'], 'A'),
          Q('Cross product magnitude involves sin θ factor analog as', ['‖u‖‖v‖ sin θ', 'cos θ', 'tan θ', '1'], 'A'),
          Q('Determinant mnemonic arrange i j k atop', ['rows for 3×3 symbol pattern', 'only numbers', 'only 2×2', 'only dot'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 6 Quiz 5 — Lines & planes', problems: [
          Q('Line parametric r(t)=r0 + t v has direction', ['v', 'r0 only', '0', 'normal n always'], 'A'),
          Q('Plane through r0 with normal n: equation', ['n·(r − r0) = 0', 'n×r = 0 always', 'r = n', 'n+r0 = 0'], 'A'),
          Q('Parallel planes share', ['parallel normals (scalar multiples)', 'same points', 'opposite volume', 'no relation'], 'A'),
          Q('Line parallel to plane if direction · normal =', ['0', '1', '−1', 'undefined'], 'A'),
          Q('Symmetric line forms arise from solving parametrics when', ['allowed division by nonzero direction components', 'never', 'only 2D', 'only polynomials'], 'A'),
          Q('Two lines in space may', ['skew (not intersect, not parallel)', 'always intersect', 'always parallel', 'always same line'], 'A'),
          Q('Normal determines orientation of', ['plane tilt', 'line only', 'parabola', 'series'], 'A'),
        ]},
      ],
    },
    {
      chapterName: 'Unit 7: Proof and mathematical induction',
      chapterDescription: 'Logic, direct proof, contradiction intro, induction.',
      topics: [
        {
          topicName: 'Statements, truth, and negation',
          topicDescription: 'Propositions, quantifiers (intro), logical negation.',
          topicObjectives: [
            'Negate simple “for all / there exists” statements correctly in context.',
            'Identify hypothesis vs conclusion in implications P ⇒ Q.',
          ],
        },
        {
          topicName: 'Direct proof',
          topicDescription: 'Assume hypotheses; chain deductions to conclusion.',
          topicObjectives: [
            'Structure short direct proofs for identities and small number theory facts.',
            'Justify each step with previously known results.',
          ],
        },
        {
          topicName: 'Proof by contradiction (intro)',
          topicDescription: 'Assume denial; derive impossible statement.',
          topicObjectives: [
            'Explain the logical template: assume ¬P, reach contradiction ⇒ P.',
            'Use contradiction on classic “irrationality flavor” sketches when appropriate.',
          ],
        },
        {
          topicName: 'Principle of mathematical induction',
          topicDescription: 'Base case + inductive step P(k) ⇒ P(k+1).',
          topicObjectives: [
            'Verify base and produce the inductive step with clear k and k+1 linkage.',
            'Avoid off-by-one errors when restating P(n).',
          ],
        },
        {
          topicName: 'Induction: divisibility & inequalities',
          topicDescription: 'Standard patterns with factorization tricks.',
          topicObjectives: [
            'Prove divisibility statements by isolating the inductive hypothesis factor.',
            'Handle inequalities by preserving order through allowed algebraic moves.',
          ],
        },
      ],
      exercises: [
        { topicIndex: 3, title: 'Sum formula', question: 'Induction target: 1+2+…+n = n(n+1)/2. Base n=', options: ['1', '0', '2', '∞'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 0, title: 'Negation', question: 'Negation of “All x satisfy P(x)” starts with', options: ['There exists x with ¬P(x)', 'No x exists', 'All x fail', 'P(x) always'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 1, title: 'Even', question: 'Sum of two even integers is', options: ['even', 'odd', 'prime', 'always 2'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 4, title: 'Div', question: 'To prove 3 | (4^n − 1) by induction, often 4^{k+1}−1 = 4·(4^k−1)+', options: ['3', '1', '4', '0'], correctAnswer: 0, difficulty: 'Medium' },
        { topicIndex: 2, title: 'Contra', question: 'Contradiction proofs assume the statement is', options: ['false (to derive absurdity)', 'true', 'unrelated', 'always undefined'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 3, title: 'IH', question: 'Inductive hypothesis assumes P(', options: ['k for some k in domain', 'k+1 always first', 'all n', 'no n'], correctAnswer: 0, difficulty: 'Easy' },
        { topicIndex: 1, title: 'Identity', question: 'Direct proof of (a+b)² = a²+2ab+b² uses', options: ['distributive law repeatedly', 'induction on a', 'contradiction', 'calculus'], correctAnswer: 0, difficulty: 'Easy' },
      ],
      quizzes: [
        { topicIndex: 0, title: 'Unit 7 Quiz 1 — Logic', problems: [
          Q('An implication P ⇒ Q is false exactly when', ['P true and Q false', 'P false and Q true', 'both false only', 'both true'], 'A'),
          Q('Negation of P ∧ Q is (De Morgan)', ['(¬P) ∨ (¬Q)', 'P ∨ Q', '¬P ∧ ¬Q always wrong', 'P only'], 'A'),
          Q('“∀x, P(x)” negation begins with', ['∃x such that ¬P(x)', '∀x, ¬P(x) sometimes wrong pattern', '∃x, P(x)', 'no change'], 'A'),
          Q('Counterexample disproves', ['for all statements', 'there exists statements', 'all proofs', 'none'], 'A'),
          Q('Truth table rows for two statements count', ['4', '2', '8', '∞'], 'A'),
          Q('Converse of P⇒Q is', ['Q⇒P', '¬P⇒¬Q', 'P⇔Q always', 'P'], 'A'),
          Q('Biconditional P⇔Q means', ['P implies Q and Q implies P', 'never both', 'only one way', 'false always'], 'A'),
        ]},
        { topicIndex: 1, title: 'Unit 7 Quiz 2 — Direct proof', problems: [
          Q('Start direct proof from', ['hypotheses', 'conclusion', 'contradiction line', 'example only'], 'A'),
          Q('To prove even product of integers, useful to write', ['factors as 2m and 2n style when applicable', 'always primes', 'never algebra', 'irrationals'], 'A'),
          Q('Each line should follow from', ['definitions/theorems already on table', 'random leaps', 'guess', 'oracle'], 'A'),
          Q('Proving identities: commonly manipulate', ['one side toward the other or both to same expression', 'never algebra', 'only graphs', 'only limits'], 'A'),
          Q('If a direct proof stalls, revisiting ___ often helps.', ['definitions', 'induction always (maybe wrong tool)', 'contradiction always (maybe wrong tool)', 'unrelated limits'], 'A'),
          Q('Direct proof ends by reaching', ['conclusion explicitly', 'hypothesis only', 'question mark', 'example alone'], 'A'),
          Q('Number theory facts often need', ['integer closure facts', 'division by reals freely', 'limits', 'series'], 'A'),
        ]},
        { topicIndex: 2, title: 'Unit 7 Quiz 3 — Contradiction', problems: [
          Q('Assume for contradiction: target false means assume', ['negation of claim carefully', 'claim again', 'always true', 'example'], 'A'),
          Q('Reach', ['a logical impossibility', 'the claim directly without issue', 'no statement', 'only inequality'], 'A'),
          Q('Classic template fits proving uniqueness sometimes or', ['irrationality sketches', 'only basic addition', 'only trig', 'derivatives'], 'A'),
          Q('If assumption leads to 1=0 style, logic says', ['assumption false so original true if exhaustive', 'everything true', 'stop math', 'induction broken'], 'A'),
          Q('Contradiction vs contrapositive: contrapositive of P⇒Q is', ['¬Q ⇒ ¬P', 'Q ⇒ P', 'P ∨ Q', '¬P ∨ Q'], 'A'),
          Q('Not every statement needs contradiction — choose method by', ['structure of claim', 'always contradiction', 'never direct', 'dice'], 'A'),
          Q('Keep track of quantifiers when negating for contradiction', ['carefully', 'ignore', 'drop all', 'replace with numbers'], 'A'),
        ]},
        { topicIndex: 3, title: 'Unit 7 Quiz 4 — Induction setup', problems: [
          Q('Induction proves statements for', ['all integers n ≥ base (context)', 'one n only', 'no n', 'real x always'], 'A'),
          Q('Base case verifies', ['starting anchor', 'inductive step', 'everything', 'only limit'], 'A'),
          Q('Inductive step shows P(k) ⇒', ['P(k+1) typically', 'P(0)', 'false', 'P(∞)'], 'A'),
          Q('Must use inductive hypothesis', ['clearly in the bridge', 'never', 'only in base', 'only symbolically fake'], 'A'),
          Q('Off-by-one errors often break', ['the k to k+1 link', 'nothing', 'only base', 'only examples'], 'A'),
          Q('Strong induction variant assumes', ['all previous cases up to k sometimes', 'never P(k)', 'only P(1)', 'random'], 'A'),
          Q('Induction is for discrete integers; continuous analogs use', ['other tools (calculus)', 'same template blindly', 'only contradiction', 'only graph'], 'A'),
        ]},
        { topicIndex: 4, title: 'Unit 7 Quiz 5 — Induction patterns', problems: [
          Q('Divisibility induction often adds/subtracts to', ['factor out the divisor using IH', 'multiply derivatives', 'integrate', 'cross'], 'A'),
          Q('For 2^n > n² beyond small n, induction may need', ['stronger P(n) or larger base start', 'never possible', 'only geometry', 'only limits'], 'A'),
          Q('Inequality induction preserves order if multiplications by positives stay valid — watch when multiplying by', ['possibly negative expressions', 'always safe', 'zero always', 'i'], 'A'),
          Q('Series Σ formula induces by relating S_{k+1} to', ['S_k + new term', 'S_k only', 'product', 'derivative'], 'A'),
          Q('Check small cases before induction to', ['guess correct statement', 'replace proof', 'avoid all work', 'break logic'], 'A'),
          Q('Binomial theorem proofs may use induction on', ['exponent n', 'base variable only', 'constant', 'matrix size'], 'A'),
          Q('If inductive step fails, statement may be', ['false or needs different method', 'always true', 'always false by induction alone', 'irrational'], 'A'),
        ]},
      ],
    },
  ],
};
