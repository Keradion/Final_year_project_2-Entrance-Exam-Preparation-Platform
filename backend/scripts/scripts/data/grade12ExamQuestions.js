/**
 * Five university-entrance-style MCQs per Grade 12 Mathematics topic (metadata years 2014–2018 E.C.).
 */

const EC_YEARS = [2014, 2015, 2016, 2017, 2018];

function Q(questionText, choices, correctLetter, answerExplanation = '') {
  return { questionText, choices, correctAnswer: correctLetter, answerExplanation };
}

function pack(c, t) {
  switch (`${c}-${t}`) {
    case '0-0':
      return [
        Q('In an arithmetic sequence with a₁ = 2 and d = 5, a₄ equals:', ['17', '14', '20', '7'], 'A'),
        Q('Common difference d satisfies a_{n+1} − aₙ:', ['constant (in an AP)', 'equals n', 'equals 0', 'random'], 'A'),
        Q('If a₃ = 10 and a₇ = 22 in an AP, then d equals:', ['3', '4', '2', '12'], 'A'),
        Q('Linear formula aₙ = a₁ + (n−1)d is:', ['degree 1 in n', 'degree 2 always', 'exponential only', 'undefined'], 'A'),
        Q('Given aₙ = −1 + 4(n−1), a₁ equals:', ['−1', '3', '0', '4'], 'A'),
      ];
    case '0-1':
      return [
        Q('Sum 1 + 2 + … + 10 equals:', ['55', '45', '100', '10'], 'A'),
        Q('Sₙ = n/2 (a₁ + aₙ) pairs:', ['first and last term', 'only middle', 'only odd n', 'random terms'], 'A'),
        Q('If a₁ = 1, a₅ = 9 in an AP, S₅ equals:', ['25', '45', '15', '5'], 'A'),
        Q('An AP with d = 0 has Sₙ equal to:', ['n a₁', '0', 'a₁^n', 'n²'], 'A'),
        Q('Average of first and last term times n/2 matches AP sum because:', ['pairing terms symmetrically', 'always false', 'only GP', 'only trig'], 'A'),
      ];
    case '0-2':
      return [
        Q('A geometric sequence has:', ['constant ratio r between consecutive terms', 'constant difference only', 'no pattern', 'only alternating signs'], 'A'),
        Q('If a₁ = 4 and r = 1/2, a₃ equals:', ['1', '2', '1/2', '8'], 'A'),
        Q('For positive terms with r > 1, the sequence:', ['grows exponentially in n', 'decays to 0', 'is constant', 'oscillates always'], 'A'),
        Q('Formula aₙ = a₁ r^{n−1} uses exponent:', ['n − 1', 'n + 1 always', 'r only', 'log n'], 'A'),
        Q('If a₂ = 6 and a₄ = 54 for positive GP, r could be:', ['3', '2', '6', '9'], 'A'),
      ];
    case '0-3':
      return [
        Q('Infinite geometric sum converges if |r| is:', ['less than 1 (intro class)', 'greater than 1', 'equal 1', 'any real'], 'A'),
        Q('Sum ∑_{k=0}^∞ (1/4)^k equals:', ['4/3', '1/4', '∞', '4'], 'A'),
        Q('Finite GS Sₙ uses factor (1 − r^n)/(1 − r) when:', ['r ≠ 1', 'always', 'never', 'r = 1 only'], 'A'),
        Q('If |r| ≥ 1 with nonzero terms, partial sums often:', ['do not approach finite limit', 'always converge', 'equal 0', 'equal 1'], 'A'),
        Q('0.333… = 1/3 links to:', ['geometric series with r = 1/10 pattern', 'only AP', 'matrix', 'cross product'], 'A'),
      ];
    case '0-4':
      return [
        Q('∑_{k=1}^{n} c with constant c equals:', ['n c', 'c', 'c^n', '0'], 'A'),
        Q('Σ notation indicates:', ['sum over an index range', 'product always', 'integral always', 'limit only'], 'A'),
        Q('Σ (a_k + b_k) with same bounds splits as:', ['Σ a_k + Σ b_k', 'Σ a_k · Σ b_k', 'max', 'undefined'], 'A'),
        Q('Recursive aₙ = 2a_{n−1} with a₁ = 3 gives a₂:', ['6', '5', '9', '1'], 'A'),
        Q('Expanding ∑_{i=1}^{3} i³ yields:', ['36', '6', '14', '9'], 'A'),
      ];
    case '1-0':
      return [
        Q('Terms 1/n as n → ∞ approach:', ['0', '1', '∞', 'oscillate without approach'], 'A'),
        Q('Sequence (−1)^n typically:', ['does not converge to one value', 'converges to 0', 'converges to 1', 'converges to −1'], 'A'),
        Q('Informal convergence means terms eventually stay near:', ['a single limiting value', 'every integer', '∞ always', 'no value'], 'A'),
        Q('Bounded monotonic (story) often suggests:', ['a finite limit in advanced theorems', 'divergence always', 'oscillation', 'undefined'], 'A'),
        Q('Graph of aₙ vs n is:', ['discrete points', 'continuous curve only', 'circle', 'empty'], 'A'),
      ];
    case '1-1':
      return [
        Q('lim_{x→3} (x² − 9)/(x − 3) equals:', ['6', '0', '9', 'undefined without work'], 'A'),
        Q('Limit at a emphasizes behavior:', ['near a, not only f(a) if defined', 'only f(a)', 'only far away', 'only a = 0'], 'A'),
        Q('lim_{x→a} c for constant c equals:', ['c', 'a', '0', '∞'], 'A'),
        Q('If left and right limits differ finitely, two-sided limit:', ['does not exist', 'always exists', 'equals average', 'equals 0'], 'A'),
        Q('Limits of rationals may simplify by:', ['factoring and canceling common terms', 'squaring always', 'ignoring denominators', 'adding 1'], 'A'),
      ];
    case '1-2':
      return [
        Q('Three-part continuity at a requires f(a), lim f, and:', ['equality lim f = f(a)', 'derivative exists', 'f(a)=0', 'none'], 'A'),
        Q('Polynomials are continuous on:', ['ℝ (standard)', '(0,∞) only', 'integers only', 'empty'], 'A'),
        Q('Removable discontinuity often looks like:', ['a hole you can “fill”', 'jump always', 'vertical asymptote', 'undefined domain'], 'A'),
        Q('Jump discontinuity has:', ['different finite one-sided limits', 'same limits always', 'always infinite', 'no limits'], 'A'),
        Q('f(x)=1/x is problematic for continuity at:', ['0', '1', '−1', 'all reals'], 'A'),
      ];
    case '1-3':
      return [
        Q('0/0 pattern suggests:', ['algebraic simplification may help', 'answer is always 0', 'never continue', 'answer is 1'], 'A'),
        Q('Factor x² − 5x + 6 as:', ['(x−2)(x−3)', '(x+2)(x+3)', '(x−6)(x+1)', '(x−5)(x−1)'], 'A'),
        Q('After canceling (x−a), evaluate simplified expression at a if:', ['still defined at a in reduced form', 'never', 'always yields ∞', 'always yields 0'], 'A'),
        Q('Vertical asymptote often after simplification when denominator → 0 and numerator:', ['nonzero', 'zero always', 'always 1', 'always ∞'], 'A'),
        Q('Rational functions continuous on:', ['their domains', 'all ℝ always', 'nowhere', '(0,1) only'], 'A'),
      ];
    case '1-4':
      return [
        Q('x → a⁺ means approach from:', ['values greater than a', 'values less than a', 'exactly a', 'complex only'], 'A'),
        Q('⌊x⌋ jumps at:', ['integers', 'rationals only', 'never', 'only π'], 'A'),
        Q('Two-sided limit exists if one-sided limits:', ['exist and match', 'either missing', 'always differ', 'always infinite'], 'A'),
        Q('Piecewise limits require picking the rule whose interval:', ['contains the approaching side', 'contains only far points', 'is empty forever', 'is complex'], 'A'),
        Q('Even if limits match, f(a) can still differ (removable) if:', ['value at point not reset to limit', 'impossible', 'always continuous', 'always discontinuous'], 'A'),
      ];
    case '2-0':
      return [
        Q('Average rate of f on [a,b] is:', ['(f(b)−f(a))/(b−a)', 'f′(a)', 'f(b)+f(a)', 'integral'], 'A'),
        Q('Instantaneous rate is limit of average rates as interval shrinks to:', ['a point', '∞', '0 wrongly as domain', 'two points fixed'], 'A'),
        Q('Secant line uses:', ['two points', 'one point only', 'origin only', 'normal only'], 'A'),
        Q('Tangent line slope (when exists) is:', ['derivative value', 'always 0', 'always ∞', 'integral'], 'A'),
        Q('Units of derivative y′(x) are:', ['y-units per x-unit', 'y-units only', 'dimensionless always', 'area'], 'A'),
      ];
    case '2-1':
      return [
        Q('f′(a) is defined as a limit of:', ['difference quotient', 'function value', 'integral', 'series'], 'A'),
        Q('If |x| is studied at 0, classic derivative situation is:', ['no single two-sided derivative (corner)', 'derivative 1', 'derivative 0', 'smooth'], 'A'),
        Q('Differentiable at a ⇒:', ['continuous at a (standard)', 'continuous ⇒ differentiable always', 'f″ exists', 'f is polynomial'], 'A'),
        Q('Derivative of mx + b equals:', ['m', 'mx', 'b', '0'], 'A'),
        Q('Numerator f(a+h)−f(a) measures:', ['change in output', 'always zero', 'only area', 'only limits'], 'A'),
      ];
    case '2-2':
      return [
        Q('d/dx x⁷ =', ['7x⁶', 'x⁶', '7x⁷', '0'], 'A'),
        Q('Derivative of sum equals:', ['sum of derivatives', 'product of derivatives', 'quotient only', 'chain only'], 'A'),
        Q('d/dx [c f(x)] with constant c:', ['c f′(x)', 'f(x)', 'c + f′', '0'], 'A'),
        Q('1/x as x^{−1} differentiates to:', ['−1/x²', '1/x²', 'ln x', '0'], 'A'),
        Q('√x = x^{1/2} derivative behaves like', ['(1/2)x^{-1/2} (x>0 domain)', 'x', '1/√x only without 1/2', '0'], 'A'),
      ];
    case '2-3':
      return [
        Q('Product rule: (uv)′ =', ['u′v + uv′', 'u′v′', 'u/v', 'u+v'], 'A'),
        Q('Quotient rule denominator involves:', ['v²', 'u²', 'v only', '1'], 'A'),
        Q('For rational functions, quotient rule applies when:', ['written as u/v with v ≠ 0 on interval', 'never', 'only constants', 'only trig'], 'A'),
        Q('Expanding product before derivative can:', ['sometimes simplify work', 'never help', 'always required', 'remove chain rule'], 'A'),
        Q('If v = 1, derivative of u/v reduces to:', ['u′', '0', 'u/v′', 'v′'], 'A'),
      ];
    case '2-4':
      return [
        Q('Chain rule for y = f(g(x)) gives y′:', ['f′(g(x)) g′(x)', 'f′ + g′', 'f g', 'f/g'], 'A'),
        Q('Inner function derivative factor appears because:', ['rates compound (chain)', 'they cancel', 'always 1', 'never needed'], 'A'),
        Q('d/dx (x² + 1)³ uses chain with u =', ['x² + 1', 'x³', '3x', '1'], 'A'),
        Q('Forgotten inner derivative typically:', ['mis-scales the result', 'fixes everything', 'always gives exact', 'removes constants'], 'A'),
        Q('Layers in composition handled:', ['from outside/in bookkeeping', 'only once', 'never', 'only polynomials'], 'A'),
      ];
    case '3-0':
      return [
        Q('Critical numbers include where f′ is:', ['0 or undefined (domain respected)', 'always ∞', 'only endpoints', 'always 1'], 'A'),
        Q('If f′ changes + to − at c, local:', ['max often (first derivative test)', 'min', 'no extremum', 'inflection'], 'A'),
        Q('Sign chart needs test points between:', ['critical x-values', 'only one global', 'only y values', 'complex'], 'A'),
        Q('f′(c)=0 does not guarantee extremum without:', ['sign change / further test', 'nothing', 'always max', 'always min'], 'A'),
        Q('Increasing on interval if f′:', ['> 0 (differentiable typical cases)', '< 0', '= 0 always', 'undefined'], 'A'),
      ];
    case '3-1':
      return [
        Q('Local minimum means smallest value:', ['nearby vs neighbors', 'globally always', 'at ∞', 'never'], 'A'),
        Q('Global min on closed interval [a,b] for continuous f:', ['exists (EVT)', 'never exists', 'only if linear', 'only if quadratic'], 'A'),
        Q('Candidate list for global extrema includes:', ['critical points and endpoints', 'only critical', 'only endpoints', 'random'], 'A'),
        Q('Corner at minimum may have:', ['no derivative at corner', 'smooth derivative', 'infinite derivative always', 'no min'], 'A'),
        Q('Second derivative test: f′(c)=0 and f″(c)>0 suggests:', ['local min', 'local max', 'must be inflection', 'no info'], 'A'),
      ];
    case '3-2':
      return [
        Q('Optimization first step is often:', ['draw and label variables', 'differentiate blindly', 'integrate', 'ignore constraints'], 'A'),
        Q('Feasible domain captures:', ['physical / problem restrictions', 'all ℝ always', 'only integers', 'nothing'], 'A'),
        Q('Check endpoints because extrema can occur:', ['at boundaries of domain', 'never', 'only interior', 'only at zero'], 'A'),
        Q('Constraint often reduces problem to:', ['one variable function', 'always zero variables', 'two independent always', 'none'], 'A'),
        Q('Answer should be interpreted with:', ['correct units', 'no units', 'only radians', 'matrix'], 'A'),
      ];
    case '3-3':
      return [
        Q('f″ > 0 means concave:', ['up', 'down', 'linear', 'constant'], 'A'),
        Q('Inflection point: concavity:', ['changes', 'does not change', 'always up', 'always down'], 'A'),
        Q('If f″ = 0 at c, inflection is:', ['not guaranteed without sign change reasoning', 'always guaranteed', 'always max', 'always min'], 'A'),
        Q('Tangent lines lie below curve locally in concave up smooth case:', ['often yes', 'never', 'always above', 'undefined'], 'A'),
        Q('If f″ ≡ 0 on interval, f is:', ['linear (affine)', 'quadratic', 'cubic', 'exponential'], 'A'),
      ];
    case '3-4':
      return [
        Q('Related rates need equation from:', ['geometry / constraint', 'random guess', 'only integrals', 'only series'], 'A'),
        Q('Differentiate constraint with respect to:', ['t typically', 'x only always', 'never', 'θ only'], 'A'),
        Q('Chain rule appears because:', ['quantities depend on t', 'never', 'only polynomials', 'only vectors'], 'A'),
        Q('For A = π r², dA/dt =', ['2πr dr/dt', 'π dr/dt', '2πr', '0'], 'A'),
        Q('Substitute known rates:', ['after differentiation', 'before setup always', 'never again', 'only at end'], 'A'),
      ];
    case '4-0':
      return [
        Q('∫ x dx =', ['x²/2 + C', 'x + C', '0', '1/x + C'], 'A'),
        Q('Indefinite integral represents:', ['a family + C', 'unique number always', 'only area', 'derivative'], 'A'),
        Q('Verify ∫ f by:', ['differentiating antiderivative', 'integrating twice', 'subtracting C only', 'matrix multiply'], 'A'),
        Q('∫ e^x dx =', ['e^x + C', 'ln x + C', '0', 'e^{x²}'], 'A'),
        Q('Antiderivative of cos x:', ['sin x + C', '−sin x + C', 'cos x + C', 'tan x + C'], 'A'),
      ];
    case '4-1':
      return [
        Q('∫_a^b f dx is a:', ['number (when defined)', 'function', 'vector', 'series term'], 'A'),
        Q('If f ≥ 0 on [a,b], definite integral is:', ['≥ 0 (area sense)', '< 0 always', '0', 'undefined'], 'A'),
        Q('Reversing limits flips sign:', ['∫_a^b = −∫_b^a', 'no change', 'doubles', 'halves'], 'A'),
        Q('Riemann sums estimate:', ['area / net accumulation', 'derivatives only', 'limits only of sequences', 'cross products'], 'A'),
        Q('Partition refinement (story) improves approximation to:', ['definite integral', 'always 0', 'always ∞', 'derivative'], 'A'),
      ];
    case '4-2':
      return [
        Q('FTC: if F′ = f, then ∫_a^b f =', ['F(b) − F(a)', 'F(a) − F(b)', 'F′(b)', '0'], 'A'),
        Q('d/dx ∫_a^x f(t) dt =', ['f(x) (nice conditions)', 'f(a)', 'F(x)', '0'], 'A'),
        Q('FTC links integration and:', ['differentiation', 'only series', 'only matrices', 'only trigonometry'], 'A'),
        Q('Net change from rate:', ['integral of derivative', 'derivative of integral always wrong', 'always 0', 'matrix'], 'A'),
        Q('Antiderivative existence for continuous f on [a,b] supports:', ['evaluation via FTC', 'never evaluation', 'only symbolic', 'only complex'], 'A'),
      ];
    case '4-3':
      return [
        Q('Substitution undoes:', ['chain rule', 'product rule only', 'quotient only', 'fundamental theorem'], 'A'),
        Q('For ∫ 2x cos(x²) dx, good u is:', ['x²', 'cos x', 'sin x', '2x'], 'A'),
        Q('With definite integral, change limits when:', ['using u throughout cleanly', 'never', 'always keep old limits unchanged wrongly', 'only indefinite'], 'A'),
        Q('Constant factors can be adjusted to match du:', ['often scales substitution', 'never', 'always illegal', 'removes dx'], 'A'),
        Q('Bad u leaves:', ['x pieces not expressible from du', 'perfect match always', 'always quadratic', 'always exponential'], 'A'),
      ];
    case '4-4':
      return [
        Q('Area between curves needs knowing which graph is:', ['on top on subintervals', 'always lower', 'identical always', 'never crossing'], 'A'),
        Q('Bounds often from:', ['intersection x-values', 'always 0 and 1', 'random', 'only vertex'], 'A'),
        Q('If graphs cross, you may need:', ['split integrals', 'one integral blindly', 'never integrate', 'derivative of difference'], 'A'),
        Q('Geometric area is usually:', ['non-negative with absolute/splits', 'negative if blind ∫(f−g)', 'always zero', 'always ∞'], 'A'),
        Q('Between y=0 and y=f(x) with f≥0, area:', ['∫ f', '∫ −f', '0', 'f(b)'], 'A'),
      ];
    case '5-0':
      return [
        Q('Distance from origin to (1,2,2) equals:', ['3', '5', '√5', '9'], 'A'),
        Q('Midpoint in ℝ³ averages:', ['each coordinate', 'only z', 'norms only', 'angles'], 'A'),
        Q('Equation z = 4 describes a plane:', ['parallel to xy-plane', 'parallel to yz-plane', 'line only', 'sphere'], 'A'),
        Q('Vector from P to Q is:', ['Q − P componentwise', 'P + Q', 'P×Q', 'P·Q'], 'A'),
        Q('‖v‖ measures:', ['length', 'angle', 'area', 'volume always'], 'A'),
      ];
    case '5-1':
      return [
        Q('⟨1,2,3⟩ + ⟨−1,0,4⟩ =', ['⟨0,2,7⟩', '⟨2,2,−1⟩', '⟨0,0,7⟩', '⟨1,2,12⟩'], 'A'),
        Q('Scalar 2⟨3,1,0⟩ =', ['⟨6,2,0⟩', '⟨5,1,0⟩', '⟨3,2,0⟩', '⟨3,1,2⟩'], 'A'),
        Q('‖⟨3,4,0⟩‖ =', ['5', '7', '12', '25'], 'A'),
        Q('Parallel nonzero vectors satisfy:', ['one is scalar multiple of other', 'dot zero always', 'cross zero always', 'always equal'], 'A'),
        Q('Direction vector for a line:', ['any nonzero parallel vector', 'only unit', 'only zero', 'only i'], 'A'),
      ];
    case '5-2':
      return [
        Q('⟨1,0,1⟩ · ⟨0,1,0⟩ =', ['0', '1', '−1', '2'], 'A'),
        Q('If dot product is zero for nonzero vectors in ℝ³, they are:', ['perpendicular', 'parallel', 'identical', 'undefined'], 'A'),
        Q('u·u equals:', ['‖u‖²', '‖u‖', '0', 'u×u'], 'A'),
        Q('cos θ =', ['(u·v)/(‖u‖‖v‖) (definition with nonzero norms)', '‖u×v‖ always', 'u+v', 'det'], 'A'),
        Q('Dot distributes over vector addition:', ['yes', 'no', 'only ℝ²', 'only cross'], 'A'),
      ];
    case '5-3':
      return [
        Q('u×v is:', ['vector perpendicular to both (nondegenerate)', 'scalar', 'parallel to both', 'always 0'], 'A'),
        Q('u×u =', ['0', '‖u‖²', '2u', 'u'], 'A'),
        Q('‖u×v‖ relates to area of spanned parallelogram:', ['yes', 'no', 'only in ℝ²', 'only if u=v'], 'A'),
        Q('Anticommutativity u×v =', ['− v×u', 'v×u', '0', 'u+v'], 'A'),
        Q('i×j with right-hand rule gives:', ['k', '−i', '0', 'j'], 'A'),
      ];
    case '5-4':
      return [
        Q('Line r(t)=r₀ + t v has direction:', ['v', 'r₀', '0', 'normal n always'], 'A'),
        Q('Plane with normal n through r₀: n·(r−r₀)=', ['0', '1', '‖n‖', '∞'], 'A'),
        Q('Direction parallel to plane means perpendicular to:', ['normal n', 'itself', 'origin', 'axis only'], 'A'),
        Q('Skew lines in ℝ³:', ['may not intersect and not parallel', 'always intersect', 'always parallel', 'do not exist'], 'A'),
        Q('Parametric form encodes:', ['all coordinates via t', 'only two dimensions', 'only implicit', 'determinant'], 'A'),
      ];
    case '6-0':
      return [
        Q('Negation of “∀x P(x)” starts with:', ['∃x ¬P(x)', '∀x ¬P(x)', '∃x P(x)', 'P(x)'], 'A'),
        Q('P ∧ Q false means at least one of P,Q is:', ['false', 'true', 'always both true', 'undefined'], 'A'),
        Q('Contrapositive of P ⇒ Q is:', ['¬Q ⇒ ¬P', 'Q ⇒ P', 'P ∨ Q', '¬P ∨ Q'], 'A'),
        Q('A counterexample disproves:', ['∀ claims', '∃ claims always', 'definitions', 'axioms'], 'A'),
        Q('Biconditional P ⇔ Q means:', ['both directions hold', 'only one way', 'never both', 'random'], 'A'),
      ];
    case '6-1':
      return [
        Q('Direct proof starts from:', ['hypotheses', 'conclusion', 'contradiction', 'example only'], 'A'),
        Q('Sum of two even integers is even because:', ['factor 2 from each summand', 'always odd', 'never factor', 'use trig'], 'A'),
        Q('Proving identity often manipulates:', ['one or both sides toward same expression', 'never algebra', 'only graphs', 'only limits'], 'A'),
        Q('Each step should cite:', ['definitions / prior theorems', 'opinion', 'guess', 'ornament'], 'A'),
        Q('Integer closure under addition helps when:', ['combining integer expressions', 'using reals only', 'dividing irrationals freely', 'ignoring quantifiers'], 'A'),
      ];
    case '6-2':
      return [
        Q('Contradiction assumes the claim is:', ['false (to derive absurdity)', 'true always', 'undefined', 'empty'], 'A'),
        Q('If assumption yields 1 = 0, logical conclusion is:', ['assumption false (in consistent system)', 'everything true', 'stop all math', 'induction'], 'A'),
        Q('Contradiction useful for some:', ['nonconstructive uniqueness / irrationality classics', 'every trivial algebra', 'only derivatives', 'only integrals'], 'A'),
        Q('Unlike contrapositive proof, contradiction may not show:', ['explicit construction of object', 'logic at all', 'definitions', 'base case'], 'A'),
        Q('Quantifiers in contradiction must be handled:', ['carefully when negating', 'ignored', 'dropped', 'replaced by numbers blindly'], 'A'),
      ];
    case '6-3':
      return [
        Q('Induction proves for integers n ≥ base that:', ['P(n) holds with template', 'one n only', 'all reals', 'random'], 'A'),
        Q('Base case checks anchor like:', ['n = 1 or smallest relevant', 'n = ∞', 'all n simultaneously', 'never'], 'A'),
        Q('Inductive step shows P(k) ⇒', ['P(k+1) typically', 'P(0)', 'false', 'P(∞)'], 'A'),
        Q('Strong induction varies by assuming:', ['all previous cases sometimes', 'only k = 1', 'never assume', 'random'], 'A'),
        Q('Off-by-one breaks link between:', ['k and k+1 statements', 'base and conclusion only', 'vectors', 'integrals'], 'A'),
      ];
    case '6-4':
      return [
        Q('Divisibility induction often factors to expose:', ['multiple of divisor using IH', 'derivatives', 'cross products', 'limits'], 'A'),
        Q('Inequality induction preserves order when multiplying by positives; beware:', ['negative multipliers reverse inequality', 'never', 'always safe', 'only for ≡'], 'A'),
        Q('Check small n before conjecturing P(n) to avoid:', ['proving false statements', 'all work', 'logic', 'base'], 'A'),
        Q('Series formulas often relate S_{k+1} to S_k +', ['new term', 'S_k only', 'product', 'derivative'], 'A'),
        Q('Induction fails if statement is:', ['false — need different claim / method', 'always true nonetheless', 'only for vectors', 'only for irrationals'], 'A'),
      ];
    default:
      return [
        Q('Which move fits this topic best?', ['Use definitions and given constraints', 'Guess', 'Drop hypotheses', 'Skip verification'], 'A'),
        Q('A common pitfall is:', ['ignoring domain or singular cases', 'checking units', 'labeling diagrams', 'substituting'], 'A'),
        Q('If two methods disagree:', ['re-read the problem setup', 'average answers', 'pick randomly', 'stop'], 'A'),
        Q('Final answers should:', ['match required form and constraints', 'avoid interpretation', 'always be vectors', 'omit reasoning'], 'A'),
        Q('Good first step:', ['translate givens into symbols', 'memorize unrelated template', 'change subject', 'erase data'], 'A'),
      ];
  }
}

function buildExamQuestionsForTopic({ chapterIndex, topicIndex, topicName }) {
  void topicName;
  const raw = pack(chapterIndex, topicIndex);
  return EC_YEARS.map((_year, i) => {
    const q = raw[i];
    return {
      questionText: q.questionText,
      choices: q.choices,
      correctAnswer: q.correctAnswer,
      answerExplanation:
        q.answerExplanation ||
        `Entrance-exam style item aligned to Grade 12 topic ${chapterIndex + 1}.${topicIndex + 1}.`,
    };
  });
}

module.exports = { buildExamQuestionsForTopic };
